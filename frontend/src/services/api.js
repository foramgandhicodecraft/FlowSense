import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api',
});

export const login = async (phone) => {
  const res = await api.post('/auth/login', { phone });
  if (res.data.user_id) {
    localStorage.setItem('user_id', res.data.user_id);
    localStorage.setItem('business_name', res.data.business_name || '');
  }
  return res.data;
};

export const getTransactions = async () => {
  const userId = localStorage.getItem('user_id');
  const res = await api.get(`/transactions?user_id=${userId}`);
  return res.data;
};

export const addTransaction = async (data) => {
  const userId = localStorage.getItem('user_id');
  const res = await api.post('/transactions/add', { ...data, user_id: userId });
  return res.data;
};

export const uploadCSV = async (file) => {
  const userId = localStorage.getItem('user_id');
  const formData = new FormData();
  formData.append('file', file);
  formData.append('user_id', userId);
  
  const res = await api.post('/transactions/upload-csv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

export const uploadDemoData = async (transactions) => {
  const userId = localStorage.getItem('user_id');
  let added = 0;
  for (const t of transactions) {
    await api.post('/transactions/add', { ...t, user_id: userId });
    added++;
  }
  return { success: true, added };
};

export const getForecast = async (force = false) => {
  const userId = localStorage.getItem('user_id');
  if (force) {
    await api.post(`/forecast/generate?user_id=${userId}`);
    // fetch again after generate
    const res2 = await api.get(`/forecast?user_id=${userId}`);
    return res2.data;
  }
  const res = await api.get(`/forecast?user_id=${userId}`);
  return res.data;
};

export const getLoanScore = async () => {
  const userId = localStorage.getItem('user_id');
  const res = await api.get(`/loan-score?user_id=${userId}`);
  return res.data;
};

export const getAlerts = async () => {
  const userId = localStorage.getItem('user_id');
  const res = await api.get(`/alerts?user_id=${userId}`);
  return res.data;
};

export const markAlertsRead = async () => {
  const userId = localStorage.getItem('user_id');
  const res = await api.post('/alerts/mark-read', { user_id: userId });
  return res.data;
};

export default api;
