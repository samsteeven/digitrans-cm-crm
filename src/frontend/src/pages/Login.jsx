import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { auth } from '../services/api'
import { notify } from '../services/toast'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)

  const setAuth = useAuthStore((s) => s.setAuth)
  const navigate = useNavigate()

  const validate = () => {
    const newErrors = {}
    if (!email.trim()) {
      newErrors.email = "L'email est obligatoire"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format d'email invalide"
    }
    if (!password) {
      newErrors.password = 'Le mot de passe est obligatoire'
    } else if (password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caracteres'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { data } = await auth.login({ email, password, device_name: 'crm-web' })
      setAuth(data.user, data.token)
      notify.success('Connexion reussie !')
      navigate('/dashboard')
    } catch (err) {
      notify.error(err.response?.data?.message || 'Identifiants incorrects')
    } finally {
      setLoading(false)
    }
  }

  const handleForgotPassword = async (e) => {
    e.preventDefault()
    if (!forgotEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(forgotEmail)) {
      notify.error('Veuillez saisir un email valide')
      return
    }
    setForgotLoading(true)
    try {
      await new Promise((r) => setTimeout(r, 1000))
      notify.success('Lien de reinitialisation envoye a ' + forgotEmail)
      setShowForgot(false)
      setForgotEmail('')
    } catch {
      notify.error('Erreur lors de envoi. Reessayez.')
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 to-green-800">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">SavoirManger CRM</h1>
          <p className="text-sm text-gray-500 mt-1">Connectez-vous a votre espace</p>
        </div>
        {!showForgot ? (
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setErrors((prev) => ({ ...prev, email: '' })) }}
                className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.email ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="admin@savoirmanager.cm"
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setErrors((prev) => ({ ...prev, password: '' })) }}
                className={`w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 ${errors.password ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                placeholder="........"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <div className="text-right">
              <button type="button" onClick={() => setShowForgot(true)} className="text-sm text-green-600 hover:text-green-800 hover:underline">
                Mot de passe oublie ?
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleForgotPassword} className="space-y-4" noValidate>
            <div className="text-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Mot de passe oublie</h2>
              <p className="text-sm text-gray-500 mt-1">Entrez votre email pour recevoir un lien de reinitialisation</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="votre@email.com"
              />
            </div>
            <button type="submit" disabled={forgotLoading} className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50">
              {forgotLoading ? 'Envoi...' : 'Envoyer le lien'}
            </button>
            <button type="button" onClick={() => { setShowForgot(false); setForgotEmail('') }} className="w-full text-sm text-gray-500 hover:text-gray-700 hover:underline">
              Retour a la connexion
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
