import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,    

});

// user authentication
api.interceptors.request.use((config) => {
  const userData = localStorage.getItem('ticketmanagement:userData');

  const token = userData && JSON.parse(userData).token;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const getTickets = async (page = 1, limit = 10) => {
  const response = await api.get(`/tickets?page=${page}&limit=${limit}`);
  return response.data;
};
