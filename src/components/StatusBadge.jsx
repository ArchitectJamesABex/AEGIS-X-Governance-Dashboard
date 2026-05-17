const variants = {
  Compliant:       { bg: 'rgba(0,212,255,0.08)',    text: '#67e8f9',  dot: '#00d4ff',  border: 'rgba(0,212,255,0.28)',   glow: 'rgba(0,212,255,0.35)',    dotGlow: '0 0 5px rgba(0,212,255,0.9)' },
  'At Risk':       { bg: 'rgba(245,158,11,0.08)',   text: '#fbbf24',  dot: '#f59e0b',  border: 'rgba(245,158,11,0.3)',   glow: 'rgba(245,158,11,0.3)',    dotGlow: '0 0 5px rgba(245,158,11,0.8)' },
  'Non-Compliant': { bg: 'rgba(239,68,68,0.08)',    text: '#f87171',  dot: '#ef4444',  border: 'rgba(239,68,68,0.3)',    glow: 'rgba(239,68,68,0.3)',     dotGlow: '0 0 5px rgba(239,68,68,0.8)' },
  'Under Review':  { bg: 'rgba(99,102,241,0.08)',   text: '#a5b4fc',  dot: '#818cf8',  border: 'rgba(99,102,241,0.3)',   glow: 'rgba(99,102,241,0.3)',    dotGlow: '0 0 5px rgba(99,102,241,0.8)' },
  Critical:        { bg: 'rgba(239,68,68,0.09)',    text: '#fca5a5',  dot: '#ef4444',  border: 'rgba(239,68,68,0.4)',    glow: 'rgba(239,68,68,0.45)',    dotGlow: '0 0 6px rgba(239,68,68,1)', pulse: true },
  High:            { bg: 'rgba(249,115,22,0.08)',   text: '#fdba74',  dot: '#f97316',  border: 'rgba(249,115,22,0.3)',   glow: 'rgba(249,115,22,0.3)',    dotGlow: '0 0 5px rgba(249,115,22,0.8)' },
  Medium:          { bg: 'rgba(234,179,8,0.08)',    text: '#fde047',  dot: '#eab308',  border: 'rgba(234,179,8,0.28)',   glow: 'rgba(234,179,8,0.28)',    dotGlow: '0 0 5px rgba(234,179,8,0.8)' },
  Low:             { bg: 'rgba(0,212,255,0.07)',    text: '#67e8f9',  dot: '#00d4ff',  border: 'rgba(0,212,255,0.25)',   glow: 'rgba(0,212,255,0.28)',    dotGlow: '0 0 5px rgba(0,212,255,0.8)' },
  Active:          { bg: 'rgba(16,185,129,0.08)',   text: '#6ee7b7',  dot: '#10b981',  border: 'rgba(16,185,129,0.28)',  glow: 'rgba(16,185,129,0.3)',    dotGlow: '0 0 5px rgba(16,185,129,0.8)' },
  Retired:         { bg: 'rgba(100,116,139,0.08)',  text: '#94a3b8',  dot: '#64748b',  border: 'rgba(100,116,139,0.25)', glow: 'rgba(100,116,139,0.2)',   dotGlow: '0 0 3px rgba(100,116,139,0.6)' },
  Open:            { bg: 'rgba(239,68,68,0.08)',    text: '#f87171',  dot: '#ef4444',  border: 'rgba(239,68,68,0.3)',    glow: 'rgba(239,68,68,0.3)',     dotGlow: '0 0 5px rgba(239,68,68,0.8)' },
  Mitigating:      { bg: 'rgba(245,158,11,0.08)',   text: '#fbbf24',  dot: '#f59e0b',  border: 'rgba(245,158,11,0.3)',   glow: 'rgba(245,158,11,0.3)',    dotGlow: '0 0 5px rgba(245,158,11,0.8)' },
  Resolved:        { bg: 'rgba(16,185,129,0.08)',   text: '#6ee7b7',  dot: '#10b981',  border: 'rgba(16,185,129,0.28)',  glow: 'rgba(16,185,129,0.3)',    dotGlow: '0 0 5px rgba(16,185,129,0.8)' },
  Monitoring:      { bg: 'rgba(0,212,255,0.07)',    text: '#67e8f9',  dot: '#00d4ff',  border: 'rgba(0,212,255,0.25)',   glow: 'rgba(0,212,255,0.28)',    dotGlow: '0 0 5px rgba(0,212,255,0.8)' },
  Accepted:        { bg: 'rgba(100,116,139,0.08)',  text: '#94a3b8',  dot: '#64748b',  border: 'rgba(100,116,139,0.25)', glow: 'rgba(100,116,139,0.2)',   dotGlow: '0 0 3px rgba(100,116,139,0.5)' },
  Pass:            { bg: 'rgba(16,185,129,0.08)',   text: '#6ee7b7',  dot: '#10b981',  border: 'rgba(16,185,129,0.28)',  glow: 'rgba(16,185,129,0.3)',    dotGlow: '0 0 5px rgba(16,185,129,0.8)' },
  Approved:        { bg: 'rgba(16,185,129,0.08)',   text: '#6ee7b7',  dot: '#10b981',  border: 'rgba(16,185,129,0.28)',  glow: 'rgba(16,185,129,0.3)',    dotGlow: '0 0 5px rgba(16,185,129,0.8)' },
  Warning:         { bg: 'rgba(245,158,11,0.08)',   text: '#fbbf24',  dot: '#f59e0b',  border: 'rgba(245,158,11,0.3)',   glow: 'rgba(245,158,11,0.3)',    dotGlow: '0 0 5px rgba(245,158,11,0.8)' },
  Flag:            { bg: 'rgba(239,68,68,0.08)',    text: '#f87171',  dot: '#ef4444',  border: 'rgba(239,68,68,0.3)',    glow: 'rgba(239,68,68,0.3)',     dotGlow: '0 0 5px rgba(239,68,68,0.8)' },
}

export default function StatusBadge({ status }) {
  const v = variants[status] ?? variants['Accepted']
  return (
    <span
      className={v.pulse ? 'badge-critical-pulse' : ''}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '5px',
        padding: '2px 10px',
        borderRadius: '9999px',
        fontSize: '11px',
        fontWeight: 500,
        background: v.bg,
        color: v.text,
        border: `1px solid ${v.border}`,
        boxShadow: `0 0 8px ${v.glow}, inset 0 0 4px ${v.glow}44`,
        whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: '5px',
        height: '5px',
        borderRadius: '50%',
        background: v.dot,
        flexShrink: 0,
        boxShadow: v.dotGlow,
      }} />
      {status}
    </span>
  )
}
