import api from './api';
import Item from '../models/Item';

class ItemsService {
  getItems(): Promise<Item[]> {
    return api.get<Item[]>('/items')
      .then(response => response.data);
  }
}

export default new ItemsService();