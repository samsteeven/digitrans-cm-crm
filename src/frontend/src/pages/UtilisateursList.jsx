import { useState, useEffect } from 'react'
import { users } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

export default function UtilisateursList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const fetchData = () => {
    setLoading(true); setError(false)
    users.list()
      .then((res) => { setData(res.data.data || []); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm({ name: '', email: '', password: '' }); setModalOpen(true) }
  const openEdit = (r) => { setEditing(r); setForm({ name: r.name, email: r.email, password: '' }); setModalOpen(true) }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      const payload = { ...form }
      if (!payload.password && editing) delete payload.password
      if (editing) {
        await users.update(editing.id, payload)
        notify.success('Utilisateur modifié')
      } else {
        await users.create(payload)
        notify.success('Utilisateur créé')
      }
      setModalOpen(false)
      fetchData()
    } catch { notify.error('Erreur lors de l\'enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cet utilisateur ?')) return
    try {
      await users.delete(id)
      notify.success('Utilisateur supprimé')
      fetchData()
    } catch { notify.error('Impossible de supprimer') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Utilisateurs</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          + Nouvel utilisateur
        </button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchData} />}

      {!error && (
        <DataTable
          columns={[
            { key: 'name', label: 'Nom' },
            { key: 'email', label: 'Email' },
            { key: 'created_at', label: 'Créé le', render: (r) => new Date(r.created_at).toLocaleDateString('fr') },
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "Modifier l'utilisateur" : 'Nouvel utilisateur'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
            <input type="email" required value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{editing ? 'Nouveau mot de passe (laisser vide pour conserver)' : 'Mot de passe *'}</label>
            <input type="password" required={!editing} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
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
