import { useState } from 'react'
import { risks } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'

const SEVERITY_ORDER = { Critical: 0, High: 1, Medium: 2, Low: 3 }

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

  const likelihoodDot = l =>
    l === 'High' ? 'text-red-400' : l === 'Medium' ? 'text-amber-400' : 'text-emerald-400'

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Risk Register</h1>
          <p className="text-slate-500 text-sm mt-0.5">{risks.length} identified risks across all AI systems</p>
        </div>
        <button className="flex items-center gap-2 bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 rounded-lg px-3 py-1.5 text-sm transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Log New Risk
        </button>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Total Risks', value: counts.total, color: 'text-slate-100' },
          { label: 'Open', value: counts.open, color: 'text-red-400' },
          { label: 'Critical', value: counts.critical, color: 'text-red-300' },
          { label: 'Mitigating', value: counts.mitigating, color: 'text-amber-400' },
          { label: 'Resolved', value: counts.resolved, color: 'text-emerald-400' },
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
          <input type="text" placeholder="Search risks..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500" />
        </div>
        <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Severities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Statuses</option>
          <option value="Open">Open</option>
          <option value="Mitigating">Mitigating</option>
          <option value="Monitoring">Monitoring</option>
          <option value="Accepted">Accepted</option>
          <option value="Resolved">Resolved</option>
        </select>
        <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
        {(filterSeverity || filterStatus || filterCategory || search) && (
          <button onClick={() => { setFilterSeverity(''); setFilterStatus(''); setFilterCategory(''); setSearch('') }}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            Clear
          </button>
        )}
        <span className="text-slate-600 text-xs ml-auto">{filtered.length} of {risks.length} shown</span>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Description</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Category</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Severity</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Likelihood</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Owner</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Due Date</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Model</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} className="border-b border-slate-700/30 last:border-0 hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-500">{r.id}</span>
                  </td>
                  <td className="px-4 py-3 max-w-xs">
                    <p className="text-slate-200 text-xs leading-relaxed">{r.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-slate-400 text-xs bg-slate-700/50 px-2 py-0.5 rounded-md">{r.category}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.severity} /></td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${likelihoodDot(r.likelihood)}`}>{r.likelihood}</span>
                  </td>
                  <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{r.owner}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{r.dueDate}</td>
                  <td className="px-4 py-3">
                    {r.relatedModel
                      ? <span className="font-mono text-xs text-blue-400">{r.relatedModel}</span>
                      : <span className="text-slate-600 text-xs">—</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-12 text-center text-slate-600">No risks match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
