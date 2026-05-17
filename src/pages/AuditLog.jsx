import { useState } from 'react'
import { auditLog } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'

const TYPE_ICONS = {
  'Risk Assessment':    { bg: 'bg-red-500/10',     icon: '⚠' },
  'Model Deployment':   { bg: 'bg-emerald-500/10', icon: '▲' },
  'Compliance Review':  { bg: 'bg-blue-500/10',    icon: '✓' },
  'Security Scan':      { bg: 'bg-purple-500/10',  icon: '⬡' },
  'Model Audit':        { bg: 'bg-amber-500/10',   icon: '◉' },
  'Policy Update':      { bg: 'bg-cyan-500/10',    icon: '⊞' },
  'Incident Report':    { bg: 'bg-red-500/10',     icon: '!' },
  'Training Review':    { bg: 'bg-amber-500/10',   icon: '◎' },
  'Model Retirement':   { bg: 'bg-slate-500/10',   icon: '⊗' },
  'Data Governance':    { bg: 'bg-teal-500/10',    icon: '⊛' },
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(iso) {
  const d = new Date(iso)
  return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export default function AuditLog() {
  const [filterType, setFilterType] = useState('')
  const [filterOutcome, setFilterOutcome] = useState('')
  const [search, setSearch] = useState('')

  const eventTypes = [...new Set(auditLog.map(e => e.type))].sort()

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

  const outcomes = [...new Set(auditLog.map(e => e.outcome))].sort()

  const counts = {
    total: auditLog.length,
    pass: auditLog.filter(e => e.outcome === 'Pass' || e.outcome === 'Approved' || e.outcome === 'Resolved').length,
    warning: auditLog.filter(e => e.outcome === 'Warning').length,
    flag: auditLog.filter(e => e.outcome === 'Flag').length,
  }

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Audit Log</h1>
          <p className="text-slate-500 text-sm mt-0.5">Complete tamper-evident record of all governance events</p>
        </div>
        <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
          </svg>
          Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-4 gap-3 mb-5">
        {[
          { label: 'Total Events', value: counts.total, color: 'text-slate-100' },
          { label: 'Pass / Approved', value: counts.pass, color: 'text-emerald-400' },
          { label: 'Warnings', value: counts.warning, color: 'text-amber-400' },
          { label: 'Flags / Incidents', value: counts.flag, color: 'text-red-400' },
        ].map(s => (
          <div key={s.label} className="bg-slate-800 border border-slate-700/50 rounded-xl px-4 py-3 text-center">
            <div className={`text-2xl font-bold ${s.color}`}>{s.value}</div>
            <div className="text-slate-500 text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="relative flex-1 min-w-48 max-w-xs">
          <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input type="text" placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Event Types</option>
          {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={filterOutcome} onChange={e => setFilterOutcome(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Outcomes</option>
          {outcomes.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        {(filterType || filterOutcome || search) && (
          <button onClick={() => { setFilterType(''); setFilterOutcome(''); setSearch('') }}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            Clear
          </button>
        )}
        <span className="text-slate-600 text-xs ml-auto">{filtered.length} of {auditLog.length} events</span>
      </div>

      {/* Event log */}
      <div className="space-y-2">
        {filtered.map(ev => {
          const meta = TYPE_ICONS[ev.type] || { bg: 'bg-slate-500/10', icon: '•' }
          return (
            <div key={ev.id} className="bg-slate-800 border border-slate-700/50 rounded-xl p-4 hover:border-slate-600/50 transition-colors">
              <div className="flex items-start gap-4">
                {/* Icon */}
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-slate-300 text-sm font-mono ${meta.bg}`}>
                  {meta.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-slate-100 font-semibold text-sm">{ev.type}</span>
                      <span className="text-slate-600">·</span>
                      <span className="text-blue-400 text-sm">{ev.system}</span>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <StatusBadge status={ev.outcome} />
                      <span className="font-mono text-xs text-slate-600">{ev.id}</span>
                    </div>
                  </div>
                  <p className="text-slate-400 text-xs mt-1.5 leading-relaxed">{ev.details}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                      {ev.actor}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
                      </svg>
                      {formatDate(ev.timestamp)}
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-500 text-xs">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {formatTime(ev.timestamp)} UTC
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
        {filtered.length === 0 && (
          <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-12 text-center text-slate-600">
            No events match the current filters.
          </div>
        )}
      </div>
    </div>
  )
}
