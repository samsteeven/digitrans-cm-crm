import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { auth } from '../services/api'

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/clients', label: 'Clients', icon: '👥' },
  { path: '/commandes', label: 'Commandes', icon: '🛵' },
  { path: '/restaurants', label: 'Restaurants', icon: '🏪' },
  { path: '/plats', label: 'Plats', icon: '🍽️' },
  { path: '/categories', label: 'Catégories', icon: '📂' },
  { path: '/fidelite', label: 'Fidélité', icon: '⭐' },
  { path: '/avis', label: 'Avis', icon: '💬' },
  { path: '/utilisateurs', label: 'Utilisateurs', icon: '🔐' },
  { path: '/roles', label: 'Rôles', icon: '🛡️' },
  { path: '/audit-logs', label: 'Audit', icon: '📋' },
]

export default function Layout() {
  const { user, clearAuth } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    try { await auth.logout() } catch {}
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-lg font-bold text-green-700">SavoirManger CRM</h1>
          <p className="text-xs text-gray-500 mt-1">DIGITRANS-CM</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                location.pathname.startsWith(item.path)
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-700">{user?.name}</p>
          <button onClick={handleLogout} className="text-xs text-red-500 hover:text-red-700 mt-1">
            Déconnexion
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  )
}
