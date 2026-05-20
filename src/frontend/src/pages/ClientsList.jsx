import { useState, useEffect, useRef } from 'react';
import { clients } from '../services/api';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import ErrorState from '../components/ErrorState';
import { notify } from '../services/toast';

export default function ClientsList() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [segment, setSegment] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const debounceTimer = useRef(null);

  // Debounce 300ms sur la recherche
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    setPage(1);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const fetchClients = () => {
    setLoading(true);
    setError(false);
    const params = {};
    if (debouncedSearch) params.search = debouncedSearch;
    if (segment) params.segment = segment;
    params.page = page;
    Promise.all([
      clients.list(params),
      clients.statistiques(),
    ]).then(([listRes, statsRes]) => {
      setData(listRes.data.data || []);
      setPagination(listRes.data.meta || null);
      setStats(statsRes.data);
      setError(false);
    }).catch(() => {
      setError(true);
      notify.error('Impossible de charger les clients');
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, [debouncedSearch, segment, page]);

  // Nettoyage du timer au démontage
  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des clients</h1>

      {error && !loading && (
        <ErrorState
          title="Echec du chargement des clients"
          message="Impossible de recuperer les statistiques et la liste des clients."
          onRetry={fetchClients}
        />
      )}

      {!error && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total clients" value={stats.total} color="blue" />
          <StatCard label="Membres fidelite" value={stats.fideles} color="green" />
          <StatCard label="Nouveaux (mois)" value={stats.nouveaux_mois} color="purple" />
        </div>
      )}

      {!error && (
        <>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Rechercher un client... (300ms debounce)"
                value={search}
                onChange={handleSearchChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
              {search !== debouncedSearch && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
                </span>
              )}
            </div>
            <select
              value={segment}
              onChange={(e) => { setSegment(e.target.value); setPage(1); }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Tous les segments</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <DataTable
            columns={[
              { key: 'nom_complet', label: 'Nom complet' },
              { key: 'email', label: 'Email' },
              { key: 'telephone', label: 'Telephone' },
              { key: 'segment', label: 'Segment', render: (r) => (
                <span className={"px-2 py-1 rounded-full text-xs font-medium " + (
                  r.segment === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                  r.segment === 'premium' ? 'bg-purple-100 text-purple-800' :
                  'bg-gray-100 text-gray-600'
                )}>{r.segment}</span>
              )},
              { key: 'points_fidelite', label: 'Points' },
              { key: 'commandes_count', label: 'Commandes' },
            ]}
            data={data}
            loading={loading}
            pagination={pagination}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
}
