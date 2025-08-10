import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';



// Goats
export const getGoats = () => axios.get(`${API_URL}/goats`);
export const createGoat = (data) => axios.post(`${API_URL}/goats`, data);
export const updateGoat = (id, data) => axios.put(`${API_URL}/goats/${id}`, data);
export const deleteGoat = (id) => axios.delete(`${API_URL}/goats/${id}`);

// Financials
export const getFinancials = () => axios.get(`${API_URL}/financials`);
export const createFinancial = (data) => axios.post(`${API_URL}/financials`, data);
export const updateFinancial = (id, data) => axios.put(`${API_URL}/financials/${id}`, data);
export const deleteFinancial = (id) => axios.delete(`${API_URL}/financials/${id}`);

// Feeds
export const getFeeds = () => axios.get(`${API_URL}/feeds`);
export const createFeed = (data) => axios.post(`${API_URL}/feeds`, data);
export const updateFeed = (id, data) => axios.put(`${API_URL}/feeds/${id}`, data);
export const deleteFeed = (id) => axios.delete(`${API_URL}/feeds/${id}`);

// Medications
export const getMedications = () => axios.get(`${API_URL}/medications`);
export const createMedication = (data) => axios.post(`${API_URL}/medications`, data);
export const updateMedication = (id, data) => axios.put(`${API_URL}/medications/${id}`, data);
export const deleteMedication = (id) => axios.delete(`${API_URL}/medications/${id}`);
