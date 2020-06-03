import express, { response } from 'express';
import knex from './database/connection';
import Point from './entities/Point';
import Item from './entities/Item';
import PointItem from './entities/PointItem';
import ItemView from './models/ItemView';
import PointsController from './controllers/PointsController';

const routes = express.Router();
const pointsController = new PointsController();

routes.get('/', (req, res) => {
  return res.json({ message: 'Im up!' });
});

routes.get('/items', async (req, res) => {
  const items = await knex('Items').select('*');
  const mappedItems = items.map((x: Item) => {
    return <ItemView>{
      id: x.id,
      title: x.title,
      imageUrl: `http://localhost:3333/uploads/${x.image}`,
    };
  })

  return res.json(mappedItems);
});

routes.post('/points', pointsController.create);

export default routes;
