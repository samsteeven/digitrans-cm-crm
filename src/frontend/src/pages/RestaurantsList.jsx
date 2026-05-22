import { useState, useEffect } from 'react'
import { restaurants } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

const emptyForm = { nom: '', ville: '', quartier: '', adresse: '', telephone: '', email: '', capacite: '', est_actif: true }

export default function RestaurantsList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchData = () => {
    setLoading(true)
    setError(false)
    restaurants.list({ search: search || undefined })
      .then((res) => { setData(res.data.data || []); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [search])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm(r); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, capacite: form.capacite ? Number(form.capacite) : null }
      if (editing) {
        await restaurants.update(editing.id, payload)
        notify.success('Restaurant modifié')
      } else {
        await restaurants.create(payload)
        notify.success('Restaurant créé')
      }
      setModalOpen(false)
      fetchData()
    } catch { notify.error('Erreur lors de l\'enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce restaurant ?')) return
    try {
      await restaurants.delete(id)
      notify.success('Restaurant supprimé')
      fetchData()
    } catch { notify.error('Impossible de supprimer ce restaurant') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Restaurants</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          + Nouveau restaurant
        </button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchData} />}

      {!error && (
        <>
          <input
            type="text" placeholder="Rechercher un restaurant..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          />
          <DataTable
            columns={[
              { key: 'nom', label: 'Nom' },
              { key: 'ville', label: 'Ville' },
              { key: 'quartier', label: 'Quartier' },
              { key: 'telephone', label: 'Téléphone' },
              { key: 'capacite', label: 'Capacité', render: (r) => r.capacite ?? '-' },
              { key: 'est_actif', label: 'Actif', render: (r) => r.est_actif ? '✅' : '❌' },
              { key: 'actions', label: '', render: (r) => (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
                </div>
              )},
            ]}
            data={data}
            loading={loading}
          />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le restaurant' : 'Nouveau restaurant'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ville *</label>
              <input required value={form.ville} onChange={(e) => setForm({...form, ville: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Quartier</label>
            <input value={form.quartier || ''} onChange={(e) => setForm({...form, quartier: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
            <input value={form.adresse || ''} onChange={(e) => setForm({...form, adresse: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone</label>
              <input value={form.telephone || ''} onChange={(e) => setForm({...form, telephone: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" value={form.email || ''} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Capacité (couverts)</label>
              <input type="number" value={form.capacite || ''} onChange={(e) => setForm({...form, capacite: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.est_actif} onChange={(e) => setForm({...form, est_actif: e.target.checked})} className="rounded" />
                Restaurant actif
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">{editing ? 'Modifier' : 'Créer'}</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
