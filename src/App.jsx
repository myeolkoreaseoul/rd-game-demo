import { useState } from 'react'
import Home from './components/Home'
import DefenseGame from './components/DefenseGame'
import EvidenceGame from './components/EvidenceGame'
import CaseDB from './components/CaseDB'
import Dashboard from './components/Dashboard'

function App() {
  const [currentView, setCurrentView] = useState('home')

  const renderView = () => {
    switch (currentView) {
      case 'defense-game':
        return <DefenseGame onBack={() => setCurrentView('home')} />
      case 'evidence-game':
        return <EvidenceGame onBack={() => setCurrentView('home')} />
      case 'case-db':
        return <CaseDB onBack={() => setCurrentView('home')} />
      case 'dashboard':
        return <Dashboard onBack={() => setCurrentView('home')} />
      default:
        return <Home onNavigate={setCurrentView} />
    }
  }

  return (
    <div className="min-h-screen">
      {renderView()}
    </div>
  )
}

export default App
