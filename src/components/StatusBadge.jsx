const variants = {
  Compliant:       { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  'At Risk':       { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400',   border: 'border-amber-500/30' },
  'Non-Compliant': { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400',     border: 'border-red-500/30' },
  'Under Review':  { bg: 'bg-blue-500/15',    text: 'text-blue-400',    dot: 'bg-blue-400',    border: 'border-blue-500/30' },
  Critical:        { bg: 'bg-red-600/20',     text: 'text-red-300',     dot: 'bg-red-300',     border: 'border-red-500/40' },
  High:            { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400',     border: 'border-red-500/30' },
  Medium:          { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400',   border: 'border-amber-500/30' },
  Low:             { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  Active:          { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  Retired:         { bg: 'bg-slate-500/15',   text: 'text-slate-400',   dot: 'bg-slate-400',   border: 'border-slate-500/30' },
  Open:            { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400',     border: 'border-red-500/30' },
  Mitigating:      { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400',   border: 'border-amber-500/30' },
  Resolved:        { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  Monitoring:      { bg: 'bg-cyan-500/15',    text: 'text-cyan-400',    dot: 'bg-cyan-400',    border: 'border-cyan-500/30' },
  Accepted:        { bg: 'bg-slate-500/15',   text: 'text-slate-400',   dot: 'bg-slate-400',   border: 'border-slate-500/30' },
  Pass:            { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  Approved:        { bg: 'bg-emerald-500/15', text: 'text-emerald-400', dot: 'bg-emerald-400', border: 'border-emerald-500/30' },
  Warning:         { bg: 'bg-amber-500/15',   text: 'text-amber-400',   dot: 'bg-amber-400',   border: 'border-amber-500/30' },
  Flag:            { bg: 'bg-red-500/15',     text: 'text-red-400',     dot: 'bg-red-400',     border: 'border-red-500/30' },
}

export default function StatusBadge({ status }) {
  const v = variants[status] ?? variants['Accepted']
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${v.bg} ${v.text} ${v.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${v.dot}`} />
      {status}
    </span>
  )
}
