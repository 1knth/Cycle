import axios from 'axios';

const API_URL = 'http://localhost:5001';

// Helper to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': token ? `Bearer ${token}` : '',
  };
};

// Auth APIs
export const signup = async (data) => {
  const response = await axios.post(`${API_URL}/auth/signup`, data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data;
};

// User APIs
export const getUser = async () => {
  const response = await axios.get(`${API_URL}/api/user`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

// Plaid APIs
export const createLinkToken = async () => {
  const response = await axios.post(`${API_URL}/api/plaid/create-link-token`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const exchangePublicToken = async (publicToken, metadata) => {
  const response = await axios.post(`${API_URL}/api/plaid/exchange-public-token`, {
    public_token: publicToken,
    metadata,
  }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};


// Transaction APIs
export const getTransactions = async () => {
  const response = await axios.get(`${API_URL}/api/plaid/transactions`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const addTransaction = async (data) => {
  const response = await axios.post(`${API_URL}/transactions/add`, data, {
    headers: getAuthHeaders(),
  });
  return response.data;
};