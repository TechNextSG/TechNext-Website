import { lazy, Suspense, useEffect, useRef } from 'react'

const Stats = lazy(() => import('../../src/components/Stats'))
const Testimonials = lazy(() => import('../../src/components/Testimonials'))
const Offices = lazy(() => import('../../src/components/Offices'))

export { Page }

function Page() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1 }
    )
    sectionRef.current?.querySelectorAll('.animate-on-scroll').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const values = [
    { icon: '\u{1F680}', title: 'Innovation First', desc: 'We stay ahead of the curve, adopting and mastering new technologies before they become mainstream.' },
    { icon: '\u{1F91D}', title: 'Client Partnership', desc: 'We treat every project as a partnership. Your success is our success, measured in tangible business outcomes.' },
    { icon: '\u{1F3AF}', title: 'Excellence in Delivery', desc: 'With 10+ projects and a 4.9/5 rating, our track record speaks for itself. Quality is non-negotiable.' },
    { icon: '\u{1F30F}', title: 'Global Perspective', desc: 'With offices across Singapore, Vietnam, and Philippines, we bring diverse perspectives to every challenge.' },
  ]

  return (
    <div className="page about-page" ref={sectionRef}>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content animate-on-scroll">
            <span className="page-label">ABOUT US</span>
            <h1 className="page-title">
              Your reliable <span className="accent">technology partner</span>
            </h1>
            <p className="page-desc">
              Tech Next Solutions has been delivering cutting-edge IT solutions since 2018,
              empowering organizations across 5+ countries to thrive in the digital age.
            </p>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="container">
        <div className="about-values animate-on-scroll">
          {values.map((v) => (
            <div key={v.title} className="about-value-card">
              <span className="about-value-icon">{v.icon}</span>
              <h3 className="about-value-title">{v.title}</h3>
              <p className="about-value-desc">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <Suspense fallback={null}>
        <Stats />
      </Suspense>

      {/* Testimonials */}
      <Suspense fallback={null}>
        <Testimonials />
      </Suspense>

      {/* Offices */}
      <Suspense fallback={null}>
        <Offices />
      </Suspense>

      {/* CTA */}
      <div className="about-cta-section">
        <div className="container">
          <div className="about-cta animate-on-scroll">
            <h2 className="about-cta-title">Ready to work together?</h2>
            <p className="about-cta-desc">Let's discuss how our team can drive your digital transformation.</p>
            <a href="/contact" className="btn btn-primary btn-lg">
              Contact Us
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        .about-values {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-xl);
          padding: var(--spacing-5xl) 0;
        }

        .about-value-card {
          padding: var(--spacing-xl);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-surface);
          transition: all var(--transition-base);
        }

        .about-value-card:hover {
          border-color: var(--color-primary);
          transform: translateY(-4px);
        }

        .about-value-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: var(--spacing-md);
        }

        .about-value-title {
          font-size: var(--font-size-lg);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-sm);
        }

        .about-value-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.7;
        }

        .about-cta-section {
          padding: var(--spacing-5xl) 0;
        }

        .about-cta {
          text-align: center;
          padding: var(--spacing-4xl);
          background: var(--gradient-dark);
          border-radius: var(--radius-2xl);
          color: white;
        }

        .about-cta-title {
          font-size: clamp(1.75rem, 3vw, 2.5rem);
          font-weight: 900;
          color: white;
          margin-bottom: var(--spacing-md);
        }

        .about-cta-desc {
          font-size: var(--font-size-lg);
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: var(--spacing-2xl);
        }

        @media (max-width: 1024px) {
          .about-values { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .about-values { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
