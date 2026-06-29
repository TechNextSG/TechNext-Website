import { useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Offices() {
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, { threshold: 0.15 })

  const offices = [
    {
      city: 'Singapore',
      country: 'Headquarters',
      address: 'Central Business District',
      details: 'Our global headquarters driving strategic direction and client partnerships across APAC'
    },
    {
      city: 'Ho Chi Minh City',
      country: 'Vietnam',
      address: 'Technology District',
      details: 'Primary development center with 5+ engineers powering our core delivery operations'
    },
    {
      city: 'BGC, Taguig',
      country: 'Philippines',
      address: 'Bonifacio Global City',
      details: 'Regional office supporting Southeast Asian clients with local expertise and presence'
    }
  ]

  return (
    <section className="offices section section--grey" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title animate-on-scroll">
          Our <span className="accent">offices</span>
        </h2>
        <p className="section-subtitle animate-on-scroll delay-1">
          Strategically located across Asia-Pacific — delivering local expertise with global reach
        </p>

        <div className="offices-grid">
          {offices.map((office, index) => (
            <div key={office.city} className={`office-card animate-on-scroll delay-${index + 1}`}>
              <div className="office-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
                  <circle cx="12" cy="9" r="2.5" />
                </svg>
              </div>
              <div className="office-country">{office.country}</div>
              <h3 className="office-city">{office.city}</h3>
              <p className="office-details">{office.details}</p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .offices-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl);
        }

        .office-card {
          padding: var(--spacing-2xl);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          transition: all var(--transition-base);
        }

        .office-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .office-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(50, 83, 220, 0.08);
          border-radius: var(--radius-lg);
          color: var(--color-primary);
          margin-bottom: var(--spacing-lg);
        }

        .office-country {
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: var(--color-primary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-bottom: var(--spacing-sm);
        }

        .office-city {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
        }

        .office-details {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.6;
        }

        @media (max-width: 768px) {
          .offices-grid {
            grid-template-columns: 1fr;
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: var(--spacing-md);
            padding-bottom: var(--spacing-sm);
            -webkit-overflow-scrolling: touch;
          }
          .offices-grid::-webkit-scrollbar {
            display: none;
          }
          .office-card {
            min-width: 75vw;
            scroll-snap-align: start;
            flex-shrink: 0;
            padding: var(--spacing-lg);
          }
          .office-icon {
            width: 36px;
            height: 36px;
            margin-bottom: var(--spacing-sm);
          }
          .office-icon svg {
            width: 18px;
            height: 18px;
          }
          .office-city {
            font-size: var(--font-size-xl);
            margin-bottom: var(--spacing-sm);
          }
          .office-details {
            font-size: var(--font-size-xs);
          }
        }
      `}</style>
    </section>
  )
}
