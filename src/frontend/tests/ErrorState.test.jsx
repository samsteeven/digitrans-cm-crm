import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorState from '../src/components/ErrorState'

describe('ErrorState', () => {
  it('renders default title and message when none are provided', () => {
    render(<ErrorState />)
    expect(screen.getByText('Une erreur est survenue')).toBeInTheDocument()
    expect(screen.getByText('Impossible de récupérer les données depuis le serveur. Veuillez vérifier votre connexion.')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /réessayer/i })).not.toBeInTheDocument()
  })

  it('renders custom title and message', () => {
    render(<ErrorState title="Erreur test" message="Message personnalisé d'erreur." />)
    expect(screen.getByText('Erreur test')).toBeInTheDocument()
    expect(screen.getByText("Message personnalisé d'erreur.")).toBeInTheDocument()
  })

  it('renders retry button when onRetry prop is provided and triggers callback on click', () => {
    const handleRetry = vi.fn()
    render(<ErrorState onRetry={handleRetry} />)
    
    const retryBtn = screen.getByRole('button', { name: /réessayer/i })
    expect(retryBtn).toBeInTheDocument()
    
    fireEvent.click(retryBtn)
    expect(handleRetry).toHaveBeenCalledTimes(1)
  })
})
