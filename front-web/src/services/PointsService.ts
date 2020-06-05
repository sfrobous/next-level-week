import api from './api';
import Item from '../models/Item';
import NewPointCommand from '../models/NewPointCommand';
import Point from '../models/Point';

class PointsService {
  create(point: NewPointCommand) {
    return api.post<Point>('/points', point)
      .then(response => {
        console.log(response.data);
        return response.data;
      });
  }
}

export default new PointsService();