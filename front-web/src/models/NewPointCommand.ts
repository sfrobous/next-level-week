export default interface NewPointCommand {
  name: string;
  email: string;
  whatsapp: string;
  latitude: number;
  longitude: number;
  city: string;
  state: string;
  items: number[],
  image: string
}