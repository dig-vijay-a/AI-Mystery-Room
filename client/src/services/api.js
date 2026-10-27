import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

export const caseApi = {
  // Create a new mystery
  createCase: async (payload) => {
    const response = await api.post('/cases', payload);
    return response.data;
  },

  // Get active case state
  getCase: async (id) => {
    const response = await api.get(`/cases/${id}`);
    return response.data;
  },

  // Discover a specific clue
  discoverClue: async (caseId, clueId) => {
    const response = await api.post(`/cases/${caseId}/clues/${clueId}/discover`);
    return response.data;
  },

  // Request next hint
  requestHint: async (caseId) => {
    const response = await api.post(`/cases/${caseId}/hints`);
    return response.data;
  },

  // Submit accusation
  accuseSuspect: async (caseId, payload) => {
    const response = await api.post(`/cases/${caseId}/accuse`, payload);
    return response.data;
  },

  // Get finalized result
  getCaseResult: async (caseId) => {
    const response = await api.get(`/cases/${caseId}/result`);
    return response.data;
  },

  // List recent cases
  listRecentCases: async () => {
    const response = await api.get('/cases');
    return response.data;
  },

  // Health check
  checkHealth: async () => {
    const response = await api.get('/health');
    return response.data;
  },
};

export default api;
