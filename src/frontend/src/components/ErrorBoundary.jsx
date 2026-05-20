import { Component } from 'react';

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
          <p className="text-gray-500 text-sm mb-2">
            {this.state.error?.message || 'Erreur inconnue'}
          </p>
          <p className="text-gray-400 text-xs mb-6">
            Rechargez la page ou contactez le support si le probleme persiste.
          </p>
          <div className="flex gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Reessayer
            </button>
            <button
              onClick={() => window.location.href = '/dashboard'}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
