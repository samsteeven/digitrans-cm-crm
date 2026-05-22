import { useState, useEffect } from 'react'
import { commandes, clients, restaurants } from '../services/api'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import { notify } from '../services/toast'

const statutColors = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  confirmee: 'bg-blue-100 text-blue-800',
  en_preparation: 'bg-orange-100 text-orange-800',
  prete: 'bg-green-100 text-green-800',
  livree: 'bg-gray-100 text-gray-600',
  annulee: 'bg-red-100 text-red-800',
}

const statutLabels = {
  en_attente: 'En attente', confirmee: 'Confirmée', en_preparation: 'En préparation',
  prete: 'Prête', livree: 'Livrée', annulee: 'Annulée',
}

/**
 * Page de gestion des commandes.
 * Affiche la liste avec filtrage par statut, permet la création, changement de statut,
 * consultation des détails et suppression via DataTable + Modal.
 * Appels API : commandes.list(), commandes.create(), commandes.updateStatut(), commandes.delete(),
 * clients.list(), restaurants.list().
 */
export default function CommandesList() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [statut, setStatut] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState(null)
  const [clientList, setClientList] = useState([])
  const [restaurantList, setRestaurantList] = useState([])
  const [form, setForm] = useState({ client_id: '', restaurant_id: '', type_commande: 'sur_place', notes: '', lignes: [{ plat_id: '', quantite: 1 }] })

  const fetchCommandes = () => {
    setLoading(true); setError(false)
    commandes.list({ statut: statut || undefined })
      .then((res) => { setData(res.data.data || []); setError(false) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCommandes() }, [statut])

  const openCreate = async () => {
    try {
      const [c, r] = await Promise.all([clients.list({ per_page: 200 }), restaurants.list({ per_page: 200 })])
      setClientList(c.data.data || [])
      setRestaurantList(r.data.data || [])
      setForm({ client_id: '', restaurant_id: '', type_commande: 'sur_place', notes: '', lignes: [{ plat_id: '', quantite: 1 }] })
      setModalOpen(true)
    } catch { notify.error('Erreur chargement données') }
  }

  const openDetail = (r) => { setSelected(r); setDetailOpen(true) }

  const addLigne = () => setForm({...form, lignes: [...form.lignes, { plat_id: '', quantite: 1 }]})
  const removeLigne = (i) => setForm({...form, lignes: form.lignes.filter((_, idx) => idx !== i)})
  const setLigne = (i, field, value) => {
    const lignes = [...form.lignes]
    lignes[i][field] = value
    setForm({...form, lignes})
  }

  const handleSave = async (e) => {
    e.preventDefault()
    try {
      await commandes.create(form)
      notify.success('Commande créée')
      setModalOpen(false)
      fetchCommandes()
    } catch { notify.error('Erreur lors de la création') }
  }

  const handleStatutChange = async (id, newStatut) => {
    try {
      await commandes.updateStatut(id, newStatut)
      setData((prev) => prev.map((c) => c.id === id ? { ...c, statut: newStatut } : c))
      notify.success('Statut mis à jour')
    } catch { notify.error('Erreur mise à jour statut') }
  }

  const handleDelete = async (id) => {
    if (!confirm('Supprimer cette commande ?')) return
    try {
      await commandes.delete(id)
      notify.success('Commande supprimée')
      fetchCommandes()
    } catch { notify.error('Impossible de supprimer') }
  }

  const formatCFA = (val) => `${(val || 0).toLocaleString()} FCFA`

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des commandes</h1>
        <button onClick={openCreate} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium">+ Nouvelle commande</button>
      </div>

      {error && !loading && <ErrorState title="Échec du chargement" onRetry={fetchCommandes} />}

      {!error && (
        <>
          <div className="flex gap-3">
            <select value={statut} onChange={(e) => setStatut(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Tous les statuts</option>
              {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <DataTable
            onRowClick={openDetail}
            columns={[
              { key: 'client', label: 'Client', render: (r) => r.client ? `${r.client.prenom} ${r.client.nom}` : '-' },
              { key: 'restaurant', label: 'Restaurant', render: (r) => r.restaurant?.nom || '-' },
              { key: 'montant_total', label: 'Montant', render: (r) => formatCFA(r.montant_total) },
              { key: 'type_commande', label: 'Type', render: (r) => r.type_commande === 'livraison' ? '🚚 Livraison' : r.type_commande === 'a_emporter' ? '📦 À emporter' : '🍽️ Sur place' },
              { key: 'statut', label: 'Statut', render: (r) => (
                <select value={r.statut} onChange={(e) => handleStatutChange(r.id, e.target.value)}
                  className={`px-2 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${statutColors[r.statut] || ''}`}
                  onClick={(e) => e.stopPropagation()}>
                  {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
              )},
              { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString('fr') },
              { key: 'actions', label: '', render: (r) => (
                <button onClick={(e) => { e.stopPropagation(); handleDelete(r.id) }} className="text-red-600 hover:text-red-800 text-sm">Supprimer</button>
              )},
            ]}
            data={data} loading={loading}
          />
        </>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Nouvelle commande">
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type_commande} onChange={(e) => setForm({...form, type_commande: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="sur_place">Sur place</option>
              <option value="a_emporter">À emporter</option>
              <option value="livraison">Livraison</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} rows={2} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Lignes de commande</label>
              <button type="button" onClick={addLigne} className="text-xs text-green-600 hover:text-green-800">+ Ajouter un plat</button>
            </div>
            {form.lignes.map((ligne, i) => (
              <div key={i} className="flex gap-2 mb-2 items-end">
                <div className="flex-1">
                  {i === 0 && <span className="block text-xs text-gray-500 mb-1">Plat</span>}
                  <PlatSelect value={ligne.plat_id} onChange={(v) => setLigne(i, 'plat_id', v)} />
                </div>
                <div className="w-20">
                  {i === 0 && <span className="block text-xs text-gray-500 mb-1">Qté</span>}
                  <input type="number" min={1} value={ligne.quantite} onChange={(e) => setLigne(i, 'quantite', Number(e.target.value))} className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                {form.lignes.length > 1 && (
                  <button type="button" onClick={() => removeLigne(i)} className="text-red-500 text-sm pb-2">✕</button>
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm">Annuler</button>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm">Créer</button>
          </div>
        </form>
      </Modal>

      <Modal open={detailOpen} onClose={() => setDetailOpen(null)} title="Détail de la commande">
        {selected && (
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="font-medium text-gray-600">Client :</span> {selected.client?.prenom} {selected.client?.nom}</div>
              <div><span className="font-medium text-gray-600">Restaurant :</span> {selected.restaurant?.nom}</div>
              <div><span className="font-medium text-gray-600">Montant :</span> {formatCFA(selected.montant_total)}</div>
              <div><span className="font-medium text-gray-600">Statut :</span> {statutLabels[selected.statut] || selected.statut}</div>
              <div><span className="font-medium text-gray-600">Type :</span> {selected.type_commande}</div>
              <div><span className="font-medium text-gray-600">Date :</span> {new Date(selected.created_at).toLocaleString('fr')}</div>
            </div>
            {selected.notes && <div><span className="font-medium text-gray-600">Notes :</span> {selected.notes}</div>}
            {selected.ligne_commandes && selected.ligne_commandes.length > 0 && (
              <div>
                <span className="font-medium text-gray-600">Articles :</span>
                <table className="w-full mt-1 text-xs">
                  <thead><tr className="border-b"><th className="text-left py-1">Plat</th><th className="text-right py-1">Qté</th><th className="text-right py-1">Prix</th><th className="text-right py-1">Total</th></tr></thead>
                  <tbody>
                    {selected.ligne_commandes.map((l) => (
                      <tr key={l.id} className="border-b border-gray-100">
                        <td className="py-1">{l.plat?.nom || '-'}</td>
                        <td className="text-right py-1">{l.quantite}</td>
                        <td className="text-right py-1">{formatCFA(l.prix_unitaire)}</td>
                        <td className="text-right py-1">{formatCFA(l.sous_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}

function PlatSelect({ value, onChange }) {
  const [plats, setPlats] = useState([])
  useEffect(() => {
    import('../services/api').then(({ plats }) => plats.list({ per_page: 200 }).then((r) => setPlats(r.data.data || [])))
  }, [])
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)} required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
      <option value="">Sélectionner...</option>
      {plats.map((p) => <option key={p.id} value={p.id}>{p.nom} - {((p.prix_unitaire || 0)).toLocaleString()} FCFA</option>)}
    </select>
  )
}
