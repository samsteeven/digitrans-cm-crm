import { useState } from 'react'
import { fidelite, clients } from '../../services/api'
import { notify } from '../../services/toast'

export default function PointsSection() {
  const [searchClient, setSearchClient] = useState('')
  const [clientList, setClientList] = useState([])
  const [selectedClient, setSelectedClient] = useState(null)
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading] = useState(false)
  const [showAjouter, setShowAjouter] = useState(false)
  const [form, setForm] = useState({ client_id: '', commande_id: '', points: '' })

  const searchClients = async (val) => {
    setSearchClient(val)
    if (val.length < 2) { setClientList([]); return }
    try {
      const res = await clients.list({ search: val, per_page: 10 })
      setClientList(res.data.data || [])
    } catch { setClientList([]) }
  }

  const selectClient = async (client) => {
    setSelectedClient(client)
    setSearchClient(`${client.prenom} ${client.nom}`)
    setClientList([])
    setLoading(true)
    try {
      const res = await fidelite.points(client.id)
      setTransactions(res.data.transactions?.data || [])
      setShowAjouter(true)
      setForm({ client_id: client.id, commande_id: '', points: '' })
    } catch { notify.error('Erreur chargement points') }
    finally { setLoading(false) }
  }

  const handleAjouterPoints = async (e) => {
    e.preventDefault()
    try {
      await fidelite.ajouter(form)
      notify.success('Points ajoutés')
      setShowAjouter(false)
      selectClient(selectedClient)
    } catch { notify.error('Erreur ajout points') }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-700">Gestion des points fidélité</h2>

      <div className="relative">
        <input type="text" placeholder="Rechercher un client..." value={searchClient}
          onChange={(e) => searchClients(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none text-sm" />
        {clientList.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
            {clientList.map((c) => (
              <button key={c.id} onClick={() => selectClient(c)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-green-50 border-b border-gray-100 last:border-0">
                {c.prenom} {c.nom} - {c.email} <span className="text-yellow-600">({c.points_fidelite} pts)</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedClient && (
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="font-semibold">{selectedClient.prenom} {selectedClient.nom}</p>
              <p className="text-sm text-gray-500">Solde : <span className="font-bold text-yellow-600">{selectedClient.points_fidelite} pts</span></p>
            </div>
          </div>

          {showAjouter && (
            <form onSubmit={handleAjouterPoints} className="flex gap-3 mb-4 p-3 bg-yellow-50 rounded-lg">
              <input type="text" placeholder="Commande ID" value={form.commande_id}
                onChange={(e) => setForm({...form, commande_id: e.target.value})}
                className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
              <input type="number" placeholder="Points" min={1} required value={form.points}
                onChange={(e) => setForm({...form, points: e.target.value})}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm" />
              <button type="submit" className="px-4 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Ajouter</button>
            </form>
          )}

          {loading ? (
            <p className="text-gray-400 text-sm">Chargement...</p>
          ) : (
            <div className="space-y-1 max-h-60 overflow-y-auto">
              {transactions.map((t) => (
                <div key={t.id} className="flex justify-between items-center text-sm py-1.5 border-b border-gray-100 last:border-0">
                  <div>
                    <span className={`font-medium ${t.type === 'gain' ? 'text-green-600' : 'text-red-600'}`}>
                      {t.type === 'gain' ? '+' : ''}{t.points} pts
                    </span>
                    <span className="text-gray-400 ml-2 text-xs">{t.description || t.type}</span>
                  </div>
                  <span className="text-xs text-gray-400">{new Date(t.created_at).toLocaleDateString('fr')}</span>
                </div>
              ))}
              {transactions.length === 0 && <p className="text-gray-400 text-sm">Aucune transaction</p>}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
