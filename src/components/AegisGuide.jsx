// =============================================================
// AEGIS-X Governance Console — Floating Tour Guide
// File location: /src/components/AegisGuide.jsx
//
// Usage: Import and add <AegisGuide /> once inside App.jsx,
// outside your <Routes> block so it persists across all pages.
//
// Requires: /api/chat.js serverless function + ANTHROPIC_API_KEY env var
// =============================================================

import { useState, useEffect, useRef } from 'react';

// ─── Tab configuration ───────────────────────────────────────
const TABS = [
  { id: 'overview',  label: 'Overview',   icon: '🛡️' },
  { id: 'inventory', label: 'Inventory',  icon: '📦' },
  { id: 'risks',     label: 'Risks',      icon: '⚠️' },
  { id: 'audit',     label: 'Audit',      icon: '📋' },
  { id: 'vision',    label: 'Vision',     icon: '🚀' },
];

// ─── Welcome messages per tab ────────────────────────────────
const WELCOME = {
  overview:  `Welcome to **AEGIS-X Governance Console** — the operational command layer for enterprise AI governance. 🛡️ This Overview page streams a live health score across six regulatory frameworks and surfaces every open risk in real time. Most organizations don't have a screen like this yet. What would you like to explore?`,
  inventory: `You're on the **Model Inventory** — AEGIS-X's single source of truth for every AI system the organization operates. 10 registered models, each with a named owner, risk tier, and full audit history. What would you like to know?`,
  risks:     `This is the **Risk Register** — a living ledger of all 12 identified AI risks, tracked from discovery through mitigation and resolution. Three are Critical. Two are already Resolved. Where do you want to start?`,
  audit:     `Welcome to the **Audit Log** — AEGIS-X's tamper-evident, append-only record of every governance event. 15 events, regulator-ready export in one click, UTC timestamps throughout. What can I show you?`,
  vision:    `AEGIS-X is v1.0 of a governance operating system — not a dashboard, not a checklist. 🚀 Built on React 18, deployed on Vercel, aligned to EU AI Act, NIST AI RMF, CSA STAR, and DoD ethics principles. There's a four-phase roadmap behind this. Want the full story?`,
};

// ─── Quick-action chips per tab ──────────────────────────────
const CHIPS = {
  overview:  ['What makes AEGIS-X ahead of its time?', 'Walk me through the health score', 'Why track 6 frameworks simultaneously?', "What's the live telemetry?"],
  inventory: ['Which model carries the most risk?', 'What does Register Model do?', 'Why keep retired models?', 'Walk me through the full registry'],
  risks:     ['What are the 3 Critical risks?', 'Explain the risk evidence chain', 'What is Shadow AI risk?', 'How are risks resolved?'],
  audit:     ['Why is this tamper-evident?', 'Tell me about Export CSV', 'What triggered the KPMG audit?', 'How does this meet EU AI Act?'],
  vision:    ['What is the tech stack?', "What's the 4-phase roadmap?", 'Who is the target audience?', 'What problem does AEGIS-X solve?'],
};

// ─── Helper: timestamp label ─────────────────────────────────
const ts = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

