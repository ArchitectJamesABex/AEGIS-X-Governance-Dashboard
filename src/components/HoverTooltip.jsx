import { useState } from 'react'
import StatusBadge from './StatusBadge'

const MAX_ROWS = 6

export default function HoverTooltip({ title, items = [], children }) {
  const [show, setShow] = useState(false)

  const visible = items.slice(0, MAX_ROWS)
  const extra = items.length - MAX_ROWS

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {/* Tooltip panel — right on desktop, below on mobile (CSS handles position) */}
      <div
        className="hover-tooltip-panel"
        style={{
          opacity: show ? 1 : 0,
          pointerEvents: show ? 'auto' : 'none',
          transition: 'opacity 150ms ease',
        }}
      >
        {/* Caret: two layers give a bordered arrow */}
        <div className="hover-tooltip-caret-border" />
        <div className="hover-tooltip-caret-fill" />

        {/* Glass panel */}
        <div style={{
          background: '#06080f',
          border: '1px solid rgba(0,212,255,0.2)',
          borderRadius: '12px',
          boxShadow: '0 0 28px rgba(0,212,255,0.12), 0 0 1px rgba(0,212,255,0.22), 0 16px 48px rgba(0,0,0,0.9)',
          overflow: 'hidden',
        }}>
          {/* Title bar */}
          <div style={{
            padding: '8px 12px 7px',
            borderBottom: '1px solid rgba(0,212,255,0.08)',
            color: '#00d4ff',
            fontSize: '9.5px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            background: 'rgba(0,212,255,0.03)',
          }}>
            {title}
          </div>

          {/* Rows */}
          {visible.map((item, i) => (
            <div
              key={i}
              style={{
                padding: '7px 12px',
                borderBottom: (i < visible.length - 1 || extra > 0)
                  ? '1px solid rgba(0,212,255,0.04)' : 'none',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '8px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.id && (
                  <div style={{
                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                    color: 'rgba(0,212,255,0.5)',
                    fontSize: '10px',
                    lineHeight: 1,
                    marginBottom: '2px',
                  }}>
                    {item.id}
                  </div>
                )}
                <div style={{
                  color: '#f0f4ff',
                  fontSize: '12px',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}>
                  {item.label}
                </div>
                {item.sub && (
                  <div style={{
                    color: '#8899bb',
                    fontSize: '10px',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.sub}
                  </div>
                )}
                {item.detail && (
                  <div style={{
                    fontFamily: "'JetBrains Mono', 'Consolas', monospace",
                    color: 'rgba(136,153,187,0.55)',
                    fontSize: '10px',
                    marginTop: '2px',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {item.detail}
                  </div>
                )}
              </div>
              {item.badge && (
                <div style={{ flexShrink: 0, paddingTop: '1px' }}>
                  <StatusBadge status={item.badge} />
                </div>
              )}
            </div>
          ))}

          {extra > 0 && (
            <div style={{
              padding: '5px 12px 7px',
              color: 'rgba(136,153,187,0.4)',
              fontSize: '10px',
              fontStyle: 'italic',
            }}>
              +{extra} more
            </div>
          )}

          {items.length === 0 && (
            <div style={{
              padding: '14px 12px',
              color: 'rgba(136,153,187,0.35)',
              fontSize: '11px',
              textAlign: 'center',
            }}>
              None
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
