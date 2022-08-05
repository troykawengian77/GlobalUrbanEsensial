import axios from 'axios';
export const API = () => {
  let requestHeaders = {
    accept: 'application/json',
  };

  const request = axios.create({
    baseURL: 'https://run.mocky.io/v3/',
    timeout: 5000,
    headers: requestHeaders,
  });

  return {
    request
  };
};
