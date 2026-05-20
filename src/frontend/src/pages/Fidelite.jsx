import { useRecompenses } from '../hooks/useApi';
import DataTable from '../components/DataTable';

export default function Fidelite() {
  const { data, isLoading, isError, error, refetch } = useRecompenses();

  // Normalisation : l'API peut retourner { data: [...] } ou directement [...]
  const recompenses = Array.isArray(data)
    ? data
    : Array.isArray(data?.data)
    ? data.data
    : [];

  // Statistiques dynamiques calculées depuis les vraies données
  const totalRecompenses = recompenses.length;
  const pointsMin = recompenses.length > 0
    ? Math.min(...recompenses.map((r) => r.points_requis))
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Programme de fidélité</h1>

      {/* Bannière */}
      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold">SavoirManger Rewards</h2>
        <p className="mt-1 opacity-90">
          Cumulez des points à chaque commande et échangez-les contre des récompenses !
        </p>
        <div className="mt-4 grid grid-cols-4 gap-3">
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">4</p>
            <p className="text-xs opacity-80">Paliers</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">
              {isLoading ? '…' : totalRecompenses}
            </p>
            <p className="text-xs opacity-80">Récompenses</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">
              {isLoading ? '…' : pointsMin > 0 ? pointsMin : '—'}
            </p>
            <p className="text-xs opacity-80">Points min.</p>
          </div>
          <div className="bg-white/20 rounded-lg p-3 text-center">
            <p className="text-2xl font-bold">-50%</p>
            <p className="text-xs opacity-80">Jusqu'à -50%</p>
          </div>
        </div>
      </div>

      {/* État erreur */}
      {isError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-red-500 text-xl">⚠️</span>
            <div>
              <p className="font-semibold text-red-700">
                Impossible de charger les récompenses
              </p>
              <p className="text-sm text-red-500">
                {error?.message || 'Erreur inconnue'}
              </p>
            </div>
          </div>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Tableau */}
      <h2 className="text-lg font-semibold text-gray-700">Récompenses disponibles</h2>
      <DataTable
        columns={[
          { key: 'nom', label: 'Récompense' },
          { key: 'description', label: 'Description' },
          {
            key: 'points_requis',
            label: 'Points requis',
            render: (r) => (
              <span className="font-bold text-yellow-600">{r.points_requis} pts</span>
            ),
          },
          {
            key: 'type',
            label: 'Type',
            render: (r) =>
              r.type === 'produit_offert'
                ? ' Produit offert'
                : r.type === 'reduction'
                ? 'Réduction'
                : 'Menu gratuit',
          },
          { key: 'stock', label: 'Stock' },
        ]}
        data={recompenses}
        loading={isLoading}
      />
    </div>
  );
}