import { useState, useEffect, useRef } from 'react'
import { PieChart, Pie, Cell, Tooltip } from 'recharts'
import {
  complianceFrameworks, riskDistribution, risks, models, auditLog,
} from '../data/mockData'
import StatusBadge from '../components/StatusBadge'
import { exportOverviewPDF } from '../utils/exportUtils'

// ── Smooth number animation hook ──────────────────────────────────────────────
function useAnimatedNumber(target, duration = 550) {
  const [display, setDisplay] = useState(target)
  const frameRef = useRef(null)
  const fromRef = useRef(target)
  const startRef = useRef(null)

  useEffect(() => {
    const from = fromRef.current
    if (from === target) return
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    startRef.current = null

    function step(ts) {
      if (!startRef.current) startRef.current = ts
      const t = Math.min((ts - startRef.current) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setDisplay(Math.round(from + (target - from) * eased))
      if (t < 1) {
        frameRef.current = requestAnimationFrame(step)
      } else {
        fromRef.current = target
      }
    }

    frameRef.current = requestAnimationFrame(step)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [target, duration])

  return display
}

// ── Orbital Ring ──────────────────────────────────────────────────────────────
function OrbitalRing({ score }) {
  const r = 78
  const cx = 100
  const cy = 100
  const circumference = 2 * Math.PI * r
  const filled = (score / 100) * circumference
  const color = score >= 80 ? '#10b981' : score >= 65 ? '#f59e0b' : '#ef4444'
  const grade = score >= 80 ? 'EXCELLENT' : score >= 70 ? 'GOOD' : score >= 65 ? 'AT RISK' : 'CRITICAL'

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

        <circle cx={cx} cy={cy} r="97" fill="url(#coronaGrad)" />
        <circle cx={cx} cy={cy} r="92" fill="none" stroke={color} strokeWidth="0.4" opacity="0.18"
          style={{ transition: 'stroke 1.2s ease' }} />
        <circle cx={cx} cy={cy} r="96" fill="none" stroke={color} strokeWidth="0.3" opacity="0.08"
          style={{ transition: 'stroke 1.2s ease' }} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="13" />
        <circle
          cx={cx} cy={cy} r={r}
          fill="none" stroke={color} strokeWidth="10" strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference - filled}`}
          transform={`rotate(-90, ${cx}, ${cy})`}
          filter="url(#ringGlow)"
          style={{ transition: 'stroke-dasharray 0.7s ease, stroke 1.2s ease' }}
        />
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#f0f4ff" fontSize="44" fontWeight="700"
          className="score-pulse" style={{ fontFamily: 'system-ui' }}>
          {score}
        </text>
        <text x={cx} y={cy + 8} textAnchor="middle" fill="rgba(136,153,187,0.7)" fontSize="9" letterSpacing="0.5">
          / 100
        </text>
        <text x={cx} y={cy + 24} textAnchor="middle" fill={color} fontSize="8.5" letterSpacing="2.5"
          fontWeight="600" style={{ transition: 'fill 1.2s ease' }}>
          {grade}
        </text>
      </svg>

      <div className="mt-1 flex items-center gap-1.5 text-xs"
        style={{ color: 'rgba(136,153,187,0.6)', letterSpacing: '1px' }}>
        <svg className="w-3 h-3" fill="none" stroke="#10b981" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
        <span style={{ color: '#10b981' }}>+3 pts</span>
        <span>from last month</span>
      </div>
    </div>
  )
}

// ── Live Governance Telemetry Chart ───────────────────────────────────────────
function LiveTelemetryChart({ initialScore, onScoreChange }) {
  const WINDOW = 60
  const TICK_MS = 3000
  const Y_MIN = 60
  const Y_MAX = 100

  const [data, setData] = useState(() =>
    Array.from({ length: WINDOW }, () => initialScore)
  )
  const [lastDelta, setLastDelta] = useState(0)
  const momentumRef = useRef(0)
  const dataRef = useRef(Array.from({ length: WINDOW }, () => initialScore))

  useEffect(() => {
    const id = setInterval(() => {
      const last = dataRef.current[dataRef.current.length - 1]
      const bias = momentumRef.current * 0.4
      const raw = (Math.random() - 0.5 + bias) * 5.5
      const delta = Math.max(-3, Math.min(3, Math.round(raw)))
      const newVal = Math.max(65, Math.min(98, last + delta))
      const actual = newVal - last

      momentumRef.current = actual
      const next = [...dataRef.current.slice(1), newVal]
      dataRef.current = next
      setData(next)
      setLastDelta(actual)
      onScoreChange?.(newVal)
    }, TICK_MS)
    return () => clearInterval(id)
  }, [onScoreChange])

  // SVG layout constants
  const W = 600
  const H = 160
  const PL = 34   // padding left (Y axis labels)
  const PR = 12   // padding right
  const PT = 10   // padding top
  const PB = 8    // padding bottom
  const pw = W - PL - PR
  const ph = H - PT - PB

  const xs = i => PL + (i / (WINDOW - 1)) * pw
  const ys = v => PT + ph - ((v - Y_MIN) / (Y_MAX - Y_MIN)) * ph

  const lastVal = data[data.length - 1]
  const color = lastVal >= 80 ? '#00d4ff' : lastVal >= 65 ? '#f59e0b' : '#ef4444'

  // Catmull-Rom / cardinal spline (α = 0.4) — same command count every render
  const pts = data.map((v, i) => ({ x: xs(i), y: ys(v) }))

  function buildPath(points) {
    if (points.length < 2) return ''
    const a = 0.4
    let d = `M ${points[0].x.toFixed(2)},${points[0].y.toFixed(2)}`
    for (let i = 1; i < points.length; i++) {
      const p0 = points[Math.max(0, i - 2)]
      const p1 = points[i - 1]
      const p2 = points[i]
      const p3 = points[Math.min(points.length - 1, i + 1)]
      const cp1x = (p1.x + (p2.x - p0.x) * a / 3).toFixed(2)
      const cp1y = (p1.y + (p2.y - p0.y) * a / 3).toFixed(2)
      const cp2x = (p2.x - (p3.x - p1.x) * a / 3).toFixed(2)
      const cp2y = (p2.y - (p3.y - p1.y) * a / 3).toFixed(2)
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x.toFixed(2)},${p2.y.toFixed(2)}`
    }
    return d
  }

  const linePath = buildPath(pts)
  const botY = PT + ph
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(2)},${botY} L ${pts[0].x.toFixed(2)},${botY} Z`
  const livePt = pts[pts.length - 1]

  const yLabels = [65, 70, 75, 80, 85, 90, 95, 100]
  const xGridXs = [0, 10, 20, 30, 40, 50].map(i => xs(i))

  return (
    <div style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        style={{ width: '100%', height: '175px', display: 'block', overflow: 'visible' }}
      >
        <defs>
          <linearGradient id="liveAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.18"
              style={{ transition: 'stop-color 1.2s ease' }} />
            <stop offset="100%" stopColor={color} stopOpacity="0.01"
              style={{ transition: 'stop-color 1.2s ease' }} />
          </linearGradient>
          <filter id="liveDotGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Vertical grid lines */}
        {xGridXs.map((x, i) => (
          <line key={i} x1={x} y1={PT} x2={x} y2={PT + ph}
            stroke="rgba(0,212,255,0.08)" strokeWidth="1" strokeDasharray="3,5" />
        ))}

        {/* Y axis gridlines + labels */}
        {yLabels.map(v => (
          <g key={v}>
            <line
              x1={PL} y1={ys(v)} x2={W - PR} y2={ys(v)}
              stroke={v === 80 ? 'rgba(16,185,129,0.16)' : 'rgba(0,212,255,0.05)'}
              strokeWidth={v === 80 ? 1.5 : 1}
              strokeDasharray={v === 80 ? '5,5' : '2,6'}
            />
            <text
              x={PL - 5} y={ys(v) + 3.5}
              textAnchor="end"
              fill={v === 80 ? 'rgba(16,185,129,0.55)' : 'rgba(136,153,187,0.4)'}
              fontSize="7.5"
              style={{ fontFamily: 'system-ui' }}
            >{v}</text>
          </g>
        ))}

        {/* Area fill — CSS d-property transition makes it morph smoothly */}
        <path
          d={areaPath}
          fill="url(#liveAreaGrad)"
          style={{ transition: 'd 0.7s cubic-bezier(0.25,0.46,0.45,0.94)' }}
        />

        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke={color}
          strokeWidth="1.8"
          strokeLinejoin="round"
          style={{ transition: 'd 0.7s cubic-bezier(0.25,0.46,0.45,0.94), stroke 1.2s ease' }}
        />

        {/* Live position: pulsing ring */}
        <circle
          cx={livePt.x} cy={livePt.y}
          r="5" fill="none" stroke={color} strokeWidth="1.2" opacity="0.45"
          className="chart-dot-ring"
          style={{ transition: 'cx 0.7s ease, cy 0.7s ease, stroke 1.2s ease' }}
        />
        {/* Live position: solid glow dot */}
        <circle
          cx={livePt.x} cy={livePt.y}
          r="3" fill={color}
          filter="url(#liveDotGlow)"
          style={{ transition: 'cx 0.7s ease, cy 0.7s ease, fill 1.2s ease' }}
        />
      </svg>

      {/* Bottom-right score readout */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        background: 'rgba(2,5,14,0.8)',
        border: `1px solid ${color}30`,
        borderRadius: '6px',
        padding: '3px 9px',
        backdropFilter: 'blur(6px)',
        transition: 'border-color 1.2s ease',
      }}>
        <span style={{
          color: lastDelta > 0 ? '#10b981' : lastDelta < 0 ? '#ef4444' : 'rgba(136,153,187,0.6)',
          fontSize: '9px', fontWeight: 800, lineHeight: 1,
        }}>
          {lastDelta > 0 ? '▲' : lastDelta < 0 ? '▼' : '─'}
        </span>
        <span style={{
          color, fontSize: '13px', fontWeight: 700, fontFamily: 'system-ui',
          transition: 'color 1.2s ease',
        }}>
          {lastVal}
        </span>
      </div>
    </div>
  )
}

// ── Live KPI Card ─────────────────────────────────────────────────────────────
function LiveKpiCard({ label, value, sub, valueColor, iconBg, icon }) {
  const displayValue = useAnimatedNumber(value)
  const [flashing, setFlashing] = useState(false)
  const prevRef = useRef(value)

  useEffect(() => {
    if (prevRef.current !== value) {
      prevRef.current = value
      setFlashing(true)
      const t = setTimeout(() => setFlashing(false), 900)
      return () => clearTimeout(t)
    }
  }, [value])

  return (
    <div
      className="glass-panel rounded-xl p-5 flex items-start gap-4"
      style={{
        transition: 'box-shadow 0.4s ease, border-color 0.4s ease',
        ...(flashing ? {
          boxShadow: '0 0 28px rgba(0,212,255,0.22), inset 0 0 18px rgba(0,212,255,0.05), 0 8px 32px rgba(0,0,0,0.55)',
          borderColor: 'rgba(0,212,255,0.28)',
        } : {}),
      }}
    >
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
          {displayValue}
        </div>
        <div style={{ color: '#f0f4ff', fontSize: '13px', fontWeight: 500, marginTop: '4px' }}>{label}</div>
        {sub && <div style={{ color: '#8899bb', fontSize: '11px', marginTop: '2px' }}>{sub}</div>}
      </div>
    </div>
  )
}

// ── Live Framework Card ───────────────────────────────────────────────────────
function LiveFrameworkCard({ fw, liveScore }) {
  const style = {
    Compliant:       { bar: '#00d4ff', glow: 'rgba(0,212,255,0.7)',    label: '#67e8f9' },
    'At Risk':       { bar: '#f59e0b', glow: 'rgba(245,158,11,0.7)',   label: '#fbbf24' },
    'Non-Compliant': { bar: '#ef4444', glow: 'rgba(239,68,68,0.7)',    label: '#f87171' },
    'Under Review':  { bar: '#818cf8', glow: 'rgba(129,140,248,0.5)', label: '#a5b4fc' },
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
        <div className="flex-1 rounded-full overflow-hidden"
          style={{ height: '4px', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{
            height: '100%', width: `${liveScore}%`,
            background: style.bar, borderRadius: '9999px',
            boxShadow: `0 0 6px ${style.glow}`,
            transition: 'width 0.9s ease',
          }} />
        </div>
        <span style={{ color: style.label, fontSize: '11px', fontWeight: 600, width: '30px', textAlign: 'right' }}>
          {liveScore}%
        </span>
      </div>
    </div>
  )
}

// ── Pie Tooltip ───────────────────────────────────────────────────────────────
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
  const textColor  = isPass ? '#6ee7b7' : isWarn ? '#fbbf24' : isFlag ? '#f87171' : '#a5b4fc'

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

// ── Seed values ───────────────────────────────────────────────────────────────
const SEED_SCORE      = 74
const SEED_OPEN_RISKS = risks.filter(r => r.status === 'Open').length
const SEED_HIGH_RISK  = models.filter(m => m.riskTier === 'High' && m.status !== 'Retired').length
const SEED_PENDING    = models.filter(m => m.status === 'Under Review').length
const SEED_ACTIVE     = models.filter(m => m.status === 'Active').length

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Overview() {
  // Score is driven by LiveTelemetryChart via onScoreChange
  const [targetScore, setTargetScore]       = useState(SEED_SCORE)
  const [fwScores, setFwScores]             = useState(complianceFrameworks.map(fw => fw.score))
  const [openRisks, setOpenRisks]           = useState(SEED_OPEN_RISKS)
  const [highRiskModels, setHighRiskModels] = useState(SEED_HIGH_RISK)
  const [pendingReviews, setPendingReviews] = useState(SEED_PENDING)
  const [activeModels, setActiveModels]     = useState(SEED_ACTIVE)

  const displayScore = useAnimatedNumber(targetScore, 600)

  const openRef    = useRef(SEED_OPEN_RISKS)
  const highRef    = useRef(SEED_HIGH_RISK)
  const pendingRef = useRef(SEED_PENDING)
  const activeRef  = useRef(SEED_ACTIVE)
  const fwRef      = useRef(complianceFrameworks.map(fw => fw.score))

  // ── Compliance framework scores ───────────────────────────────────────────
  useEffect(() => {
    const bounds = complianceFrameworks.map(fw => {
      if (fw.status === 'Non-Compliant') return { lo: 25, hi: 50 }
      if (fw.status === 'At Risk')       return { lo: 45, hi: 72 }
      if (fw.status === 'Under Review')  return { lo: 60, hi: 85 }
      return { lo: 72, hi: 99 }
    })
    const handles = []
    function schedule(i) {
      handles[i] = setTimeout(() => {
        const { lo, hi } = bounds[i]
        fwRef.current[i] = Math.max(lo, Math.min(hi, fwRef.current[i] + (Math.random() < 0.5 ? -1 : 1)))
        setFwScores([...fwRef.current])
        schedule(i)
      }, 6000 + Math.random() * 4000)
    }
    complianceFrameworks.forEach((_, i) => schedule(i))
    return () => handles.forEach(h => clearTimeout(h))
  }, [])

  // ── Open risks: discovery ─────────────────────────────────────────────────
  useEffect(() => {
    let t
    function tick() {
      if (openRef.current < 8) { openRef.current += 1; setOpenRisks(openRef.current) }
      t = setTimeout(tick, 20000 + Math.random() * 10000)
    }
    t = setTimeout(tick, 20000 + Math.random() * 10000)
    return () => clearTimeout(t)
  }, [])

  // ── Open risks: resolution ────────────────────────────────────────────────
  useEffect(() => {
    let t
    function tick() {
      if (openRef.current > 2) { openRef.current -= 1; setOpenRisks(openRef.current) }
      t = setTimeout(tick, 45000 + Math.random() * 15000)
    }
    t = setTimeout(tick, 45000 + Math.random() * 15000)
    return () => clearTimeout(t)
  }, [])

  // ── High-risk models ──────────────────────────────────────────────────────
  useEffect(() => {
    let t
    function tick() {
      highRef.current = Math.max(2, Math.min(6, highRef.current + (Math.random() < 0.5 ? -1 : 1)))
      setHighRiskModels(highRef.current)
      t = setTimeout(tick, 30000 + Math.random() * 20000)
    }
    t = setTimeout(tick, 30000 + Math.random() * 20000)
    return () => clearTimeout(t)
  }, [])

  // ── Pending reviews ───────────────────────────────────────────────────────
  useEffect(() => {
    let t
    function tick() {
      pendingRef.current = Math.max(1, Math.min(6, pendingRef.current + (Math.random() < 0.5 ? -1 : 1)))
      setPendingReviews(pendingRef.current)
      t = setTimeout(tick, 25000 + Math.random() * 15000)
    }
    t = setTimeout(tick, 25000 + Math.random() * 15000)
    return () => clearTimeout(t)
  }, [])

  // ── Active models ─────────────────────────────────────────────────────────
  useEffect(() => {
    let t
    function tick() {
      activeRef.current = Math.max(3, Math.min(8, activeRef.current + (Math.random() < 0.5 ? -1 : 1)))
      setActiveModels(activeRef.current)
      t = setTimeout(tick, 35000 + Math.random() * 20000)
    }
    t = setTimeout(tick, 35000 + Math.random() * 20000)
    return () => clearTimeout(t)
  }, [])

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
            onClick={() => exportOverviewPDF({ governanceScore: targetScore, complianceFrameworks, risks, models })}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
            </svg>
            Export Report
          </button>
        </div>
      </div>

      {/* Row 1: Orbital Ring + KPIs */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-5">
        <div className="lg:col-span-1 glass-panel rounded-xl p-5 flex flex-col items-center justify-center">
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
            <span className="status-dot-live" style={{ width: '6px', height: '6px' }} />
            <span className="live-badge" style={{ color: '#10b981', fontSize: '9px', fontWeight: 700, letterSpacing: '2.5px' }}>
              LIVE
            </span>
          </div>
          <OrbitalRing score={displayScore} />
          <div style={{
            color: 'rgba(136,153,187,0.5)', fontSize: '9px',
            letterSpacing: '2px', textTransform: 'uppercase', marginTop: '6px',
          }}>
            Governance Health Score
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
          <LiveKpiCard
            label="Open Risks" value={openRisks} sub="Require immediate action"
            valueColor="#f87171" iconBg="rgba(239,68,68,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#f87171" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" /></svg>}
          />
          <LiveKpiCard
            label="High-Risk Models" value={highRiskModels} sub="Active, unretired systems"
            valueColor="#fbbf24" iconBg="rgba(245,158,11,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#fbbf24" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" /></svg>}
          />
          <LiveKpiCard
            label="Pending Reviews" value={pendingReviews} sub={`${activeModels} models fully active`}
            valueColor="#00d4ff" iconBg="rgba(0,212,255,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#00d4ff" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
          />
          <LiveKpiCard
            label="Active Models" value={activeModels} sub="In production systems"
            valueColor="#a78bfa" iconBg="rgba(139,92,246,0.08)"
            icon={<svg className="w-5 h-5" fill="none" stroke="#a78bfa" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" /></svg>}
          />
        </div>
      </div>

      {/* Row 2: Compliance Frameworks */}
      <div className="mb-5">
        <h2 style={{
          color: 'rgba(0,212,255,0.45)', fontSize: '10px', fontWeight: 600,
          letterSpacing: '2.5px', textTransform: 'uppercase', marginBottom: '10px',
        }}>
          Compliance Frameworks
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {complianceFrameworks.map((fw, i) => (
            <LiveFrameworkCard key={fw.id} fw={fw} liveScore={fwScores[i]} />
          ))}
        </div>
      </div>

      {/* Row 3: Live Chart + Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">

        {/* Live Governance Telemetry */}
        <div className="lg:col-span-2 glass-panel rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 style={{
                color: '#f0f4ff', fontSize: '11px', fontWeight: 700,
                letterSpacing: '2px', textTransform: 'uppercase',
              }}>
                Live Governance Telemetry
              </h2>
              <p style={{ color: '#8899bb', fontSize: '10px', marginTop: '2px' }}>
                60-point rolling window · updates every 3s
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="status-dot-live" style={{ width: '6px', height: '6px' }} />
              <span className="live-badge" style={{
                color: '#10b981', fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
              }}>
                STREAMING
              </span>
            </div>
          </div>
          <LiveTelemetryChart initialScore={SEED_SCORE} onScoreChange={setTargetScore} />
        </div>

        {/* Risk Distribution */}
        <div className="glass-panel rounded-xl p-5">
          <h2 style={{ color: '#f0f4ff', fontSize: '12px', fontWeight: 600, marginBottom: '4px' }}>
            Risk Distribution
          </h2>
          <div className="flex items-center justify-center">
            <PieChart width={180} height={165}>
              <Pie data={riskDistribution} cx={88} cy={80} innerRadius={46} outerRadius={68}
                dataKey="value" paddingAngle={3}>
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
                  background: d.color, boxShadow: `0 0 4px ${d.color}88`,
                }} />
                <span style={{ color: '#8899bb' }}>{d.name}</span>
                <span style={{ color: '#f0f4ff', fontWeight: 600, marginLeft: 'auto' }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Terminal Event Feed */}
      <div className="glass-panel rounded-xl p-5"
        style={{ background: 'linear-gradient(135deg, rgba(3,8,16,0.97) 0%, rgba(2,5,14,0.98) 100%)' }}>
        <div className="flex items-center justify-between mb-3">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ color: '#f0f4ff', fontSize: '12px', fontWeight: 600 }}>Recent Audit Events</h2>
            <span style={{
              fontSize: '9px', fontWeight: 600, letterSpacing: '1.5px',
              color: '#10b981', border: '1px solid rgba(16,185,129,0.25)',
              background: 'rgba(16,185,129,0.08)', borderRadius: '4px', padding: '1px 6px',
            }}>LIVE FEED</span>
          </div>
          <span
            style={{ color: '#00d4ff', fontSize: '11px', cursor: 'pointer', opacity: 0.7 }}
            onMouseOver={e => e.target.style.opacity = 1}
            onMouseOut={e => e.target.style.opacity = 0.7}
          >
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
