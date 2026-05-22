import { useEffect, useRef } from 'react'

/**
 * Fenêtre modale superposée avec fermeture au clic sur
 * l'overlay ou via la touche Échap.
 *
 * @param {Object} props
 * @param {boolean} props.open - Contrôle l'ouverture de la modale
 * @param {Function} props.onClose - Callback de fermeture
 * @param {string} props.title - Titre affiché dans l'en-tête
 * @param {React.ReactNode} props.children - Contenu de la modale
 */
export default function Modal({ open, onClose, title, children }) {
  const overlayRef = useRef()

  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={(e) => e.target === overlayRef.current && onClose()}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
        </div>
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  )
}
