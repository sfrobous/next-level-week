import api from './api';
import NewPointCommand from '../models/NewPointCommand';
import Point from '../models/Point';

class PointsService {
  create(point: NewPointCommand, imageFile: File) {
    const formData = new FormData();
    Object.entries(point).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    formData.append('image', imageFile);

    return api.post<Point>('/points', formData)
      .then(response => {
        console.log(response.data);
        return response.data;
      });
  }
}

export default new PointsService();