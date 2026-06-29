import { useState, useRef, useEffect, useCallback } from 'react'

const WHATSAPP_NUMBER = '6584272549'
const WHATSAPP_MESSAGE = 'Hi TechNext! I visited your website and would like to learn more about your services.'

// ─── GA4 Tracking (respects cookie consent) ───────
function trackEvent(eventName, params = {}) {
  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('event', eventName, { event_category: 'CTA Widget', ...params })
  }
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// ─── AI Chat Hook ─────────────────────────────────
function useChat() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi! 👋 I'm TechNext AI Assistant. How can I help you today?", time: timeNow() }
  ])
  const [loading, setLoading] = useState(false)

  const send = useCallback(async (text) => {
    if (!text.trim() || loading) return
    const userMsg = { role: 'user', content: text.trim(), time: timeNow() }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    try {
      const apiMessages = [...messages, userMsg]
        .filter(m => m.role === 'user' || m.role === 'assistant')
        .map(({ role, content }) => ({ role, content }))
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply, time: timeNow() }])
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, I'm having trouble connecting. Please try WhatsApp or the Contact Form!",
        time: timeNow()
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  return { messages, loading, send }
}

const QUICK_REPLIES = [
  { icon: '🚀', text: 'What services do you offer?' },
  { icon: '🤖', text: 'Tell me about AI Development' },
  { icon: '📊', text: 'Odoo ERP solutions' },
  { icon: '💻', text: 'I need a website or app' },
]