// ─── Main component ──────────────────────────────────────────
export default function AegisGuide() {
  const [isOpen,    setIsOpen]    = useState(false);
  const [page,      setPage]      = useState('overview');
  const [messages,  setMessages]  = useState([]);
  const [history,   setHistory]   = useState([]);
  const [input,     setInput]     = useState('');
  const [loading,   setLoading]   = useState(false);
  const [showNotif, setShowNotif] = useState(true);
  const msgsRef = useRef(null);

  // Auto-open after 2.2 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsOpen(true);
      setShowNotif(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // Inject welcome message when tab changes or chat first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([{ role: 'assistant', content: WELCOME[page], time: ts() }]);
    }
  }, [isOpen, page]);

  // Auto-scroll to latest message
  useEffect(() => {
    if (msgsRef.current) {
      msgsRef.current.scrollTop = msgsRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // ── Switch page tab ────────────────────────────────────────
  const switchPage = (newPage) => {
    if (newPage === page) return;
    setPage(newPage);
    setHistory([]);
    setMessages([{ role: 'assistant', content: WELCOME[newPage], time: ts() }]);
  };

  // ── Open / close ───────────────────────────────────────────
  const openChat = () => {
    setIsOpen(true);
    setShowNotif(false);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  // ── Send message ───────────────────────────────────────────
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userMsg = { role: 'user', content: text, time: ts() };
    const nextHistory = [...history, { role: 'user', content: `[Visitor is on the ${page} tab] ${text}` }];

    setMessages((prev) => [...prev, userMsg]);
    setHistory(nextHistory);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory }),
      });

      const data = await res.json();
      const reply = data.content?.[0]?.text || 'Let me walk you through that — try asking again.';
      const botMsg = { role: 'assistant', content: reply, time: ts() };

      setMessages((prev) => [...prev, botMsg]);
      setHistory((prev) => [...prev, { role: 'assistant', content: reply }]);

    } catch (err) {
      console.error('AegisGuide error:', err);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: 'Connection hiccup — please try again in a moment.', time: ts() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  // ── Render ─────────────────────────────────────────────────
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">

      {/* ── Chat window ────────────────────────────────────── */}
      {isOpen && (
        <div className="w-80 flex flex-col rounded-2xl overflow-hidden shadow-2xl border border-gray-700 bg-gray-900"
             style={{ maxHeight: '560px' }}>

          {/* Header */}
          <div className="flex items-center gap-2.5 px-3.5 py-3"
               style={{ background: 'linear-gradient(135deg, #2e2680 0%, #534AB7 100%)' }}>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 text-sm">
              🛡️
            </div>
            <div className="min-w-0">
              <p className="text-white text-sm font-semibold leading-tight">AEGIS-X Guide</p>
              <p className="text-indigo-200 text-xs">AI Governance Console · 4 pages</p>
            </div>
            <div className="ml-auto flex items-center gap-1.5">
              <span className="text-indigo-300 text-xs">LIVE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            </div>
            <button onClick={closeChat}
                    className="ml-2 text-indigo-300 hover:text-white transition-colors text-lg leading-none"
                    aria-label="Close guide">
              ✕
            </button>
          </div>

          {/* Page tabs */}
          <div className="flex overflow-x-auto border-b border-gray-700 bg-gray-800"
               style={{ scrollbarWidth: 'none' }}>
            {TABS.map((tab) => (
              <button key={tab.id}
                      onClick={() => switchPage(tab.id)}
                      className={`flex items-center gap-1 px-3 py-2 text-xs whitespace-nowrap border-b-2 transition-all flex-shrink-0
                        ${page === tab.id
                          ? 'border-indigo-400 text-indigo-300 font-medium'
                          : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Messages */}
          <div ref={msgsRef}
               className="flex-1 overflow-y-auto p-3 flex flex-col gap-2.5 bg-gray-900"
               style={{ height: '260px' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`rounded-2xl px-3 py-2 text-sm leading-relaxed max-w-[88%]
                  ${msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-br-sm'
                    : 'bg-gray-800 border border-gray-700 text-gray-100 rounded-bl-sm'}`}>
                  {/* Render bold markdown from bot */}
                  {msg.role === 'assistant'
                    ? <span dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    : msg.content}
                </div>
                <span className="text-xs text-gray-500 px-1">
                  {msg.role === 'user' ? 'You' : 'AEGIS-X Guide'} · {msg.time}
                </span>
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div className="flex flex-col items-start gap-1">
                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-sm px-3 py-2.5 flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <span key={i}
                          className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quick-action chips */}
          <div className="flex flex-wrap gap-1.5 px-3 py-2 border-t border-gray-700 bg-gray-800">
            {CHIPS[page]?.map((chip, i) => (
              <button key={i}
                      onClick={() => sendMessage(chip)}
                      disabled={loading}
                      className={`text-xs px-2.5 py-1 rounded-full border transition-colors disabled:opacity-40
                        ${i === 0
                          ? 'bg-indigo-900/60 text-indigo-300 border-indigo-600 font-medium hover:bg-indigo-900'
                          : 'bg-gray-900 text-gray-400 border-gray-600 hover:text-gray-200 hover:border-gray-500'}`}>
                {chip}
              </button>
            ))}
          </div>

          {/* Input row */}
          <div className="flex gap-2 px-3 py-2.5 border-t border-gray-700 bg-gray-900">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about AEGIS-X..."
              disabled={loading}
              className="flex-1 bg-gray-800 border border-gray-700 text-gray-100 text-sm rounded-full px-3 py-1.5
                         placeholder-gray-500 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
            />
            <button
              onClick={() => sendMessage(input)}
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="w-8 h-8 flex-shrink-0 rounded-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40
                         disabled:cursor-default flex items-center justify-center transition-colors">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L15 22 11 13 2 9l20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating action button ──────────────────────────── */}
      {!isOpen && (
        <button
          onClick={openChat}
          aria-label="Open AEGIS-X platform guide"
          className="relative w-14 h-14 rounded-full bg-indigo-600 hover:bg-indigo-700
                     shadow-lg shadow-indigo-900/50 flex items-center justify-center
                     transition-transform hover:scale-105 active:scale-95">
          <span className="text-2xl">🛡️</span>
          {showNotif && (
            <span className="absolute top-0.5 right-0.5 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-gray-900 animate-pulse" />
          )}
        </button>
      )}
    </div>
  );
}
