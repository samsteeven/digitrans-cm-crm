import { useState, useEffect } from 'react'
import { paliers } from '../../services/api'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { notify } from '../../services/toast'

const emptyForm = { nom: '', points_minimum: '', points_maximum: '', description: '' }

/**
 * Section de gestion des paliers de fidélité.
 * CRUD complet via DataTable + Modal.
 * Appels API : paliers.list(), paliers.create(), paliers.update(), paliers.delete().
 */
export default function PaliersSection() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchData = () => {
    setLoading(true)
    paliers.list()
      .then((res) => setData(Array.isArray(res.data) ? res.data : res.data.data || []))
      .catch(() => notify.error('Erreur chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm(r); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, points_minimum: Number(form.points_minimum), points_maximum: form.points_maximum ? Number(form.points_maximum) : null }
      if (editing) { await paliers.update(editing.id, payload); notify.success('Palier modifié') }
      else { await paliers.create(payload); notify.success('Palier créé') }
      setModalOpen(false); fetchData()
    } catch { notify.error('Erreur enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce palier ?')) return
    try { await paliers.delete(id); notify.success('Palier supprimé'); fetchData() }
    catch { notify.error('Erreur suppression') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Paliers de fidélité</h2>
        <button onClick={openCreate} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">+ Ajouter</button>
      </div>
      <DataTable
        columns={[
          { key: 'nom', label: 'Palier' },
          { key: 'points_minimum', label: 'Points min' },
          { key: 'points_maximum', label: 'Points max', render: (r) => r.points_maximum ?? '∞' },
          { key: 'description', label: 'Avantages' },
          { key: 'actions', label: '', render: (r) => (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
              <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
            </div>
          )},
        ]}
        data={data} loading={loading}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier palier' : 'Nouveau palier'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points minimum *</label>
              <input type="number" required min={0} value={form.points_minimum} onChange={(e) => setForm({...form, points_minimum: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points maximum</label>
              <input type="number" value={form.points_maximum || ''} onChange={(e) => setForm({...form, points_maximum: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
