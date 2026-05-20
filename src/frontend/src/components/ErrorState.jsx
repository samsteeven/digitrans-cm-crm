import React from 'react';

/**
 * Composant ErrorState
 * Affiche un état d'erreur premium et moderne en cas d'échec de chargement API.
 * 
 * @param {Object} props
 * @param {string} props.title - Le titre de l'erreur (par défaut "Échec du chargement")
 * @param {string} props.message - Le message ou détail de l'erreur
 * @param {Function} props.onRetry - La fonction de rappel pour réessayer le chargement
 */
export default function ErrorState({ 
  title = "Une erreur est survenue", 
  message = "Impossible de récupérer les données depuis le serveur. Veuillez vérifier votre connexion.", 
  onRetry 
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center min-h-[350px] bg-white border border-red-100 rounded-2xl shadow-sm transition-all duration-300 hover:shadow-md animate-fade-in">
      <div className="relative flex items-center justify-center w-16 h-16 mb-6 rounded-full bg-red-50 text-red-500 animate-bounce-subtle">
        {/* Glow effect */}
        <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-20 animate-ping"></span>
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill="none" 
          viewBox="0 0 24 24" 
          strokeWidth={1.5} 
          stroke="currentColor" 
          className="w-8 h-8 relative z-10"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" 
          />
        </svg>
      </div>

      <h3 className="text-lg font-bold text-gray-800 mb-2">
        {title}
      </h3>
      
      <p className="text-sm text-gray-500 max-w-md mb-6 leading-relaxed">
        {message}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 active:from-red-700 text-white font-medium text-sm rounded-xl shadow-sm shadow-red-100 hover:shadow-md transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            strokeWidth={2} 
            stroke="currentColor" 
            className="w-4 h-4"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" 
            />
          </svg>
          Réessayer
        </button>
      )}
    </div>
  );
}
