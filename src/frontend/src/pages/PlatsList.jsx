import { useState, useEffect } from 'react'
import { plats, categories } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

const emptyForm = { categorie_id: '', nom: '', description: '', prix_unitaire: '', devise: 'FCFA', disponible: true, image_url: '' }

export default function PlatsList() {
  const [data, setData] = useState([])
  const [categoriesList, setCategoriesList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [categorieId, setCategorieId] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchPlats = () => {
    setLoading(true); setError(false)
    Promise.all([
      plats.list({ categorie_id: categorieId || undefined }),
      categories.list(),
    ]).then(([listRes, catRes]) => {
      setData(listRes.data.data || [])
      setCategoriesList(Array.isArray(catRes.data) ? catRes.data : catRes.data.data || [])
      setError(false)
    }).catch(() => setError(true)).finally(() => setLoading(false))
  }

  useEffect(() => { fetchPlats() }, [categorieId])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm(r); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, prix_unitaire: Number(form.prix_unitaire), image_url: form.image_url || null }
      if (editing) {
        await plats.update(editing.id, payload)
        notify.success('Plat modifié')
      } else {
        await plats.create(payload)
        notify.success('Plat créé')
      }
      setModalOpen(false)
      fetchPlats()
    } catch { notify.error('Erreur lors de l\'enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce plat ?')) return
    try {
      await plats.delete(id)
      notify.success('Plat supprimé')
      fetchPlats()
    } catch { notify.error('Impossible de supprimer') }
  }

  const formatCFA = (val) => `${(val || 0).toLocaleString()} FCFA`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Carte des plats</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouveau plat</button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchPlats} />}

      {!error && (
        <>
          <div className="flex gap-3">
            <select value={categorieId} onChange={(e) => setCategorieId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Toutes les catégories</option>
              {categoriesList.map((cat) => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
            </select>
          </div>

          <DataTable
            columns={[
              { key: 'nom', label: 'Plat' },
              { key: 'prix_unitaire', label: 'Prix', render: (r) => formatCFA(r.prix_unitaire) },
              { key: 'disponible', label: 'Disponible', render: (r) => r.disponible ? <span className="text-green-600 text-sm">✅ Disponible</span> : <span className="text-red-600 text-sm">❌ Indisponible</span> },
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le plat' : 'Nouveau plat'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
              <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
              <select required value={form.categorie_id} onChange={(e) => setForm({...form, categorie_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Sélectionner...</option>
                {categoriesList.map((cat) => <option key={cat.id} value={cat.id}>{cat.nom}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix *</label>
              <input type="number" step="0.01" min="0" required value={form.prix_unitaire} onChange={(e) => setForm({...form, prix_unitaire: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Devise</label>
              <input value={form.devise} onChange={(e) => setForm({...form, devise: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.disponible} onChange={(e) => setForm({...form, disponible: e.target.checked})} className="rounded" />
                Disponible
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
            <input value={form.image_url || ''} onChange={(e) => setForm({...form, image_url: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
