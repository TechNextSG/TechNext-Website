import { useRef } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

export default function OnTrend() {
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, { threshold: 0.15 })

  const articles = [
    {
      image: '/service-ai.png',
      tag: 'TECH BLOG',
      title: 'How AI Is Reshaping Enterprise Software Development in 2026',
      date: 'Mar 10, 2026',
      readTime: '5 min read'
    },
    {
      image: '/service-web.png',
      tag: 'INSIGHTS',
      title: 'Building Scalable Web Platforms: Lessons from 10+ Projects',
      date: 'Mar 5, 2026',
      readTime: '4 min read'
    },
    {
      image: '/service-mobile.png',
      tag: 'CASE STUDY',
      title: 'Mobile-First Strategy: Driving Digital Transformation Across Asia',
      date: 'Feb 28, 2026',
      readTime: '6 min read'
    },
  ]

  return (
    <section className="ontrend section" ref={sectionRef}>
      <div className="container">
        <div className="ontrend-header animate-on-scroll">
          <div className="ontrend-left">
            <h2 className="ontrend-title">
              On Trend.{' '}
              <span className="line2">Onward.</span>{' '}
              <span className="accent-red">OnTech.</span>
            </h2>
          </div>
          <div className="ontrend-right">
            <p className="ontrend-desc">
              Breakthrough innovations, real-world technology insights, and thought leadership
              from voices across TechNext.
            </p>
            <a href="#" className="btn btn-secondary ontrend-cta">Learn more</a>
          </div>
        </div>

        <div className="ontrend-featured animate-on-scroll delay-1">
          <div className="ontrend-main-article">
            <div className="ontrend-main-image">
              <img src="/blog-featured.png" alt="Featured article" loading="lazy" />
            </div>
          </div>
          <div className="ontrend-sidebar">
            <div className="ontrend-sidebar-tag">{articles[0].tag}</div>
            <h3 className="ontrend-sidebar-title">{articles[0].title}</h3>
            <p className="ontrend-sidebar-meta">{articles[0].date} | {articles[0].readTime}</p>
            <div className="ontrend-nav">
              <button className="ontrend-nav-btn" aria-label="Previous">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
              </button>
              <span className="ontrend-nav-count">More articles</span>
              <button className="ontrend-nav-btn" aria-label="Next">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .ontrend {
          background: var(--color-bg);
          padding: var(--spacing-5xl) 0;
        }

        .ontrend-header {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-3xl);
          align-items: end;
          margin-bottom: var(--spacing-3xl);
        }

        .ontrend-title {
          font-size: clamp(2.5rem, 5vw, 3.5rem);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -0.04em;
          color: var(--color-text-primary);
        }

        .ontrend-title .line2 {
          display: block;
        }

        .ontrend-title .accent-red {
          color: var(--color-red, #E11927);
        }

        .ontrend-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: var(--spacing-lg);
        }

        .ontrend-cta {
          width: fit-content;
        }

        /* Featured Article Layout */
        .ontrend-featured {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--spacing-xl);
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }

        .ontrend-main-article {
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--color-bg-tertiary);
        }

        .ontrend-main-image {
          width: 100%;
          height: 100%;
          min-height: 350px;
        }

        .ontrend-main-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ontrend-sidebar {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: var(--spacing-xl) 0;
        }

        .ontrend-sidebar-tag {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-red, #E11927);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--spacing-md);
        }

        .ontrend-sidebar-title {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.25;
          margin-bottom: var(--spacing-md);
        }

        .ontrend-sidebar-meta {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-2xl);
        }

        .ontrend-nav {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .ontrend-nav-btn {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          transition: all var(--transition-fast);
          background: transparent;
        }

        .ontrend-nav-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .ontrend-nav-count {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }

        @media (max-width: 1024px) {
          .ontrend-header {
            grid-template-columns: 1fr;
            gap: var(--spacing-lg);
          }
        }

        @media (max-width: 768px) {
          .ontrend-featured {
            grid-template-columns: 1fr;
          }
          .ontrend-main-image {
            min-height: 240px;
          }
          .ontrend-title {
            font-size: 2rem;
          }
        }
      `}</style>
    </section>
  )
}
