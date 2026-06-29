import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { openBookingModal } from './BookingModal'
import { useT } from '../i18n/I18nProvider'

function useCountUp(target, duration = 2000, startCounting = false) {
  const [count, setCount] = useState(0)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!startCounting || hasAnimated.current) return
    hasAnimated.current = true
    const startTime = performance.now()
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * target))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, startCounting])

  return count
}

const heroContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
}

const heroItem = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

const trustContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } }
}

const trustItem = {
  hidden: { opacity: 0, y: 18, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
}

const HERO_IMAGES = ['/2.png', '/1.png']

export default function Hero() {
  const t = useT()
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const statsRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.5 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveImg((i) => (i + 1) % HERO_IMAGES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const clientCount = useCountUp(10, 1800, statsVisible)
  const countryCount = useCountUp(11, 1400, statsVisible)
  const expertCount = useCountUp(4, 2000, statsVisible)

  return (
    <>
      <section className="hero" id="home">
        {/* Image bleeds to right viewport edge, outside container */}
        <motion.div
          className="hero-img-col"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1], delay: 0.3 }}
        >
          {HERO_IMAGES.map((src, i) => (
            <img
              key={src}
              src={src}
              alt="TechNext team"
              className={i === activeImg ? 'active' : ''}
              loading={i === 0 ? 'eager' : 'lazy'}
            />
          ))}
        </motion.div>

        <div className="container">
          <motion.div
            className="hero-left"
            variants={heroContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div className="hero-badges" variants={heroItem}>
              <span className="badge badge-yellow">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                {t('hero.badge.ai')}
              </span>
              <span className="badge badge-blue">
                <span className="badge-pulse" />
                {t('hero.badge.trust')}
              </span>
            </motion.div>

            <motion.h1 className="hero-title" variants={heroItem}>
              {t('hero.title.l1')}<br />
              {t('hero.title.l2.a')} <span className="hand-accent">{t('hero.title.l2.b')}</span>.<br />
              <span className="blue">{t('hero.title.l3.a')}{' '}
                <span className="highlight">{t('hero.title.l3.b')}</span>
              </span>
            </motion.h1>

            <motion.p className="hero-sub" variants={heroItem}>
              {t('hero.sub')}
            </motion.p>

            <motion.div className="hero-ctas" variants={heroItem}>
              <button type="button" className="btn-plum" onClick={openBookingModal}>
                {t('hero.cta.primary')}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <a href="#services" className="btn-outline-hero">
                {t('hero.cta.secondary')}
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* TRUST BAR */}
      <div id="trust">
        <div className="trust-item">
          <span className="ti-icon"><img src="/odoo-partner.png" alt="Odoo Partner" /></span>
          <span>{t('trust.odoo')}</span>
        </div>
        <div className="trust-sep" />
        <div className="trust-item">
          <span className="ti-icon"><img src="/iso27001-logo.png" alt="ISO 27001" /></span>
          <span>ISO 27001</span>
        </div>
        <div className="trust-sep" />
        <div className="trust-item">
          <span className="ti-icon"><img src="/claude-logo.png" alt="Claude Partner" /></span>
          <span>{t('trust.claude')}</span>
        </div>
        <div className="trust-sep" />
        <div className="trust-item">
          <span className="ti-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            </svg>
          </span>
          <span>{t('trust.countries')}</span>
        </div>
      </div>

      {/* STATS */}
      <div id="stats" ref={statsRef}>
        <motion.div
          className="stats-inner"
          variants={trustContainer}
          initial="hidden"
          animate={statsVisible ? 'visible' : 'hidden'}
        >
          <motion.div className="stat-col" variants={trustItem}>
            <div className="stat-num">{clientCount}+</div>
            <div className="stat-label">{t('stats.clients.label')}</div>
            <div className="stat-sub">{t('stats.clients.sub')}</div>
          </motion.div>
          <motion.div className="stat-col" variants={trustItem}>
            <div className="stat-num">{countryCount}+</div>
            <div className="stat-label">{t('stats.countries.label')}</div>
            <div className="stat-sub">{t('stats.countries.sub')}</div>
          </motion.div>
          <motion.div className="stat-col" variants={trustItem}>
            <div className="stat-num">{expertCount}</div>
            <div className="stat-label">{t('stats.disc.label')}</div>
            <div className="stat-sub">{t('stats.disc.sub')}</div>
          </motion.div>
        </motion.div>
      </div>

      <style>{`
        /* ========== HERO ========== */
        .hero {
          position: relative;
          min-height: 100vh;
          display: flex;
          align-items: center;
          background: var(--color-bg);
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          right: 4%;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(420px, 68vw, 780px);
          height: clamp(420px, 68vw, 780px);
          border-radius: 50%;
          border: 1.5px solid rgba(37,99,235,0.09);
          pointer-events: none;
          z-index: 0;
        }
        .hero::after {
          content: '';
          position: absolute;
          right: 4%;
          top: 50%;
          transform: translateY(-50%);
          width: clamp(280px, 45vw, 520px);
          height: clamp(280px, 45vw, 520px);
          border-radius: 50%;
          border: 1.5px solid rgba(37,99,235,0.06);
          pointer-events: none;
          z-index: 0;
        }

        .hero .container {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .hero-left {
          position: relative;
          z-index: 2;
          width: 48%;
          padding-top: 88px;
        }

        /* Badges */
        .hero-badges {
          display: flex;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
          margin-bottom: var(--spacing-lg);
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          border-radius: 10px;
          font-size: 0.78rem;
          font-weight: 600;
          font-family: var(--font-body);
          letter-spacing: 0.01em;
        }
        .badge-yellow {
          background: var(--color-yellow);
          color: #854D0E;
        }
        .badge-yellow svg { color: #CA8A04; }
        .badge-blue {
          background: var(--color-primary-pale);
          color: var(--color-primary-dark);
        }
        .badge-pulse {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22c55e;
          position: relative;
        }
        .badge-pulse::after {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: #22c55e;
          opacity: 0.4;
          animation: badgePulse 1.8s ease-in-out infinite;
        }
        @keyframes badgePulse {
          0%, 100% { transform: scale(0.8); opacity: 0.4; }
          50% { transform: scale(1.6); opacity: 0; }
        }

        /* Title */
        .hero-title {
          font-family: var(--font-hand);
          font-size: clamp(2.8rem, 5.2vw, 4.6rem);
          font-weight: 700;
          line-height: 1.08;
          letter-spacing: 0.01em;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-lg);
        }
        .hero-title .blue { color: var(--color-primary); }
        .hero-title .highlight {
          position: relative;
          display: inline-block;
          z-index: 0;
        }
        .hero-title .highlight::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: -2px;
          right: -2px;
          height: 14px;
          background: var(--color-yellow-mid);
          z-index: -1;
          border-radius: 3px;
        }

        .hand-accent {
          display: inline-block;
          font-family: var(--font-hand);
          font-weight: 700;
          color: var(--color-accent);
          font-size: 1em;
          line-height: 1;
        }

        /* Subtitle */
        .hero-sub {
          font-size: var(--font-size-lg);
          color: var(--color-text-muted);
          line-height: 1.6;
          max-width: 540px;
          margin-bottom: var(--spacing-xl);
        }

        /* CTAs — plum + outline (from new HTML) */
        .hero-ctas {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex-wrap: wrap;
        }
        .btn-plum {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.85rem 1.6rem;
          background: var(--color-accent);
          color: white;
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: var(--radius-full);
          border: none;
          transition: all var(--transition-base);
        }
        .btn-plum:hover {
          background: var(--color-accent-dark);
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(109, 45, 122, 0.3);
        }
        .btn-outline-hero {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.85rem 1.6rem;
          background: transparent;
          color: var(--color-text-primary);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.95rem;
          border-radius: var(--radius-full);
          border: 1.5px solid var(--color-border-strong);
          transition: all var(--transition-base);
        }
        .btn-outline-hero:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        /* Image column — bleeds to right viewport edge */
        .hero-img-col {
          position: absolute;
          right: 0;
          top: 0;
          bottom: 0;
          width: 62%;
          overflow: hidden;
          z-index: 1;
        }
        .hero-img-col img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 115%;
          top: -8%;
          object-fit: cover;
          object-position: center 70%;
          mix-blend-mode: multiply;
          opacity: 0;
          transition: opacity 1.2s ease;
        }
        .hero-img-col img.active { opacity: 1; }

        /* ========== TRUST BAR ========== */
        #trust {
          background: rgba(255, 255, 255, 0.55);
          border-top: 1px solid var(--color-border);
          border-bottom: 1px solid var(--color-border);
          padding: var(--spacing-md) var(--spacing-xl);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: var(--spacing-lg);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 0.88rem;
          font-weight: 500;
          color: var(--color-text-secondary);
          font-family: var(--font-body);
        }
        .ti-icon {
          display: inline-flex;
          align-items: center;
          color: var(--color-accent);
        }
        .ti-icon svg { width: 20px; height: 20px; }
        .ti-icon img { height: 22px; width: auto; object-fit: contain; }
        .trust-sep {
          width: 1px;
          height: 20px;
          background: var(--color-border-strong);
        }

        /* ========== STATS ========== */
        #stats {
          background: var(--color-primary);
          padding: var(--spacing-3xl) var(--spacing-xl);
        }
        .stats-inner {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          max-width: 900px;
          margin: 0 auto;
        }
        .stat-col {
          text-align: center;
          padding: var(--spacing-xl) var(--spacing-lg);
          background: transparent;
        }
        .stat-col:not(:last-child) {
          border-right: 1px solid rgba(255,255,255,0.3);
        }
        .stat-num {
          font-family: var(--font-hand);
          font-size: clamp(2.5rem, 5vw, 4rem);
          font-weight: 900;
          color: #ffffff;
          letter-spacing: 0.01em;
          line-height: 1;
          margin-bottom: 6px;
        }
        .stat-label {
          font-size: var(--font-size-base);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.9);
          margin-bottom: 2px;
        }
        .stat-sub {
          font-size: var(--font-size-xs);
          color: rgba(255, 255, 255, 0.65);
        }

        /* ========== RESPONSIVE ========== */
        @media (max-width: 1024px) {
          .hero {
            min-height: auto;
            padding-bottom: 340px;
            display: block;
          }
          .hero::before, .hero::after { display: none; }
          .hero-left {
            width: 100%;
            padding-top: 100px;
          }
          .hero-img-col {
            top: auto;
            bottom: 0;
            width: 100%;
            height: 300px;
          }
          .hero-img-col img {
            height: 100%;
            top: 0;
            object-position: center 30%;
          }
        }

        @media (max-width: 768px) {
          .hero {
            padding-bottom: 280px;
          }
          .hero-left {
            padding-top: 80px;
          }
          .hero-img-col {
            height: 240px;
          }
          .hero-ctas .btn-plum,
          .hero-ctas .btn-outline-hero {
            width: 100%;
            justify-content: center;
          }
          #trust {
            gap: var(--spacing-md);
            padding: var(--spacing-md);
          }
          .trust-sep { display: none; }
          #stats {
            padding: var(--spacing-2xl) var(--spacing-md);
          }
          .stats-inner {
            grid-template-columns: 1fr 1fr;
            gap: var(--spacing-md);
          }
          .stat-col:last-child {
            grid-column: 1 / -1;
          }
        }
      `}</style>
    </>
  )
}
