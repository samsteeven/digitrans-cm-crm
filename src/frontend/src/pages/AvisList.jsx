import { useState, useEffect } from 'react';
import { avis } from '../services/api';
import DataTable from '../components/DataTable';
import StatCard from '../components/StatCard';
import ErrorState from '../components/ErrorState';
import { notify } from '../services/toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AvisList() {
  const [data, setData] = useState([]);
  const [analyse, setAnalyse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchAvis = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      avis.list(),
      avis.analyse(),
    ]).then(([listRes, analyseRes]) => {
      setData(listRes.data.data || []);
      setAnalyse(analyseRes.data);
      setError(false);
    }).catch(() => {
      setError(true);
      notify.error('Impossible de charger les avis');
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAvis();
  }, []);

  const renderStars = (note) => {
    return '★'.repeat(note) + '☆'.repeat(5 - note);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Avis clients</h1>

      {error && !loading && (
        <ErrorState
          title="Échec du chargement des avis"
          message="Impossible de récupérer les notes, statistiques et commentaires des clients. Veuillez réessayer."
          onRetry={fetchAvis}
        />
      )}

      {!error && (
        <>


      {analyse && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Note moyenne" value={`${analyse.moyenne?.toFixed(1) || '-'}/5`} color="green" />
            <StatCard label="Total avis" value={analyse.total_avis || 0} color="blue" />
            <StatCard label="Avis positifs" value={`${analyse.pourcentage_positif || 0}%`} color="purple" sublabel="Note ≥ 4" />
          </div>

          <div className="bg-white p-4 rounded-lg border border-gray-200">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">Répartition des notes</h2>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={Object.entries(analyse.repartition || {}).map(([k, v]) => ({ note: `${k} étoile(s)`, total: v }))}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="note" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      <DataTable
        columns={[
          { key: 'client', label: 'Client', render: (r) => r.client ? `${r.client.prenom} ${r.client.nom}` : '-' },
          { key: 'restaurant', label: 'Restaurant', render: (r) => r.restaurant?.nom || '-' },
          { key: 'note', label: 'Note', render: (r) => <span className="text-yellow-500">{renderStars(r.note)}</span> },
          { key: 'commentaire', label: 'Commentaire', render: (r) => r.commentaire || '-' },
          { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString('fr') },
        ]}
        data={data}
        loading={loading}
      />
        </>
      )}
    </div>
  );
}
