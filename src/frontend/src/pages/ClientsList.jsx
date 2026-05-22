import { useState, useEffect } from 'react'
import { clients } from '../services/api'
import DataTable from '../components/DataTable'
import StatCard from '../components/StatCard'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

const emptyForm = { nom: '', prenom: '', email: '', telephone: '', date_naissance: '', notes: '' }

export default function ClientsList() {
  const [data, setData] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [segment, setSegment] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [selected, setSelected] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchClients = () => {
    setLoading(true); setError(false)
    const params = {}
    if (search) params.search = search
    if (segment) params.segment = segment
    Promise.all([clients.list(params), clients.statistiques()])
      .then(([listRes, statsRes]) => { setData(listRes.data.data || []); setStats(statsRes.data); setError(false) })
      .catch(() => { setError(true); notify.error('Impossible de charger les clients') })
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchClients() }, [search, segment])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm(r); setModalOpen(true) }
  const openDetail = (r) => { setSelected(r); setDetailOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, date_naissance: form.date_naissance || null }
      if (editing) {
        await clients.update(editing.id, payload)
        notify.success('Client modifié')
      } else {
        await clients.create(payload)
        notify.success('Client créé')
      }
      setModalOpen(false)
      fetchClients()
    } catch { notify.error('Erreur lors de l\'enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce client ?')) return
    try {
      await clients.delete(id)
      notify.success('Client supprimé')
      fetchClients()
    } catch { notify.error('Impossible de supprimer') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des clients</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouveau client</button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchClients} />}

      {!error && stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total clients" value={stats.total} color="blue" />
          <StatCard label="Membres fidélité" value={stats.fideles} color="green" />
          <StatCard label="Nouveaux (mois)" value={stats.nouveaux_mois} color="purple" />
        </div>
      )}

      {!error && (
        <>
          <div className="flex gap-3">
            <input type="text" placeholder="Rechercher un client..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none" />
            <select value={segment} onChange={(e) => setSegment(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Tous les segments</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <DataTable
            onRowClick={openDetail}
            columns={[
              { key: 'nom_complet', label: 'Nom complet' },
              { key: 'email', label: 'Email' },
              { key: 'telephone', label: 'Téléphone' },
              { key: 'segment', label: 'Segment', render: (r) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  r.segment === 'vip' ? 'bg-yellow-100 text-yellow-800' :
                  r.segment === 'premium' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-600'
                }`}>{r.segment}</span>
              )},
              { key: 'points_fidelite', label: 'Points' },
              { key: 'commandes_count', label: 'Commandes' },
              { key: 'actions', label: '', render: (r) => (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                </div>
              )},
            ]}
            data={data} loading={loading}
          />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le client' : 'Nouveau client'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prénom *</label>
              <input required value={form.prenom} onChange={(e) => setForm({...form, prenom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input value={form.telephone || ''} onChange={(e) => setForm({...form, telephone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date naissance</label>
              <input type="date" value={form.date_naissance || ''} onChange={(e) => setForm({...form, date_naissance: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes || ''} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">{editing ? 'Modifier' : 'Créer'}</button>
          </div>
        </form>
      </Modal>

      <Modal open={detailOpen} onClose={() => setDetailOpen(null)} title="Détail du client">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="font-medium text-gray-600">Nom :</span> {selected.prenom} {selected.nom}</div>
              <div><span className="font-medium text-gray-600">Email :</span> {selected.email}</div>
              <div><span className="font-medium text-gray-600">Téléphone :</span> {selected.telephone || '-'}</div>
              <div><span className="font-medium text-gray-600">Segment :</span> {selected.segment}</div>
              <div><span className="font-medium text-gray-600">Points fidélité :</span> {selected.points_fidelite}</div>
              <div><span className="font-medium text-gray-600">Date création :</span> {new Date(selected.created_at).toLocaleDateString('fr')}</div>
            </div>
            {selected.notes && <div><span className="font-medium text-gray-600">Notes :</span> {selected.notes}</div>}
          </div>
        )}
      </Modal>
    </div>
  )
}
