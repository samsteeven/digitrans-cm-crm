import { Component } from 'react';

/**
 * Barrière d'erreur React qui capture les erreurs de rendu
 * dans l'arbre des composants enfants et affiche une UI de secours.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 text-center">
          <span className="text-5xl mb-4">💥</span>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Une erreur inattendue est survenue
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <button
            onClick={this.handleReset}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}