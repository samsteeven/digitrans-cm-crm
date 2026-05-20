import { useState } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { auth } from '../services/api';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/clients', label: 'Clients', icon: '👥' },
  { path: '/commandes', label: 'Commandes', icon: '🛵' },
  { path: '/fidelite', label: 'Fidelite', icon: '⭐' },
  { path: '/avis', label: 'Avis', icon: '💬' },
  { path: '/plats', label: 'Plats', icon: '🍽️' },
];

export default function Layout() {
  const { user, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try { await auth.logout(); } catch {}
    clearAuth();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="flex h-screen bg-gray-50">

      {/* ── Overlay mobile (fond sombre quand sidebar ouverte) ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* ── Sidebar ── */}
      <aside className={"fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out " + (sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")}>
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-green-700">SavoirManger CRM</h1>
            <p className="text-xs text-gray-500 mt-1">DIGITRANS-CM</p>
          </div>
          {/* Bouton fermer sur mobile */}
          <button
            onClick={closeSidebar}
            className="lg:hidden text-gray-400 hover:text-gray-600 text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={closeSidebar}
              className={"flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors " + (
                location.pathname.startsWith(item.path)
                  ? 'bg-green-50 text-green-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 font-medium">{user?.name}</p>
          <p className="text-xs text-gray-400 mb-2">{user?.email}</p>
          <button
            onClick={handleLogout}
            className="text-xs text-red-500 hover:text-red-700 transition-colors"
          >
            Deconnexion
          </button>
        </div>
      </aside>

      {/* ── Contenu principal ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* ── Header mobile avec bouton toggle ── */}
        <header className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold text-green-700 text-sm">SavoirManger CRM</span>
        </header>

        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
