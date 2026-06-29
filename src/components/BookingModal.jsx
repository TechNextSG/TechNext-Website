import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../i18n/I18nProvider'

const SERVICES = [
  {
    id: 'ai',
    nameKey: 'booking.svc.ai.name',
    descKey: 'booking.svc.ai.desc',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="4" y="4" width="16" height="16" rx="3" />
        <rect x="9" y="9" width="6" height="6" />
        <line x1="9" y1="4" x2="9" y2="2" />
        <line x1="15" y1="4" x2="15" y2="2" />
        <line x1="9" y1="22" x2="9" y2="20" />
        <line x1="15" y1="22" x2="15" y2="20" />
        <line x1="4" y1="9" x2="2" y2="9" />
        <line x1="4" y1="15" x2="2" y2="15" />
        <line x1="22" y1="9" x2="20" y2="9" />
        <line x1="22" y1="15" x2="20" y2="15" />
      </svg>
    )
  },
  {
    id: 'odoo',
    nameKey: 'booking.svc.odoo.name',
    descKey: 'booking.svc.odoo.desc',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    )
  },
  {
    id: 'both',
    nameKey: 'booking.svc.both.name',
    descKey: 'booking.svc.both.desc',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    )
  },
]

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DDAYS  = ['Su','Mo','Tu','We','Th','Fr','Sa']
const TIMES  = ['9:00 AM','10:00 AM','11:00 AM','2:00 PM','3:00 PM','4:00 PM']

export function openBookingModal() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('booking:open'))
  }
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const lastDate = new Date(year, month + 1, 0).getDate()
  const cells = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= lastDate; d++) cells.push(d)
  return cells
}

