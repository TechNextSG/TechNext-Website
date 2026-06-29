import { useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function DeveloperSection() {
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, { threshold: 0.15 })

  const devLinks = [
    { icon: '⚙️', label: 'Documentation', href: '#' },
    { icon: '💻', label: 'API Reference', href: '#' },
    { icon: '📚', label: 'Tutorials', href: '#' },
    { icon: '📝', label: 'Tech Blog', href: '#' },
  ]

  const projectCards = [
    {
      image: '/service-web.png',
      title: 'Enterprise SaaS',
      desc: 'Build scalable multi-tenant SaaS platforms with our proven architecture patterns and tech stack.'
    },
    {
      image: '/service-ai.png',
      title: 'AI Integration',
      desc: 'Integrate cutting-edge AI capabilities into your existing applications with our expert guidance.'
    },
    {
      image: '/service-mobile.png',
      title: 'Mobile Solutions',
      desc: 'Launch cross-platform mobile apps that deliver native performance and exceptional UX.'
    },
  ]

  return (
    <section className="developer" ref={sectionRef}>
      {/* Dark Developer Section */}
      <div className="developer-dark">
        <div className="container">
          <div className="developer-grid animate-on-scroll">
            <div className="developer-left">
              <span className="developer-label">TECHNEXT DEVELOPER</span>
              <h2 className="developer-title">
                What do you want{' '}
                <span className="developer-accent">to build</span> today?
              </h2>
              <p className="developer-desc">
                A new era of possibility with cutting-edge technology and expert guidance.
              </p>
              <a href="#contact" className="btn btn-secondary developer-cta" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.3)' }}>
                Visit our developer page
              </a>
            </div>
            <div className="developer-right">
              {devLinks.map((link) => (
                <a key={link.label} href={link.href} className="developer-link">
                  <span className="developer-link-icon">{link.icon}</span>
                  <span className="developer-link-label">{link.label}</span>
                  <svg className="developer-link-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Power Your Next Project — 3-column cards */}
      <div className="container">
        <div className="projects-section animate-on-scroll">
          <h3 className="projects-title">Power your next project</h3>
          <div className="projects-grid">
            {projectCards.map((card) => (
              <a key={card.title} href="#contact" className="project-card">
                <div className="project-card-image">
                  <img src={card.image} alt={card.title} loading="lazy" />
                </div>
                <h4 className="project-card-title">{card.title}</h4>
                <p className="project-card-desc">{card.desc}</p>
                <span className="arrow-link">
                  Learn more
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .developer {
          background: var(--color-bg);
        }

        .developer-dark {
          background: var(--color-bg-dark);
          padding: var(--spacing-5xl) 0;
        }

        .developer-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-4xl);
          align-items: center;
        }

        .developer-label {
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.4);
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: var(--spacing-md);
          display: block;
        }

        .developer-title {
          font-size: clamp(2rem, 4vw, 2.75rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: var(--spacing-md);
        }

        .developer-accent {
          color: var(--color-primary-light, #4a6cf7);
        }

        .developer-desc {
          font-size: var(--font-size-sm);
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.6;
          margin-bottom: var(--spacing-xl);
        }

        .developer-right {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .developer-link {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg) var(--spacing-xl);
          background: rgba(255, 255, 255, 0.03);
          transition: background var(--transition-base);
        }

        .developer-link:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .developer-link:hover .developer-link-arrow {
          transform: translateX(4px);
          color: white;
        }

        .developer-link-icon {
          font-size: 1.25rem;
        }

        .developer-link-label {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: var(--font-size-base);
          color: var(--color-primary-light, #4a6cf7);
          flex: 1;
        }

        .developer-link-arrow {
          color: rgba(255, 255, 255, 0.3);
          transition: all var(--transition-base);
        }

        /* Power Your Next Project */
        .projects-section {
          padding: var(--spacing-5xl) 0;
        }

        .projects-title {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-2xl);
        }

        .projects-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl);
        }

        .project-card {
          display: block;
          transition: transform var(--transition-base);
        }

        .project-card:hover {
          transform: translateY(-4px);
        }

        .project-card-image {
          width: 100%;
          aspect-ratio: 16 / 10;
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--spacing-md);
          background: var(--color-bg-tertiary);
        }

        .project-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform var(--transition-slow);
        }

        .project-card:hover .project-card-image img {
          transform: scale(1.03);
        }

        .project-card-title {
          font-size: var(--font-size-base);
          font-weight: 700;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
        }

        .project-card-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: var(--spacing-md);
        }

        @media (max-width: 1024px) {
          .developer-grid {
            grid-template-columns: 1fr;
            gap: var(--spacing-2xl);
          }
        }

        @media (max-width: 768px) {
          .projects-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: var(--spacing-md);
            scrollbar-width: none;
          }
          .projects-grid::-webkit-scrollbar { display: none; }
          .project-card {
            min-width: 80vw;
            scroll-snap-align: center;
            flex-shrink: 0;
          }
          .developer-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  )
}
