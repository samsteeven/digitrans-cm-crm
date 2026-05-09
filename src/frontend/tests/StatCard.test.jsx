import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '../src/components/StatCard'

describe('StatCard', () => {
  it('renders label and value', () => {
    render(<StatCard label="Total clients" value="150" color="blue" />)
    expect(screen.getByText('Total clients')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renders sublabel when provided', () => {
    render(<StatCard label="CA" value="50 000 FCFA" sublabel="Ce mois" color="green" />)
    expect(screen.getByText('Ce mois')).toBeInTheDocument()
  })

  it('renders loading skeleton when loading is true', () => {
    const { container } = render(<StatCard label="Test" value="100" color="blue" loading />)
    expect(container.querySelector('.animate-pulse')).toBeInTheDocument()
    expect(screen.queryByText('Test')).not.toBeInTheDocument()
  })

  it('applies correct color class', () => {
    const { container } = render(<StatCard label="OK" value="5" color="green" />)
    const div = container.firstChild
    expect(div.className).toContain('bg-green-50')
    expect(div.className).toContain('text-green-700')
  })

  it('defaults to green when no color is provided', () => {
    const { container } = render(<StatCard label="Test" value="1" />)
    const div = container.firstChild
    expect(div.className).toContain('bg-green-50')
  })

  it('does not render sublabel div when sublabel is undefined', () => {
    render(<StatCard label="Test" value="1" color="blue" />)
    expect(screen.queryByText('undefined')).not.toBeInTheDocument()
  })
})
