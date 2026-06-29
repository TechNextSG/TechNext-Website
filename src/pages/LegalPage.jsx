export default function LegalPage({ title, lastUpdated, children }) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : ''

  const legalNav = [
    { label: 'Terms of Use', to: '/legal/terms' },
    { label: 'Privacy Policy', to: '/legal/privacy' },
    { label: 'Cookie Policy', to: '/legal/cookies' },
    { label: 'Accessibility', to: '/legal/accessibility' },
    { label: 'Responsible AI', to: '/legal/ai-policy' },
  ]

  return (
    <div className="page legal-page">
      {/* Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content">
            <span className="page-label">LEGAL</span>
            <h1 className="page-title">{title}</h1>
            {lastUpdated && <p className="page-desc">Last Updated: {lastUpdated}</p>}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <div className="legal-layout">
          {/* Sidebar nav */}
          <aside className="legal-sidebar">
            <nav className="legal-nav">
              <h4 className="legal-nav-title">Legal Information</h4>
              {legalNav.map((item) => (
                <a
                  key={item.to}
                  href={item.to}
                  className={`legal-nav-link ${currentPath === item.to ? 'active' : ''}`}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>

          {/* Main content */}
          <article className="legal-content">
            {children}
          </article>
        </div>
      </div>

      <style>{`
        .legal-layout {
          display: grid;
          grid-template-columns: 260px 1fr;
          gap: var(--spacing-4xl);
          padding: var(--spacing-3xl) 0 var(--spacing-5xl);
        }

        .legal-sidebar {
          position: sticky;
          top: 100px;
          align-self: start;
        }

        .legal-nav {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }

        .legal-nav-title {
          font-size: var(--font-size-sm);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .legal-nav-link {
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
          border-left: 3px solid transparent;
        }

        .legal-nav-link:hover {
          color: var(--color-text-primary);
          background: var(--color-bg-secondary);
        }

        .legal-nav-link.active {
          color: var(--color-primary);
          font-weight: 600;
          border-left-color: var(--color-primary);
          background: var(--color-bg-secondary);
        }

        .legal-content {
          max-width: 800px;
        }

        .legal-content h2 {
          font-size: var(--font-size-xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-top: var(--spacing-3xl);
          margin-bottom: var(--spacing-lg);
          padding-bottom: var(--spacing-sm);
          border-bottom: 1px solid var(--color-border);
        }

        .legal-content h2:first-child {
          margin-top: 0;
        }

        .legal-content h3 {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-top: var(--spacing-2xl);
          margin-bottom: var(--spacing-md);
        }

        .legal-content p {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.8;
          margin-bottom: var(--spacing-md);
        }

        .legal-content ul,
        .legal-content ol {
          padding-left: var(--spacing-xl);
          margin-bottom: var(--spacing-lg);
        }

        .legal-content li {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.8;
          margin-bottom: var(--spacing-sm);
        }

        .legal-content strong {
          color: var(--color-text-primary);
          font-weight: 700;
        }

        .legal-content a {
          color: var(--color-primary);
          text-decoration: underline;
          text-underline-offset: 2px;
        }

        .legal-content a:hover {
          color: var(--color-text-primary);
        }

        @media (max-width: 768px) {
          .legal-layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-xl);
          }
          .legal-sidebar {
            position: static;
          }
          .legal-nav {
            flex-direction: row;
            flex-wrap: wrap;
            gap: var(--spacing-xs);
          }
          .legal-nav-link {
            border-left: none;
            border-bottom: 2px solid transparent;
            padding: var(--spacing-xs) var(--spacing-sm);
            font-size: var(--font-size-xs);
          }
          .legal-nav-link.active {
            border-bottom-color: var(--color-primary);
          }
        }
      `}</style>
    </div>
  )
}
