import { useState, useEffect } from 'react';
import { commandes } from '../services/api';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';

const statutColors = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  confirmee: 'bg-blue-100 text-blue-800',
  en_preparation: 'bg-orange-100 text-orange-800',
  prete: 'bg-green-100 text-green-800',
  livree: 'bg-gray-100 text-gray-600',
  annulee: 'bg-red-100 text-red-800',
};

const statutLabels = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_preparation: 'En préparation',
  prete: 'Prête',
  livree: 'Livrée',
  annulee: 'Annulée',
};

export default function CommandesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statut, setStatut] = useState('');

  const fetchCommandes = () => {
    setLoading(true);
    setError(false);
    const params = {};
    if (statut) params.statut = statut;

    commandes.list(params)
      .then((res) => {
        setData(res.data.data || []);
        setError(false);
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCommandes();
  }, [statut]);

  const handleStatutChange = async (id, newStatut) => {
    try {
      await commandes.updateStatut(id, newStatut);
      setData((prev) => prev.map((c) => c.id === id ? { ...c, statut: newStatut } : c));
    } catch {
      // toast notification already handled globally or we can ignore
    }
  };

  const formatCFA = (val) => `${(val || 0).toLocaleString()} FCFA`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Gestion des commandes</h1>

      {error && !loading && (
        <ErrorState
          title="Échec du chargement des commandes"
          message="Impossible de récupérer la liste des commandes. Veuillez réessayer."
          onRetry={fetchCommandes}
        />
      )}


      {!error && (
        <>
          <div className="flex gap-3">
            <select
              value={statut}
              onChange={(e) => setStatut(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Tous les statuts</option>
              {Object.entries(statutLabels).map(([k, v]) => (
                <option key={k} value={k}>{v}</option>
              ))}
            </select>
          </div>

          <DataTable
            columns={[
              {
                key: 'client', label: 'Client',
                render: (r) => r.client ? `${r.client.prenom} ${r.client.nom}` : '-',
              },
              {
                key: 'restaurant', label: 'Restaurant',
                render: (r) => r.restaurant?.nom || '-',
              },
              { key: 'montant_total', label: 'Montant', render: (r) => formatCFA(r.montant_total) },
              { key: 'type_commande', label: 'Type', render: (r) => r.type_commande === 'livraison' ? '🚚 Livraison' : r.type_commande === 'a_emporter' ? '📦 À emporter' : '🍽️ Sur place' },
              {
                key: 'statut', label: 'Statut',
                render: (r) => (
                  <select
                    value={r.statut}
                    onChange={(e) => handleStatutChange(r.id, e.target.value)}
                    className={`px-2 py-1 rounded-full text-xs font-medium border-0 ${statutColors[r.statut] || ''}`}
                  >
                    {Object.entries(statutLabels).map(([k, v]) => (
                      <option key={k} value={k}>{v}</option>
                    ))}
                  </select>
                ),
              },
              {
                key: 'created_at', label: 'Date',
                render: (r) => new Date(r.created_at).toLocaleDateString('fr'),
              },
            ]}
            data={data}
            loading={loading}
          />
        </>
      )}
    </div>
  );
}
