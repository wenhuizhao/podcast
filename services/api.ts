import Axios from 'axios';

const urls = {
  test: `http://localhost:5000/api/v1`,
  development: 'http://localhost:5000/api/v1',
  production: 'https://api.notebookvideo.com/api/v1',
};
const api = Axios.create({
  baseURL: urls[process.env.NODE_ENV],
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export const apiRoot = urls[process.env.NODE_ENV];

const homeUrls = {
  test: `http://localhost:3000`,
  development: 'http://localhost:3000',
  production: 'https://www.notebookvideo.com',
};
const assetUrls = {
  test: `http://localhost:3000/images`,
  development: 'http://localhost:3000/images',
  production: 'https://notebookvideo.s3.us-west-2.amazonaws.com',
};
export const homeUrl = homeUrls[process.env.NODE_ENV];
export const assetUrl = assetUrls[process.env.NODE_ENV];
export default api;
