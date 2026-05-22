import { useState, useEffect } from 'react'
import { categories } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

/**
 * Page de gestion des catégories de plats.
 * CRUD complet via DataTable + Modal.
 * Appels API : categories.list(), categories.create(), categories.update(), categories.delete().
 */
export default function CategoriesList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ nom: '', description: '' })

  const fetchData = () => {
    setLoading(true)
    setError(false)
    categories.list()
      .then((res) => { setData(Array.isArray(res.data) ? res.data : res.data.data || []); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm({ nom: '', description: '' }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm({ nom: r.nom, description: r.description || '' }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await categories.update(editing.id, form)
        notify.success('Catégorie modifiée')
      } else {
        await categories.create(form)
        notify.success('Catégorie créée')
      }
      setModalOpen(false)
      fetchData()
    } catch { notify.error('Erreur lors de l\'enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette catégorie ?')) return
    try {
      await categories.delete(id)
      notify.success('Catégorie supprimée')
      fetchData()
    } catch (err) {
      notify.error(err.response?.data?.message || 'Impossible de supprimer')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Catégories de plats</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          + Nouvelle catégorie
        </button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchData} />}

      {!error && (
        <DataTable
          columns={[
            { key: 'nom', label: 'Nom' },
            { key: 'description', label: 'Description', render: (r) => r.description || '-' },
            { key: 'plats_count', label: 'Plats', render: (r) => r.plats_count ?? '-' },
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
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier la catégorie' : 'Nouvelle catégorie'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
