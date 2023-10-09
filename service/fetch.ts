import axios from 'axios';

const requestInstance = axios.create({
  baseURL: '/',
//   headers: {
//     'Content-Type': 'application/json',
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type, Accept, x-access-token, x-key, Authorization',
//     'Access-Control-Allow-Credentials': 'true',
//   },
});

requestInstance.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('token');
    // if (token) {
    //     config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

requestInstance.interceptors.response.use((response) => {
  if (response?.status === 200) {
    return response?.data;
  } else {
    return {
      code: -1,
      msg: '未知错误',
      data: null,
    };
  }
});

export default requestInstance;
