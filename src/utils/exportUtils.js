import { jsPDF } from 'jspdf'

// ── CSV ───────────────────────────────────────────────────────────────────────

function escapeCSV(val) {
  if (val == null) return ''
  const str = String(val)
  return str.includes(',') || str.includes('"') || str.includes('\n')
    ? `"${str.replace(/"/g, '""')}"`
    : str
}

export function downloadCSV(filename, headers, rows) {
  const lines = [
    headers.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function exportModelsCSV(models) {
  downloadCSV(
    `model-inventory-${new Date().toISOString().slice(0, 10)}.csv`,
    ['ID', 'Model Name', 'Vendor', 'Risk Tier', 'Status', 'Owner', 'Department', 'Last Audit', 'Use Case'],
    models.map(m => [m.id, m.name, m.vendor, m.riskTier, m.status, m.owner, m.department, m.lastAudit, m.useCase]),
  )
}

export function exportRisksCSV(risks) {
  downloadCSV(
    `risk-register-${new Date().toISOString().slice(0, 10)}.csv`,
    ['ID', 'Description', 'Category', 'Severity', 'Likelihood', 'Status', 'Owner', 'Due Date', 'Related Model'],
    risks.map(r => [r.id, r.description, r.category, r.severity, r.likelihood, r.status, r.owner, r.dueDate, r.relatedModel ?? '']),
  )
}

// ── PDF ───────────────────────────────────────────────────────────────────────

const DARK  = [15,  23,  42]   // slate-900
const MID   = [30,  41,  59]   // slate-800
const LINE  = [51,  65,  85]   // slate-700
const LIGHT = [148, 163, 184]  // slate-400
const WHITE = [241, 245, 249]  // slate-100

function hex(r, g, b) { return [r, g, b] }

const STATUS_COLORS = {
  Compliant:       [16,  185, 129],  // emerald
  'At Risk':       [245, 158, 11],   // amber
  'Non-Compliant': [239, 68,  68],   // red
  'Under Review':  [59,  130, 246],  // blue
}

export function exportOverviewPDF({ governanceScore, complianceFrameworks, risks, models }) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' })
  const W = doc.internal.pageSize.getWidth()
  const MARGIN = 40
  const COL = W - MARGIN * 2
  let y = 0

  // ── helpers ──────────────────────────────────────────────────────────────

  const fillRect = (x, fy, w, h, [r, g, b]) => {
    doc.setFillColor(r, g, b)
    doc.rect(x, fy, w, h, 'F')
  }

  const text = (str, x, ty, size, [r, g, b], align = 'left') => {
    doc.setFontSize(size)
    doc.setTextColor(r, g, b)
    doc.text(str, x, ty, { align })
  }

  const setDrawColor = ([r, g, b]) => doc.setDrawColor(r, g, b)

  // ── header banner ────────────────────────────────────────────────────────

  fillRect(0, 0, W, 72, DARK)
  text('AEGIS-X', MARGIN, 34, 22, WHITE)
  text('AI Governance Console', MARGIN, 52, 10, LIGHT)
  text('Governance Overview Report', W - MARGIN, 34, 14, LIGHT, 'right')
  const dateStr = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  text(`Generated: ${dateStr}`, W - MARGIN, 52, 9, LIGHT, 'right')

  y = 96

  // ── governance health score ───────────────────────────────────────────────

  fillRect(MARGIN, y, COL, 80, MID)
  const grade = governanceScore >= 80 ? 'Excellent' : governanceScore >= 70 ? 'Good' : governanceScore >= 50 ? 'At Risk' : 'Critical'
  const scoreColor = governanceScore >= 70 ? [16, 185, 129] : governanceScore >= 40 ? [245, 158, 11] : [239, 68, 68]

  text('GOVERNANCE HEALTH SCORE', MARGIN + 16, y + 22, 8, LIGHT)
  text(String(governanceScore), MARGIN + 16, y + 58, 36, scoreColor)
  text('/ 100', MARGIN + 68, y + 58, 14, LIGHT)
  text(grade, MARGIN + 110, y + 58, 18, scoreColor)

  // summary KPIs on the right
  const openRisks = risks.filter(r => r.status === 'Open').length
  const highRiskModels = models.filter(m => m.riskTier === 'High' && m.status !== 'Retired').length
  const activeModels = models.filter(m => m.status === 'Active').length

  const kpis = [
    { label: 'Open Risks',      value: String(openRisks),      color: [239, 68,  68] },
    { label: 'High-Risk Models', value: String(highRiskModels), color: [245, 158, 11] },
    { label: 'Active Models',   value: String(activeModels),   color: [59,  130, 246] },
  ]
  const kpiW = 90
  kpis.forEach((k, i) => {
    const kx = W - MARGIN - kpiW * (3 - i) - 8 * (2 - i)
    text(k.value, kx + kpiW / 2, y + 50, 24, k.color, 'center')
    text(k.label,  kx + kpiW / 2, y + 66, 7,  LIGHT,    'center')
  })

  y += 100

  // ── section label helper ─────────────────────────────────────────────────

  const sectionLabel = (label, sy) => {
    text(label, MARGIN, sy, 8, LIGHT)
    setDrawColor(LINE)
    doc.setLineWidth(0.5)
    doc.line(MARGIN, sy + 4, W - MARGIN, sy + 4)
    return sy + 16
  }

  // ── compliance frameworks ────────────────────────────────────────────────

  y = sectionLabel('COMPLIANCE FRAMEWORKS', y)

  const fwColW = [140, 90, 60, 80, 80]
  const fwHeaders = ['Framework', 'Status', 'Score', 'Last Review', 'Next Review']

  // header row
  fillRect(MARGIN, y, COL, 20, LINE)
  let cx = MARGIN + 8
  fwHeaders.forEach((h, i) => {
    text(h, cx, y + 13, 7.5, LIGHT)
    cx += fwColW[i]
  })
  y += 20

  complianceFrameworks.forEach((fw, idx) => {
    fillRect(MARGIN, y, COL, 22, idx % 2 === 0 ? MID : DARK)
    cx = MARGIN + 8
    const cols = [fw.name, fw.status, `${fw.score}%`, fw.lastReview, fw.nextReview]
    cols.forEach((val, i) => {
      const color = i === 1 ? (STATUS_COLORS[fw.status] ?? LIGHT) : i === 2 ? (STATUS_COLORS[fw.status] ?? WHITE) : WHITE
      text(val, cx, y + 14, 8, color)
      cx += fwColW[i]
    })
    y += 22
  })

  y += 18

  // ── risk summary ─────────────────────────────────────────────────────────

  y = sectionLabel('RISK SUMMARY', y)

  const sevLabels = ['Critical', 'High', 'Medium', 'Low']
  const sevColors = { Critical: [220, 38, 38], High: [239, 68, 68], Medium: [245, 158, 11], Low: [16, 185, 129] }

  // counts by severity
  const boxW = (COL - 12) / 4
  sevLabels.forEach((sev, i) => {
    const count = risks.filter(r => r.severity === sev).length
    const bx = MARGIN + i * (boxW + 4)
    fillRect(bx, y, boxW, 52, MID)
    text(String(count), bx + boxW / 2, y + 30, 22, sevColors[sev], 'center')
    text(sev.toUpperCase(), bx + boxW / 2, y + 44, 7, LIGHT, 'center')
  })

  y += 64

  // open risks table (top 5)
  const openList = risks.filter(r => r.status === 'Open').slice(0, 5)
  if (openList.length > 0) {
    text('Top Open Risks', MARGIN, y, 9, WHITE)
    y += 12
    const rColW = [50, 220, 80, 60, 80]
    const rHeaders = ['ID', 'Description', 'Category', 'Severity', 'Owner']

    fillRect(MARGIN, y, COL, 18, LINE)
    cx = MARGIN + 8
    rHeaders.forEach((h, i) => {
      text(h, cx, y + 12, 7.5, LIGHT)
      cx += rColW[i]
    })
    y += 18

    openList.forEach((r, idx) => {
      fillRect(MARGIN, y, COL, 20, idx % 2 === 0 ? MID : DARK)
      cx = MARGIN + 8
      const desc = r.description.length > 52 ? r.description.slice(0, 52) + '…' : r.description
      const cols = [r.id, desc, r.category, r.severity, r.owner]
      cols.forEach((val, i) => {
        const color = i === 3 ? (sevColors[r.severity] ?? WHITE) : WHITE
        text(val, cx, y + 13, 7.5, color)
        cx += rColW[i]
      })
      y += 20
    })
  }

  // ── footer ───────────────────────────────────────────────────────────────

  const pageH = doc.internal.pageSize.getHeight()
  fillRect(0, pageH - 28, W, 28, DARK)
  text('AEGIS-X — AI Governance Console', MARGIN, pageH - 10, 8, LIGHT)
  text('Confidential — For Internal Use Only', W - MARGIN, pageH - 10, 8, LIGHT, 'right')

  doc.save(`aegis-x-governance-report-${new Date().toISOString().slice(0, 10)}.pdf`)
}
