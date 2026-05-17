import { NavLink } from 'react-router-dom'

const navItems = [
  {
    path: '/overview',
    label: 'Overview',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    path: '/models',
    label: 'Model Inventory',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
  },
  {
    path: '/risks',
    label: 'Risk Register',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
      </svg>
    ),
  },
  {
    path: '/audit',
    label: 'Audit Log',
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
      </svg>
    ),
  },
]

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Backdrop overlay — mobile only */}
      <div
        className="fixed inset-0 lg:hidden transition-opacity duration-300"
        style={{
          background: 'rgba(0, 0, 0, 0.6)',
          zIndex: 40,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sidebar drawer */}
      <aside
        className={[
          'fixed lg:relative',
          'inset-y-0 lg:inset-y-auto',
          'left-0 lg:left-auto',
          'flex flex-col flex-shrink-0',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        ].join(' ')}
        style={{
          width: '236px',
          background: '#06080f',
          borderRight: '1px solid rgba(0, 212, 255, 0.06)',
          zIndex: 50,
        }}
      >
        {/* Branding */}
        <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(0, 212, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ flexShrink: 0 }}>
              <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
                <circle cx="17" cy="17" r="13" stroke="rgba(0,212,255,0.12)" strokeWidth="1.5" />
                <circle cx="17" cy="17" r="9"
                  stroke="#00d4ff" strokeWidth="1.5"
                  strokeDasharray="18.8 37.7"
                  strokeLinecap="round"
                  transform="rotate(-90 17 17)"
                  style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.9))' }}
                />
                <circle cx="17" cy="8" r="2" fill="#00d4ff"
                  style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }} />
                <circle cx="17" cy="17" r="2.5" fill="rgba(0,212,255,0.15)" stroke="rgba(0,212,255,0.3)" strokeWidth="1" />
              </svg>
            </div>
            <div>
              <div style={{ color: '#f0f4ff', fontWeight: 700, fontSize: '13px', letterSpacing: '3px' }}>AEGIS-X</div>
              <div style={{ color: 'rgba(0, 212, 255, 0.45)', fontSize: '9.5px', letterSpacing: '1.5px', marginTop: '1px' }}>
                GOVERNANCE CONSOLE
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 8px', paddingTop: '16px' }}>
          <p style={{
            padding: '0 12px',
            paddingBottom: '8px',
            color: 'rgba(0, 212, 255, 0.3)',
            fontSize: '9.5px',
            fontWeight: 600,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
          }}>
            Navigation
          </p>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={onClose}
              className={({ isActive }) =>
                `nav-item-base${isActive ? ' nav-item-active' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <span className="nav-icon" style={{ transition: 'all 150ms ease', color: isActive ? '#00d4ff' : '#4a5a76' }}>
                    {item.icon}
                  </span>
                  <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid rgba(0, 212, 255, 0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span className="status-dot-live" />
            <span style={{ color: '#10b981', fontSize: '11px', fontWeight: 500 }}>All Systems Operational</span>
          </div>
          <div style={{ color: 'rgba(136, 153, 187, 0.35)', fontSize: '10px', marginTop: '4px' }}>
            v2.4.1 · Last sync 2 min ago
          </div>
        </div>
      </aside>
    </>
  )
}
