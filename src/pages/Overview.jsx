import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from 'recharts'
import {
  governanceScore, complianceFrameworks, complianceTrend,
  riskDistribution, risks, models, auditLog,
} from '../data/mockData'
import StatusBadge from '../components/StatusBadge'

// ── Gauge ────────────────────────────────────────────────────────────────────
function GovernanceGauge({ score }) {
  const r = 72, cx = 100, cy = 92
  const half = Math.PI * r
  const filled = (score / 100) * half
  const color = score >= 70 ? '#10b981' : score >= 40 ? '#f59e0b' : '#ef4444'
  const grade = score >= 80 ? 'Excellent' : score >= 70 ? 'Good' : score >= 50 ? 'At Risk' : 'Critical'

  // Needle endpoint
  const θ = (1 - score / 100) * Math.PI
  const nx = cx + 58 * Math.cos(θ)
  const ny = cy - 58 * Math.sin(θ)

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 108" className="w-56">
        {/* Track */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" />
        {/* Fill */}
        <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none" stroke={color} strokeWidth="13" strokeLinecap="round"
          strokeDasharray={`${filled} ${half}`} />
        {/* Needle */}
        <line x1={cx} y1={cy} x2={nx} y2={ny}
          stroke="#e2e8f0" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx={cx} cy={cy} r="5" fill="#e2e8f0" />
        {/* Labels */}
        <text x={cx - r + 2} y={cy + 16} fill="#475569" fontSize="9">0</text>
        <text x={cx + r - 10} y={cy + 16} fill="#475569" fontSize="9">100</text>
        {/* Score */}
        <text x={cx} y={cy - 20} textAnchor="middle" fill="#f1f5f9" fontSize="34" fontWeight="700">{score}</text>
        <text x={cx} y={cy - 5} textAnchor="middle" fill="#64748b" fontSize="10" letterSpacing="1">/ 100</text>
      </svg>
      <div className="mt-1 text-center">
        <div className="text-lg font-bold" style={{ color }}>{grade}</div>
        <div className="text-slate-500 text-xs uppercase tracking-widest mt-0.5">Governance Health Score</div>
      </div>
    </div>
  )
}

// ── KPI Card ─────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, color = 'text-slate-100', icon }) {
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5 flex items-start gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${color === 'text-red-400' ? 'bg-red-500/10' : color === 'text-amber-400' ? 'bg-amber-500/10' : color === 'text-emerald-400' ? 'bg-emerald-500/10' : 'bg-blue-500/10'}`}>
        {icon}
      </div>
      <div>
        <div className={`text-2xl font-bold ${color}`}>{value}</div>
        <div className="text-slate-300 text-sm font-medium mt-0.5">{label}</div>
        {sub && <div className="text-slate-500 text-xs mt-0.5">{sub}</div>}
      </div>
    </div>
  )
}

// ── Compliance Framework Card ─────────────────────────────────────────────────
function FrameworkCard({ fw }) {
  const barColor = fw.status === 'Compliant' ? 'bg-emerald-500' : fw.status === 'At Risk' ? 'bg-amber-500' : fw.status === 'Non-Compliant' ? 'bg-red-500' : 'bg-blue-500'
  return (
    <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-slate-100 font-semibold text-sm">{fw.name}</div>
          <div className="text-slate-500 text-xs mt-0.5">Next: {fw.nextReview}</div>
        </div>
        <StatusBadge status={fw.status} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${fw.score}%` }} />
        </div>
        <span className="text-slate-300 text-xs font-medium w-8 text-right">{fw.score}%</span>
      </div>
    </div>
  )
}

// ── Recharts custom tooltip ───────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div className="text-slate-400 mb-1">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="text-slate-100 font-semibold">{p.name}: {p.value}</div>
      ))}
    </div>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs shadow-xl">
      <div style={{ color: d.payload.color }} className="font-semibold">{d.name}</div>
      <div className="text-slate-300">{d.value} risk{d.value !== 1 ? 's' : ''}</div>
    </div>
  )
}

