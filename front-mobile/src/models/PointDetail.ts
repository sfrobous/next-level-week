export default interface PointDetail {
  id: number;
  image: string;
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  items: { id: number, title: string }[];
}