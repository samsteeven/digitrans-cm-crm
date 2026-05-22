import axios from 'axios'

const api = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const stored = localStorage.getItem('crm-auth')
  if (stored) {
    const { state } = JSON.parse(stored)
    if (state?.token) {
      config.headers.Authorization = `Bearer ${state.token}`
    }
  }
  return config
})

api.interceptors.response.use(
  (r) => r,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('crm-auth')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
}

export const clients = {
  list: (params) => api.get('/clients', { params }),
  show: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  statistiques: () => api.get('/clients/statistiques'),
}

export const commandes = {
  list: (params) => api.get('/commandes', { params }),
  show: (id) => api.get(`/commandes/${id}`),
  create: (data) => api.post('/commandes', data),
  updateStatut: (id, statut) => api.patch(`/commandes/${id}/statut`, { statut }),
  delete: (id) => api.delete(`/commandes/${id}`),
}

export const restaurants = {
  list: (params) => api.get('/restaurants', { params }),
  show: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
}

export const plats = {
  list: (params) => api.get('/plats', { params }),
  show: (id) => api.get(`/plats/${id}`),
  create: (data) => api.post('/plats', data),
  update: (id, data) => api.put(`/plats/${id}`, data),
  delete: (id) => api.delete(`/plats/${id}`),
  categories: () => api.get('/categories'),
}

export const categories = {
  list: (params) => api.get('/categories', { params }),
  show: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

export const fidelite = {
  points: (clientId) => api.get(`/fidelite/clients/${clientId}/points`),
  ajouter: (data) => api.post('/fidelite/points/ajouter', data),
  recompenses: () => api.get('/fidelite/recompenses'),
  echanger: (data) => api.post('/fidelite/echanger', data),
}

export const recompenses = {
  list: (params) => api.get('/recompenses', { params }),
  show: (id) => api.get(`/recompenses/${id}`),
  create: (data) => api.post('/recompenses', data),
  update: (id, data) => api.put(`/recompenses/${id}`, data),
  delete: (id) => api.delete(`/recompenses/${id}`),
}

export const paliers = {
  list: () => api.get('/paliers-fidelite'),
  show: (id) => api.get(`/paliers-fidelite/${id}`),
  create: (data) => api.post('/paliers-fidelite', data),
  update: (id, data) => api.put(`/paliers-fidelite/${id}`, data),
  delete: (id) => api.delete(`/paliers-fidelite/${id}`),
}

export const echanges = {
  list: (params) => api.get('/echanges-recompenses', { params }),
  show: (id) => api.get(`/echanges-recompenses/${id}`),
  update: (id, data) => api.put(`/echanges-recompenses/${id}`, data),
  delete: (id) => api.delete(`/echanges-recompenses/${id}`),
}

export const transactions = {
  list: (params) => api.get('/transactions-fidelite', { params }),
  show: (id) => api.get(`/transactions-fidelite/${id}`),
}

export const avis = {
  list: (params) => api.get('/avis', { params }),
  show: (id) => api.get(`/avis/${id}`),
  create: (data) => api.post('/avis', data),
  update: (id, data) => api.put(`/avis/${id}`, data),
  delete: (id) => api.delete(`/avis/${id}`),
  analyse: (params) => api.get('/avis/analyse', { params }),
}

export const users = {
  list: (params) => api.get('/users', { params }),
  show: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

export const roles = {
  list: () => api.get('/roles'),
  show: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
}

export const permissionsService = {
  list: () => api.get('/permissions'),
  show: (id) => api.get(`/permissions/${id}`),
  create: (data) => api.post('/permissions', data),
  update: (id, data) => api.put(`/permissions/${id}`, data),
  delete: (id) => api.delete(`/permissions/${id}`),
}

export const auditLogs = {
  list: (params) => api.get('/audit-logs', { params }),
  show: (id) => api.get(`/audit-logs/${id}`),
}

export const syncLogs = {
  list: (params) => api.get('/sync-logs', { params }),
  show: (id) => api.get(`/sync-logs/${id}`),
}

export const dashboard = {
  kpi: (params) => api.get('/dashboard/kpi', { params }),
  evolution: (params) => api.get('/dashboard/evolution', { params }),
  restaurants: () => api.get('/dashboard/restaurants'),
  topClients: () => api.get('/dashboard/top-clients'),
}

export const sync = {
  envoyer: (data) => api.post('/sync', data),
  pending: () => api.get('/sync/pending'),
}

export default api
