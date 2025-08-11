import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://backend-repo-xfe6.onrender.com';

// Goats
export const getGoats = () => axios.get(`${API_BASE_URL}/api/goats`);
export const createGoat = (data) => axios.post(`${API_BASE_URL}/api/goats`, data);
export const updateGoat = (id, data) => axios.put(`${API_BASE_URL}/api/goats/${id}`, data);
export const deleteGoat = (id) => axios.delete(`${API_BASE_URL}/api/goats/${id}`);

// Financials
export const getFinancials = () => axios.get(`${API_BASE_URL}/api/financials`);
export const createFinancial = (data) => axios.post(`${API_BASE_URL}/api/financials`, data);
export const updateFinancial = (id, data) => axios.put(`${API_BASE_URL}/api/financials/${id}`, data);
export const deleteFinancial = (id) => axios.delete(`${API_BASE_URL}/api/financials/${id}`);

// Feeds
export const getFeeds = () => axios.get(`${API_BASE_URL}/api/feeds`);
export const createFeed = (data) => axios.post(`${API_BASE_URL}/api/feeds`, data);
export const updateFeed = (id, data) => axios.put(`${API_BASE_URL}/api/feeds/${id}`, data);
export const deleteFeed = (id) => axios.delete(`${API_BASE_URL}/api/feeds/${id}`);

// Medications
export const getMedications = () => axios.get(`${API_BASE_URL}/api/medications`);
export const createMedication = (data) => axios.post(`${API_BASE_URL}/api/medications`, data);
export const updateMedication = (id, data) => axios.put(`${API_BASE_URL}/api/medications/${id}`, data);
export const deleteMedication = (id) => axios.delete(`${API_BASE_URL}/api/medications/${id}`);
