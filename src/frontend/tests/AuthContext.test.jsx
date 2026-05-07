import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '../src/context/AuthContext'
import { auth } from '../src/services/api'

vi.mock('../src/services/api', () => ({
  auth: {
    login: vi.fn(),
    logout: vi.fn(),
  },
}))

function TestComponent() {
  const { user, token, isAuthenticated, login, logout } = useAuth()
  return (
    <div>
      <p data-testid="auth-status">{isAuthenticated ? 'Connecté' : 'Déconnecté'}</p>
      {user && <p data-testid="user-name">{user.name}</p>}
      {token && <p data-testid="token">{token}</p>}
      <button data-testid="login-btn" onClick={() => login('test@test.com', 'password').catch(() => {})}>
        Login
      </button>
      <button data-testid="logout-btn" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.localStorage.clear()
  })

  it('starts unauthenticated', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    expect(screen.getByTestId('auth-status').textContent).toBe('Déconnecté')
  })

  it('calls auth.login on login and updates state', async () => {
    auth.login.mockResolvedValue({
      data: {
        token: 'fake-token-123',
        user: { name: 'Admin', email: 'test@test.com' },
      },
    })

    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('login-btn'))

    await waitFor(() => {
      expect(auth.login).toHaveBeenCalledWith({
        email: 'test@test.com',
        password: 'password',
        device_name: 'crm-web',
      })
    })

    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Connecté')
      expect(screen.getByTestId('user-name').textContent).toBe('Admin')
    })
  })

  it('calls auth.logout on logout and clears state', async () => {
    auth.login.mockResolvedValue({
      data: { token: 't', user: { name: 'Admin' } },
    })

    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('login-btn'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Connecté')
    })

    await user.click(screen.getByTestId('logout-btn'))
    await waitFor(() => {
      expect(auth.logout).toHaveBeenCalled()
      expect(screen.getByTestId('auth-status').textContent).toBe('Déconnecté')
    })
  })

  it('handles login failure gracefully', async () => {
    auth.login.mockRejectedValue(new Error('Invalid credentials'))

    const user = userEvent.setup()
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    await user.click(screen.getByTestId('login-btn'))
    await waitFor(() => {
      expect(screen.getByTestId('auth-status').textContent).toBe('Déconnecté')
    })
  })

  it('loads user from localStorage on mount when token exists', () => {
    window.localStorage.setItem('token', 'existing-token')
    window.localStorage.setItem('user', JSON.stringify({ name: 'Stored User', email: 'stored@test.com' }))

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )

    expect(screen.getByTestId('auth-status').textContent).toBe('Connecté')
    expect(screen.getByTestId('user-name').textContent).toBe('Stored User')
  })
})
