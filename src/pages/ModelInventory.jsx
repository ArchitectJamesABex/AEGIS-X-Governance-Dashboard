import { useState } from 'react'
import { models } from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import { exportModelsCSV } from '../utils/exportUtils'

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
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Model Inventory</h1>
          <p className="text-slate-500 text-sm mt-0.5">{models.length} registered AI systems across all departments</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => exportModelsCSV(filtered)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export CSV
          </button>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-3 py-1.5 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Register Model
          </button>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-5 gap-3 mb-5">
        {[
          { label: 'Total Models', value: counts.total, color: 'text-slate-100' },
          { label: 'Active', value: counts.active, color: 'text-emerald-400' },
          { label: 'Under Review', value: counts.review, color: 'text-blue-400' },
          { label: 'Retired', value: counts.retired, color: 'text-slate-400' },
          { label: 'High Risk', value: counts.high, color: 'text-red-400' },
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
          <input
            type="text"
            placeholder="Search models..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>
        <select value={filterRisk} onChange={e => setFilterRisk(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Risk Tiers</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:border-blue-500">
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Under Review">Under Review</option>
          <option value="Retired">Retired</option>
        </select>
        {(filterRisk || filterStatus || search) && (
          <button onClick={() => { setFilterRisk(''); setFilterStatus(''); setSearch('') }}
            className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
            Clear filters
          </button>
        )}
        <span className="text-slate-600 text-xs ml-auto">{filtered.length} of {models.length} shown</span>
      </div>

      {/* Table */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700/50">
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">ID</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Model Name</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Vendor</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Risk Tier</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Owner</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Department</th>
                <th className="text-left px-4 py-3 text-slate-500 font-medium text-xs uppercase tracking-wider">Last Audit</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m, i) => (
                <tr key={m.id}
                  className={`border-b border-slate-700/30 last:border-0 hover:bg-slate-700/30 transition-colors ${m.status === 'Retired' ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs text-slate-500">{m.id}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-slate-100 font-medium">{m.name}</div>
                    <div className="text-slate-500 text-xs mt-0.5 max-w-48 truncate">{m.useCase}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{m.vendor}</td>
                  <td className="px-4 py-3"><StatusBadge status={m.riskTier} /></td>
                  <td className="px-4 py-3"><StatusBadge status={m.status} /></td>
                  <td className="px-4 py-3 text-slate-300 text-xs">{m.owner}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{m.department}</td>
                  <td className="px-4 py-3 text-slate-400 text-xs font-mono">{m.lastAudit}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-600">No models match the current filters.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
