import axios from 'axios';

const instance = axios.create({ baseURL: 'https://draw-app-backend.vercel.app/' });

export default instance;
