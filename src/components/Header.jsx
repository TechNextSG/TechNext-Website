import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { openBookingModal } from './BookingModal'
import { useT, LangSwitcher } from '../i18n/I18nProvider'

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const t = useT()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: t('nav.about'),   to: '/#about' },
    { label: t('nav.gallery'), to: '/gallery' },
    { label: t('nav.blog'),    to: '/blog' },
    { label: t('nav.careers'), to: '/careers' },
    { label: t('nav.contact'), to: '/contact' },
  ]

  const handleNavClick = (to) => {
    setIsMobileMenuOpen(false)
    if (to.startsWith('/#')) {
      const hash = to.substring(1)
      if (window.location.pathname === '/') {
        const el = document.querySelector(hash)
        el?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header className={`header ${isScrolled ? 'header--scrolled' : ''}`} role="banner">
      <div className="container">
        <nav className="nav" role="navigation" aria-label="Main navigation">
          <a href="/" className="logo" aria-label="TechNext - Home">
            <img src="/technext-logo.png" alt="TechNext" className="logo-img" />
          </a>

          <ul className="nav-links hide-mobile" role="list">
            {navLinks.map((link) => (
              <li key={link.to} role="listitem">
                <a
                  href={link.to}
                  className={`nav-link ${typeof window !== 'undefined' && window.location.pathname === link.to ? 'nav-link--active' : ''}`}
                  onClick={() => link.to.startsWith('/#') && handleNavClick(link.to)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="nav-actions hide-mobile">
            <LangSwitcher />
            <button
              type="button"
              className="btn btn-primary"
              onClick={openBookingModal}
            >
              {t('nav.book')}
            </button>
          </div>

          <button
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
          >
            <span className={`hamburger ${isMobileMenuOpen ? 'active' : ''}`}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </nav>

        {/* Mobile Menu - AnimatePresence */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              id="mobile-menu"
              className="mobile-menu active"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ overflow: 'hidden' }}
            >
              <ul className="mobile-nav-links">
                {navLinks.map((link, index) => (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <a
                      href={link.to}
                      className={`mobile-nav-link ${typeof window !== 'undefined' && window.location.pathname === link.to ? 'nav-link--active' : ''}`}
                      onClick={() => { setIsMobileMenuOpen(false); link.to.startsWith('/#') && handleNavClick(link.to) }}
                    >
                      {link.label}
                    </a>
                  </motion.li>
                ))}
              </ul>
              <motion.div
                className="mobile-actions"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <LangSwitcher />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => { setIsMobileMenuOpen(false); openBookingModal() }}
                >
                  {t('nav.book')}
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          padding: var(--spacing-md) 0;
          background: transparent;
          transition: all var(--transition-base);
        }

        .header--scrolled {
          background: var(--glass-bg);
          backdrop-filter: var(--glass-blur);
          -webkit-backdrop-filter: var(--glass-blur);
          border-bottom: 1px solid var(--color-border);
          box-shadow: 0 1px 4px rgba(0,0,0,0.04);
          padding: var(--spacing-sm) 0;
        }

        .nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-xl);
        }

        .logo {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }

        .logo-img {
          height: 44px;
          width: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
          transition: opacity var(--transition-fast);
        }

        .logo:hover .logo-img {
          opacity: 0.8;
        }

        .nav-links {
          display: flex;
          align-items: center;
          gap: var(--spacing-2xl);
        }

        .nav-link {
          font-family: var(--font-body);
          font-weight: 500;
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
          position: relative;
          padding: var(--spacing-xs) 0;
        }

        .nav-link:hover {
          color: var(--color-text-primary);
        }

        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--color-primary);
          border-radius: 1px;
          transition: width var(--transition-base);
        }

        .nav-link:hover::after {
          width: 100%;
        }

        .nav-link--active {
          color: var(--color-primary) !important;
          font-weight: 600;
        }

        .nav-link--active::after {
          width: 100%;
        }

        .nav-actions {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .mobile-menu-btn {
          display: none;
          padding: var(--spacing-sm);
        }

        .hamburger {
          display: flex;
          flex-direction: column;
          gap: 5px;
          width: 22px;
        }

        .hamburger span {
          display: block;
          height: 2px;
          background: var(--color-text-primary);
          border-radius: 2px;
          transition: all var(--transition-base);
        }

        .hamburger.active span:nth-child(1) {
          transform: rotate(45deg) translate(5px, 5px);
        }

        .hamburger.active span:nth-child(2) {
          opacity: 0;
        }

        .hamburger.active span:nth-child(3) {
          transform: rotate(-45deg) translate(5px, -5px);
        }

        .mobile-menu {
          display: none;
          flex-direction: column;
          gap: var(--spacing-lg);
          padding: var(--spacing-xl) 0;
        }

        .mobile-menu.active {
          display: flex;
        }

        .mobile-nav-links {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .mobile-nav-link {
          display: block;
          padding: var(--spacing-sm) 0;
          font-family: var(--font-heading);
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-text-secondary);
          transition: color var(--transition-fast);
        }

        .mobile-nav-link:hover {
          color: var(--color-primary);
        }

        .mobile-actions {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
          padding-top: var(--spacing-md);
          border-top: 1px solid var(--color-border);
        }

        @media (max-width: 768px) {
          .header {
            padding: 4px 0 !important;
          }
          .header--scrolled {
            padding: 2px 0 !important;
          }
          .header .container {
            padding-top: 0;
            padding-bottom: 0;
          }
          .logo-img {
            height: 36px !important;
          }
          .nav {
            gap: 8px;
            min-height: 0;
          }
          .mobile-menu-btn {
            display: block;
            padding: 2px;
            width: 32px;
            height: 32px;
          }
        }
      `}</style>
    </header>
  )
}
