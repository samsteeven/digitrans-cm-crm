import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useDashboardStore = create(
  persist(
    (set) => ({
      kpi: null,
      evolution: [],
      topClients: [],
      restaurants: [],
      loading: false,
      setKpi: (kpi) => set({ kpi }),
      setEvolution: (evolution) => set({ evolution }),
      setTopClients: (topClients) => set({ topClients }),
      setRestaurants: (restaurants) => set({ restaurants }),
      setLoading: (loading) => set({ loading }),
      reset: () => set({ kpi: null, evolution: [], topClients: [], restaurants: [], loading: false }),
    }),
    { name: 'crm-dashboard' }
  )
)
