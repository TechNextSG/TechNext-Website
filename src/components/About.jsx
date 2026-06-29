import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { useT } from '../i18n/I18nProvider'

const TEAM_IMAGES = [
  '/gallery/team-01.png',
  '/gallery/team-02.png',
  '/gallery/gallery-01.jpeg',
  '/gallery/gallery-05.jpeg',
  '/gallery/gallery-03.jpeg',
]

const COUNTRIES = [
  { name: 'Singapore', flag: 'SG' },
  { name: 'Vietnam', flag: 'VN' },
  { name: 'Australia', flag: 'AU' },
  { name: 'United States', flag: 'US' },
  { name: 'Germany', flag: 'DE' },
  { name: 'Japan', flag: 'JP' },
]

const CULTURE_CARDS = [
  {
    color: 'yellow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    ),
    titleKey: 'about.cult1.h',
    bodyKey:  'about.cult1.p',
  },
  {
    color: 'blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    titleKey: 'about.cult2.h',
    bodyKey:  'about.cult2.p',
  },
  {
    color: 'pink',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    titleKey: 'about.cult3.h',
    bodyKey:  'about.cult3.p',
  },
]

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } }
}

export default function About() {
  const t = useT()
  const [carouselIndex, setCarouselIndex] = useState(0)
  const trackRef = useRef(null)

  const next = () => setCarouselIndex((i) => (i + 1) % TEAM_IMAGES.length)
  const prev = () => setCarouselIndex((i) => (i - 1 + TEAM_IMAGES.length) % TEAM_IMAGES.length)

  useEffect(() => {
    const interval = setInterval(next, 4500)
    return () => clearInterval(interval)
  }, [])

  return (
    <section id="about" className="about-section">
      <div className="container">
        <motion.div
          className="about-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <div className="section-label">{t('about.label')}</div>
          <h2 className="section-title">
            {t('about.h2.l1')}<br />
            <span className="hand-highlight">{t('about.h2.l2')}</span>
          </h2>
          <p className="section-sub">{t('about.sub')}</p>
        </motion.div>

        {/* Culture cards */}
        <motion.div
          className="culture-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={gridContainer}
        >
          {CULTURE_CARDS.map((card) => (
            <motion.div
              key={card.titleKey}
              className={`culture-card culture-${card.color}`}
              variants={sectionFade}
            >
              <div className="culture-icon">{card.icon}</div>
              <h3>{t(card.titleKey)}</h3>
              <p>{t(card.bodyKey)}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Team photo carousel */}
        <motion.div
          className="team-carousel"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
        >
          <div className="tc-track" ref={trackRef}>
            {TEAM_IMAGES.map((src, i) => (
              <div
                key={src}
                className={`tc-slide ${i === carouselIndex ? 'active' : ''}`}
              >
                <img src={src} alt={`TechNext team ${i + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          <button className="tc-btn tc-prev" onClick={prev} aria-label="Previous photo">‹</button>
          <button className="tc-btn tc-next" onClick={next} aria-label="Next photo">›</button>
          <div className="tc-dots" role="tablist">
            {TEAM_IMAGES.map((_, i) => (
              <button
                key={i}
                className={`tc-dot ${i === carouselIndex ? 'active' : ''}`}
                onClick={() => setCarouselIndex(i)}
                aria-label={`Show photo ${i + 1}`}
              />
            ))}
          </div>
        </motion.div>

        {/* Countries strip */}
        <motion.div
          className="countries"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <span className="countries-label">{t('about.activeIn')}</span>
          {COUNTRIES.map((c) => (
            <span key={c.flag} className="country-chip">
              <span className="country-flag">{c.flag}</span>
              {c.name}
            </span>
          ))}
        </motion.div>

        <div className="section-cta-row">
          <a href="/services" className="cta-primary">{t('about.cta')}</a>
        </div>
      </div>

      <style>{`
        .about-section {
          background: var(--color-bg);
          padding: var(--spacing-4xl) 0;
          position: relative;
        }

        .about-head {
          text-align: left;
          margin-bottom: var(--spacing-3xl);
        }

        .section-label {
          font-family: var(--font-hand);
          font-size: 1.9rem;
          font-weight: 600;
          color: var(--color-primary);
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 0.6rem;
          background: transparent;
          padding: 0;
          border-radius: 0;
          text-transform: none;
          letter-spacing: normal;
        }
        .section-label::before {
          content: '';
          display: inline-block;
          width: 28px;
          height: 3px;
          background: var(--color-primary);
          border-radius: 2px;
          flex-shrink: 0;
        }

        .section-title {
          font-family: var(--font-hand);
          font-size: clamp(3.2rem, 6.5vw, 5.8rem);
          font-weight: 700;
          line-height: 1.05;
          letter-spacing: 0.01em;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
        }

        .hand-highlight {
          position: relative;
          display: inline;
          z-index: 0;
        }
        .hand-highlight::after {
          content: '';
          position: absolute;
          bottom: 2px;
          left: -3px;
          right: -3px;
          height: 12px;
          background: var(--color-yellow-mid);
          z-index: -1;
          border-radius: 3px;
        }

        .section-sub {
          font-size: var(--font-size-base);
          color: var(--color-text-muted);
          line-height: 1.6;
          max-width: 580px;
          margin: 0;
        }

        /* Culture grid */
        .culture-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
          margin-bottom: var(--spacing-3xl);
        }
        .culture-card {
          background: #fff;
          border: 1.5px solid var(--color-border);
          border-radius: 20px;
          padding: 2rem;
          transition: transform 0.25s, box-shadow 0.25s;
        }
        .culture-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0,0,0,0.08);
        }
        .culture-icon { display: none; }
        .culture-card h3 {
          font-family: var(--font-hand);
          font-size: 1.9rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.6rem;
        }
        .culture-card p {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.75;
        }

        /* Team carousel */
        .team-carousel {
          position: relative;
          max-width: 960px;
          margin: 0 auto var(--spacing-2xl);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          aspect-ratio: 16 / 9;
          background: var(--color-bg-tertiary);
          box-shadow: var(--shadow-lg);
        }
        .tc-track {
          position: absolute;
          inset: 0;
        }
        .tc-slide {
          position: absolute;
          inset: 0;
          opacity: 0;
          transition: opacity 0.8s ease;
        }
        .tc-slide.active { opacity: 1; }
        .tc-slide img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .tc-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(8px);
          color: var(--color-text-primary);
          font-size: 1.4rem;
          font-weight: 700;
          border: none;
          cursor: pointer;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background var(--transition-fast);
        }
        .tc-btn:hover { background: white; }
        .tc-prev { left: var(--spacing-md); }
        .tc-next { right: var(--spacing-md); }
        .tc-dots {
          position: absolute;
          bottom: var(--spacing-md);
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          z-index: 2;
        }
        .tc-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.5);
          border: none;
          cursor: pointer;
          transition: all var(--transition-fast);
          padding: 0;
        }
        .tc-dot.active {
          background: white;
          width: 24px;
          border-radius: 4px;
        }

        /* Countries strip */
        .countries {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }
        .countries-label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-muted);
          margin-right: var(--spacing-sm);
          font-family: var(--font-body);
        }
        .country-chip {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          font-size: 0.82rem;
          color: var(--color-text-secondary);
          font-weight: 500;
        }
        .country-flag {
          display: inline-block;
          font-family: var(--font-heading);
          font-weight: 800;
          font-size: 0.72rem;
          color: var(--color-accent);
          letter-spacing: 0.04em;
        }

        /* Section CTA */
        .section-cta-row {
          text-align: center;
          margin-top: var(--spacing-xl);
        }
        .cta-primary {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 16px 40px;
          background: #6d2d7a;
          color: #fff;
          border-radius: 100px;
          font-size: 1rem;
          font-weight: 700;
          font-family: var(--font-body);
          letter-spacing: -0.01em;
          transition: all 0.25s;
          box-shadow: 0 6px 24px rgba(109,45,122,0.32);
          border: none;
          cursor: pointer;
          text-decoration: none;
        }
        .cta-primary:hover {
          background: #5a2568;
          transform: translateY(-2px);
          box-shadow: 0 10px 32px rgba(109,45,122,0.42);
        }

        @media (max-width: 1024px) {
          .culture-grid { grid-template-columns: 1fr; }
        }

        @media (max-width: 768px) {
          .about-section { padding: var(--spacing-2xl) 0; }
          .team-carousel { aspect-ratio: 4 / 3; border-radius: var(--radius-xl); }
          .tc-btn { width: 32px; height: 32px; font-size: 1.1rem; }
          .countries-label { width: 100%; text-align: center; margin: 0 0 4px; }
        }
      `}</style>
    </section>
  )
}
