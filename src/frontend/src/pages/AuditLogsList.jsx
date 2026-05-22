import { useState, useEffect } from 'react'
import { auditLogs } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'

/**
 * Page de consultation du journal d'audit.
 * Affiche la liste des actions (create, update, delete) avec Modal de détail (anciennes/nouvelles valeurs).
 * Appels API : auditLogs.list().
 */
export default function AuditLogsList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [selected, setSelected] = useState(null)

  const fetchData = () => {
    setLoading(true); setError(false)
    auditLogs.list()
      .then((res) => { setData(res.data.data || []); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const formatJSON = (val) => {
    if (!val) return '-'
    try { return JSON.stringify(typeof val === 'string' ? JSON.parse(val) : val, null, 2) }
    catch { return String(val) }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Journal d'audit</h1>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchData} />}

      {!error && (
        <DataTable
          columns={[
            { key: 'action', label: 'Action', render: (r) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                r.action === 'create' ? 'bg-green-100 text-green-800' :
                r.action === 'update' ? 'bg-blue-100 text-blue-800' :
                r.action === 'delete' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-600'
              }`}>{r.action}</span>
            )},
            { key: 'entite_type', label: 'Type' },
            { key: 'entite_id', label: 'Entité ID', render: (r) => r.entite_id ? r.entite_id.substring(0, 8) + '...' : '-' },
            { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleString('fr') },
            { key: 'actions', label: '', render: (r) => (
              <button onClick={(e) => { e.stopPropagation(); setSelected(r) }} className="text-blue-600 hover:text-blue-800 text-sm">Détails</button>
            )},
          ]}
          data={data}
          loading={loading}
        />
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Détail de l'audit">
        {selected && (
          <div className="space-y-3 text-sm">
            <div><span className="font-medium text-gray-600">Action :</span> {selected.action}</div>
            <div><span className="font-medium text-gray-600">Type :</span> {selected.entite_type}</div>
            <div><span className="font-medium text-gray-600">Entité ID :</span> {selected.entite_id || '-'}</div>
            <div><span className="font-medium text-gray-600">IP :</span> {selected.adresse_ip || '-'}</div>
            <div><span className="font-medium text-gray-600">Date :</span> {new Date(selected.created_at).toLocaleString('fr')}</div>
            <div>
              <span className="font-medium text-gray-600">Anciennes valeurs :</span>
              <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">{formatJSON(selected.anciennes_valeurs)}</pre>
            </div>
            <div>
              <span className="font-medium text-gray-600">Nouvelles valeurs :</span>
              <pre className="mt-1 bg-gray-50 p-2 rounded text-xs overflow-x-auto">{formatJSON(selected.nouvelles_valeurs)}</pre>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