// ── Recent Event Row ──────────────────────────────────────────────────────────
function EventRow({ ev }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-700/40 last:border-0">
      <div className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0"
        style={{ backgroundColor: ev.outcome === 'Pass' || ev.outcome === 'Approved' || ev.outcome === 'Resolved' ? '#10b981' : ev.outcome === 'Warning' ? '#f59e0b' : ev.outcome === 'Flag' ? '#ef4444' : '#3b82f6' }} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-200 text-sm font-medium">{ev.type}</span>
          <span className="text-slate-500 text-xs">·</span>
          <span className="text-slate-400 text-xs">{ev.system}</span>
        </div>
        <div className="text-slate-500 text-xs mt-0.5 truncate">{ev.details}</div>
      </div>
      <div className="flex-shrink-0 text-right">
        <StatusBadge status={ev.outcome} />
        <div className="text-slate-600 text-xs mt-1">{new Date(ev.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Overview() {
  const openRisks = risks.filter(r => r.status === 'Open').length
  const highRiskModels = models.filter(m => m.riskTier === 'High' && m.status !== 'Retired').length
  const pendingReviews = models.filter(m => m.status === 'Under Review').length
  const activeModels = models.filter(m => m.status === 'Active').length
  const recentEvents = auditLog.slice(0, 6)

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100">Governance Overview</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-1.5">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span className="text-emerald-400 text-xs font-medium">Live</span>
          </div>
          <button className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white rounded-lg px-3 py-1.5 text-sm transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Row 1: Score + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
        {/* Governance Score */}
        <div className="lg:col-span-1 bg-slate-800 border border-slate-700/50 rounded-xl p-5 flex flex-col items-center justify-center">
          <GovernanceGauge score={governanceScore} />
          <div className="mt-3 flex items-center gap-1.5 text-emerald-400 text-xs">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
            </svg>
            <span>+3 pts from last month</span>
          </div>
        </div>

        {/* KPIs */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Open Risks"
            value={openRisks}
            sub="Require immediate action"
            color="text-red-400"
            icon={<svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          />
          <KpiCard
            label="High-Risk Models"
            value={highRiskModels}
            sub="Active, unretired systems"
            color="text-amber-400"
            icon={<svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" /></svg>}
          />
          <KpiCard
            label="Pending Reviews"
            value={pendingReviews}
            sub={`${activeModels} models fully active`}
            color="text-blue-400"
            icon={<svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>
      </div>

      {/* Row 2: Compliance Frameworks */}
      <div className="mb-5">
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-3">Compliance Frameworks</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {complianceFrameworks.map(fw => <FrameworkCard key={fw.id} fw={fw} />)}
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Compliance Trend */}
        <div className="lg:col-span-2 bg-slate-800 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-4">Governance Score Trend (12 months)</h2>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={complianceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area type="monotone" dataKey="score" name="Score" stroke="#3b82f6" strokeWidth={2} fill="url(#areaGrad)" dot={false} activeDot={{ r: 4, fill: '#3b82f6' }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Risk Distribution */}
        <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-300 mb-2">Risk Distribution</h2>
          <div className="flex items-center justify-center">
            <PieChart width={180} height={170}>
              <Pie data={riskDistribution} cx={88} cy={82} innerRadius={50} outerRadius={72} dataKey="value" paddingAngle={2}>
                {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-1">
            {riskDistribution.map(d => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs">
                <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400">{d.name}</span>
                <span className="text-slate-200 font-medium ml-auto">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Recent Events */}
      <div className="bg-slate-800 border border-slate-700/50 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-slate-300">Recent Audit Events</h2>
          <span className="text-blue-400 text-xs hover:text-blue-300 cursor-pointer">View all →</span>
        </div>
        <div>
          {recentEvents.map(ev => <EventRow key={ev.id} ev={ev} />)}
        </div>
      </div>
    </div>
  )
}
