import { useState, useEffect } from 'react'
import { echanges, fidelite, clients } from '../../services/api'
import DataTable from '../../components/DataTable'
import Modal from '../../components/Modal'
import { notify } from '../../services/toast'

/**
 * Section d'échange de récompenses (fidélité).
 * Liste des échanges avec création (sélection client / récompense) et annulation via DataTable + Modal.
 * Appels API : echanges.list(), echanges.update(), fidelite.echanger(), clients.list(), recompenses.list().
 */
export default function EchangesSection() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [clientList, setClientList] = useState([])
  const [recompensesList, setRecompensesList] = useState([])
  const [form, setForm] = useState({ client_id: '', recompense_id: '' })

  const fetchData = () => {
    setLoading(true)
    echanges.list()
      .then((res) => setData(res.data.data || []))
      .catch(() => notify.error('Erreur chargement'))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchData() }, [])

  const openCreate = async () => {
    try {
      const [c, r] = await Promise.all([
        clients.list({ per_page: 200 }),
        import('../../services/api').then(m => m.recompenses.list()),
      ])
      setClientList(c.data.data || [])
      setRecompensesList(r.data.data || [])
      setForm({ client_id: '', recompense_id: '' })
      setModalOpen(true)
    } catch { notify.error('Erreur chargement données') }
  }

  const handleEchanger = async (e) => {
    e.preventDefault()
    try {
      await fidelite.echanger(form)
      notify.success('Récompense échangée')
      setModalOpen(false)
      fetchData()
    } catch (err) {
      notify.error(err.response?.data?.message || 'Erreur échange')
    }
  }

  const handleAnnuler = async (id) => {
    if (!confirm('Annuler cet échange ?')) return
    try {
      await echanges.update(id, { statut: 'annule' })
      notify.success('Échange annulé')
      fetchData()
    } catch { notify.error('Erreur') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-700">Échanges de récompenses</h2>
        <button onClick={openCreate} className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">+ Échanger des points</button>
      </div>
      <DataTable
        columns={[
          { key: 'client', label: 'Client', render: (r) => r.client ? `${r.client.prenom} ${r.client.nom}` : '-' },
          { key: 'recompense', label: 'Récompense', render: (r) => r.recompense?.nom || '-' },
          { key: 'points_utilises', label: 'Points', render: (r) => <span className="font-bold text-yellow-600">{r.points_utilises} pts</span> },
          { key: 'statut', label: 'Statut', render: (r) => {
            const colors = { valide: 'bg-green-100 text-green-800', utilise: 'bg-blue-100 text-blue-800', expire: 'bg-gray-100 text-gray-600', annule: 'bg-red-100 text-red-800' }
            return <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[r.statut] || 'bg-gray-100'}`}>{r.statut}</span>
          }},
          { key: 'code_utilisation', label: 'Code' },
          { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString('fr') },
          { key: 'actions', label: '', render: (r) => (
            r.statut === 'valide' && <button onClick={(e) => { e.stopPropagation(); handleAnnuler(r.id) }} className="text-red-600 hover:text-red-800 text-sm">Annuler</button>
          )},
        ]}
        data={data} loading={loading}
      />
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Échanger des points">
        <form onSubmit={handleEchanger} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client *</label>
            <select required value={form.client_id} onChange={(e) => setForm({...form, client_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Sélectionner...</option>
              {clientList.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Récompense *</label>
            <select required value={form.recompense_id} onChange={(e) => setForm({...form, recompense_id: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Sélectionner...</option>
              {recompensesList.map((r) => <option key={r.id} value={r.id}>{r.nom} ({r.points_requis} pts)</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Échanger</button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
