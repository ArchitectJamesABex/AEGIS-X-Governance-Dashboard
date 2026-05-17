import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  governanceScore, complianceFrameworks, complianceTrend,
  riskDistribution, risks, models, auditLog,
} from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import { exportOverviewPDF } from '../utils/exportUtils'

// ── Orbital Ring ──────────────────────────────────────────────────────────────
function OrbitalRing({ score }) {
  const r = 78
  const cx = 100
  const cy = 100
  const circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference
  const color = score >= 80 ? '#00d4ff' : score >= 60 ? '#f59e0b' : '#ef4444'
  const grade = score >= 80 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : score >= 60 ? 'AT RISK' : 'CRITICAL'

  return (
    <div className="flex flex-col items-center" style={{ '--ring-color': color }}>
      <svg
        viewBox="0 0 200 200"
        className="w-36 h-36 sm:w-44 sm:h-44 md:w-52 md:h-52 orbital-ring-svg"
        style={{ '--ring-color': color }}
      >
        <defs>
          <filter id="ringGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="coronaGrad" cx="50%" cy="50%" r="50%">
            <stop offset="55%" stopColor={color} stopOpacity="0" />
            <stop offset="78%" stopColor={color} stopOpacity="0.06" />
            <stop offset="92%" stopColor={color} stopOpacity="0.03" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Corona */}
        <circle cx={cx} cy={cy} r="97" fill="url(#coronaGrad)" />
        <circle cx={cx} cy={cy} r="92" fill="none" stroke={color} strokeWidth="0.4" opacity="0.18" />
        <circle cx={cx} cy={cy} r="96" fill="none" stroke={color} strokeWidth="0.3" opacity="0.08" />

        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="13" />

        {/* Progress arc */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform={`rotate(-90, ${cx}, ${cy})`}
          filter="url(#ringGlow)"
        />

        {/* Score number */}
        <text
          x={cx} y={cy - 10}
          textAnchor="middle"
          fill="#f0f4ff"
          fontSize="44"
          fontWeight="700"
          className="score-pulse"
          style={{ fontFamily: 'system-ui' }}
        >
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(136,153,187,0.7)" fontSize="9" letterSpacing="0.5">
          / 100
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fill={color} fontSize="8.5" letterSpacing="2.5" fontWeight="600">
          {grade}
        </text>
      </svg>

      <div className="mt-1 flex items-center gap-1.5 text-xs" style={{ color: 'rgba(136,153,187,0.6)', letterSpacing: '1px' }}>
        <svg className="w-3 h-3" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
        <span style={{ color: '#10b981' }}>+3 pts</span>
        <span>from last month</span>
      </div>
    </div>
  )
}

