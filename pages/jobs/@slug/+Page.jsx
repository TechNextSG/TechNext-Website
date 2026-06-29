import { useData } from 'vike-react/useData'
import { COUNTRIES } from '../../../src/data/careers'
import NotFound from '../../../src/components/NotFound'
import { useT } from '../../../src/i18n/I18nProvider'

const COUNTRY_KEY = {
  vietnam: 'careers.country.vn',
  philippines: 'careers.country.ph',
  singapore: 'careers.country.sg',
}
const DEPT_KEY = {
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

export default function Page() {
  const t = useT()
  const { role } = useData()

  if (!role) {
    return <NotFound />
  }

  const country = COUNTRIES.find((c) => c.id === role.country)
  const mailto = `mailto:anthony@technext.asia?subject=${encodeURIComponent(
    `Application: ${role.name}${role.sub ? ` (${role.sub})` : ''}`
  )}&body=${encodeURIComponent(
    `Hi Anthony,\n\nI'd like to apply for the ${role.name} role.\n\nA bit about me:\n\n— CV attached / linked above.\n`
  )}`

  return (
    <div className="job-page">
      <section className={`job-hero rc-${role.color}`}>
        <div className="container">
          <a href="/careers" className="job-back">{t('job.back')}</a>
          <div className="role-dept">{t(DEPT_KEY[role.dept] || role.dept)}</div>
          <h1 className="job-title">{role.name}</h1>
          {role.sub && <div className="job-sub">{role.sub}</div>}
          <div className="job-meta">
            <span className="job-loc">{country?.flag} {t(COUNTRY_KEY[role.country] || role.country)}</span>
            <span className="job-dot" />
            <span>{t('job.remote')}</span>
            <span className="job-dot" />
            <span>{t('job.english')}</span>
          </div>
        </div>
      </section>

      <section className="job-body">
        <div className="container job-grid">
          <div className="job-content">
            <h2 className="job-section-title">{t('job.section.about')}</h2>
            <p className="job-short">{role.short}</p>
            {role.body.split('\n\n').map((para, i) => (
              <p key={i} className="job-para">{para}</p>
            ))}

            <h2 className="job-section-title">{t('job.section.must')}</h2>
            <ul className="job-must">
              {role.must.map((m, i) => (
                <li key={i}>{m}</li>
              ))}
            </ul>
          </div>

          <aside className="job-aside">
            <div className="job-apply-card">
              <div className="apply-label">{t('job.apply.label')}</div>
              <h3 className="apply-title">{t('job.apply.h')}</h3>
              <p className="apply-sub">{t('job.apply.sub')}</p>
              <a href={mailto} className="apply-btn">{t('job.apply.btn')}</a>
              <div className="apply-or">{t('job.apply.or')}</div>
              <a
                href={`https://wa.me/6588396998?text=${encodeURIComponent(`Hi TechNext! I'm interested in the ${role.name} role.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="apply-wa"
              >
                {t('job.apply.wa')}
              </a>
            </div>
          </aside>
        </div>
      </section>

      <style>{`
        .job-page {
          background: var(--color-bg);
          min-height: 100vh;
        }
        .job-hero {
          padding: calc(80px + var(--spacing-2xl)) 0 var(--spacing-2xl);
        }
        .rc-yellow   { background: var(--color-yellow); }
        .rc-blue     { background: var(--color-primary-pale); }
        .rc-pink     { background: var(--color-pink); }
        .rc-lavender { background: var(--color-lavender); }
        .rc-green    { background: var(--color-green); }
        .rc-peach    { background: var(--color-peach); }

        .job-back {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-md);
          transition: color var(--transition-fast);
        }
        .job-back:hover { color: var(--color-accent); }

        .role-dept {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: var(--spacing-sm);
        }
        .job-title {
          font-family: var(--font-heading);
          font-size: clamp(2rem, 4.5vw, 3.25rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: var(--color-text-primary);
        }
        .job-sub {
          font-family: var(--font-body);
          font-size: var(--font-size-lg);
          font-style: italic;
          color: var(--color-text-secondary);
          margin-top: var(--spacing-xs);
        }
        .job-meta {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          flex-wrap: wrap;
          margin-top: var(--spacing-md);
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--color-text-secondary);
        }
        .job-dot {
          width: 4px; height: 4px;
          border-radius: 50%;
          background: var(--color-text-light);
        }

        .job-body {
          padding: var(--spacing-2xl) 0 var(--spacing-4xl);
        }
        .job-grid {
          display: grid;
          grid-template-columns: 2fr 1fr;
          gap: var(--spacing-3xl);
          align-items: start;
        }

        .job-section-title {
          font-family: var(--font-heading);
          font-size: var(--font-size-xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin: var(--spacing-xl) 0 var(--spacing-sm);
        }
        .job-section-title:first-child { margin-top: 0; }
        .job-short {
          font-size: var(--font-size-lg);
          color: var(--color-text-primary);
          line-height: 1.5;
          margin-bottom: var(--spacing-md);
          font-weight: 500;
        }
        .job-para {
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          line-height: 1.7;
          margin-bottom: var(--spacing-md);
        }
        .job-must {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
        }
        .job-must li {
          position: relative;
          padding-left: 22px;
          font-size: var(--font-size-base);
          color: var(--color-text-secondary);
          line-height: 1.6;
        }
        .job-must li::before {
          content: '';
          position: absolute;
          left: 4px;
          top: 9px;
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--color-accent);
        }

        .job-aside {
          position: sticky;
          top: 90px;
        }
        .job-apply-card {
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          padding: var(--spacing-xl);
          box-shadow: var(--shadow-md);
        }
        .apply-label {
          font-family: var(--font-body);
          font-size: 0.72rem;
          font-weight: 700;
          color: var(--color-accent);
          text-transform: uppercase;
          letter-spacing: 0.14em;
          margin-bottom: var(--spacing-xs);
        }
        .apply-title {
          font-family: var(--font-heading);
          font-size: var(--font-size-lg);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-sm);
        }
        .apply-sub {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: var(--spacing-md);
        }
        .apply-btn {
          display: block;
          text-align: center;
          padding: 0.85rem 1.5rem;
          background: var(--color-accent);
          color: white;
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.92rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
        }
        .apply-btn:hover {
          background: var(--color-accent-dark);
          transform: translateY(-1px);
        }
        .apply-or {
          text-align: center;
          margin: var(--spacing-sm) 0;
          font-size: 0.75rem;
          color: var(--color-text-light);
        }
        .apply-wa {
          display: block;
          text-align: center;
          padding: 0.75rem 1.5rem;
          background: transparent;
          color: var(--color-text-primary);
          border: 1.5px solid var(--color-border-strong);
          font-family: var(--font-body);
          font-weight: 600;
          font-size: 0.88rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
        }
        .apply-wa:hover {
          border-color: var(--color-accent);
          color: var(--color-accent);
        }

        @media (max-width: 1024px) {
          .job-grid { grid-template-columns: 1fr; }
          .job-aside { position: static; }
        }

        @media (max-width: 768px) {
          .job-hero { padding: calc(60px + var(--spacing-xl)) 0 var(--spacing-xl); }
          .job-body { padding: var(--spacing-xl) 0 var(--spacing-2xl); }
        }
      `}</style>
    </div>
  )
}