export default function BookingModal() {
  const t = useT()
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(1)
  const [service, setService] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', challenge: '' })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  const today = useRef(new Date()).current
  const [calY, setCalY] = useState(today.getFullYear())
  const [calM, setCalM] = useState(today.getMonth())
  const [selDate, setSelDate] = useState(null)
  const [selTime, setSelTime] = useState(null)

  // Listen for global open event
  useEffect(() => {
    const handler = () => setOpen(true)
    window.addEventListener('booking:open', handler)
    return () => window.removeEventListener('booking:open', handler)
  }, [])

  // Lock body scroll while open
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset on close
  const close = () => {
    setOpen(false)
    setTimeout(() => {
      setStep(1)
      setService(null)
      setForm({ name: '', email: '', phone: '', company: '', challenge: '' })
      setErrors({})
      setSelDate(null)
      setSelTime(null)
      setSubmitError(null)
    }, 280)
  }

  // Close on ESC
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') close() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const updateField = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const goStep2 = () => service && setStep(2)

  const validateStep2 = () => {
    const next = {}
    if (!form.name.trim()) next.name = true
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = true
    setErrors(next)
    if (Object.keys(next).length === 0) setStep(3)
  }

  const calNav = (dir) => {
    let m = calM + dir
    let y = calY
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setCalY(y); setCalM(m); setSelDate(null); setSelTime(null)
  }

  const selectDay = (d) => {
    if (!d) return
    const date = new Date(calY, calM, d)
    if (date < new Date(today.toDateString())) return
    if (date.getDay() === 0 || date.getDay() === 6) return  // skip weekends
    setSelDate(date)
    setSelTime(null)
  }

  const submit = async () => {
    setSubmitting(true)
    setSubmitError(null)
    const svc = (() => {
      const found = SERVICES.find(s => s.id === service)
      // English service name for Odoo (consistent CRM data regardless of UI lang)
      return found ? t(found.nameKey) : 'Not specified'
    })()
    const dateStr = selDate ? selDate.toDateString() : '—'
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone || undefined,
      company: form.company || undefined,
      service: svc,
      message: [
        `Booking request via website.`,
        `Service: ${svc}`,
        `Preferred slot: ${dateStr} at ${selTime || '—'}`,
        '',
        form.challenge ? `Challenge: ${form.challenge}` : '(no challenge note)',
      ].join('\n'),
    }
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }
      setStep(4)
    } catch (err) {
      setSubmitError(err.message || 'Submit failed')
    } finally {
      setSubmitting(false)
    }
  }

  const cells = buildCalendarDays(calY, calM)
  const todayKey = today.toDateString()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="booking-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => { if (e.target === e.currentTarget) close() }}
          role="dialog"
          aria-modal="true"
          aria-label="Book a discovery call"
        >
          <motion.div
            className="booking-box"
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.32, ease: [0.34, 1.56, 0.64, 1] }}
          >
            <div className="booking-header">
              <div className="booking-brand">{t('booking.brand')}</div>
              <button className="booking-close" onClick={close} aria-label={t('booking.close')}>✕</button>
            </div>

            {step < 4 && (
              <div className="booking-progress">
                {[1, 2, 3].map((i, idx, arr) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', flex: idx === arr.length - 1 ? '0' : '1' }}>
                    <div className={`bp-step ${step === i ? 'active' : step > i ? 'done' : ''}`}>
                      {step > i ? '✓' : i}
                    </div>
                    {idx < arr.length - 1 && <div className={`bp-line ${step > i ? 'done' : ''}`} />}
                  </div>
                ))}
              </div>
            )}

            {/* STEP 1 — Service */}
            {step === 1 && (
              <div className="booking-step">
                <div className="bk-h">{t('booking.s1.h')}</div>
                <div className="bk-sub">{t('booking.s1.sub')}</div>
                <div className="service-opts">
                  {SERVICES.map((s) => (
                    <button
                      key={s.id}
                      className={`service-opt ${service === s.id ? 'selected' : ''}`}
                      onClick={() => setService(s.id)}
                      type="button"
                    >
                      <span className="service-opt-icon">{s.icon}</span>
                      <div>
                        <div className="service-opt-name">{t(s.nameKey)}</div>
                        <div className="service-opt-desc">{t(s.descKey)}</div>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="bk-nav bk-nav-end">
                  <button className="bk-btn" onClick={goStep2} disabled={!service}>{t('booking.continue')}</button>
                </div>
              </div>
            )}

            {/* STEP 2 — Details */}
            {step === 2 && (
              <div className="booking-step">
                <div className="bk-h">{t('booking.s2.h')}</div>
                <div className="bk-sub">{t('booking.s2.sub')}</div>
                <div className="booking-fields">
                  <input className={`booking-input ${errors.name ? 'err' : ''}`} type="text" placeholder={t('booking.field.name')}
                         value={form.name} onChange={(e) => updateField('name', e.target.value)} />
                  <input className={`booking-input ${errors.email ? 'err' : ''}`} type="email" placeholder={t('booking.field.email')}
                         value={form.email} onChange={(e) => updateField('email', e.target.value)} />
                  <input className="booking-input" type="tel" placeholder={t('booking.field.phone')}
                         value={form.phone} onChange={(e) => updateField('phone', e.target.value)} />
                  <input className="booking-input" type="text" placeholder={t('booking.field.company')}
                         value={form.company} onChange={(e) => updateField('company', e.target.value)} />
                  <textarea className="booking-input" placeholder={t('booking.field.challenge')}
                            value={form.challenge} onChange={(e) => updateField('challenge', e.target.value)} />
                </div>
                <div className="bk-nav">
                  <button className="bk-back" onClick={() => setStep(1)}>{t('booking.back')}</button>
                  <button className="bk-btn" onClick={validateStep2}>{t('booking.continue')}</button>
                </div>
              </div>
            )}

            {/* STEP 3 — Calendar */}
            {step === 3 && (
              <div className="booking-step">
                <div className="bk-h">{t('booking.s3.h')}</div>
                <div className="bk-sub">{t('booking.s3.sub')}</div>

                <div className="cal-hdr">
                  <button className="cal-nav-btn" onClick={() => calNav(-1)} aria-label="Previous month">‹</button>
                  <span className="cal-month-lbl">{MONTHS[calM]} {calY}</span>
                  <button className="cal-nav-btn" onClick={() => calNav(1)} aria-label="Next month">›</button>
                </div>

                <div className="cal-grid">
                  {DDAYS.map((d) => <div key={d} className="cal-dlbl">{d}</div>)}
                  {cells.map((d, i) => {
                    if (d === null) return <div key={`e${i}`} className="cal-day cd-emp" />
                    const date = new Date(calY, calM, d)
                    const isPast = date < new Date(today.toDateString())
                    const isWeekend = date.getDay() === 0 || date.getDay() === 6
                    const isSel = selDate && date.toDateString() === selDate.toDateString()
                    const isToday = date.toDateString() === todayKey
                    const dis = isPast || isWeekend
                    return (
                      <button
                        key={d}
                        className={`cal-day ${dis ? 'cd-dis' : ''} ${isSel ? 'cd-sel' : ''} ${isToday ? 'cd-today' : ''}`}
                        onClick={() => !dis && selectDay(d)}
                        disabled={dis}
                        type="button"
                      >{d}</button>
                    )
                  })}
                </div>

                {selDate && (
                  <>
                    <div className="ts-title">{t('booking.s3.times')}</div>
                    <div className="time-slots">
                      {TIMES.map((slot) => (
                        <button
                          key={slot}
                          className={`time-slot ${selTime === slot ? 'selected' : ''}`}
                          onClick={() => setSelTime(slot)}
                          type="button"
                        >{slot}</button>
                      ))}
                    </div>
                  </>
                )}

                {submitError && <div className="bk-err">{submitError}</div>}

                <div className="bk-nav">
                  <button className="bk-back" onClick={() => setStep(2)}>{t('booking.back')}</button>
                  <button
                    className="bk-btn"
                    onClick={submit}
                    disabled={!selDate || !selTime || submitting}
                  >
                    {submitting ? t('booking.sending') : t('booking.confirm')}
                  </button>
                </div>
              </div>
            )}

            {/* STEP 4 — Confirmation */}
            {step === 4 && (
              <div className="booking-step">
                <div className="bk-success">
                  <div className="bk-check">
                    <svg viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" width="28" height="28">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <div className="bk-h" style={{ marginBottom: '0.4rem' }}>{t('booking.s4.h')}</div>
                  <p className="bk-success-sub">
                    {t('booking.s4.sub')} <b>{form.email}</b> {t('booking.s4.sub2')}
                  </p>
                  <div className="bk-confirm-details">
                    <div><span>{t('booking.s4.svc')}</span><b>{(() => { const f = SERVICES.find(s => s.id === service); return f ? t(f.nameKey) : '—' })()}</b></div>
                    <div><span>{t('booking.s4.when')}</span><b>{selDate?.toDateString()} · {selTime}</b></div>
                  </div>
                  <a
                    href={`https://wa.me/6588396998?text=${encodeURIComponent(`Hi TechNext! Just booked via your site for ${(() => { const f = SERVICES.find(s => s.id === service); return f ? t(f.nameKey) : '' })()} on ${selDate?.toDateString()} at ${selTime}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="wa-btn"
                  >
                    <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M11.997 0C5.373 0 0 5.373 0 12c0 2.121.554 4.11 1.523 5.837L.057 23.885l6.225-1.634A11.943 11.943 0 0 0 12 24c6.627 0 12-5.373 12-12S18.624 0 11.997 0zm.003 21.818a9.818 9.818 0 0 1-5.007-1.369l-.359-.213-3.697.97.988-3.606-.234-.371A9.818 9.818 0 0 1 2.182 12c0-5.414 4.404-9.818 9.818-9.818 5.414 0 9.818 4.404 9.818 9.818 0 5.414-4.404 9.818-9.818 9.818z" />
                    </svg>
                    {t('booking.wa')}
                  </a>
                  <button className="bk-back" style={{ marginTop: '0.5rem' }} onClick={close}>{t('booking.close')}</button>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .booking-modal {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(10,12,28,0.72);
          backdrop-filter: blur(6px);
          display: flex; align-items: center; justify-content: center;
          padding: 1.5rem;
        }
        .booking-box {
          background: #fff; border-radius: 28px;
          max-width: 500px; width: 100%;
          max-height: 90vh; overflow-y: auto;
          position: relative;
          box-shadow: 0 32px 80px rgba(0,0,0,0.28);
          font-family: var(--font-body);
        }
        .booking-header {
          display: flex; align-items: center; justify-content: space-between;
          padding: 1.4rem 1.6rem 0;
        }
        .booking-brand {
          font-family: var(--font-heading);
          font-size: 0.95rem; font-weight: 800;
          color: var(--color-accent);
          letter-spacing: -0.02em;
        }
        .booking-close {
          width: 30px; height: 30px; border-radius: 50%;
          background: #f1f5f9; border: none; cursor: pointer;
          font-size: 0.9rem; color: #64748b;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.18s; line-height: 1;
        }
        .booking-close:hover {
          background: #e2e8f0; color: #1a1a2e;
          transform: rotate(90deg);
        }

        .booking-progress {
          display: flex; align-items: center;
          padding: 1.1rem 1.6rem 0;
        }
        .bp-step {
          width: 26px; height: 26px; border-radius: 50%; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.72rem; font-weight: 700;
          background: #f1f5f9; color: #64748b;
          transition: all 0.3s;
        }
        .bp-step.active { background: var(--color-accent); color: #fff; }
        .bp-step.done { background: var(--color-green); color: #16a34a; }
        .bp-line {
          flex: 1; height: 2px; background: #e2e8f0;
          margin: 0 4px;
          transition: background 0.3s;
        }
        .bp-line.done { background: #86efac; }

        .booking-step {
          padding: 1.4rem 1.6rem 1.6rem;
        }
        .bk-h {
          font-family: var(--font-hand);
          font-size: 1.75rem; font-weight: 700;
          color: #1a1a2e;
          margin-bottom: 0.25rem;
          line-height: 1;
        }
        .bk-sub {
          font-size: 0.85rem;
          color: #64748b;
          margin-bottom: 1.3rem;
        }

        .service-opts {
          display: flex; flex-direction: column;
          gap: 0.7rem; margin-bottom: 1.3rem;
        }
        .service-opt {
          display: flex; align-items: center; gap: 0.9rem;
          background: #f8fafc;
          border: 2px solid #e2e8f0;
          border-radius: 14px;
          padding: 0.9rem 1.1rem;
          cursor: pointer; text-align: left;
          width: 100%;
          transition: all 0.18s;
          font-family: var(--font-body);
        }
        .service-opt:hover {
          border-color: var(--color-accent);
          background: #faf5ff;
        }
        .service-opt.selected {
          border-color: var(--color-accent);
          background: #faf5ff;
          box-shadow: 0 0 0 3px rgba(109,45,122,0.08);
        }
        .service-opt-icon {
          width: 28px; height: 28px; flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          color: var(--color-accent);
        }
        .service-opt-icon svg { width: 22px; height: 22px; }
        .service-opt-name {
          font-size: 0.9rem; font-weight: 700; color: #1a1a2e;
        }
        .service-opt-desc {
          font-size: 0.75rem; color: #64748b; margin-top: 1px;
        }

        .booking-fields {
          display: flex; flex-direction: column;
          gap: 0.65rem; margin-bottom: 1.3rem;
        }
        .booking-input {
          width: 100%;
          padding: 11px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 11px;
          font-size: 0.88rem;
          font-family: var(--font-body);
          color: #1a1a2e;
          background: #fff;
          outline: none;
          transition: border-color 0.2s;
        }
        .booking-input:focus { border-color: var(--color-accent); }
        .booking-input.err { border-color: #ef4444; }
        textarea.booking-input { resize: none; height: 76px; }

        .cal-hdr {
          display: flex; align-items: center; justify-content: space-between;
          margin-bottom: 0.8rem;
        }
        .cal-nav-btn {
          width: 30px; height: 30px;
          border: 1.5px solid #e2e8f0;
          border-radius: 8px;
          background: none; cursor: pointer;
          font-size: 1rem;
          display: flex; align-items: center; justify-content: center;
          color: #64748b;
          transition: all 0.18s;
        }
        .cal-nav-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .cal-month-lbl {
          font-size: 0.9rem; font-weight: 700; color: #1a1a2e;
        }
        .cal-grid {
          display: grid; grid-template-columns: repeat(7, 1fr);
          gap: 3px; margin-bottom: 1rem;
        }
        .cal-dlbl {
          font-size: 0.62rem; font-weight: 700; color: #64748b;
          text-align: center; padding: 3px 0;
        }
        .cal-day {
          aspect-ratio: 1;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.79rem;
          border-radius: 7px;
          cursor: pointer;
          background: none;
          border: 1.5px solid transparent;
          color: #1a1a2e;
          font-family: var(--font-body);
          transition: all 0.14s;
          padding: 0;
        }
        .cal-day:hover:not(.cd-dis):not(.cd-emp) {
          background: #faf5ff;
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .cal-day.cd-sel {
          background: var(--color-accent);
          color: #fff;
          border-color: var(--color-accent);
        }
        .cal-day.cd-dis, .cal-day.cd-emp {
          color: #cbd5e1; cursor: default; pointer-events: none;
        }
        .cal-day.cd-today { font-weight: 700; }

        .ts-title {
          font-size: 0.75rem; font-weight: 700;
          color: #64748b;
          text-transform: uppercase; letter-spacing: 0.08em;
          margin-bottom: 0.6rem;
        }
        .time-slots {
          display: flex; flex-wrap: wrap;
          gap: 0.45rem; min-height: 36px;
          margin-bottom: 1rem;
        }
        .time-slot {
          padding: 7px 15px;
          background: #f8fafc;
          border: 1.5px solid #e2e8f0;
          border-radius: 999px;
          font-size: 0.82rem;
          color: #1a1a2e;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all 0.18s;
        }
        .time-slot:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .time-slot.selected {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: #fff;
        }

        .bk-nav {
          display: flex; align-items: center; justify-content: space-between;
          gap: 0.6rem;
        }
        .bk-nav-end { justify-content: flex-end; }
        .bk-btn {
          padding: 0.7rem 1.4rem;
          background: var(--color-accent);
          color: #fff;
          font-family: var(--font-body);
          font-weight: 700; font-size: 0.85rem;
          border: none; border-radius: 999px;
          cursor: pointer;
          transition: all 0.18s;
        }
        .bk-btn:hover:not(:disabled) {
          background: var(--color-accent-dark);
          transform: translateY(-1px);
        }
        .bk-btn:disabled {
          background: #cbd5e1; cursor: not-allowed;
        }
        .bk-back {
          padding: 0.6rem 1rem;
          background: transparent;
          color: #64748b;
          font-family: var(--font-body);
          font-weight: 600; font-size: 0.85rem;
          border: none;
          cursor: pointer;
          transition: color 0.18s;
        }
        .bk-back:hover { color: #1a1a2e; }

        .bk-err {
          padding: 0.6rem 0.9rem;
          background: #fef2f2;
          border: 1px solid #fecaca;
          border-radius: 10px;
          font-size: 0.78rem;
          color: #b91c1c;
          margin-bottom: 0.8rem;
        }

        .bk-success {
          text-align: center;
          padding: 0.5rem 0;
        }
        .bk-check {
          width: 56px; height: 56px;
          border-radius: 50%;
          background: var(--color-green);
          display: flex; align-items: center; justify-content: center;
          margin: 0 auto 0.8rem;
        }
        .bk-success-sub {
          font-size: 0.85rem; color: #475569;
          margin-bottom: 1rem;
          line-height: 1.55;
        }
        .bk-confirm-details {
          background: #f8fafc;
          border-radius: 12px;
          padding: 0.9rem 1.1rem;
          margin-bottom: 1rem;
          text-align: left;
          display: flex; flex-direction: column; gap: 0.4rem;
        }
        .bk-confirm-details > div {
          display: flex; justify-content: space-between; gap: 1rem;
          font-size: 0.82rem;
        }
        .bk-confirm-details span {
          color: #64748b;
        }
        .bk-confirm-details b {
          color: #1a1a2e;
          font-weight: 700;
          text-align: right;
        }
        .wa-btn {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 0.7rem 1.3rem;
          background: #25d366;
          color: #fff;
          font-family: var(--font-body);
          font-weight: 600; font-size: 0.85rem;
          border-radius: 999px;
          transition: background 0.18s;
        }
        .wa-btn:hover { background: #20b858; }

        @media (max-width: 480px) {
          .booking-modal { padding: 0; }
          .booking-box {
            border-radius: 24px 24px 0 0;
            max-height: 95vh;
            align-self: flex-end;
          }
        }
      `}</style>
    </AnimatePresence>
  )
}
