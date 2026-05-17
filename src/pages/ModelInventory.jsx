import { useState } from 'react'
import { models } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import { exportModelsCSV } from '../utils/exportUtils'

function MobileModelCard({ m }) {
  return (
    <div
      className="glass-panel rounded-xl p-4 mb-3"
      style={{ opacity: m.status === 'Retired' ? 0.55 : 1 }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div style={{ minWidth: 0 }}>
          <div style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '14px' }}>{m.name}</div>
          <div className="mono" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '11px', marginTop: '2px' }}>{m.id}</div>
        </div>
        <div className="flex gap-1.5 flex-shrink-0">
          <StatusBadge status={m.riskTier} />
          <StatusBadge status={m.status} />
        </div>
      </div>
      <div style={{ color: '#8899bb', fontSize: '12px', marginBottom: '10px', lineHeight: '1.4' }}>{m.useCase}</div>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        {[
          { label: 'Vendor', value: m.vendor, color: '#c8d8f0', mono: false },
          { label: 'Owner', value: m.owner, color: '#c8d8f0', mono: false },
          { label: 'Department', value: m.department, color: '#8899bb', mono: false },
          { label: 'Last Audit', value: m.lastAudit, color: '#8899bb', mono: true },
        ].map(({ label, value, color, mono }) => (
          <div key={label}>
            <div style={{ color: 'rgba(0,212,255,0.4)', fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>
              {label}
            </div>
            <div className={mono ? 'mono' : ''} style={{ color, fontSize: '12px' }}>{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ModelInventory() {
  const [filterRisk, setFilterRisk] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [search, setSearch] = useState('')

  const filtered = models.filter(m => {
    const matchRisk = !filterRisk || m.riskTier === filterRisk
    const matchStatus = !filterStatus || m.status === filterStatus
    const matchSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.owner.toLowerCase().includes(search.toLowerCase()) ||
      m.department.toLowerCase().includes(search.toLowerCase()) ||
      m.vendor.toLowerCase().includes(search.toLowerCase())
    return matchRisk && matchStatus && matchSearch
  })

  const counts = {
    total: models.length,
    active: models.filter(m => m.status === 'Active').length,
    review: models.filter(m => m.status === 'Under Review').length,
    retired: models.filter(m => m.status === 'Retired').length,
    high: models.filter(m => m.riskTier === 'High').length,
  }

  return (
    <div className="p-4 sm:p-6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 style={{ color: '#f0f4ff', fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>
            Model Inventory
          </h1>
          <p style={{ color: '#8899bb', fontSize: '12px', marginTop: '3px' }}>
            {models.length} registered AI systems across all departments
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-mission" onClick={() => exportModelsCSV(filtered)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <button className="btn-mission btn-mission-primary">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Register Model
          </button>
        </div>
      </div>

      {/* Stat cards — 2 cols mobile, 3 cols sm, 5 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Total Models', value: counts.total, color: '#f0f4ff', glow: 'rgba(240,244,255,0.2)' },
          { label: 'Active', value: counts.active, color: '#6ee7b7', glow: 'rgba(16,185,129,0.3)' },
          { label: 'Under Review', value: counts.review, color: '#67e8f9', glow: 'rgba(0,212,255,0.3)' },
          { label: 'Retired', value: counts.retired, color: '#94a3b8', glow: 'rgba(148,163,184,0.2)' },
          { label: 'High Risk', value: counts.high, color: '#f87171', glow: 'rgba(239,68,68,0.3)' },
        ].map(s => (
          <div key={s.label} className="glass-panel rounded-xl px-4 py-3 text-center">
            <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, textShadow: `0 0 12px ${s.glow}` }}>
              {s.value}
            </div>
            <div style={{ color: '#8899bb', fontSize: '11px', marginTop: '3px' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative w-full sm:flex-1 sm:min-w-40 sm:max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8899bb' }}
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text" placeholder="Search models..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Risk Tiers</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Under Review">Under Review</option>
          <option value="Retired">Retired</option>
        </select>
        {(filterRisk || filterStatus || search) && (
          <button
            onClick={() => { setFilterRisk(''); setFilterStatus(''); setSearch('') }}
            style={{ color: '#8899bb', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 150ms ease' }}
            onMouseOver={e => e.target.style.color = '#f0f4ff'}
            onMouseOut={e => e.target.style.color = '#8899bb'}
          >
            Clear filters
          </button>
        )}
        <span style={{ color: 'rgba(136,153,187,0.5)', fontSize: '11px', marginLeft: 'auto' }} className="mono">
          {filtered.length} / {models.length} shown
        </span>
      </div>

      {/* Mobile card layout */}
      <div className="block md:hidden">
        {filtered.length > 0
          ? filtered.map(m => <MobileModelCard key={m.id} m={m} />)
          : (
            <div className="glass-panel rounded-xl p-12 text-center" style={{ color: 'rgba(136,153,187,0.4)' }}>
              No models match the current filters.
            </div>
          )
        }
      </div>

      {/* Desktop table layout */}
      <div className="hidden md:block glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(0,212,255,0.07)', background: 'rgba(0,212,255,0.02)' }}>
                {['ID', 'Model Name', 'Vendor', 'Risk Tier', 'Status', 'Owner', 'Department', 'Last Audit'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px',
                    color: 'rgba(0,212,255,0.45)', fontWeight: 600,
                    fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(m => (
                <tr
                  key={m.id}
                  className="data-row"
                  style={{ opacity: m.status === 'Retired' ? 0.5 : 1 }}
                >
                  <td style={{ padding: '11px 16px' }}>
                    <span className="mono" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '11px' }}>{m.id}</span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <div style={{ color: '#f0f4ff', fontWeight: 500 }}>{m.name}</div>
                    <div style={{ color: '#8899bb', fontSize: '11px', marginTop: '2px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {m.useCase}
                    </div>
                  </td>
                  <td style={{ padding: '11px 16px', color: '#8899bb' }}>{m.vendor}</td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={m.riskTier} /></td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={m.status} /></td>
                  <td style={{ padding: '11px 16px', color: '#c8d8f0', fontSize: '12px' }}>{m.owner}</td>
                  <td style={{ padding: '11px 16px', color: '#8899bb', fontSize: '12px' }}>{m.department}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span className="mono" style={{ color: '#8899bb', fontSize: '11px' }}>{m.lastAudit}</span>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} style={{ padding: '48px 16px', textAlign: 'center', color: 'rgba(136,153,187,0.4)' }}>
                    No models match the current filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
