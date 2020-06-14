import axios from 'axios';
import State from '../models/State';
import City from '../models/City';

const api = axios.create({
  baseURL: 'https://servicodados.ibge.gov.br/api/v1/localidades/'
});


class LocationService {
  getStates(): Promise<State[]> {
    return api.get('/estados')
      .then(response => response.data.map((x: any) => {
        return {
          id: x.id,
          code: x.sigla,
          name: x.nome
        }
      }));
  }

  getCities(stateCode: string): Promise<City[]> {
    return api.get(`/estados/${stateCode}/municipios`)
      .then(response => response.data.map((x: any) => {
        return {
          id: x.id,
          stateCode,
          name: x.nome
        }
      }));
  }
}

export default new LocationService();