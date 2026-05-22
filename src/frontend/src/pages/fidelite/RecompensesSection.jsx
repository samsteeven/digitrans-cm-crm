import { useState, useEffect } from 'react'
import { recompenses } from '../../services/api'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { notify } from '../../services/toast'

const emptyForm = { nom: '', description: '', points_requis: '', type: 'produit_offert', valeur: '', stock: 999, est_active: true }

/**
 * Section de gestion des récompenses (fidélité).
 * CRUD complet via DataTable + Modal.
 * Appels API : recompenses.list(), recompenses.create(), recompenses.update(), recompenses.delete().
 */
export default function RecompensesSection() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(emptyForm)

  const fetchData = () => {
    setLoading(true)
    recompenses.list()
      .then((res) => setData(res.data.data || []))
      .catch(() => notify.error('Erreur chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm(r); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form, points_requis: Number(form.points_requis), valeur: form.valeur ? Number(form.valeur) : null, stock: Number(form.stock) }
      if (editing) { await recompenses.update(editing.id, payload); notify.success('Récompense modifiée') }
      else { await recompenses.create(payload); notify.success('Récompense créée') }
      setModalOpen(false); fetchData()
    } catch { notify.error('Erreur enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ?')) return
    try { await recompenses.delete(id); notify.success('Supprimée'); fetchData() }
    catch { notify.error('Erreur suppression') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Récompenses disponibles</h2>
        <button onClick={openCreate} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">+ Ajouter</button>
      </div>
      <DataTable
        columns={[
          { key: 'nom', label: 'Récompense' },
          { key: 'points_requis', label: 'Points', render: (r) => <span className="font-bold text-yellow-600">{r.points_requis} pts</span> },
          { key: 'type', label: 'Type' },
          { key: 'stock', label: 'Stock' },
          { key: 'est_active', label: 'Actif', render: (r) => r.est_active ? '✅' : '❌' },
          { key: 'actions', label: '', render: (r) => (
            <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
              <button onClick={() => openEdit(r)} className="text-blue-600 hover:text-blue-800 text-sm">Modifier</button>
              <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
            </div>
          )},
        ]}
        data={data} loading={loading}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier récompense' : 'Nouvelle récompense'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required value={form.nom} onChange={(e) => setForm({...form, nom: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea value={form.description || ''} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Points requis *</label>
              <input type="number" required min={1} value={form.points_requis} onChange={(e) => setForm({...form, points_requis: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valeur (FCFA)</label>
              <input type="number" value={form.valeur || ''} onChange={(e) => setForm({...form, valeur: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
              <input type="number" min={0} value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="produit_offert">Produit offert</option>
                <option value="reduction">Réduction</option>
                <option value="menu_gratuit">Menu gratuit</option>
              </select>
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.est_active} onChange={(e) => setForm({...form, est_active: e.target.checked})} className="rounded" />
                Active
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
