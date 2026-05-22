import { useState, useEffect } from 'react'
import { avis, clients, restaurants } from '../services/api'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

/**
 * Page de gestion des avis clients.
 * Affiche la liste des avis avec note moyenne, répartition (BarChart) et statistiques (StatCard).
 * Permet la création et la suppression via DataTable + Modal.
 * Appels API : avis.list(), avis.analyse(), avis.create(), avis.delete(), clients.list(), restaurants.list().
 */
export default function AvisList() {
  const [data, setData] = useState([])
  const [analyse, setAnalyse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [clientList, setClientList] = useState([])
  const [restaurantList, setRestaurantList] = useState([])
  const [form, setForm] = useState({ client_id: '', commande_id: '', restaurant_id: '', note: 5, commentaire: '' })

  const fetchAvis = () => {
    setLoading(true); setError(false)
    Promise.all([avis.list(), avis.analyse()])
      .then(([listRes, analyseRes]) => { setData(listRes.data.data || []); setAnalyse(analyseRes.data); setError(false) })
      .catch(() => { setError(true); notify.error('Impossible de charger les avis') })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAvis() }, [])

  const openCreate = async () => {
    try {
      const [c, r] = await Promise.all([clients.list({ per_page: 200 }), restaurants.list({ per_page: 200 })])
      setClientList(c.data.data || [])
      setRestaurantList(r.data.data || [])
      setForm({ client_id: '', commande_id: '', restaurant_id: '', note: 5, commentaire: '' })
      setModalOpen(true)
    } catch { notify.error('Erreur chargement données') }
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await avis.create(form)
      notify.success('Avis créé')
      setModalOpen(false)
      fetchAvis()
    } catch { notify.error('Erreur lors de la création') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet avis ?')) return
    try {
      await avis.delete(id)
      notify.success('Avis supprimé')
      fetchAvis()
    } catch { notify.error('Impossible de supprimer') }
  }

  const renderStars = (note) => '★'.repeat(note) + '☆'.repeat(5 - note)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Avis clients</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouvel avis</button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchAvis} />}

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
              { key: 'actions', label: '', render: (r) => (
                <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
              )},
            ]}
            data={data} loading={loading}
          />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvel avis">
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
              <select required value={form.client_id} onChange={(e) => setForm({...form, client_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Sélectionner...</option>
                {clientList.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant *</label>
              <select required value={form.restaurant_id} onChange={(e) => setForm({...form, restaurant_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Sélectionner...</option>
                {restaurantList.map((r) => <option key={r.id} value={r.id}>{r.nom}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Note *</label>
            <div className="flex gap-2">
              {[1,2,3,4,5].map((n) => (
                <button key={n} type="button" onClick={() => setForm({...form, note: n})}
                  className={`w-10 h-10 rounded-full text-lg ${form.note >= n ? 'text-yellow-500' : 'text-gray-300'}`}>
                  ★
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commentaire</label>
            <textarea value={form.commentaire} onChange={(e) => setForm({...form, commentaire: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Créer</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
