import Axios from 'axios';

const urls = {
  test: `http://localhost:5000`,
  development: 'http://localhost:5000/',
  production: 'https://api.podcast.com/',
};
const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV],
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const apiRoot = urls[process.env.NODE_ENV];

export default api;
