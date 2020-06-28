import db from '../database/connection';
import { Request, Response } from 'express';

import PointItem from '../entities/PointItem';
import Point from '../entities/Point';
import { celebrate, Joi } from 'celebrate';

class PointsController {
  async index(req: Request, res: Response) {
    const { city, state, items } = req.query;
    let query = db('points').join('point_items', 'points.id', '=', 'point_items.pointId');

    const itemsIds = String(items).split(',').map(x => Number(x.trim()));

    if (city) {
      query = query.where('points.city', String(city));
    }

    if (state) {
      query = query.where('points.state', String(state));
    }

    if (items) {
      query = query.whereIn('point_items.itemId', itemsIds);
    }

    const points = (await query.distinct().select('points.*'))
      .map(x => {
        return {
          ...x,
          image: `http://192.168.1.12:3333/uploads/${x.image}`
        };
      });

    console.log(req.query);
    return res.json(points);
  }

  async show(req: Request, res: Response) {
    const { id } = req.params;
    console.log(id);
    const point = await db('points').where('id', id).first();

    point.image = `http://192.168.1.12:3333/uploads/${point.image}`;

    if (!point) {
      return res.status(400).json({ message: 'Point not found' });
    }

    const items = await db('items')
      .join('point_items', 'items.id', '=', 'point_items.itemId')
      .where('point_items.pointId', id)
      .select('items.id', 'items.title');

    return res.json({ ...point, items });
  }

  createValidation = celebrate({
    body: Joi.object().keys({
      name: Joi.string().required(),
      email: Joi.string().required().email(),
      whatsapp: Joi.number().required(),
      latitude: Joi.number().required(),
      longitude: Joi.number().required(),
      city: Joi.string().required(),
      state: Joi.string().required().max(2),
      items: Joi.string().required()
    })
  }, {
    abortEarly: false
  });

  async create(req: Request, res: Response) {
    const trx = await db.transaction();
    const point = <Point>{
      name: req.body.name,
      email: req.body.email,
      whatsapp: req.body.whatsapp,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      city: req.body.city,
      state: req.body.state,
      image: req.file.filename
    };
    const insertedIds = await trx('Points').insert(point);
    const { items } = req.body;
    const pointId = insertedIds[0];
    const pointItems = items
      .split(',')
      .map((item: string) => Number(item.trim()))
      .map((itemId: number) => {
        return <PointItem>{
          itemId,
          pointId
        };
      });
    const insertedIds2 = await trx('Point_Items').insert(pointItems);

    await trx.commit();

    return res.json(<Point>{ ...point, id: pointId });
  }
}

export default new PointsController();