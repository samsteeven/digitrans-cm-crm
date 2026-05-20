import { useRecompenses } from '../hooks/useApi';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';

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
        <ErrorState
          title="Échec du chargement du programme de fidélité"
          message={error?.message || "Impossible de récupérer les paliers et récompenses disponibles. Veuillez réessayer."}
          onRetry={() => refetch()}
        />
      )}

      {/* Tableau */}
      {!isError && (
        <>
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
        </>
      )}
    </div>
  );
}