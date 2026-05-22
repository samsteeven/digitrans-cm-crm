import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'sonner'
import { queryClient } from './queryClient'
import ErrorBoundary from './components/ErrorBoundary'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ClientsList from './pages/ClientsList'
import CommandesList from './pages/CommandesList'
import RestaurantsList from './pages/RestaurantsList'
import PlatsList from './pages/PlatsList'
import CategoriesList from './pages/CategoriesList'
import Fidelite from './pages/Fidelite'
import AvisList from './pages/AvisList'
import UtilisateursList from './pages/UtilisateursList'
import RolesList from './pages/RolesList'
import AuditLogsList from './pages/AuditLogsList'
import { useAuthStore } from './store/authStore'

function ProtectedRoute({ children }) {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

function AppRoutes() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="clients" element={<ClientsList />} />
        <Route path="commandes" element={<CommandesList />} />
        <Route path="restaurants" element={<RestaurantsList />} />
        <Route path="plats" element={<PlatsList />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="fidelite" element={<Fidelite />} />
        <Route path="avis" element={<AvisList />} />
        <Route path="utilisateurs" element={<UtilisateursList />} />
        <Route path="roles" element={<RolesList />} />
        <Route path="audit-logs" element={<AuditLogsList />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-right" richColors duration={4000} />
        </BrowserRouter>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
