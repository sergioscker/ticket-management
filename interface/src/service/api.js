import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true,
});

// get tickets
export const getTickets = async (page = 1, limit = 12) => {
  const response = await api.get(`/tickets?page=${page}&limit=${limit}`);

  return response.data;
};

// get departments
export const getDepartments = async () => {
  const response = await api.get('/departments');

  return response.data;
};
