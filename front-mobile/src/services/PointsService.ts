import api from './api';
import Item from '../models/Item';
import NewPointCommand from '../models/NewPointCommand';
import Point from '../models/Point';
import PointDetail from '../models/PointDetail';

class PointsService {
  create(point: NewPointCommand) {
    return api.post<Point>('/points', point)
      .then(response => {
        return response.data;
      });
  }

  getAll(city?: string, state?: string, items?: string) {
    const params: any = {};
    if (city) {
      params.city = city;
    }
    if (state) {
      params.state = state;
    }
    if (items) {
      params.items = items;
    }
    return api.get<Point[]>('/points', { params })
      .then(response => {
        return response.data;
      });
  }

  get(id: number) {
    return api.get<PointDetail>(`/points/${id}`)
      .then(response => {
        return response.data;
      });
  }
}

export default new PointsService();