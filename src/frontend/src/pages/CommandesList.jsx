import { useState, useEffect } from 'react';
import { commandes, clients, plats } from '../services/api';
import DataTable from '../components/DataTable';
import ErrorState from '../components/ErrorState';

const statutColors = {
  en_attente: 'bg-yellow-100 text-yellow-800',
  confirmee: 'bg-blue-100 text-blue-800',
  en_preparation: 'bg-orange-100 text-orange-800',
  prete: 'bg-green-100 text-green-800',
  livree: 'bg-gray-100 text-gray-600',
  annulee: 'bg-red-100 text-red-800',
};

const statutLabels = {
  en_attente: 'En attente',
  confirmee: 'Confirmee',
  en_preparation: 'En preparation',
  prete: 'Prete',
  livree: 'Livree',
  annulee: 'Annulee',
};

const TYPES = ['sur_place', 'a_emporter', 'livraison'];

export default function CommandesList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [statut, setStatut] = useState('');

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [clientsList, setClientsList] = useState([]);
  const [platsList, setPlatsList] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const emptyForm = { client_id: '', type_commande: 'sur_place', lignes: [{ plat_id: '', quantite: 1 }] };
  const [form, setForm] = useState(emptyForm);

  const fetchCommandes = () => {
    setLoading(true);
    setError(false);
    const params = {};
    if (statut) params.statut = statut;
    commandes.list(params)
      .then((res) => { setData(res.data.data || []); setError(false); })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCommandes(); }, [statut]);

  const openModal = async () => {
    setForm(emptyForm);
    setFormErrors({});
    try {
      const [c, p] = await Promise.all([clients.list({ per_page: 100 }), plats.list({ per_page: 100 })]);
      setClientsList(c.data.data || []);
      setPlatsList(p.data.data || []);
    } catch { setClientsList([]); setPlatsList([]); }
    setShowModal(true);
  };

  const closeModal = () => { setShowModal(false); setForm(emptyForm); setFormErrors({}); };

  const validateForm = () => {
    const errs = {};
    if (!form.client_id) errs.client_id = 'Veuillez selectionner un client';
    if (!form.type_commande) errs.type_commande = 'Veuillez selectionner un type';
    const lignesValides = form.lignes.filter((l) => l.plat_id);
    if (lignesValides.length === 0) errs.lignes = 'Ajoutez au moins un plat';
    form.lignes.forEach((l, i) => {
      if (l.plat_id && (!l.quantite || l.quantite < 1)) errs['qte_' + i] = 'Quantite invalide';
    });
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAddLigne = () => setForm((f) => ({ ...f, lignes: [...f.lignes, { plat_id: '', quantite: 1 }] }));
  const handleRemoveLigne = (i) => setForm((f) => ({ ...f, lignes: f.lignes.filter((_, idx) => idx !== i) }));
  const handleLigneChange = (i, field, value) => {
    setForm((f) => {
      const lignes = [...f.lignes];
      lignes[i] = { ...lignes[i], [field]: value };
      return { ...f, lignes };
    });
  };

  const getPlatPrix = (platId) => platsList.find((p) => p.id == platId)?.prix_unitaire || 0;
  const getTotal = () => form.lignes.reduce((sum, l) => sum + (l.plat_id ? getPlatPrix(l.plat_id) * (l.quantite || 1) : 0), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const payload = {
        client_id: form.client_id,
        type_commande: form.type_commande,
        lignes: form.lignes.filter((l) => l.plat_id).map((l) => ({ plat_id: l.plat_id, quantite: parseInt(l.quantite) })),
      };
      await commandes.create(payload);
      closeModal();
      fetchCommandes();
    } catch (err) {
      setFormErrors({ submit: err.response?.data?.message || 'Erreur lors de la creation' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatutChange = async (id, newStatut) => {
    try {
      await commandes.updateStatut(id, newStatut);
      setData((prev) => prev.map((c) => c.id === id ? { ...c, statut: newStatut } : c));
    } catch {}
  };

  const formatCFA = (val) => (val || 0).toLocaleString() + ' FCFA';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Gestion des commandes</h1>
        <button onClick={openModal} className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          + Nouvelle commande
        </button>
      </div>

      {error && !loading && (
        <ErrorState title="Echec du chargement" message="Impossible de recuperer les commandes." onRetry={fetchCommandes} />
      )}

      {!error && (
        <>
          <div className="flex gap-3">
            <select value={statut} onChange={(e) => setStatut(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none">
              <option value="">Tous les statuts</option>
              {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <DataTable
            columns={[
              { key: 'client', label: 'Client', render: (r) => r.client ? r.client.prenom + ' ' + r.client.nom : '-' },
              { key: 'restaurant', label: 'Restaurant', render: (r) => r.restaurant?.nom || '-' },
              { key: 'montant_total', label: 'Montant', render: (r) => formatCFA(r.montant_total) },
              { key: 'type_commande', label: 'Type', render: (r) => r.type_commande === 'livraison' ? 'Livraison' : r.type_commande === 'a_emporter' ? 'A emporter' : 'Sur place' },
              {
                key: 'statut', label: 'Statut',
                render: (r) => (
                  <select value={r.statut} onChange={(e) => handleStatutChange(r.id, e.target.value)} className={"px-2 py-1 rounded-full text-xs font-medium border-0 " + (statutColors[r.statut] || '')}>
                    {Object.entries(statutLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                  </select>
                ),
              },
              { key: 'created_at', label: 'Date', render: (r) => new Date(r.created_at).toLocaleDateString('fr') },
            ]}
            data={data}
            loading={loading}
          />
        </>
      )}

      {/* ── Modal Nouvelle Commande ── */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Nouvelle commande</h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>

                {/* Client */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
                  <select
                    value={form.client_id}
                    onChange={(e) => setForm((f) => ({ ...f, client_id: e.target.value }))}
                    className={"w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 " + (formErrors.client_id ? 'border-red-500' : 'border-gray-300')}
                  >
                    <option value="">Selectionnez un client</option>
                    {clientsList.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom}</option>)}
                  </select>
                  {formErrors.client_id && <p className="text-red-500 text-xs mt-1">{formErrors.client_id}</p>}
                </div>

                {/* Type commande */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type de commande</label>
                  <select
                    value={form.type_commande}
                    onChange={(e) => setForm((f) => ({ ...f, type_commande: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {TYPES.map((t) => <option key={t} value={t}>{t === 'sur_place' ? 'Sur place' : t === 'a_emporter' ? 'A emporter' : 'Livraison'}</option>)}
                  </select>
                </div>

                {/* Lignes de commande */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Plats commandes</label>
                  {formErrors.lignes && <p className="text-red-500 text-xs mb-2">{formErrors.lignes}</p>}
                  <div className="space-y-2">
                    {form.lignes.map((ligne, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <select
                          value={ligne.plat_id}
                          onChange={(e) => handleLigneChange(i, 'plat_id', e.target.value)}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        >
                          <option value="">Choisir un plat</option>
                          {platsList.map((p) => <option key={p.id} value={p.id}>{p.nom} — {p.prix_unitaire.toLocaleString()} FCFA</option>)}
                        </select>
                        <input
                          type="number"
                          min="1"
                          value={ligne.quantite}
                          onChange={(e) => handleLigneChange(i, 'quantite', e.target.value)}
                          className="w-16 px-2 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 text-sm text-center"
                        />
                        {form.lignes.length > 1 && (
                          <button type="button" onClick={() => handleRemoveLigne(i)} className="text-red-500 hover:text-red-700 font-bold text-lg leading-none">&times;</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button type="button" onClick={handleAddLigne} className="mt-2 text-sm text-green-600 hover:text-green-800 hover:underline">
                    + Ajouter un plat
                  </button>
                </div>

                {/* Total */}
                <div className="bg-green-50 rounded-lg px-4 py-3 flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Total estimé</span>
                  <span className="text-lg font-bold text-green-700">{formatCFA(getTotal())}</span>
                </div>

                {formErrors.submit && <p className="text-red-500 text-sm">{formErrors.submit}</p>}

                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={closeModal} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Annuler
                  </button>
                  <button type="submit" disabled={submitting} className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50">
                    {submitting ? 'Creation...' : 'Creer la commande'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
