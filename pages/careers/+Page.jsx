import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { ROLES, COUNTRIES, DEPARTMENTS } from '../../src/data/careers'
import { useT } from '../../src/i18n/I18nProvider'

const COUNTRY_KEY = {
  all: 'careers.country.all',
  vietnam: 'careers.country.vn',
  philippines: 'careers.country.ph',
  singapore: 'careers.country.sg',
}

const DEPT_KEY = {
  'All Roles': 'careers.dept.all',
  'Engineering': 'careers.dept.engineering',
  'AI Systems': 'careers.dept.ai',
  'Infrastructure': 'careers.dept.infra',
  'Leadership': 'careers.dept.leadership',
  'Quality': 'careers.dept.quality',
  'Finance': 'careers.dept.finance',
  'ERP': 'careers.dept.erp',
  'Sales': 'careers.dept.sales',
  'Client Success': 'careers.dept.cs',
  'Management': 'careers.dept.mgmt',
}

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } }
}

const cardItem = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function Page() {
  const t = useT()
  const [country, setCountry] = useState('all')
  const [dept, setDept] = useState('All Roles')

  const visible = useMemo(() => ROLES.filter((r) => {
    if (country !== 'all' && r.country !== country) return false
    if (dept !== 'All Roles' && r.dept !== dept) return false
    return true
  }), [country, dept])

  return (
    <div className="careers-page">
      <section className="careers-hero">
        <div className="container">
          <div className="page-label">{t('careers.label')}</div>
          <h1 className="page-title">
            {t('careers.h1.l1')}<br />
            <span className="hand-highlight">{t('careers.h1.l2')}</span>
          </h1>
          <p className="page-sub">{t('careers.sub')}</p>
        </div>
      </section>

      <section className="careers-filters">
        <div className="container">
          <div className="filter-row">
            {COUNTRIES.map((c) => (
              <button
                key={c.id}
                className={`country-btn ${country === c.id ? 'active' : ''}`}
                onClick={() => setCountry(c.id)}
                type="button"
              >
                <span className="country-flag">{c.flag}</span> {t(COUNTRY_KEY[c.id] || c.id)}
              </button>
            ))}
          </div>
          <div className="filter-row filter-row-dept">
            {DEPARTMENTS.map((d) => (
              <button
                key={d}
                className={`filter-btn ${dept === d ? 'active' : ''}`}
                onClick={() => setDept(d)}
                type="button"
              >
                {t(DEPT_KEY[d] || d)}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="jobs-section">
        <div className="container">
          {visible.length === 0 ? (
            <div className="empty-state">
              <p>{t('careers.empty')}</p>
            </div>
          ) : (
            <motion.div
              className="jobs-grid"
              key={`${country}-${dept}`}
              variants={gridContainer}
              initial="hidden"
              animate="visible"
            >
              {visible.map((role) => (
                <motion.a
                  key={role.slug}
                  href={`/jobs/${role.slug}`}
                  className={`role-card rc-${role.color}`}
                  variants={cardItem}
                >
                  <div className="role-dept">{t(DEPT_KEY[role.dept] || role.dept)}</div>
                  <div className="role-name">{role.name}</div>
                  {role.sub && <div className="role-sub">{role.sub}</div>}
                  <div className="role-desc">{role.short}</div>
                  <div className="role-meta">
                    <span className="role-location">
                      {COUNTRIES.find((c) => c.id === role.country)?.flag}{' '}
                      {t(COUNTRY_KEY[role.country] || role.country)}
                    </span>
                    <span className="role-arrow">→</span>
                  </div>
                </motion.a>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      <section className="careers-cta">
        <div className="container">
          <motion.div
            className="careers-cta-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className="cc-label">{t('careers.cta.label')}</div>
            <h3 className="cc-title">
              {t('careers.cta.title.l1')}{' '}
              <span className="hand-highlight">{t('careers.cta.title.l2')}</span>{' '}
              {t('careers.cta.title.l3')}
            </h3>
            <p className="cc-sub">{t('careers.cta.sub')}</p>
            <a href="mailto:anthony@technext.asia?subject=Open%20application" className="cc-btn">
              {t('careers.cta.btn')}
            </a>
          </motion.div>
        </div>
      </section>

      <style>{`
        .careers-page {
          background: var(--color-bg);
          min-height: 100vh;
        }

        .careers-hero {
          padding: calc(80px + var(--spacing-3xl)) 0 var(--spacing-2xl);
          text-align: center;
        }
        .careers-hero .page-label {
          display: inline-block;
          padding: 4px 12px;
          background: var(--color-yellow);
          color: #854D0E;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: var(--spacing-md);
        }
        .careers-hero .page-title {
          font-family: var(--font-heading);
          font-size: clamp(2.25rem, 5vw, 3.75rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
        }
        .careers-hero .hand-highlight {
          font-family: var(--font-hand);
          color: var(--color-accent);
          font-weight: 700;
          font-size: 1.2em;
          line-height: 0.9;
        }
        .careers-hero .page-sub {
          font-size: var(--font-size-lg);
          color: var(--color-text-muted);
          line-height: 1.6;
          max-width: 640px;
          margin: 0 auto;
        }

        /* Filters */
        .careers-filters {
          padding: var(--spacing-md) 0 var(--spacing-xl);
        }
        .filter-row {
          display: flex;
          flex-wrap: wrap;
          gap: var(--spacing-xs);
          justify-content: center;
          margin-bottom: var(--spacing-sm);
        }
        .country-btn, .filter-btn {
          padding: 8px 16px;
          background: var(--color-bg-secondary);
          border: 1.5px solid var(--color-border);
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          cursor: pointer;
          transition: all var(--transition-fast);
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .country-btn:hover, .filter-btn:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }
        .country-btn.active, .filter-btn.active {
          background: var(--color-accent);
          border-color: var(--color-accent);
          color: #fff;
        }
        .country-flag { font-size: 1rem; }

        /* Job grid */
        .jobs-section {
          padding: var(--spacing-xl) 0 var(--spacing-3xl);
        }
        .jobs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-lg);
        }
        .role-card {
          display: flex;
          flex-direction: column;
          padding: var(--spacing-xl);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--color-border);
          color: var(--color-text-primary);
          text-decoration: none;
          transition: all var(--transition-base);
          min-height: 280px;
        }
        .role-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-xl);
        }
        .rc-yellow   { background: var(--color-yellow); }
        .rc-blue     { background: var(--color-primary-pale); }
        .rc-pink     { background: var(--color-pink); }
        .rc-lavender { background: var(--color-lavender); }
        .rc-green    { background: var(--color-green); }
        .rc-peach    { background: var(--color-peach); }

        .role-dept {
          display: inline-block;
          font-family: var(--font-body);
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--spacing-sm);
        }
        .role-name {
          font-family: var(--font-heading);
          font-size: var(--font-size-lg);
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.2;
          margin-bottom: 4px;
        }
        .role-sub {
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-style: italic;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-sm);
        }
        .role-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.55;
          margin-bottom: var(--spacing-md);
          flex: 1;
        }
        .role-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-sm);
          padding-top: var(--spacing-sm);
          border-top: 1px solid rgba(0,0,0,0.06);
        }
        .role-location {
          font-size: 0.78rem;
          font-weight: 600;
          color: var(--color-text-secondary);
        }
        .role-arrow {
          font-size: 1.2rem;
          color: var(--color-accent);
          transition: transform var(--transition-base);
        }
        .role-card:hover .role-arrow {
          transform: translateX(4px);
        }

        /* Empty state */
        .empty-state {
          text-align: center;
          padding: var(--spacing-3xl) 0;
          color: var(--color-text-muted);
          font-size: var(--font-size-base);
        }

        /* Bottom CTA */
        .careers-cta {
          padding: 0 0 var(--spacing-4xl);
        }
        .careers-cta-card {
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary-dark) 100%);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-3xl);
          text-align: center;
          color: white;
        }
        .cc-label {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          opacity: 0.8;
          margin-bottom: var(--spacing-sm);
        }
        .cc-title {
          font-family: var(--font-heading);
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: var(--spacing-sm);
        }
        .cc-title .hand-highlight {
          font-family: var(--font-hand);
          color: #FEF08A;
          font-weight: 700;
          font-size: 1.15em;
          line-height: 0.9;
        }
        .cc-sub {
          font-size: var(--font-size-sm);
          opacity: 0.85;
          max-width: 520px;
          margin: 0 auto var(--spacing-lg);
          line-height: 1.6;
        }
        .cc-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.85rem 1.75rem;
          background: white;
          color: var(--color-accent);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
        }
        .cc-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 1024px) {
          .jobs-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .careers-hero { padding: calc(60px + var(--spacing-xl)) 0 var(--spacing-lg); }
          .jobs-grid { grid-template-columns: 1fr; gap: var(--spacing-md); }
          .role-card { min-height: 0; padding: var(--spacing-lg); }
          .careers-cta-card { padding: var(--spacing-xl); }
        }
      `}</style>
    </div>
  )
}
