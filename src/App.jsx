import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useMemo } from 'react'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import ModelInventory from './pages/ModelInventory'
import RiskRegister from './pages/RiskRegister'
import AuditLog from './pages/AuditLog'

function Starfield() {
  const stars = useMemo(() =>
    Array.from({ length: 150 }, (_, i) => {
      const opacity = Math.random() * 0.55 + 0.06
      const dur = (Math.random() * 6 + 3).toFixed(1)
      const delay = -(Math.random() * 9).toFixed(1)
      const size = Math.random() < 0.82
        ? (Math.random() * 1.1 + 0.3).toFixed(1)
        : (Math.random() * 1.8 + 1.1).toFixed(1)
      return {
        id: i,
        x: (Math.random() * 100).toFixed(2),
        y: (Math.random() * 100).toFixed(2),
        size,
        opacity,
        dur,
        delay,
      }
    }), []
  )

  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
      {stars.map(s => (
        <div
          key={s.id}
          className="starfield-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            '--star-opacity': s.opacity,
            animationDuration: `${s.dur}s`,
            animationDelay: `${s.delay}s`,
          }}
        />
      ))}
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ background: '#050914', position: 'relative' }} className="flex h-screen overflow-hidden">
        <Starfield />
        <div className="horizon-glow" />
        <div style={{ position: 'relative', zIndex: 10 }} className="flex w-full h-full">
          <Sidebar />
          <main className="flex-1 overflow-y-auto" style={{ background: 'transparent' }}>
            <Routes>
              <Route path="/" element={<Navigate to="/overview" replace />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/models" element={<ModelInventory />} />
              <Route path="/risks" element={<RiskRegister />} />
              <Route path="/audit" element={<AuditLog />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  )
}
