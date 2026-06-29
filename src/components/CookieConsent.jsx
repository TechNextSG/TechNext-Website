import { useState, useEffect } from 'react'

function grantConsent() {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      'analytics_storage': 'granted',
      'ad_storage': 'granted',
      'ad_user_data': 'granted',
      'ad_personalization': 'granted'
    })
  }
}

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'accepted') {
      grantConsent()
    } else if (consent === null) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
    // If 'rejected', consent stays denied (default in index.html)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
    grantConsent()
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
      <div className="cookie-content">
        <div className="cookie-text">
          <svg className="cookie-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a10 10 0 0 0 0 20 10 10 0 0 0 7.5-3.5" />
            <circle cx="8" cy="8" r="1" fill="currentColor" />
            <circle cx="12" cy="14" r="1" fill="currentColor" />
            <circle cx="16" cy="9" r="1" fill="currentColor" />
          </svg>
          <p>
            We use cookies to enhance your experience and analyze site traffic.{' '}
            <a href="/legal/cookies" className="cookie-link">Cookie Policy</a>
          </p>
        </div>
        <div className="cookie-actions">
          <button className="cookie-btn cookie-btn--reject" onClick={reject}>
            Decline
          </button>
          <button className="cookie-btn cookie-btn--accept" onClick={accept}>
            Accept
          </button>
        </div>
      </div>

      <style>{`
        .cookie-banner {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: var(--spacing-md);
          animation: cookieSlideUp 0.4s ease-out;
        }

        @keyframes cookieSlideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .cookie-content {
          max-width: 1100px;
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-lg);
          padding: var(--spacing-lg) var(--spacing-xl);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
        }

        .cookie-text {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .cookie-icon {
          flex-shrink: 0;
          color: var(--color-primary);
        }

        .cookie-text p {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          line-height: 1.5;
          margin: 0;
        }

        .cookie-link {
          color: var(--color-primary);
          text-decoration: underline;
          font-weight: 600;
        }

        .cookie-actions {
          display: flex;
          gap: var(--spacing-sm);
          flex-shrink: 0;
        }

        .cookie-btn {
          padding: 8px 20px;
          border-radius: var(--radius-full);
          font-size: var(--font-size-sm);
          font-weight: 600;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all var(--transition-fast);
          border: none;
        }

        .cookie-btn--reject {
          background: transparent;
          color: var(--color-text-muted);
          border: 1px solid var(--color-border-strong);
        }

        .cookie-btn--reject:hover {
          background: var(--color-bg-secondary);
          color: var(--color-text-primary);
        }

        .cookie-btn--accept {
          background: var(--color-primary);
          color: white;
        }

        .cookie-btn--accept:hover {
          background: var(--color-primary-dark);
          transform: translateY(-1px);
        }

        @media (max-width: 768px) {
          .cookie-content {
            flex-direction: column;
            text-align: center;
            padding: var(--spacing-lg);
            gap: var(--spacing-md);
          }
          .cookie-text {
            flex-direction: column;
            gap: var(--spacing-sm);
          }
          .cookie-actions {
            width: 100%;
          }
          .cookie-btn {
            flex: 1;
          }
        }
      `}</style>
    </div>
  )
}

