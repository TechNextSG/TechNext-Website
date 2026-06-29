import { openBookingModal } from './BookingModal'
import { useT } from '../i18n/I18nProvider'

export default function Footer() {
  const t = useT()
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    services: [
      { key: 'footer.link.aiAgents', to: '/services' },
      { key: 'footer.link.rag',      to: '/services' },
      { key: 'footer.link.conv',     to: '/services' },
      { key: 'footer.link.odoo',     to: '/services' },
      { key: 'footer.link.web',      to: '/services' },
    ],
    company: [
      { key: 'footer.link.about',       to: '/about' },
      { key: 'footer.link.blog',        to: '/blog' },
      { key: 'footer.link.contact',     to: '/contact' },
      { key: 'footer.link.partnership', to: '/contact' },
    ],
    legal: [
      { key: 'footer.link.terms',   to: '/legal/terms' },
      { key: 'footer.link.privacy', to: '/legal/privacy' },
      { key: 'footer.link.cookies', to: '/legal/cookies' },
      { key: 'footer.link.a11y',    to: '/legal/accessibility' },
      { key: 'footer.link.ai',      to: '/legal/ai-policy' },
    ],
  }

  const socialLinks = [
    {
      label: 'LinkedIn',
      href: 'https://www.linkedin.com/company/technextasia/',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect x="2" y="9" width="4" height="12" /><circle cx="4" cy="4" r="2" /></svg>
    },
    {
      label: 'Twitter',
      href: 'https://x.com/technextasia',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
    },
    {
      label: 'Facebook',
      href: 'https://www.facebook.com/technextasia',
      icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
    },
  ]

  return (
    <footer className="footer" id="contact">
      {/* CTA strip */}
      <div className="footer-cta-band">
        <div className="container">
          <div className="cta-band-inner">
            <div className="cta-band-text">
              <div className="cta-band-label">{t('footer.cta.label')}</div>
              <h3 className="cta-band-title">
                {t('footer.cta.title.l1')}{' '}
                <span className="hand-highlight">{t('footer.cta.title.l2')}</span>
              </h3>
              <p className="cta-band-desc">{t('footer.cta.desc')}</p>
            </div>
            <div className="cta-band-actions">
              <button type="button" className="cta-band-btn" onClick={openBookingModal}>
                {t('footer.cta.btn')}
              </button>
              <a href="mailto:anthony@technext.asia" className="cta-band-link">anthony@technext.asia</a>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="footer-main">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <a href="/" className="footer-logo">
                <img src="/technext-logo.png" alt="TechNext" className="footer-logo-img" />
              </a>
              <p className="footer-tagline">{t('footer.tagline')}</p>
              <div className="footer-social">
                {socialLinks.map((s) => (
                  <a key={s.label} href={s.href} className="social-icon"
                     aria-label={s.label} target="_blank" rel="noopener noreferrer">
                    {s.icon}
                  </a>
                ))}
              </div>
              <div className="footer-partner">
                <img src="/odoo-partner.png" alt="Odoo Ready Partner" />
              </div>
            </div>

            <div className="footer-columns">
              <div className="footer-col">
                <h4 className="footer-heading">{t('footer.col.services')}</h4>
                <ul>
                  {footerLinks.services.map((l) => (
                    <li key={l.key}><a href={l.to}>{t(l.key)}</a></li>
                  ))}
                </ul>
              </div>
              <div className="footer-col">
                <h4 className="footer-heading">{t('footer.col.company')}</h4>
                <ul>
                  {footerLinks.company.map((l) => (
                    <li key={l.key}><a href={l.to}>{t(l.key)}</a></li>
                  ))}
                </ul>
              </div>
              <div className="footer-col">
                <h4 className="footer-heading">{t('footer.col.legal')}</h4>
                <ul>
                  {footerLinks.legal.map((l) => (
                    <li key={l.key}><a href={l.to}>{t(l.key)}</a></li>
                  ))}
                </ul>
              </div>
              <div className="footer-col">
                <h4 className="footer-heading">{t('footer.col.newsletter.h')}</h4>
                <p className="footer-newsletter-desc">{t('footer.col.newsletter.d')}</p>
                <form
                  className="footer-newsletter"
                  onSubmit={(e) => {
                    e.preventDefault()
                    const input = e.target.querySelector('input')
                    if (input.value) { input.value = ''; alert('Thank you for subscribing!') }
                  }}
                >
                  <input type="email" placeholder={t('footer.newsletter.placeholder')} required />
                  <button type="submit" aria-label="Subscribe">→</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container">
          <p className="footer-copyright">{t('footer.bottom.copyright', { year: currentYear })}</p>
          <p className="footer-disclaimer">{t('footer.bottom.disclaimer')}</p>
        </div>
      </div>

      <style>{`
        .footer {
          background: var(--color-bg);
          padding-top: var(--spacing-3xl);
        }

        /* CTA band */
        .footer-cta-band {
          padding: var(--spacing-2xl) 0;
        }
        .cta-band-inner {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--spacing-2xl);
          align-items: center;
          padding: var(--spacing-2xl);
          background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-primary-dark) 100%);
          border-radius: var(--radius-2xl);
          color: white;
        }
        .cta-band-label {
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.14em;
          opacity: 0.8;
          margin-bottom: var(--spacing-sm);
        }
        .cta-band-title {
          font-family: var(--font-heading);
          font-size: clamp(1.5rem, 3vw, 2.2rem);
          font-weight: 800;
          line-height: 1.2;
          margin-bottom: var(--spacing-sm);
        }
        .cta-band-title .hand-highlight {
          font-family: var(--font-hand);
          color: #FEF08A;
          font-weight: 700;
          font-size: 1.15em;
          line-height: 0.9;
        }
        .cta-band-desc {
          font-size: var(--font-size-sm);
          opacity: 0.85;
          line-height: 1.6;
        }
        .cta-band-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          align-items: flex-start;
        }
        .cta-band-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0.9rem 1.8rem;
          background: white;
          color: var(--color-accent);
          font-family: var(--font-body);
          font-weight: 700;
          font-size: 0.95rem;
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
        }
        .cta-band-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
        }
        .cta-band-link {
          font-size: 0.85rem;
          color: white;
          opacity: 0.75;
          text-decoration: underline;
          text-underline-offset: 3px;
          font-family: var(--font-body);
        }

        /* Main footer */
        .footer-main {
          padding: var(--spacing-3xl) 0 var(--spacing-2xl);
          border-top: 1px solid var(--color-border);
          margin-top: var(--spacing-xl);
        }
        .footer-grid {
          display: grid;
          grid-template-columns: 1.3fr 2fr;
          gap: var(--spacing-3xl);
        }
        .footer-logo {
          display: inline-block;
          margin-bottom: var(--spacing-md);
        }
        .footer-logo-img {
          height: 32px;
          mix-blend-mode: multiply;
        }
        .footer-tagline {
          color: var(--color-text-muted);
          font-size: var(--font-size-sm);
          line-height: 1.7;
          margin-bottom: var(--spacing-lg);
          max-width: 360px;
        }
        .footer-social {
          display: flex;
          gap: var(--spacing-xs);
          margin-bottom: var(--spacing-lg);
        }
        .social-icon {
          width: 34px;
          height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          transition: all var(--transition-base);
        }
        .social-icon:hover {
          color: var(--color-accent);
          border-color: var(--color-accent);
          transform: translateY(-2px);
        }
        .footer-partner img {
          height: 48px;
          width: auto;
          object-fit: contain;
        }

        .footer-columns {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-xl);
        }
        .footer-col h4.footer-heading {
          font-family: var(--font-heading);
          font-size: 0.82rem;
          font-weight: 700;
          color: var(--color-text-primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--spacing-md);
        }
        .footer-col ul {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-xs);
        }
        .footer-col a {
          color: var(--color-text-muted);
          font-size: var(--font-size-sm);
          transition: color var(--transition-fast);
        }
        .footer-col a:hover {
          color: var(--color-accent);
        }
        .footer-newsletter-desc {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: var(--spacing-sm);
        }
        .footer-newsletter {
          display: flex;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-full);
          overflow: hidden;
          background: white;
        }
        .footer-newsletter:focus-within {
          border-color: var(--color-primary);
        }
        .footer-newsletter input {
          flex: 1;
          padding: 0.55rem 0.9rem;
          font-family: var(--font-body);
          font-size: 0.85rem;
          border: none;
          background: transparent;
          color: var(--color-text-primary);
          outline: none;
          min-width: 0;
        }
        .footer-newsletter button {
          padding: 0 0.9rem;
          background: var(--color-accent);
          color: white;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background var(--transition-fast);
        }
        .footer-newsletter button:hover {
          background: var(--color-accent-dark);
        }

        /* Bottom bar */
        .footer-bottom {
          padding: var(--spacing-lg) 0 var(--spacing-xl);
          border-top: 1px solid var(--color-border);
        }
        .footer-copyright,
        .footer-disclaimer {
          font-size: 0.76rem;
          color: var(--color-text-light);
          line-height: 1.6;
          margin: 0;
        }
        .footer-copyright { margin-bottom: 4px; }

        @media (max-width: 1024px) {
          .cta-band-inner {
            grid-template-columns: 1fr;
            text-align: left;
          }
          .cta-band-actions { align-items: flex-start; }
          .footer-grid { grid-template-columns: 1fr; gap: var(--spacing-2xl); }
          .footer-columns { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .cta-band-inner { padding: var(--spacing-xl); }
          .footer-columns { grid-template-columns: 1fr; gap: var(--spacing-xl); }
        }
      `}</style>
    </footer>
  )
}
