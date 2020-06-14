import db from "../database/connection";
import Item from "../entities/Item";
import ItemView from "../models/ItemView";
import { Request, Response } from 'express';

class ItemsController {
  async index(req: Request, res: Response) {
    const items = await db('items').select('*');
    const mappedItems = items.map((x: Item) => {
      return <ItemView>{
        id: x.id,
        title: x.title,
        imageUrl: `http://192.168.1.11:3333/uploads/${x.image}`,
      };
    });
    return res.json(mappedItems);
  }
}

export default new ItemsController();