import { useState, useEffect } from 'react'
import { roles, permissionsService } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

/**
 * Page de gestion des rôles et permissions.
 * CRUD complet avec sélection de permissions par checkboxes via DataTable + Modal.
 * Appels API : roles.list(), roles.create(), roles.update(), roles.delete(), permissionsService.list().
 */
export default function RolesList() {
  const [data, setData] = useState([])
  const [allPermissions, setAllPermissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', permissions: [] })

  const fetchData = () => {
    setLoading(true); setError(false)
    Promise.all([roles.list(), permissionsService.list()])
      .then(([r, p]) => {
        setData(Array.isArray(r.data) ? r.data : r.data.data || [])
        setAllPermissions(Array.isArray(p.data) ? p.data : p.data.data || [])
        setError(false)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = () => { setEditing(null); setForm({ name: '', permissions: [] }); setModalOpen(true) }
  const openEdit = (r) => {
    setEditing(r)
    setForm({ name: r.name, permissions: (r.permissions || []).map((p) => p.name || p) })
    setModalOpen(true)
  }

  const togglePermission = (permName) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(permName)
        ? prev.permissions.filter((p) => p !== permName)
        : [...prev.permissions, permName],
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      if (editing) {
        await roles.update(editing.id, form)
        notify.success('Rôle modifié')
      } else {
        await roles.create(form)
        notify.success('Rôle créé')
      }
      setModalOpen(false)
      fetchData()
    } catch { notify.error('Erreur lors de l\'enregistrement') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer ce rôle ?')) return
    try {
      await roles.delete(id)
      notify.success('Rôle supprimé')
      fetchData()
    } catch { notify.error('Impossible de supprimer') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Rôles & Permissions</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">
          + Nouveau rôle
        </button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchData} />}

      {!error && (
        <DataTable
          columns={[
            { key: 'name', label: 'Nom' },
            { key: 'permissions_count', label: 'Permissions', render: (r) => (r.permissions || []).length },
            { key: 'guard_name', label: 'Guard' },
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Modifier le rôle' : 'Nouveau rôle'}>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nom *</label>
            <input required value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
            <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1">
              {allPermissions.map((perm) => (
                <label key={perm.id || perm.name} className="flex items-center gap-2 text-sm py-1 px-2 hover:bg-gray-50 rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.permissions.includes(perm.name)}
                    onChange={() => togglePermission(perm.name)}
                    className="rounded"
                  />
                  {perm.name}
                </label>
              ))}
              {allPermissions.length === 0 && <p className="text-gray-400 text-sm px-2">Aucune permission disponible</p>}
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
