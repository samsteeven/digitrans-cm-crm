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
}

export const plats = {
  list: (params) => api.get('/plats', { params }),
  categories: () => api.get('/categories'),
}

export const fidelite = {
  points: (clientId) => api.get(`/fidelite/clients/${clientId}/points`),
  ajouter: (data) => api.post('/fidelite/points/ajouter', data),
  recompenses: () => api.get('/fidelite/recompenses'),
  echanger: (data) => api.post('/fidelite/echanger', data),
}

export const avis = {
  list: (params) => api.get('/avis', { params }),
  create: (data) => api.post('/avis', data),
  analyse: (params) => api.get('/avis/analyse', { params }),
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