export default function FloatingCTA() {
  const [open, setOpen] = useState(false)
  const [tab, setTab] = useState('chat')
  const [formState, setFormState] = useState({ name: '', email: '', message: '', sending: false, sent: false })
  const [inputText, setInputText] = useState('')
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const { messages, loading, send } = useChat()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (open && tab === 'chat') setTimeout(() => inputRef.current?.focus(), 300)
  }, [open, tab])

  // Show greeting tooltip after 5 seconds
  useEffect(() => {
    if (hasInteracted) return
    const timer = setTimeout(() => {
      const tooltip = document.querySelector('.fcta-tooltip')
      if (tooltip) tooltip.classList.add('fcta-tooltip--show')
    }, 5000)
    return () => clearTimeout(timer)
  }, [hasInteracted])

  const handleOpen = () => {
    const willOpen = !open
    setOpen(willOpen)
    setHasInteracted(true)
    if (willOpen) trackEvent('widget_open', { event_label: 'FAB Click' })
  }

  const handleSend = () => {
    if (!inputText.trim()) return
    trackEvent('chat_message_sent', { event_label: inputText.trim().slice(0, 50) })
    send(inputText)
    setInputText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault()
    setFormState(s => ({ ...s, sending: true }))
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formState.name, email: formState.email, message: formState.message }),
      })
      if (res.ok) {
        setFormState({ name: '', email: '', message: '', sending: false, sent: true })
        trackEvent('form_submit', { event_label: formState.email })
        setTimeout(() => setFormState(s => ({ ...s, sent: false })), 5000)
      } else throw new Error()
    } catch {
      alert('Failed to send. Please try again or use WhatsApp.')
      setFormState(s => ({ ...s, sending: false }))
    }
  }

  const openWhatsApp = () => {
    trackEvent('whatsapp_click', { event_label: 'Open WhatsApp' })
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`, '_blank')
  }

  const tabs = [
    { id: 'chat', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>, label: 'AI Chat' },
    { id: 'whatsapp', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>, label: 'WhatsApp' },
    { id: 'form', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>, label: 'Contact' },
  ]

  return (
    <>
      {/* Greeting tooltip */}
      {!hasInteracted && !open && (
        <div className="fcta-tooltip">
          <span>👋 Need help? Chat with us!</span>
          <button className="fcta-tooltip-close" onClick={(e) => { e.stopPropagation(); setHasInteracted(true) }}>×</button>
        </div>
      )}

      {/* Panel */}
      <div className={`fcta-panel ${open ? 'fcta-panel--open' : ''}`} role="dialog" aria-label="Contact us">
        {/* Header */}
        <div className="fcta-header">
          <div className="fcta-header-bg" />
          <div className="fcta-header-content">
            <div className="fcta-header-info">
              <div className="fcta-avatar">
                <div className="fcta-avatar-inner">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                  </svg>
                </div>
                <span className="fcta-avatar-pulse" />
              </div>
              <div className="fcta-header-text">
                <div className="fcta-header-title">TechNext</div>
                <div className="fcta-header-status">
                  <span className="fcta-online-dot" />
                  Online now — We reply instantly
                </div>
              </div>
            </div>
            <button className="fcta-close" onClick={() => setOpen(false)} aria-label="Close">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="fcta-tabs" role="tablist">
          {tabs.map((t, i) => (
            <button
              key={t.id}
              className={`fcta-tab ${tab === t.id ? 'fcta-tab--active' : ''}`}
              onClick={() => { setTab(t.id); trackEvent('widget_tab_switch', { event_label: t.id }) }}
              role="tab"
              aria-selected={tab === t.id}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              <span className="fcta-tab-icon">{t.icon}</span>
              <span className="fcta-tab-label">{t.label}</span>
              {tab === t.id && <span className="fcta-tab-indicator" />}
            </button>
          ))}
        </div>

        {/* Chat Tab */}
        {tab === 'chat' && (
          <div className="fcta-body fcta-chat-body">
            <div className="fcta-messages">
              {messages.map((m, i) => (
                <div key={i} className={`fcta-msg ${m.role === 'user' ? 'fcta-msg--user' : 'fcta-msg--bot'}`}
                  style={{ animationDelay: `${Math.min(i * 80, 400)}ms` }}>
                  {m.role === 'assistant' && (
                    <div className="fcta-msg-avatar">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                    </div>
                  )}
                  <div className="fcta-msg-content">
                    <div className="fcta-msg-bubble">{m.content}</div>
                    <div className="fcta-msg-time">{m.time}</div>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="fcta-msg fcta-msg--bot">
                  <div className="fcta-msg-avatar">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
                  </div>
                  <div className="fcta-msg-content">
                    <div className="fcta-msg-bubble fcta-typing">
                      <span /><span /><span />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {messages.length <= 1 && (
              <div className="fcta-quick-replies">
                {QUICK_REPLIES.map((q, i) => (
                  <button key={q.text} className="fcta-quick-btn" onClick={() => { trackEvent('chat_quick_reply', { event_label: q.text }); send(q.text) }}
                    style={{ animationDelay: `${300 + i * 100}ms` }}>
                    <span className="fcta-quick-icon">{q.icon}</span>
                    {q.text}
                  </button>
                ))}
              </div>
            )}

            <div className="fcta-input-bar">
              <input ref={inputRef} type="text" className="fcta-input" placeholder="Type your message..."
                value={inputText} onChange={e => setInputText(e.target.value)}
                onKeyDown={handleKeyDown} disabled={loading} />
              <button className="fcta-send-btn" onClick={handleSend}
                disabled={loading || !inputText.trim()} aria-label="Send">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* WhatsApp Tab */}
        {tab === 'whatsapp' && (
          <div className="fcta-body fcta-wa-body">
            <div className="fcta-wa-card">
              <div className="fcta-wa-icon-wrap">
                <div className="fcta-wa-icon-bg" />
                <svg className="fcta-wa-svg" width="44" height="44" viewBox="0 0 24 24" fill="#25D366">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <h3 className="fcta-wa-title">Start a WhatsApp Chat</h3>
              <p className="fcta-wa-desc">
                Get instant, personalized support from our expert team.<br/>
                <strong>Mon–Fri, 9AM–6PM SGT</strong>
              </p>
              <button className="fcta-wa-btn" onClick={openWhatsApp}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Open WhatsApp Chat
              </button>
              <p className="fcta-wa-number">+65 8427 2549</p>
            </div>
          </div>
        )}

        {/* Form Tab */}
        {tab === 'form' && (
          <div className="fcta-body fcta-form-body">
            {formState.sent ? (
              <div className="fcta-form-success">
                <div className="fcta-success-check">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3>Message Sent!</h3>
                <p>Our team will respond within 24 hours.</p>
              </div>
            ) : (
              <form className="fcta-form" onSubmit={handleFormSubmit}>
                <div className="fcta-field">
                  <label className="fcta-label">Full Name</label>
                  <input type="text" className="fcta-form-input" required
                    value={formState.name} onChange={e => setFormState(s => ({ ...s, name: e.target.value }))}
                    placeholder="John Doe" />
                </div>
                <div className="fcta-field">
                  <label className="fcta-label">Work Email</label>
                  <input type="email" className="fcta-form-input" required
                    value={formState.email} onChange={e => setFormState(s => ({ ...s, email: e.target.value }))}
                    placeholder="john@company.com" />
                </div>
                <div className="fcta-field">
                  <label className="fcta-label">How can we help?</label>
                  <textarea className="fcta-form-input fcta-textarea" required rows={3}
                    value={formState.message} onChange={e => setFormState(s => ({ ...s, message: e.target.value }))}
                    placeholder="Tell us about your project goals..." />
                </div>
                <button type="submit" className="fcta-submit-btn" disabled={formState.sending}>
                  {formState.sending ? (
                    <><span className="fcta-btn-spinner" /> Sending...</>
                  ) : (
                    <>Send Message <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg></>
                  )}
                </button>
                <p className="fcta-form-note">🔒 Your information is secure and never shared.</p>
              </form>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="fcta-footer">
          <div className="fcta-footer-inner">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2L2 7l10 5 10-5-10-5z"/></svg>
            Powered by <strong>TechNext AI</strong>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className={`fcta-fab ${open ? 'fcta-fab--open' : ''}`}
        onClick={handleOpen} aria-label={open ? 'Close' : 'Chat with us'}>
        <span className="fcta-fab-icon fcta-fab-icon--chat">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
        </span>
        <span className="fcta-fab-icon fcta-fab-icon--close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </span>
      </button>

      {/* Backdrop (mobile) */}
      {open && <div className="fcta-backdrop" onClick={() => setOpen(false)} />}

      <style>{`
        /* ============================================
           FLOATING CTA — ENTERPRISE PREMIUM
           Inspired by Intercom, Drift, HubSpot
           ============================================ */

        /* ── FAB ── */
        .fcta-fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: var(--gradient-primary);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow:
            0 4px 14px rgba(50, 83, 220, 0.4),
            0 0 0 0 rgba(50, 83, 220, 0.3);
          z-index: 10000;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          overflow: hidden;
        }

        .fcta-fab::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .fcta-fab:hover::before { opacity: 1; }

        .fcta-fab:hover {
          transform: scale(1.1);
          box-shadow:
            0 8px 28px rgba(50, 83, 220, 0.45),
            0 0 0 0 rgba(50, 83, 220, 0);
        }

        .fcta-fab:active { transform: scale(0.95); }

        /* Pulse ring animation */
        .fcta-fab::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 50%;
          border: 2px solid var(--color-primary);
          opacity: 0;
          animation: fctaRing 3s ease-out infinite;
        }

        .fcta-fab--open::after { animation: none; opacity: 0; }

        @keyframes fctaRing {
          0% { transform: scale(0.9); opacity: 0.7; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { opacity: 0; }
        }

        /* Icon transition */
        .fcta-fab-icon {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fcta-fab-icon--chat {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .fcta-fab-icon--close {
          opacity: 0;
          transform: scale(0.3) rotate(-90deg);
        }

        .fcta-fab--open .fcta-fab-icon--chat {
          opacity: 0;
          transform: scale(0.3) rotate(90deg);
        }

        .fcta-fab--open .fcta-fab-icon--close {
          opacity: 1;
          transform: scale(1) rotate(0deg);
        }

        .fcta-fab--open {
          background: var(--color-bg-tertiary);
          box-shadow: 0 4px 16px rgba(0,0,0,0.15);
          color: var(--color-text-primary);
        }

        /* ── Tooltip ── */
        .fcta-tooltip {
          position: fixed;
          bottom: 92px;
          right: 24px;
          background: var(--color-surface);
          color: var(--color-text-primary);
          padding: 12px 16px;
          border-radius: 12px;
          font-size: 13.5px;
          font-weight: 500;
          box-shadow: 0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px var(--color-border);
          z-index: 9999;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transform: translateY(8px) scale(0.95);
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
          pointer-events: none;
        }

        .fcta-tooltip--show {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        .fcta-tooltip::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 24px;
          width: 12px;
          height: 12px;
          background: var(--color-surface);
          border-right: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          transform: rotate(45deg);
        }

        .fcta-tooltip-close {
          background: none;
          border: none;
          color: var(--color-text-light);
          font-size: 16px;
          cursor: pointer;
          padding: 0 0 0 4px;
          line-height: 1;
          transition: color 0.2s;
        }

        .fcta-tooltip-close:hover { color: var(--color-text-primary); }

        /* ── Panel ── */
        .fcta-panel {
          position: fixed;
          bottom: 96px;
          right: 24px;
          width: 400px;
          max-height: 580px;
          background: var(--color-surface);
          border-radius: 20px;
          box-shadow:
            0 24px 80px rgba(0,0,0,0.15),
            0 8px 32px rgba(0,0,0,0.08),
            0 0 0 1px var(--color-border);
          z-index: 10000;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          opacity: 0;
          transform: translateY(20px) scale(0.92);
          transform-origin: bottom right;
          pointer-events: none;
          transition: all 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fcta-panel--open {
          opacity: 1;
          transform: translateY(0) scale(1);
          pointer-events: auto;
        }

        /* ── Header ── */
        .fcta-header {
          position: relative;
          padding: 20px 20px 16px;
          overflow: hidden;
        }

        .fcta-header-bg {
          position: absolute;
          inset: 0;
          background: var(--gradient-primary);
        }

        .fcta-header-bg::before {
          content: '';
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%);
        }

        .fcta-header-bg::after {
          content: '';
          position: absolute;
          top: -50%;
          right: -30%;
          width: 200px;
          height: 200px;
          background: radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: fctaFloat 8s ease-in-out infinite;
        }

        @keyframes fctaFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(-20px, 10px) scale(1.1); }
        }

        .fcta-header-content {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
          z-index: 1;
        }

        .fcta-header-info {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .fcta-avatar {
          position: relative;
          width: 44px;
          height: 44px;
        }

        .fcta-avatar-inner {
          width: 44px;
          height: 44px;
          border-radius: 14px;
          background: rgba(255,255,255,0.2);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          border: 1px solid rgba(255,255,255,0.15);
        }

        .fcta-avatar-pulse {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 14px;
          height: 14px;
          background: #4ade80;
          border-radius: 50%;
          border: 2.5px solid var(--color-primary);
          animation: fctaDotPulse 2s ease-in-out infinite;
        }

        @keyframes fctaDotPulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4); }
          50% { box-shadow: 0 0 0 5px rgba(74, 222, 128, 0); }
        }

        .fcta-header-title {
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 16px;
          color: white;
          letter-spacing: -0.01em;
        }

        .fcta-header-status {
          font-size: 11.5px;
          color: rgba(255,255,255,0.8);
          display: flex;
          align-items: center;
          gap: 5px;
          margin-top: 1px;
        }

        .fcta-online-dot {
          width: 6px; height: 6px;
          background: #4ade80;
          border-radius: 50%;
        }

        .fcta-close {
          width: 34px; height: 34px;
          border-radius: 10px;
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(4px);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          border: 1px solid rgba(255,255,255,0.1);
          transition: all 0.2s ease;
        }

        .fcta-close:hover {
          background: rgba(255,255,255,0.25);
          transform: rotate(90deg);
        }

        /* ── Tabs ── */
        .fcta-tabs {
          display: flex;
          padding: 0 4px;
          background: var(--color-bg);
          border-bottom: 1px solid var(--color-border);
        }

        .fcta-tab {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 12px 0;
          font-family: var(--font-body);
          font-size: 12.5px;
          font-weight: 600;
          color: var(--color-text-muted);
          cursor: pointer;
          border: none;
          background: none;
          transition: color 0.25s ease;
        }

        .fcta-tab--active { color: var(--color-primary); }
        .fcta-tab:hover:not(.fcta-tab--active) { color: var(--color-text-secondary); }

        .fcta-tab-icon {
          display: flex;
          align-items: center;
          transition: transform 0.3s ease;
        }

        .fcta-tab--active .fcta-tab-icon { transform: scale(1.15); }

        .fcta-tab-indicator {
          position: absolute;
          bottom: -1px;
          left: 20%;
          right: 20%;
          height: 2.5px;
          background: var(--color-primary);
          border-radius: 2px 2px 0 0;
          animation: fctaSlideIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fctaSlideIn {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }

        /* ── Body ── */
        .fcta-body {
          flex: 1;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          animation: fctaFadeUp 0.35s ease;
        }

        @keyframes fctaFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* ── Chat ── */
        .fcta-chat-body { min-height: 340px; }

        .fcta-messages {
          flex: 1;
          overflow-y: auto;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          max-height: 290px;
          scrollbar-width: thin;
          scrollbar-color: var(--color-border-strong) transparent;
        }

        .fcta-msg {
          display: flex;
          gap: 8px;
          max-width: 88%;
          animation: fctaMsgIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        @keyframes fctaMsgIn {
          from { opacity: 0; transform: translateY(10px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }

        .fcta-msg--user {
          align-self: flex-end;
          flex-direction: row-reverse;
        }

        .fcta-msg--bot { align-self: flex-start; }

        .fcta-msg-avatar {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: var(--color-bg-secondary);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: var(--color-primary);
          margin-top: 2px;
        }

        .fcta-msg-content {
          display: flex;
          flex-direction: column;
        }

        .fcta-msg--user .fcta-msg-content { align-items: flex-end; }

        .fcta-msg-bubble {
          padding: 10px 14px;
          font-size: 13.5px;
          line-height: 1.55;
          word-break: break-word;
        }

        .fcta-msg--user .fcta-msg-bubble {
          background: var(--gradient-primary);
          color: white;
          border-radius: 16px 16px 4px 16px;
          box-shadow: 0 2px 8px rgba(50, 83, 220, 0.2);
        }

        .fcta-msg--bot .fcta-msg-bubble {
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
          border-radius: 16px 16px 16px 4px;
          border: 1px solid var(--color-border);
        }

        .fcta-msg-time {
          font-size: 10px;
          color: var(--color-text-light);
          margin-top: 4px;
          padding: 0 4px;
        }

        /* Typing dots */
        .fcta-typing {
          display: flex;
          gap: 5px;
          padding: 14px 18px !important;
        }

        .fcta-typing span {
          width: 7px; height: 7px;
          background: var(--color-text-light);
          border-radius: 50%;
          animation: fctaDot 1.4s ease-in-out infinite;
        }

        .fcta-typing span:nth-child(2) { animation-delay: 0.2s; }
        .fcta-typing span:nth-child(3) { animation-delay: 0.4s; }

        @keyframes fctaDot {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.3; }
          30% { transform: translateY(-6px); opacity: 1; }
        }

        /* Quick Replies */
        .fcta-quick-replies {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 0 16px 12px;
        }

        .fcta-quick-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 12px;
          border: 1px solid var(--color-border);
          background: var(--color-bg);
          color: var(--color-text-secondary);
          font-size: 12.5px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
          text-align: left;
          animation: fctaMsgIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }

        .fcta-quick-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(50, 83, 220, 0.04);
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(50, 83, 220, 0.1);
        }

        .fcta-quick-icon { font-size: 16px; }

        /* Input */
        .fcta-input-bar {
          display: flex;
          gap: 8px;
          padding: 12px 16px;
          border-top: 1px solid var(--color-border);
          background: var(--color-bg);
        }

        .fcta-input {
          flex: 1;
          border: 1.5px solid var(--color-border-strong);
          border-radius: 12px;
          padding: 10px 14px;
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-text-primary);
          background: var(--color-surface);
          outline: none;
          transition: all 0.25s ease;
        }

        .fcta-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(50, 83, 220, 0.08);
        }

        .fcta-input::placeholder { color: var(--color-text-light); }

        .fcta-send-btn {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: var(--gradient-primary);
          color: white;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.25s ease;
        }

        .fcta-send-btn:hover:not(:disabled) {
          transform: scale(1.08);
          box-shadow: 0 4px 12px rgba(50, 83, 220, 0.3);
        }

        .fcta-send-btn:disabled { opacity: 0.4; cursor: not-allowed; }

        /* ── WhatsApp ── */
        .fcta-wa-body {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 32px 28px;
          min-height: 340px;
          animation: fctaFadeUp 0.4s ease;
        }

        .fcta-wa-card { text-align: center; }

        .fcta-wa-icon-wrap {
          position: relative;
          display: inline-flex;
          margin-bottom: 20px;
        }

        .fcta-wa-icon-bg {
          position: absolute;
          inset: -12px;
          background: radial-gradient(circle, rgba(37, 211, 102, 0.12) 0%, transparent 70%);
          border-radius: 50%;
          animation: fctaWaPulse 2.5s ease-in-out infinite;
        }

        @keyframes fctaWaPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.3); opacity: 0; }
        }

        .fcta-wa-svg { position: relative; z-index: 1; }

        .fcta-wa-title {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 8px;
          letter-spacing: -0.02em;
        }

        .fcta-wa-desc {
          font-size: 13.5px;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: 24px;
        }

        .fcta-wa-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 32px;
          background: #25D366;
          color: white;
          border: none;
          border-radius: 14px;
          font-family: var(--font-heading);
          font-size: 14.5px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .fcta-wa-btn:hover {
          background: #20bd5a;
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.35);
        }

        .fcta-wa-btn:active { transform: scale(0.97); }

        .fcta-wa-number {
          margin-top: 14px;
          font-size: 12.5px;
          color: var(--color-text-light);
          font-weight: 500;
        }

        /* ── Form ── */
        .fcta-form-body {
          padding: 20px;
          min-height: 340px;
          overflow-y: auto;
          animation: fctaFadeUp 0.4s ease;
        }

        .fcta-form { display: flex; flex-direction: column; gap: 14px; }

        .fcta-field { display: flex; flex-direction: column; gap: 5px; }

        .fcta-label {
          font-size: 12px;
          font-weight: 700;
          color: var(--color-text-secondary);
          letter-spacing: 0.02em;
        }

        .fcta-form-input {
          border: 1.5px solid var(--color-border-strong);
          border-radius: 10px;
          padding: 10px 14px;
          font-family: var(--font-body);
          font-size: 13.5px;
          color: var(--color-text-primary);
          background: var(--color-bg);
          outline: none;
          transition: all 0.25s ease;
          resize: vertical;
        }

        .fcta-form-input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(50, 83, 220, 0.08);
        }

        .fcta-form-input::placeholder { color: var(--color-text-light); }

        .fcta-textarea { min-height: 72px; }

        .fcta-submit-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 0;
          background: var(--gradient-primary);
          color: white;
          border: none;
          border-radius: 12px;
          font-family: var(--font-heading);
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-top: 4px;
        }

        .fcta-submit-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(50, 83, 220, 0.3);
        }

        .fcta-submit-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .fcta-btn-spinner {
          width: 16px; height: 16px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .fcta-form-note {
          text-align: center;
          font-size: 11px;
          color: var(--color-text-light);
          margin-top: 2px;
        }

        /* Success */
        .fcta-form-success {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 300px;
          text-align: center;
          animation: fctaSuccessIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        @keyframes fctaSuccessIn {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }

        .fcta-success-check {
          margin-bottom: 16px;
          animation: fctaCheckBounce 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s both;
        }

        @keyframes fctaCheckBounce {
          from { transform: scale(0) rotate(-45deg); }
          to { transform: scale(1) rotate(0deg); }
        }

        .fcta-form-success h3 {
          font-family: var(--font-heading);
          font-size: 20px;
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: 6px;
        }

        .fcta-form-success p {
          font-size: 13.5px;
          color: var(--color-text-muted);
        }

        /* ── Footer ── */
        .fcta-footer {
          padding: 10px 16px;
          border-top: 1px solid var(--color-border);
          background: var(--color-bg);
        }

        .fcta-footer-inner {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 5px;
          font-size: 10.5px;
          color: var(--color-text-light);
        }

        /* Backdrop */
        .fcta-backdrop { display: none; }

        /* ── Mobile ── */
        @media (max-width: 480px) {
          .fcta-panel {
            bottom: 0;
            right: 0;
            left: 0;
            width: 100%;
            max-height: 88vh;
            border-radius: 24px 24px 0 0;
            transform: translateY(100%);
            transform-origin: bottom center;
          }

          .fcta-panel--open { transform: translateY(0); }

          .fcta-fab { bottom: 16px; right: 16px; }

          .fcta-tooltip {
            right: 16px;
            bottom: 84px;
          }

          .fcta-backdrop {
            display: block;
            position: fixed;
            inset: 0;
            background: rgba(0,0,0,0.5);
            backdrop-filter: blur(2px);
            z-index: 9999;
            animation: fadeIn 0.3s ease;
          }

          .fcta-messages { max-height: 42vh; }
        }
      `}</style>
    </>
  )
}
