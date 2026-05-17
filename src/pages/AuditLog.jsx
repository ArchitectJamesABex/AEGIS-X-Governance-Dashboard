import { useState } from 'react'
import { auditLog } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import { exportAuditCSV } from '../utils/exportUtils'

const TYPE_META = {
  'Risk Assessment':   { color: '#ef4444', symbol: '⚠' },
  'Model Deployment':  { color: '#10b981', symbol: '▲' },
  'Compliance Review': { color: '#00d4ff', symbol: '✓' },
  'Security Scan':     { color: '#818cf8', symbol: '⬡' },
  'Model Audit':       { color: '#f59e0b', symbol: '◉' },
  'Policy Update':     { color: '#00d4ff', symbol: '⊞' },
  'Incident Report':   { color: '#ef4444', symbol: '!' },
  'Training Review':   { color: '#f59e0b', symbol: '◎' },
  'Model Retirement':  { color: '#64748b', symbol: '⊗' },
  'Data Governance':   { color: '#2dd4bf', symbol: '⊛' },
}

function outcomeStyle(outcome) {
  if (outcome === 'Pass' || outcome === 'Approved' || outcome === 'Resolved')
    return { border: '#10b981', text: '#6ee7b7', bg: 'rgba(16,185,129,0.04)' }
  if (outcome === 'Warning')
    return { border: '#f59e0b', text: '#fbbf24', bg: 'rgba(245,158,11,0.04)' }
  if (outcome === 'Flag')
    return { border: '#ef4444', text: '#f87171', bg: 'rgba(239,68,68,0.04)' }
  return { border: '#818cf8', text: '#a5b4fc', bg: 'rgba(129,140,248,0.04)' }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function AuditLog() {
  const [filterType, setFilterType] = useState('')
  const [filterOutcome, setFilterOutcome] = useState('')
  const [search, setSearch] = useState('')

  const eventTypes = [...new Set(auditLog.map(e => e.type))].sort()
  const outcomes = [...new Set(auditLog.map(e => e.outcome))].sort()

  const filtered = auditLog.filter(e => {
    const matchType = !filterType || e.type === filterType
    const matchOutcome = !filterOutcome || e.outcome === filterOutcome
    const matchSearch = !search ||
      e.system.toLowerCase().includes(search.toLowerCase()) ||
      e.actor.toLowerCase().includes(search.toLowerCase()) ||
      e.details.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase())
    return matchType && matchOutcome && matchSearch
  })

  const counts = {
    total: auditLog.length,
    pass: auditLog.filter(e => e.outcome === 'Pass' || e.outcome === 'Approved' || e.outcome === 'Resolved').length,
    warning: auditLog.filter(e => e.outcome === 'Warning').length,
    flag: auditLog.filter(e => e.outcome === 'Flag').length,
  }

  return (
    <div className="p-6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 style={{ color: '#f0f4ff', fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>
            Audit Log
          </h1>
          <p style={{ color: '#8899bb', fontSize: '12px', marginTop: '3px' }}>
            Complete tamper-evident record of all governance events
          </p>
        </div>
        <button
          className="btn-mission"
          onClick={() => exportAuditCSV(filtered)}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Events', value: counts.total, color: '#f0f4ff', glow: 'rgba(240,244,255,0.2)' },
          { label: 'Pass / Approved', value: counts.pass, color: '#6ee7b7', glow: 'rgba(16,185,129,0.3)' },
          { label: 'Warnings', value: counts.warning, color: '#fbbf24', glow: 'rgba(245,158,11,0.3)' },
          { label: 'Flags / Incidents', value: counts.flag, color: '#f87171', glow: 'rgba(239,68,68,0.3)' },
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
        <div className="relative flex-1 min-w-48 max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#8899bb' }}
            fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input
            type="text" placeholder="Search events..." value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full rounded-lg pl-9 pr-3 py-2 text-sm placeholder-slate-600"
          />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Event Types</option>
          {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterOutcome} onChange={e => setFilterOutcome(e.target.value)} className="rounded-lg px-3 py-2 text-sm">
          <option value="">All Outcomes</option>
          {outcomes.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {(filterType || filterOutcome || search) && (
          <button
            onClick={() => { setFilterType(''); setFilterOutcome(''); setSearch('') }}
            style={{ color: '#8899bb', fontSize: '13px', cursor: 'pointer', background: 'none', border: 'none', transition: 'color 150ms ease' }}
            onMouseOver={e => e.target.style.color = '#f0f4ff'}
            onMouseOut={e => e.target.style.color = '#8899bb'}
          >
            Clear
          </button>
        )}
        <span style={{ color: 'rgba(136,153,187,0.5)', fontSize: '11px', marginLeft: 'auto' }} className="mono">
          {filtered.length} / {auditLog.length} events
        </span>
      </div>

      {/* Terminal log */}
      <div className="glass-panel rounded-xl overflow-hidden"
        style={{ background: 'linear-gradient(135deg, rgba(3,8,16,0.97) 0%, rgba(2,5,14,0.99) 100%)' }}>

        {/* Terminal header bar */}
        <div style={{
          padding: '10px 16px',
          borderBottom: '1px solid rgba(0,212,255,0.07)',
          display: 'flex', alignItems: 'center', gap: '8px',
          background: 'rgba(0,0,0,0.3)',
        }}>
          <div style={{ display: 'flex', gap: '6px' }}>
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444', opacity: 0.7 }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b', opacity: 0.7 }} />
            <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981', opacity: 0.7 }} />
          </div>
          <span style={{ color: 'rgba(136,153,187,0.5)', fontSize: '11px', marginLeft: '6px' }} className="mono">
            aegis-x :: audit-stream :: {new Date().toISOString().slice(0, 19)}Z
          </span>
        </div>

        <div style={{ padding: '8px 0' }}>
          {filtered.map(ev => {
            const meta = TYPE_META[ev.type] || { color: '#8899bb', symbol: '•' }
            const os = outcomeStyle(ev.outcome)
            return (
              <div
                key={ev.id}
                className="terminal-entry"
                style={{
                  borderLeft: `2px solid ${os.border}`,
                  background: os.bg,
                  margin: '0 0 1px 0',
                  padding: '10px 16px',
                  transition: 'background 150ms ease',
                }}
                onMouseOver={e => e.currentTarget.style.background = `${os.border}0a`}
                onMouseOut={e => e.currentTarget.style.background = os.bg}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Type symbol */}
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '6px', flexShrink: 0,
                    background: `${meta.color}14`,
                    border: `1px solid ${meta.color}25`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: meta.color, fontSize: '11px',
                    boxShadow: `0 0 6px ${meta.color}30`,
                  }}>
                    {meta.symbol}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: '#f0f4ff', fontWeight: 600 }}>{ev.type}</span>
                        <span style={{ color: 'rgba(136,153,187,0.4)' }}>·</span>
                        <span style={{ color: '#00d4ff', opacity: 0.8 }}>{ev.system}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                        <StatusBadge status={ev.outcome} />
                        <span style={{ color: 'rgba(136,153,187,0.35)', fontSize: '10px' }} className="mono">{ev.id}</span>
                      </div>
                    </div>

                    <p style={{ color: '#8899bb', fontSize: '11px', marginTop: '5px', lineHeight: '1.6' }}>
                      {ev.details}
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(136,153,187,0.55)', fontSize: '10px' }}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                        </svg>
                        {ev.actor}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(136,153,187,0.55)', fontSize: '10px' }} className="mono">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                        </svg>
                        {formatDate(ev.timestamp)}
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'rgba(136,153,187,0.55)', fontSize: '10px' }} className="mono">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {formatTime(ev.timestamp)} UTC
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="terminal-entry" style={{ padding: '48px 16px', textAlign: 'center', color: 'rgba(136,153,187,0.4)' }}>
              No events match the current filters.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
