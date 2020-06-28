import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import logo from '../../assets/logo.svg';
import './styles.css';
import { Map, TileLayer, Marker } from 'react-leaflet';
import ItemsService from '../../services/ItemsService';
import Item from '../../models/Item';
import LocationService from '../../services/LocationService';
import { LeafletMouseEvent } from 'leaflet';
import NewPointCommand from '../../models/NewPointCommand';
import PointsService from '../../services/PointsService';
import ImageDropzone from '../../components/Dropzone';

const CreatePoint = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<File>();
  const [initialPosition, setInitialPosition] = useState<[number, number]>([0, 0]);
  const history = useHistory();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    state: '',
    city: '',
    position: [0, 0] as [number, number],
    items: [] as number[]
  });

  useEffect(() => {
    ItemsService.getItems()
      .then((response) => {
        setItems(response);
      })
  }, []);

  useEffect(() => {
    LocationService.getStates()
      .then((response) => {
        setStates(response.map(x => x.code).sort());
      })
  }, []);

  useEffect(() => {
    if (formData.state) {
      LocationService.getCities(formData.state)
        .then((response) => {
          setCities(response.map(x => x.name));
        });
    } else {
      setStates([]);
    }
  }, [formData.state]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(position => {
      setInitialPosition([
        position.coords.latitude,
        position.coords.longitude
      ]);
    });
  }, [])

  function handleMapClick(e: LeafletMouseEvent) {
    setFormData({
      ...formData,
      position: [
        e.latlng.lat,
        e.latlng.lng
      ]
    });
  }

  function handleTextInputChange(e: ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSelectChange(e: ChangeEvent<HTMLSelectElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSelectItem(id: number) {
    const oldItems = formData.items;
    let newItems = [];
    if (oldItems.some(x => x === id)) {
      newItems = oldItems.filter(x => x !== id);
    } else {
      newItems = [...oldItems, id];
    }

    setFormData({
      ...formData,
      items: newItems
    })
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const newPoint: NewPointCommand = {
      name: formData.name,
      email: formData.email,
      whatsapp: formData.whatsapp,
      latitude: formData.position[0],
      longitude: formData.position[1],
      city: formData.city,
      state: formData.state,
      items: formData.items,
      image: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60'
    }

    PointsService.create(newPoint, selectedFile as File).then(() => {
      alert('Sucesso!')
      history.push('/');
    });
  }

  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="eColeta" />
        <Link to="/">
          <FiArrowLeft></FiArrowLeft>
          Voltar para home
        </Link>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <h1>Cadastro do <br /> ponto de coleta</h1>

          <ImageDropzone onFileUploaded={setSelectedFile} />

          <fieldset>
            <legend>
              <h2>Dados</h2>
            </legend>
            <div className="field">
              <label htmlFor="name">Nome da entidade</label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={handleTextInputChange}
              />
            </div>
            <div className="field-group">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  onChange={handleTextInputChange}
                />
              </div>
              <div className="field">
                <label htmlFor="whatsapp">Whatsapp</label>
                <input
                  type="text"
                  name="whatsapp"
                  id="whatsapp"
                  onChange={handleTextInputChange}
                />
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <h2>Endereço</h2>
              <span>Selecione o endereço no mapa</span>
            </legend>

            <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
              <TileLayer
                attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={formData.position} />
            </Map>

            <div className="field-group">
              <div className="field">
                <label htmlFor="state">Estado</label>
                <select
                  name="state"
                  id="state"
                  onChange={handleSelectChange}
                >
                  <option value="">Selecione um Estado</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
                  ))}

                </select>
              </div>
              <div className="field">
                <label htmlFor="city">Cidade</label>
                <select
                  name="city"
                  id="city"
                  onChange={handleSelectChange}
                >
                  <option value="">Selecione um Cidade</option>
                  {cities.map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>
              <h2>Itens de Coleta</h2>
              <span>Selecione um ou mais itens abaixo</span>
            </legend>

            <ul className="items-grid">
              {items.map(item => (
                <li
                  key={item.id}
                  onClick={() => handleSelectItem(item.id)}
                  className={formData.items.some(x => x === item.id) ? 'selected' : undefined}
                >
                  <img src={item.imageUrl} alt={item.title} />
                  <span>{item.title}</span>
                </li>
              ))}
            </ul>
          </fieldset>

          <button type="submit">
            Cadastrar ponto de coleta
          </button>
        </form>
      </main>
    </div>
  )
}

export default CreatePoint;