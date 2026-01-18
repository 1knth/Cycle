import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions`);
  return response.data;
};

export const addTransaction = async (data) => {
  const response = await axios.post(`${API_URL}/transactions`, data);
  return response.data;
};
