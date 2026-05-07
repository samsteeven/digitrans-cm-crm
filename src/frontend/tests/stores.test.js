import { describe, it, expect, beforeEach } from 'vitest'
import { useAuthStore } from '../src/store/authStore'
import { useUiStore } from '../src/store/uiStore'
import { useDashboardStore } from '../src/store/dashboardStore'

describe('authStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useAuthStore.setState({ user: null, token: null, isAuthenticated: false })
  })

  it('starts unauthenticated', () => {
    const state = useAuthStore.getState()
    expect(state.isAuthenticated).toBe(false)
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
  })

  it('setAuth sets user, token, and isAuthenticated', () => {
    const user = { name: 'Admin', email: 'admin@test.com' }
    const token = 'abc123'
    useAuthStore.getState().setAuth(user, token)
    const state = useAuthStore.getState()
    expect(state.user).toEqual(user)
    expect(state.token).toBe('abc123')
    expect(state.isAuthenticated).toBe(true)
  })

  it('clearAuth resets all auth state', () => {
    useAuthStore.getState().setAuth({ name: 'Test' }, 'token123')
    useAuthStore.getState().clearAuth()
    const state = useAuthStore.getState()
    expect(state.user).toBeNull()
    expect(state.token).toBeNull()
    expect(state.isAuthenticated).toBe(false)
  })
})

describe('uiStore', () => {
  beforeEach(() => {
    useUiStore.setState({ sidebarOpen: true, theme: 'light' })
  })

  it('starts with sidebar open and light theme', () => {
    const state = useUiStore.getState()
    expect(state.sidebarOpen).toBe(true)
    expect(state.theme).toBe('light')
  })

  it('setSidebarOpen updates sidebar state', () => {
    useUiStore.getState().setSidebarOpen(false)
    expect(useUiStore.getState().sidebarOpen).toBe(false)
  })

  it('toggleSidebar flips sidebarOpen', () => {
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(false)
    useUiStore.getState().toggleSidebar()
    expect(useUiStore.getState().sidebarOpen).toBe(true)
  })

  it('setTheme updates theme', () => {
    useUiStore.getState().setTheme('dark')
    expect(useUiStore.getState().theme).toBe('dark')
  })
})

describe('dashboardStore', () => {
  beforeEach(() => {
    window.localStorage.clear()
    useDashboardStore.setState({ kpi: null, evolution: [], topClients: [], restaurants: [], loading: false })
  })

  it('starts with default values', () => {
    const state = useDashboardStore.getState()
    expect(state.kpi).toBeNull()
    expect(state.evolution).toEqual([])
    expect(state.loading).toBe(false)
  })

  it('setKpi stores kpi data', () => {
    const kpi = { chiffre_affaires: 5000000, total_commandes: 100 }
    useDashboardStore.getState().setKpi(kpi)
    expect(useDashboardStore.getState().kpi).toEqual(kpi)
  })

  it('setTopClients stores top clients', () => {
    const clients = [{ nom: 'Client A' }, { nom: 'Client B' }]
    useDashboardStore.getState().setTopClients(clients)
    expect(useDashboardStore.getState().topClients).toHaveLength(2)
  })

  it('reset clears all dashboard state', () => {
    useDashboardStore.getState().setKpi({ test: true })
    useDashboardStore.getState().setLoading(true)
    useDashboardStore.getState().reset()
    const state = useDashboardStore.getState()
    expect(state.kpi).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.evolution).toEqual([])
  })
})
