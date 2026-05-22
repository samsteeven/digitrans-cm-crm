/**
 * Service client HTTP centralisé.
 *
 * Configure Axios avec une instance pré-configurée pointant
 * vers /api/v1, injecte automatiquement le token JWT depuis
 * localStorage et redirige vers /login en cas de 401.
 *
 * @module services/api
 */

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

/** Authentification — connexion et déconnexion. */
export const auth = {
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
}

/** Gestion des clients — CRUD et statistiques. */
export const clients = {
  list: (params) => api.get('/clients', { params }),
  show: (id) => api.get(`/clients/${id}`),
  create: (data) => api.post('/clients', data),
  update: (id, data) => api.put(`/clients/${id}`, data),
  delete: (id) => api.delete(`/clients/${id}`),
  statistiques: () => api.get('/clients/statistiques'),
}

/** Gestion des commandes — CRUD et mise à jour de statut. */
export const commandes = {
  list: (params) => api.get('/commandes', { params }),
  show: (id) => api.get(`/commandes/${id}`),
  create: (data) => api.post('/commandes', data),
  updateStatut: (id, statut) => api.patch(`/commandes/${id}/statut`, { statut }),
  delete: (id) => api.delete(`/commandes/${id}`),
}

/** Gestion des restaurants — CRUD. */
export const restaurants = {
  list: (params) => api.get('/restaurants', { params }),
  show: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
}

/** Gestion des plats — CRUD et liste des catégories. */
export const plats = {
  list: (params) => api.get('/plats', { params }),
  show: (id) => api.get(`/plats/${id}`),
  create: (data) => api.post('/plats', data),
  update: (id, data) => api.put(`/plats/${id}`, data),
  delete: (id) => api.delete(`/plats/${id}`),
  categories: () => api.get('/categories'),
}

/** Gestion des catégories — CRUD. */
export const categories = {
  list: (params) => api.get('/categories', { params }),
  show: (id) => api.get(`/categories/${id}`),
  create: (data) => api.post('/categories', data),
  update: (id, data) => api.put(`/categories/${id}`, data),
  delete: (id) => api.delete(`/categories/${id}`),
}

/** Programme de fidélité — points, récompenses et échanges. */
export const fidelite = {
  points: (clientId) => api.get(`/fidelite/clients/${clientId}/points`),
  ajouter: (data) => api.post('/fidelite/points/ajouter', data),
  recompenses: () => api.get('/fidelite/recompenses'),
  echanger: (data) => api.post('/fidelite/echanger', data),
}

/** Gestion des récompenses — CRUD. */
export const recompenses = {
  list: (params) => api.get('/recompenses', { params }),
  show: (id) => api.get(`/recompenses/${id}`),
  create: (data) => api.post('/recompenses', data),
  update: (id, data) => api.put(`/recompenses/${id}`, data),
  delete: (id) => api.delete(`/recompenses/${id}`),
}

/** Paliers de fidélité — CRUD. */
export const paliers = {
  list: () => api.get('/paliers-fidelite'),
  show: (id) => api.get(`/paliers-fidelite/${id}`),
  create: (data) => api.post('/paliers-fidelite', data),
  update: (id, data) => api.put(`/paliers-fidelite/${id}`, data),
  delete: (id) => api.delete(`/paliers-fidelite/${id}`),
}

/** Échanges de récompenses — CRUD. */
export const echanges = {
  list: (params) => api.get('/echanges-recompenses', { params }),
  show: (id) => api.get(`/echanges-recompenses/${id}`),
  update: (id, data) => api.put(`/echanges-recompenses/${id}`, data),
  delete: (id) => api.delete(`/echanges-recompenses/${id}`),
}

/** Transactions de fidélité — consultation. */
export const transactions = {
  list: (params) => api.get('/transactions-fidelite', { params }),
  show: (id) => api.get(`/transactions-fidelite/${id}`),
}

/** Gestion des avis — CRUD et analyse de sentiment. */
export const avis = {
  list: (params) => api.get('/avis', { params }),
  show: (id) => api.get(`/avis/${id}`),
  create: (data) => api.post('/avis', data),
  update: (id, data) => api.put(`/avis/${id}`, data),
  delete: (id) => api.delete(`/avis/${id}`),
  analyse: (params) => api.get('/avis/analyse', { params }),
}

/** Gestion des utilisateurs — CRUD. */
export const users = {
  list: (params) => api.get('/users', { params }),
  show: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

/** Gestion des rôles — CRUD. */
export const roles = {
  list: () => api.get('/roles'),
  show: (id) => api.get(`/roles/${id}`),
  create: (data) => api.post('/roles', data),
  update: (id, data) => api.put(`/roles/${id}`, data),
  delete: (id) => api.delete(`/roles/${id}`),
}

/** Gestion des permissions — CRUD. */
export const permissionsService = {
  list: () => api.get('/permissions'),
  show: (id) => api.get(`/permissions/${id}`),
  create: (data) => api.post('/permissions', data),
  update: (id, data) => api.put(`/permissions/${id}`, data),
  delete: (id) => api.delete(`/permissions/${id}`),
}

/** Journaux d'audit — consultation. */
export const auditLogs = {
  list: (params) => api.get('/audit-logs', { params }),
  show: (id) => api.get(`/audit-logs/${id}`),
}

/** Journaux de synchronisation — consultation. */
export const syncLogs = {
  list: (params) => api.get('/sync-logs', { params }),
  show: (id) => api.get(`/sync-logs/${id}`),
}

/** Tableau de bord — KPI, évolutions, restaurants et top clients. */
export const dashboard = {
  kpi: (params) => api.get('/dashboard/kpi', { params }),
  evolution: (params) => api.get('/dashboard/evolution', { params }),
  restaurants: () => api.get('/dashboard/restaurants'),
  topClients: () => api.get('/dashboard/top-clients'),
}

/** Synchronisation — envoi de données et consultation des en attente. */
export const sync = {
  envoyer: (data) => api.post('/sync', data),
  pending: () => api.get('/sync/pending'),
}

export default api
