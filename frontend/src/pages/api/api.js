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
  const response = await axios.get(`${API_URL}/api/user/me`, {
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
export const readTransactions = async (amount) => {
  const response = await axios.get(`${API_URL}/transactions?limit=${amount}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const calculateAnalytics = async (accountId, timeRange) => {
  const params = new URLSearchParams();
  if (accountId) params.append('accountId', accountId);
  if (timeRange) params.append('timeRange', timeRange);

  const response = await axios.get(`${API_URL}/dashboard/analytics/forecast?${params.toString()}`, {
    headers: getAuthHeaders(),  
  });
  return response.data;
}

// Sync transactions from Plaid to MongoDB
export const syncTransactions = async () => {
  const response = await axios.get(`${API_URL}/transactions/get`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const calculateMetrics = async (accountId, timeRange) => {
  const params = new URLSearchParams();
  if (accountId) params.append('accountId', accountId);
  if (timeRange) params.append('timeRange', timeRange);
  
  const response = await axios.get(`${API_URL}/transactions/overview?${params.toString()}`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const getAccounts = async () => {
  const response = await axios.get(`${API_URL}/api/accounts`, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

export const syncAccounts = async () => {
  const response = await axios.post(`${API_URL}/api/accounts/sync`, {}, {
    headers: getAuthHeaders(),
  });
  return response.data;
};