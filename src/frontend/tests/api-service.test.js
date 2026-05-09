import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

// Mock axios before importing api
vi.mock('axios', () => {
  const mockInterceptors = {
    request: { use: vi.fn() },
    response: { use: vi.fn() },
  }
  const mockAxiosInstance = {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: mockInterceptors,
  }
  return {
    default: {
      create: vi.fn(() => mockAxiosInstance),
    },
  }
})

describe('API Service', () => {
  let api, axios

  beforeAll(async () => {
    const axiosModule = await import('axios')
    axios = axiosModule.default
    const apiModule = await import('../src/services/api')
    api = apiModule.default
  })

  it('creates axios instance with correct baseURL', () => {
    expect(axios.create).toHaveBeenCalledWith({
      baseURL: '/api/v1',
      headers: { 'Content-Type': 'application/json' },
    })
  })

  it('attaches request interceptor', () => {
    expect(api.interceptors.request.use).toHaveBeenCalled()
  })

  it('attaches response interceptor', () => {
    expect(api.interceptors.response.use).toHaveBeenCalled()
  })
})

describe('API named exports', () => {
  it('exports all service groups with correct structure', async () => {
    const apiModule = await import('../src/services/api')
    expect(apiModule.auth).toHaveProperty('login')
    expect(apiModule.auth).toHaveProperty('logout')
    expect(apiModule.clients).toHaveProperty('list')
    expect(apiModule.clients).toHaveProperty('show')
    expect(apiModule.clients).toHaveProperty('create')
    expect(apiModule.clients).toHaveProperty('update')
    expect(apiModule.clients).toHaveProperty('delete')
    expect(apiModule.clients).toHaveProperty('statistiques')
    expect(apiModule.commandes).toHaveProperty('list')
    expect(apiModule.commandes).toHaveProperty('show')
    expect(apiModule.commandes).toHaveProperty('create')
    expect(apiModule.commandes).toHaveProperty('updateStatut')
    expect(apiModule.plats).toHaveProperty('list')
    expect(apiModule.plats).toHaveProperty('categories')
    expect(apiModule.fidelite).toHaveProperty('points')
    expect(apiModule.fidelite).toHaveProperty('ajouter')
    expect(apiModule.fidelite).toHaveProperty('recompenses')
    expect(apiModule.fidelite).toHaveProperty('echanger')
    expect(apiModule.avis).toHaveProperty('list')
    expect(apiModule.avis).toHaveProperty('create')
    expect(apiModule.avis).toHaveProperty('analyse')
    expect(apiModule.dashboard).toHaveProperty('kpi')
    expect(apiModule.dashboard).toHaveProperty('evolution')
    expect(apiModule.dashboard).toHaveProperty('restaurants')
    expect(apiModule.dashboard).toHaveProperty('topClients')
    expect(apiModule.sync).toHaveProperty('envoyer')
    expect(apiModule.sync).toHaveProperty('pending')
  })
})
