import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// login request
export const login = async (email, password) => {
  const response = await api.post('/session', { email, password });
  return response.data;
};

// logout request
export const logout = async () => {
  await api.post('/logout');
};

export const getTickets = async (page = 1, limit = 12) => {
  const response = await api.get(`/tickets?page=${page}&limit=${limit}`);
  return response.data;
};