// ── KPI Card ──────────────────────────────────────────────────────────────────
function KpiCard({ label, value, sub, valueColor, iconBg, icon }) {
  return (
    <div className="glass-panel rounded-xl p-5 flex items-start gap-4">
      <div style={{
        width: '40px', height: '40px', borderRadius: '10px',
        background: iconBg,
        border: `1px solid ${iconBg.replace('0.08', '0.2')}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: '26px', fontWeight: 700, color: valueColor, lineHeight: 1 }}>
          {value}
        </div>
        <div style={{ color: '#f0f4ff', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ color: '#8899bb', fontSize: '11px', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  )
}

// ── Framework Card ────────────────────────────────────────────────────────────
function FrameworkCard({ fw }) {
  const style = {
    Compliant:       { bar: '#00d4ff', glow: 'rgba(0,212,255,0.7)',    label: '#67e8f9' },
    'At Risk':       { bar: '#f59e0b', glow: 'rgba(245,158,11,0.7)',   label: '#fbbf24' },
    'Non-Compliant': { bar: '#ef4444', glow: 'rgba(239,68,68,0.7)',    label: '#f87171' },
  }[fw.status] || { bar: '#818cf8', glow: 'rgba(129,140,248,0.5)', label: '#a5b4fc' }

  return (
    <div className="glass-panel rounded-xl p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div style={{ color: '#f0f4ff', fontWeight: 600, fontSize: '13px' }}>{fw.name}</div>
          <div style={{ color: '#8899bb', fontSize: '11px', marginTop: '2px' }}>Next: {fw.nextReview}</div>
        </div>
        <StatusBadge status={fw.status} />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-full overflow-hidden" style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%',
            width: `${fw.score}%`,
            background: style.bar,
            borderRadius: '9999px',
            boxShadow: `0 0 6px ${style.glow}`,
            transition: 'width 300ms ease',
          }} />
        </div>
        <span style={{ color: style.label, fontSize: '11px', fontWeight: 600, width: '30px', textAlign: 'right' }}>
          {fw.score}%
        </span>
      </div>
    </div>
  )
}

// ── Chart Tooltip ─────────────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="mission-tooltip">
      <div style={{ color: '#8899bb', marginBottom: '4px', fontSize: '11px' }}>{label}</div>
      {payload.map(p => (
        <div key={p.name} style={{ color: '#00d4ff', fontWeight: 600, fontSize: '12px' }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  )
}

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0]
  return (
    <div className="mission-tooltip">
      <div style={{ color: d.payload.color, fontWeight: 600 }}>{d.name}</div>
      <div style={{ color: '#c8d8f0', fontSize: '11px' }}>{d.value} risk{d.value !== 1 ? 's' : ''}</div>
    </div>
  )
}

// ── Terminal Event Row ────────────────────────────────────────────────────────
function TerminalEventRow({ ev }) {
  const isPass = ev.outcome === 'Pass' || ev.outcome === 'Approved' || ev.outcome === 'Resolved'
  const isWarn = ev.outcome === 'Warning'
  const isFlag = ev.outcome === 'Flag'
  const borderColor = isPass ? '#10b981' : isWarn ? '#f59e0b' : isFlag ? '#ef4444' : '#818cf8'
  const textColor = isPass ? '#6ee7b7' : isWarn ? '#fbbf24' : isFlag ? '#f87171' : '#a5b4fc'

  return (
    <div
      className="terminal-entry flex items-start gap-3 py-2.5"
      style={{
        borderBottom: '1px solid rgba(0,212,255,0.04)',
        borderLeft: `2px solid ${borderColor}`,
        paddingLeft: '12px',
        background: `${borderColor}05`,
        marginBottom: '2px',
        borderRadius: '0 6px 6px 0',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ color: textColor, fontWeight: 600 }}>[{ev.outcome.toUpperCase()}]</span>
          <span style={{ color: '#f0f4ff' }}>{ev.type}</span>
          <span style={{ color: 'rgba(136,153,187,0.5)' }}>·</span>
          <span style={{ color: '#00d4ff', opacity: 0.8 }}>{ev.system}</span>
        </div>
        <div style={{ color: '#8899bb', marginTop: '2px', fontSize: '11px' }} className="truncate">
          {ev.details}
        </div>
      </div>
      <div style={{ flexShrink: 0, textAlign: 'right' }}>
        <div style={{ color: 'rgba(136,153,187,0.5)', fontSize: '10px' }}>
          {new Date(ev.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
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
    <div className="p-4 sm:p-6" style={{ maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 style={{ color: '#f0f4ff', fontSize: '18px', fontWeight: 700, letterSpacing: '0.5px' }}>
            Governance Overview
          </h1>
          <p style={{ color: '#8899bb', fontSize: '12px', marginTop: '3px' }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(16,185,129,0.07)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: '8px', padding: '5px 10px',
          }}>
            <span className="status-dot-live" style={{ width: '6px', height: '6px' }} />
            <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 500 }}>Live</span>
          </div>
          <button
            className="btn-mission"
            onClick={() => exportOverviewPDF({ governanceScore, complianceFrameworks, risks, models })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Row 1: Orbital Ring + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
        <div className="lg:col-span-1 glass-panel rounded-xl p-5 flex flex-col items-center justify-center">
          <OrbitalRing score={governanceScore} />
          <div style={{ color: 'rgba(136,153,187,0.5)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px' }}>
            Governance Health Score
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <KpiCard
            label="Open Risks"
            value={openRisks}
            sub="Require immediate action"
            valueColor="#f87171"
            iconBg="rgba(239,68,68,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#f87171" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          />
          <KpiCard
            label="High-Risk Models"
            value={highRiskModels}
            sub="Active, unretired systems"
            valueColor="#fbbf24"
            iconBg="rgba(245,158,11,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#fbbf24" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" /></svg>}
          />
          <KpiCard
            label="Pending Reviews"
            value={pendingReviews}
            sub={`${activeModels} models fully active`}
            valueColor="#00d4ff"
            iconBg="rgba(0,212,255,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#00d4ff" strokeWidth="1.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
        </div>
      </div>

      {/* Row 2: Compliance Frameworks */}
      <div className="mb-5">
        <h2 style={{ color: 'rgba(0,212,255,0.45)', fontSize: '10px', fontWeight: 600, letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px' }}>
          Compliance Frameworks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {complianceFrameworks.map(fw => <FrameworkCard key={fw.id} fw={fw} />)}
        </div>
      </div>

      {/* Row 3: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        <div className="lg:col-span-2 glass-panel rounded-xl p-5">
          <h2 style={{ color: '#f0f4ff', fontSize: '12px', fontWeight: 600, letterSpacing: '0.5px', marginBottom: '16px' }}>
            Governance Score Trend
            <span style={{ color: '#8899bb', fontWeight: 400, marginLeft: '6px' }}>(12 months)</span>
          </h2>
          <ResponsiveContainer width="100%" height={175}>
            <AreaChart data={complianceTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#00d4ff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,212,255,0.06)" />
              <XAxis dataKey="month" tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis domain={[40, 100]} tick={{ fill: '#8899bb', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip content={<ChartTooltip />} />
              <Area
                type="monotone" dataKey="score" name="Score"
                stroke="#00d4ff" strokeWidth={2}
                fill="url(#areaGrad)"
                dot={false}
                activeDot={{ r: 4, fill: '#00d4ff', strokeWidth: 0, filter: 'drop-shadow(0 0 4px #00d4ff)' }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-panel rounded-xl p-5">
          <h2 style={{ color: '#f0f4ff', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>Risk Distribution</h2>
          <div className="flex items-center justify-center">
            <PieChart width={180} height={165}>
              <Pie data={riskDistribution} cx={88} cy={80} innerRadius={46} outerRadius={68} dataKey="value" paddingAngle={3}>
                {riskDistribution.map((entry, i) => (
                  <Cell key={i} fill={entry.color}
                    style={{ filter: `drop-shadow(0 0 4px ${entry.color}88)` }} />
                ))}
              </Pie>
              <Tooltip content={<PieTooltip />} />
            </PieChart>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 mt-1">
            {riskDistribution.map(d => (
              <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px' }}>
                <span style={{
                  width: '9px', height: '9px', borderRadius: '2px', flexShrink: 0,
                  background: d.color,
                  boxShadow: `0 0 4px ${d.color}88`,
                }} />
                <span style={{ color: '#8899bb' }}>{d.name}</span>
                <span style={{ color: '#f0f4ff', fontWeight: 600, marginLeft: 'auto' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Terminal Event Feed */}
      <div className="glass-panel rounded-xl p-5" style={{ background: 'linear-gradient(135deg, rgba(3,8,16,0.97) 0%, rgba(2,5,14,0.98) 100%)' }}>
        <div className="flex items-center justify-between mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ color: '#f0f4ff', fontSize: '12px', fontWeight: 600 }}>Recent Audit Events</h2>
            <span style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '1.5px',
              color: '#10b981', border: '1px solid rgba(16,185,129,0.25)',
              background: 'rgba(16,185,129,0.08)', borderRadius: '4px', padding: '1px 6px',
            }}>LIVE FEED</span>
          </div>
          <span style={{ color: '#00d4ff', fontSize: '11px', cursor: 'pointer', opacity: 0.7 }}
            onMouseOver={e => e.target.style.opacity = 1}
            onMouseOut={e => e.target.style.opacity = 0.7}>
            View all →
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1px' }}>
          {recentEvents.map(ev => <TerminalEventRow key={ev.id} ev={ev} />)}
        </div>
      </div>
    </div>
  )
}
