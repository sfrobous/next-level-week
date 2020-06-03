import knex from '../database/connection';
import { Request, Response, response } from 'express';

import PointItem from '../entities/PointItem';
import Point from '../entities/Point';

export default class PointsController {
  async create(req: Request, res: Response) {
    const trx = await knex.transaction();
    const point = <Point>{
      name: req.body.name,
      email: req.body.email,
      whatsapp: req.body.whatsapp,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      city: req.body.city,
      state: req.body.state,
      image: 'fake.svg'
    };
    const insertedIds = await trx('Points').insert(point);
    const { items } = req.body;
    const pointId = insertedIds[0];
    const pointItems = items.map((itemId: number) => {
      return <PointItem>{
        itemId,
        pointId
      };
    });
    const insertedIds2 = await trx('Point_Items').insert(pointItems);

    await trx.commit();

    return res.json(<Point>{ id: pointId, ...point });
  }
}