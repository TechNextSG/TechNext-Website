import { useEffect } from 'react'
import { usePageContext } from 'vike-react/usePageContext'
import Header from '../src/components/Header'
import Footer from '../src/components/Footer'
import CookieConsent from '../src/components/CookieConsent'
import FloatingCTA from '../src/components/FloatingCTA'
import ReadingProgress from '../src/components/ReadingProgress'
import BookingModal from '../src/components/BookingModal'
import { I18nProvider } from '../src/i18n/I18nProvider'
import useLenis from '../src/hooks/useLenis'
import '../src/index.css'

function SectionLoader() {
    return (
        <div className="section-loader" role="status" aria-label="Loading section">
            <div className="loader-spinner"></div>
            <style>{`
        .section-loader {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 200px;
          background: var(--color-bg);
        }
        .loader-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid var(--color-border);
          border-top-color: var(--color-primary);
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    )
}

function SkipLink() {
    return (
        <a href="#main-content" className="skip-link">
            Skip to main content
            <style>{`
        .skip-link {
          position: absolute;
          top: -100%;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-primary);
          color: white;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          z-index: 10000;
          transition: top 0.3s ease;
          font-weight: 600;
        }
        .skip-link:focus {
          top: 1rem;
        }
      `}</style>
        </a>
    )
}

export default function Layout({ children }) {
    const { urlPathname } = usePageContext()
    useLenis()

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [urlPathname])

    return (
        <I18nProvider>
            <div className="app">
                <ReadingProgress />
                <SkipLink />
                <Header />
                <main id="main-content" role="main" aria-label="Main content">
                    {children}
                </main>
                <Footer />
                <CookieConsent />
                <FloatingCTA />
                <BookingModal />
            </div>
        </I18nProvider>
    )
}
