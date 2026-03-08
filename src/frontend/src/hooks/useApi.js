import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as api from '../services/api'

export function useClients(params) {
  return useQuery({
    queryKey: ['clients', params],
    queryFn: () => api.clients.list(params).then((r) => r.data),
  })
}

export function useClient(id) {
  return useQuery({
    queryKey: ['client', id],
    queryFn: () => api.clients.show(id).then((r) => r.data),
    enabled: !!id,
  })
}

export function useCreateClient() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data) => api.clients.create(data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useCommandes(params) {
  return useQuery({
    queryKey: ['commandes', params],
    queryFn: () => api.commandes.list(params).then((r) => r.data),
  })
}

export function useUpdateStatut() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, statut }) => api.commandes.updateStatut(id, statut),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['commandes'] }),
  })
}

export function useDashboardKpi(params) {
  return useQuery({
    queryKey: ['dashboard', 'kpi', params],
    queryFn: () => api.dashboard.kpi(params).then((r) => r.data),
  })
}

export function useDashboardEvolution(params) {
  return useQuery({
    queryKey: ['dashboard', 'evolution', params],
    queryFn: () => api.dashboard.evolution(params).then((r) => r.data),
  })
}

export function useAvis(params) {
  return useQuery({
    queryKey: ['avis', params],
    queryFn: () => api.avis.list(params).then((r) => r.data),
  })
}

export function useAvisAnalyse(params) {
  return useQuery({
    queryKey: ['avis', 'analyse', params],
    queryFn: () => api.avis.analyse(params).then((r) => r.data),
  })
}

export function useRecompenses() {
  return useQuery({
    queryKey: ['recompenses'],
    queryFn: () => api.fidelite.recompenses().then((r) => r.data),
  })
}

export function usePlats(params) {
  return useQuery({
    queryKey: ['plats', params],
    queryFn: () => api.plats.list(params).then((r) => r.data),
  })
}
