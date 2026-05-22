/**
 * Carte de statistique avec code couleur, état de chargement
 * et affichage d'une valeur et d'un sous-titre optionnel.
 *
 * @param {Object} props
 * @param {string} props.label - Libellé de la carte
 * @param {string|number} props.value - Valeur affichée
 * @param {string} [props.sublabel] - Sous-titre optionnel
 * @param {'green'|'blue'|'orange'|'purple'|'red'} [props.color] - Couleur de fond
 * @param {boolean} [props.loading] - Affiche l'état de chargement
 */
export default function StatCard({ label, value, sublabel, color, loading }) {
  const colorMap = {
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    red: 'bg-red-50 text-red-700 border-red-200',
  }

  if (loading) {
    return (
      <div className={`p-4 rounded-lg border animate-pulse ${colorMap[color] || colorMap.green}`}>
        <div className="h-3 bg-current/20 rounded w-24 mb-2" />
        <div className="h-6 bg-current/20 rounded w-16" />
      </div>
    )
  }

  return (
    <div className={`p-4 rounded-lg border ${colorMap[color] || colorMap.green}`}>
      <p className="text-sm opacity-75">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
      {sublabel && <p className="text-xs opacity-60 mt-1">{sublabel}</p>}
    </div>
  )
}
