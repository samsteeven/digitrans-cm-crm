import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import DataTable from '../src/components/DataTable'

const columns = [
  { key: 'nom', label: 'Nom' },
  { key: 'email', label: 'Email' },
  { key: 'segment', label: 'Segment', render: (r) => (
    <span className={`segment-badge ${r.segment}`}>{r.segment}</span>
  )},
]

const data = [
  { id: 1, nom: 'Dupont', email: 'dupont@test.com', segment: 'vip' },
  { id: 2, nom: 'Martin', email: 'martin@test.com', segment: 'standard' },
]

describe('DataTable', () => {
  it('renders column headers', () => {
    render(<DataTable columns={columns} data={data} loading={false} />)
    expect(screen.getByText('Nom')).toBeInTheDocument()
    expect(screen.getByText('Email')).toBeInTheDocument()
    expect(screen.getByText('Segment')).toBeInTheDocument()
  })

  it('renders data rows', () => {
    render(<DataTable columns={columns} data={data} loading={false} />)
    expect(screen.getByText('Dupont')).toBeInTheDocument()
    expect(screen.getByText('Martin')).toBeInTheDocument()
    expect(screen.getByText('dupont@test.com')).toBeInTheDocument()
  })

  it('shows loading spinner when loading', () => {
    const { container } = render(<DataTable columns={columns} data={[]} loading />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
    expect(screen.queryByText('Nom')).not.toBeInTheDocument()
  })

  it('shows empty message when no data', () => {
    render(<DataTable columns={columns} data={[]} loading={false} />)
    expect(screen.getByText('Aucune donnée')).toBeInTheDocument()
  })

  it('renders custom cell content via render prop', () => {
    render(<DataTable columns={columns} data={data} loading={false} />)
    const badges = document.querySelectorAll('.segment-badge')
    expect(badges.length).toBe(2)
    expect(badges[0].textContent).toBe('vip')
    expect(badges[1].textContent).toBe('standard')
  })

  it('calls onRowClick when a row is clicked', () => {
    const onRowClick = vi.fn()
    render(<DataTable columns={columns} data={data} loading={false} onRowClick={onRowClick} />)
    fireEvent.click(screen.getByText('Dupont'))
    expect(onRowClick).toHaveBeenCalledWith(data[0])
  })

  it('does not fail when onRowClick is undefined', () => {
    render(<DataTable columns={columns} data={data} loading={false} />)
    fireEvent.click(screen.getByText('Martin'))
    // No error expected
  })
})
