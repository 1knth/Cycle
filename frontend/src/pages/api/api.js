import axios from 'axios';
const API_URL = 'http://localhost:5001';

// available endpoints: 
// /api/auth
// /api/plaid
// /api/users
// /api/dashboard

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
  const response = await axios.post(`${API_URL}/api/auth/signup`, data);
  return response.data;
};

export const login = async (data) => {
  const response = await axios.post(`${API_URL}/api/auth/login`, data);
  return response.data;
};

// User APIs
export const getUser = async () => {
  const response = await axios.get(`${API_URL}/api/users/me`, {
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

export const syncBanks = async (publicToken, metadata) => {
  const response = await axios.post(`${API_URL}/api/plaid/sync/banks`, {
    public_token: publicToken,
    metadata,
  }, {
    headers: getAuthHeaders(),
  });
  return response.data;
};


// Transaction APIs
export const readTransactions = async (limit, accountId) => {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit)
  if (accountId) params.append('accountId', accountId);
  const response = await axios.get(`${API_URL}/api/users/me/transactions?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};


// Sync all transactions from Plaid to MongoDB
export const syncTransactions = async (accountId) => {
  const response = await axios.post(`${API_URL}/api/plaid/sync/transactions/${accountId}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const calculateMetrics = async (accountId, timeRange) => {
  const params = new URLSearchParams();
  if (accountId) params.append('accountId', accountId);
  if (timeRange) params.append('timeRange', timeRange);
  
  const response = await axios.get(`${API_URL}/api/dashboard/overview?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAccounts = async () => {
  const response = await axios.get(`${API_URL}/api/users/me/accounts`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const syncAccounts = async (plaidItemId) => {
  const response = await axios.post(`${API_URL}/api/plaid/sync/accounts/${plaidItemId}`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

