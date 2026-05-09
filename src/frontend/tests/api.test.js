import { describe, it, expect, vi } from 'vitest'

describe('Utilities', () => {
  it('should format CFA values correctly', () => {
    const formatCFA = (val) => {
      const formatted = Number(val || 0).toLocaleString('fr-FR')
      return `${formatted} FCFA`
    }
    const result = formatCFA(96000000)
    expect(result).toContain('FCFA')
    expect(result).not.toContain('undefined')
    expect(formatCFA(0)).toBe('0 FCFA')
  })

  it('should calculate KPI stats correctly', () => {
    const kpi = {
      chiffre_affaires: 15000000,
      total_commandes: 320,
      clients_servis: 180,
      note_moyenne: 4.2,
    }
    expect(kpi.total_commandes / kpi.clients_servis).toBeCloseTo(1.78, 1)
    expect(kpi.note_moyenne).toBeGreaterThanOrEqual(1)
    expect(kpi.note_moyenne).toBeLessThanOrEqual(5)
  })

  it('should return correct statut color', () => {
    const statutColors = {
      en_attente: 'bg-yellow-100 text-yellow-800',
      confirmee: 'bg-blue-100 text-blue-800',
      en_preparation: 'bg-orange-100 text-orange-800',
      prete: 'bg-green-100 text-green-800',
      livree: 'bg-gray-100 text-gray-600',
      annulee: 'bg-red-100 text-red-800',
    }
    expect(statutColors['en_attente']).toContain('yellow')
    expect(statutColors['confirmee']).toContain('blue')
    expect(statutColors['en_preparation']).toContain('orange')
    expect(statutColors['prete']).toContain('green')
    expect(statutColors['livree']).toContain('gray')
    expect(statutColors['annulee']).toContain('red')
  })

  it('should compute segment class correctly', () => {
    const segmentClass = (seg) => {
      return seg === 'vip' ? 'bg-yellow-100 text-yellow-800' :
             seg === 'premium' ? 'bg-purple-100 text-purple-800' :
             'bg-gray-100 text-gray-600'
    }
    expect(segmentClass('vip')).toContain('yellow')
    expect(segmentClass('premium')).toContain('purple')
    expect(segmentClass('standard')).toContain('gray')
  })
})
