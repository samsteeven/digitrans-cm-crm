import { useState } from 'react'
import { useRecompenses } from '../hooks/useApi'
import DataTable from '../components/DataTable'
import ErrorState from '../components/ErrorState'
import Modal from '../components/Modal'
import PaliersSection from './fidelite/PaliersSection'
import PointsSection from './fidelite/PointsSection'
import RecompensesSection from './fidelite/RecompensesSection'
import EchangesSection from './fidelite/EchangesSection'

export default function Fidelite() {
  const [activeTab, setActiveTab] = useState('recompenses')

  const tabs = [
    { id: 'recompenses', label: 'Récompenses' },
    { id: 'paliers', label: 'Paliers' },
    { id: 'points', label: 'Points' },
    { id: 'echanges', label: 'Échanges' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Programme de fidélité</h1>
      </div>

      <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-lg p-6 text-white">
        <h2 className="text-xl font-bold">SavoirManger Rewards</h2>
        <p className="mt-1 opacity-90">Cumulez des points à chaque commande et échangez-les contre des récompenses !</p>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? 'border-green-600 text-green-700' : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'recompenses' && <RecompensesSection />}
      {activeTab === 'paliers' && <PaliersSection />}
      {activeTab === 'points' && <PointsSection />}
      {activeTab === 'echanges' && <EchangesSection />}
    </div>
  )
}
