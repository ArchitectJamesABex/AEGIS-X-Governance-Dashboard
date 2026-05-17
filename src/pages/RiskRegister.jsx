import { useState } from 'react'
import { risks } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import HoverTooltip from '../components/HoverTooltip'
import { exportRisksCSV } from '../utils/exportUtils'

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }

const likelihoodColor = l =>
  l === 'High' ? '#f87171' : l === 'Medium' ? '#fbbf24' : '#6ee7b7'

const severityBorderColor = s =>
  s === 'Critical' ? '#ef4444' : s === 'High' ? '#f87171' : s === 'Medium' ? '#f59e0b' : '#6ee7b7'

function MobileRiskCard({ r }) {
  return (
    <div
      className="glass-panel rounded-xl p-4 mb-3"
      style={{ borderLeft: `2px solid ${severityBorderColor(r.severity)}` }}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="mono" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '11px' }}>{r.id}</span>
        <div className="flex gap-1.5 flex-shrink-0">
          <StatusBadge status={r.severity} />
          <StatusBadge status={r.status} />
        </div>
      </div>
      <p style={{ color: '#c8d8f0', fontSize: '13px', lineHeight: '1.5', marginBottom: '10px' }}>{r.description}</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-2">
        <div>
          <div style={{ color: 'rgba(0,212,255,0.4)', fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Category</div>
          <div style={{
            display: 'inline-block', color: '#8899bb', fontSize: '11px',
            background: 'rgba(0,212,255,0.05)',
            border: '1px solid rgba(0,212,255,0.1)',
            borderRadius: '5px', padding: '1px 7px',
          }}>{r.category}</div>
        </div>
        <div>
          <div style={{ color: 'rgba(0,212,255,0.4)', fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Likelihood</div>
          <div style={{ color: likelihoodColor(r.likelihood), fontWeight: 600, fontSize: '12px' }}>{r.likelihood}</div>
        </div>
        <div>
          <div style={{ color: 'rgba(0,212,255,0.4)', fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Owner</div>
          <div style={{ color: '#8899bb', fontSize: '12px' }}>{r.owner}</div>
        </div>
        <div>
          <div style={{ color: 'rgba(0,212,255,0.4)', fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Due Date</div>
          <div className="mono" style={{ color: '#8899bb', fontSize: '11px' }}>{r.dueDate}</div>
        </div>
        {r.relatedModel && (
          <div className="col-span-2">
            <div style={{ color: 'rgba(0,212,255,0.4)', fontSize: '9.5px', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '2px' }}>Related Model</div>
            <div className="mono" style={{ color: 'rgba(0,212,255,0.7)', fontSize: '11px' }}>{r.relatedModel}</div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function RiskRegister() {
  const [filterSeverity, setFilterSeverity] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [search, setSearch] = useState('')

  const categories = [...new Set(risks.map(r => r.category))].sort()

  const filtered = risks
    .filter(r => {
      const matchSev = !filterSeverity || r.severity === filterSeverity
      const matchStat = !filterStatus || r.status === filterStatus
      const matchCat = !filterCategory || r.category === filterCategory
      const matchSearch = !search ||
        r.description.toLowerCase().includes(search.toLowerCase()) ||
        r.owner.toLowerCase().includes(search.toLowerCase()) ||
        r.id.toLowerCase().includes(search.toLowerCase())
      return matchSev && matchStat && matchCat && matchSearch
    })
    .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])

  const counts = {
    total: risks.length,
    open: risks.filter(r => r.status === 'Open').length,
    critical: risks.filter(r => r.severity === 'Critical').length,
    mitigating: risks.filter(r => r.status === 'Mitigating').length,
    resolved: risks.filter(r => r.status === 'Resolved').length,
  }

  return (
    <div className="p-4 sm:p-6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 style={{ color: '#f0f4ff', fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>
            Risk Register
          </h1>
          <p style={{ color: '#8899bb', fontSize: '12px', marginTop: '3px' }}>
            {risks.length} identified risks across all AI systems
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button className="btn-mission" onClick={() => exportRisksCSV(filtered)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <button className="btn-mission btn-mission-danger">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Log New Risk
          </button>
        </div>
      </div>

      {/* Stat cards — 2 cols mobile, 3 cols sm, 5 cols desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
        {[
          {
            label: 'Total Risks', value: counts.total,
            color: '#f0f4ff', glow: 'rgba(240,244,255,0.2)',
            tooltip: {
              title: 'All Risks · Top by Severity',
              items: [...risks]
                .sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity])
                .map(r => ({ id: r.id, label: r.description, badge: r.severity })),
            },
          },
          {
            label: 'Open', value: counts.open,
            color: '#f87171', glow: 'rgba(239,68,68,0.3)',
            tooltip: {
              title: 'Open Risks',
              items: risks.filter(r => r.status === 'Open')
                .map(r => ({ id: r.id, label: r.owner, detail: r.dueDate })),
            },
          },
          {
            label: 'Critical', value: counts.critical,
            color: '#fca5a5', glow: 'rgba(239,68,68,0.4)',
            tooltip: {
              title: 'Critical Risks',
              items: risks.filter(r => r.severity === 'Critical')
                .map(r => ({ id: r.id, label: r.description, sub: r.owner })),
            },
          },
          {
            label: 'Mitigating', value: counts.mitigating,
            color: '#fbbf24', glow: 'rgba(245,158,11,0.3)',
            tooltip: {
              title: 'Mitigating Risks',
              items: risks.filter(r => r.status === 'Mitigating')
                .map(r => ({ id: r.id, label: r.category, sub: r.owner })),
            },
          },
          {
            label: 'Resolved', value: counts.resolved,
            color: '#6ee7b7', glow: 'rgba(16,185,129,0.3)',
            tooltip: {
              title: 'Resolved Risks',
              items: risks.filter(r => r.status === 'Resolved')
                .map(r => ({ id: r.id, label: r.description, sub: r.owner })),
            },
          },
        ].map(s => (
          <HoverTooltip key={s.label} title={s.tooltip.title} items={s.tooltip.items}>
            <div className="glass-panel rounded-xl px-4 py-3 text-center" style={{ cursor: 'default' }}>
              <div style={{ fontSize: '26px', fontWeight: 700, color: s.color, textShadow: `0 0 12px ${s.glow}` }}>
                {s.value}
              </div>
              <div style={{ color: '#8899bb', fontSize: '11px', marginTop: '3px' }}>{s.label}</div>
            </div>
          </HoverTooltip>
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
            type="text" placeholder="Search risks..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg pl-9 pr-3 py-2 text-sm"
          />
        </div>
        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Mitigating">Mitigating</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Accepted">Accepted</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filterSeverity || filterStatus || filterCategory || search) && (
          <button
            onClick={() => { setFilterSeverity(''); setFilterStatus(''); setFilterCategory(''); setSearch('') }}
            style={{ color: '#8899bb', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 150ms ease' }}
            onMouseOver={e => e.target.style.color = '#f0f4ff'}
            onMouseOut={e => e.target.style.color = '#8899bb'}
          >
            Clear
          </button>
        )}
        <span style={{ color: 'rgba(136,153,187,0.5)', fontSize: '11px', marginLeft: 'auto' }} className="mono">
          {filtered.length} / {risks.length} shown
        </span>
      </div>

      {/* Mobile card layout */}
      <div className="block md:hidden">
        {filtered.length > 0
          ? filtered.map(r => <MobileRiskCard key={r.id} r={r} />)
          : (
            <div className="glass-panel rounded-xl p-12 text-center" style={{ color: 'rgba(136,153,187,0.4)' }}>
              No risks match the current filters.
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
                {['ID', 'Description', 'Category', 'Severity', 'Likelihood', 'Status', 'Owner', 'Due Date', 'Model'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '10px 16px',
                    color: 'rgba(0,212,255,0.45)', fontWeight: 600,
                    fontSize: '10px', letterSpacing: '1.5px', textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="data-row">
                  <td style={{ padding: '11px 16px' }}>
                    <span className="mono" style={{ color: 'rgba(0,212,255,0.5)', fontSize: '11px' }}>{r.id}</span>
                  </td>
                  <td style={{ padding: '11px 16px', maxWidth: '260px' }}>
                    <p style={{ color: '#c8d8f0', fontSize: '12px', lineHeight: '1.5' }}>{r.description}</p>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{
                      color: '#8899bb', fontSize: '11px',
                      background: 'rgba(0,212,255,0.05)',
                      border: '1px solid rgba(0,212,255,0.1)',
                      borderRadius: '5px', padding: '2px 8px',
                    }}>
                      {r.category}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={r.severity} /></td>
                  <td style={{ padding: '11px 16px' }}>
                    <span style={{ color: likelihoodColor(r.likelihood), fontSize: '12px', fontWeight: 600 }}>
                      {r.likelihood}
                    </span>
                  </td>
                  <td style={{ padding: '11px 16px' }}><StatusBadge status={r.status} /></td>
                  <td style={{ padding: '11px 16px', color: '#8899bb', fontSize: '12px' }}>{r.owner}</td>
                  <td style={{ padding: '11px 16px' }}>
                    <span className="mono" style={{ color: '#8899bb', fontSize: '11px' }}>{r.dueDate}</span>
                  </td>
                  <td style={{ padding: '11px 16px' }}>
                    {r.relatedModel
                      ? <span className="mono" style={{ color: 'rgba(0,212,255,0.7)', fontSize: '11px' }}>{r.relatedModel}</span>
                      : <span style={{ color: 'rgba(136,153,187,0.3)' }}>—</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} style={{ padding: '48px 16px', textAlign: 'center', color: 'rgba(136,153,187,0.4)' }}>
                    No risks match the current filters.
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
