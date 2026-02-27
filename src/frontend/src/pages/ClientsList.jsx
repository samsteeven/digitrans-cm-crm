import { useState, useEffect } from 'react';
import { clients } from '../services/api';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';

export default function ClientsList() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [segment, setSegment] = useState('');

  const fetchClients = () => {
    setLoading(true);
    const params = {};
    if (search) params.search = search;
    if (segment) params.segment = segment;

    Promise.all([
      clients.list(params),
      clients.statistiques(),
    ]).then(([listRes, statsRes]) => {
      setData(listRes.data.data || []);
      setStats(statsRes.data);
    }).finally(() => setLoading(false));
  };

  useEffect(() => { fetchClients(); }, [search, segment]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des clients</h1>

      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total clients" value={stats.total} color="blue" />
          <StatCard label="Membres fidélité" value={stats.fideles} color="green" />
          <StatCard label="Nouveaux (mois)" value={stats.nouveaux_mois} color="purple" />
        </div>
      )}

      <div className="flex gap-3">
        <input
          type="text"
          placeholder="Rechercher un client..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
        />
        <select
          value={segment}
          onChange={(e) => setSegment(e.target.value)}
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
          { key: 'telephone', label: 'Téléphone' },
          { key: 'segment', label: 'Segment', render: (r) => (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              r.segment === 'vip' ? 'bg-yellow-100 text-yellow-800' :
              r.segment === 'premium' ? 'bg-purple-100 text-purple-800' :
              'bg-gray-100 text-gray-600'
            }`}>{r.segment}</span>
          )},
          { key: 'points_fidelite', label: 'Points' },
          { key: 'commandes_count', label: 'Commandes' },
        ]}
        data={data}
        loading={loading}
      />
    </div>
  );
}
