import { useDashboardKpi, useDashboardEvolution, useCommandes, useClients } from '../hooks/useApi'
import StatCard from '../components/StatCard'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

export default function Dashboard() {
  const { data: kpi, isLoading: kpiLoading, isError: kpiError, refetch: refetchKpi } = useDashboardKpi({ periode: 'mois' })
  const { data: evolution, isError: evolutionError, refetch: refetchEvolution } = useDashboardEvolution({ mois: 6 })
  const { data: commandes, isError: commandesError, refetch: refetchCommandes } = useCommandes({ per_page: 5 })
  const { data: clients, isError: clientsError, refetch: refetchClients } = useClients({ per_page: 5 })

  const formatCFA = (val) => `${(val || 0).toLocaleString()} FCFA`

  const evolutionData = Array.isArray(evolution) ? evolution : []
  const commandesData = commandes?.data || []
  const clientsData = clients?.data || []

  if (kpiError || evolutionError || commandesError || clientsError) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord CRM</h1>
        <ErrorState
          title="Échec du chargement du tableau de bord"
          message="Une erreur est survenue lors de la récupération des données en temps réel du CRM. Veuillez vérifier votre connexion et réessayer."
          onRetry={() => {
            refetchKpi();
            refetchEvolution();
            refetchCommandes();
            refetchClients();
          }}
        />
      </div>
    );
  }


  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Tableau de bord CRM</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Chiffre d'affaires (mois)" value={formatCFA(kpi?.chiffre_affaires)} color="green" sublabel="Période en cours" loading={kpiLoading} />
        <StatCard label="Commandes" value={kpi?.total_commandes || 0} color="blue" sublabel="Ce mois" loading={kpiLoading} />
        <StatCard label="Clients servis" value={kpi?.clients_servis || 0} color="purple" sublabel="Ce mois" loading={kpiLoading} />
        <StatCard label="Panier moyen" value={kpi?.panier_moyen ? formatCFA(kpi.panier_moyen) : '-'} color="orange" loading={kpiLoading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Évolution du CA</h2>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={evolutionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mois" tickFormatter={(v) => new Date(v).toLocaleDateString('fr', { month: 'short' })} />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="chiffre_affaires" stroke="#16a34a" strokeWidth={2} name="CA (FCFA)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">Commandes par statut</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={Object.entries(kpi?.commandes_par_statut || {}).map(([k, v]) => ({ statut: k, total: v }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="statut" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Dernières commandes</h2>
          <DataTable
            columns={[
              { key: 'client', label: 'Client', render: (r) => r.client ? `${r.client.prenom} ${r.client.nom}` : '-' },
              { key: 'montant_total', label: 'Montant', render: (r) => formatCFA(r.montant_total) },
              { key: 'statut', label: 'Statut' },
            ]}
            data={commandesData}
            loading={kpiLoading}
          />
        </div>
        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">Derniers clients</h2>
          <DataTable
            columns={[
              { key: 'nom_complet', label: 'Client' },
              { key: 'email', label: 'Email' },
              { key: 'segment', label: 'Segment' },
            ]}
            data={clientsData}
            loading={kpiLoading}
          />
        </div>
      </div>
    </div>
  )
}
