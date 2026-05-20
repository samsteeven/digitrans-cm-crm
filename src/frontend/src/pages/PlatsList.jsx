import { useState, useEffect } from 'react';
import { plats } from '../services/api';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';

export default function PlatsList() {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [categorieId, setCategorieId] = useState('');

  const fetchPlats = () => {
    setLoading(true);
    setError(false);
    Promise.all([
      plats.list({ categorie_id: categorieId || undefined }),
      plats.categories(),
    ]).then(([listRes, catRes]) => {
      setData(listRes.data.data || []);
      setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || []);
      setError(false);
    }).catch(() => {
      setError(true);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPlats();
  }, [categorieId]);

  const formatCFA = (val) => `${(val || 0).toLocaleString()} FCFA`;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Carte des plats</h1>

      {error && !loading && (
        <ErrorState
          title="Échec du chargement des plats"
          message="Impossible de récupérer les catégories et la liste des plats de la carte. Veuillez réessayer."
          onRetry={fetchPlats}
        />
      )}


      {!error && (
        <>
          <div className="flex gap-3">
            <select
              value={categorieId}
              onChange={(e) => setCategorieId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="">Toutes les catégories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>{cat.nom}</option>
              ))}
            </select>
          </div>

          <DataTable
            columns={[
              { key: 'nom', label: 'Plat' },
              { key: 'prix_unitaire', label: 'Prix', render: (r) => formatCFA(r.prix_unitaire) },
              {
                key: 'disponible', label: 'Disponible',
                render: (r) => r.disponible
                  ? <span className="text-green-600 text-sm">✅ Disponible</span>
                  : <span className="text-red-600 text-sm">❌ Indisponible</span>,
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
