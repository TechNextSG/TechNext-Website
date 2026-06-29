import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'

export default function WhyChooseUs() {
  const sectionRef = useRef(null)
  const [openFeature, setOpenFeature] = useState(0)
  useScrollReveal(sectionRef, { threshold: 0.15 })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  })
  const bgPosition = useTransform(scrollYProgress, [0, 1], ['0% 0%', '100% 100%'])

  const features = [
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
      title: 'Expert Team',
      description: '5+ skilled engineers across mobile, web, AI, and cloud technologies'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      ),
      title: 'Global Reach',
      description: 'Serving clients across 5+ countries from offices in Singapore, Vietnam & Philippines'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5z" />
          <path d="M2 17l10 5 10-5" />
          <path d="M2 12l10 5 10-5" />
        </svg>
      ),
      title: 'Full Stack',
      description: 'End-to-end development from design and prototyping to deployment and scaling'
    },
    {
      icon: (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <path d="M22 4L12 14.01l-3-3" />
        </svg>
      ),
      title: 'Proven Track Record',
      description: '10+ successful projects with a 4.9/5 client satisfaction rating'
    },
  ]

  return (
    <section className="why-us" ref={sectionRef}>
      <div className="container">
        <motion.div className="why-us-inner" style={{ backgroundPosition: bgPosition, backgroundSize: '200% 200%' }}>
          <div className="why-us-left animate-on-scroll">
            <span className="why-us-label">Why TechNext</span>
            <h2 className="why-us-title">A new era of digital excellence</h2>
            <p className="why-us-desc">
              We combine deep technical expertise with strategic thinking to deliver
              solutions that transform businesses and create lasting competitive advantages.
            </p>
            <a href="#contact" className="btn btn-primary btn-lg why-us-cta">
              Learn more
            </a>
          </div>
          <div className="why-us-right">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                role="button"
                tabIndex={0}
                className={`why-us-feature animate-on-scroll delay-${index + 1} ${openFeature === index ? 'why-us-feature--open' : ''}`}
                onClick={() => {
                  if (window.innerWidth <= 768) {
                    setOpenFeature(openFeature === index ? -1 : index)
                  } else {
                    window.location.hash = 'contact'
                  }
                }}
                style={{ cursor: 'pointer' }}
              >
                <div className="why-us-feature-left">
                  <span className="why-us-feature-icon">{feature.icon}</span>
                  <div>
                    <span className="why-us-feature-title">{feature.title}</span>
                    <span className="why-us-feature-desc">{feature.description}</span>
                  </div>
                </div>
                <svg className="why-us-feature-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        .why-us {
          padding: var(--spacing-5xl) 0;
        }

        .why-us-inner {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: var(--spacing-3xl);
          background: var(--gradient-dark);
          border-radius: var(--radius-2xl);
          overflow: hidden;
          padding: var(--spacing-3xl);
          min-height: 420px;
        }

        .why-us-left {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .why-us-label {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.5);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--spacing-md);
        }

        .why-us-title {
          font-size: clamp(2rem, 3.5vw, 3rem);
          font-weight: 900;
          color: white;
          line-height: 1.1;
          letter-spacing: -0.03em;
          margin-bottom: var(--spacing-lg);
        }

        .why-us-desc {
          font-size: var(--font-size-base);
          color: rgba(255, 255, 255, 0.6);
          line-height: 1.7;
          margin-bottom: var(--spacing-2xl);
          max-width: 400px;
        }

        .why-us-cta {
          align-self: flex-start;
        }

        .why-us-right {
          display: flex;
          flex-direction: column;
          gap: 1px;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .why-us-feature {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-md);
          padding: var(--spacing-xl) var(--spacing-lg);
          background: rgba(255, 255, 255, 0.04);
          transition: background var(--transition-base);
          cursor: pointer;
        }

        .why-us-feature:hover {
          background: rgba(255, 255, 255, 0.08);
        }

        .why-us-feature:hover .why-us-feature-arrow {
          transform: translateX(4px);
          color: white;
        }

        .why-us-feature-left {
          display: flex;
          align-items: flex-start;
          gap: var(--spacing-md);
        }

        .why-us-feature-icon {
          flex-shrink: 0;
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.08);
          border-radius: var(--radius-lg);
          color: white;
        }

        .why-us-feature-title {
          display: block;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: var(--font-size-base);
          color: white;
          margin-bottom: 4px;
        }

        .why-us-feature-desc {
          display: block;
          font-size: var(--font-size-xs);
          color: rgba(255, 255, 255, 0.5);
          line-height: 1.5;
        }

        .why-us-feature-arrow {
          flex-shrink: 0;
          color: rgba(255, 255, 255, 0.3);
          transition: all var(--transition-base);
        }

        @media (max-width: 1024px) {
          .why-us-inner {
            grid-template-columns: 1fr;
            gap: var(--spacing-2xl);
          }
        }

        @media (max-width: 768px) {
          .why-us-inner {
            padding: var(--spacing-xl) var(--spacing-lg);
            min-height: auto;
            gap: var(--spacing-lg);
          }
          .why-us-title {
            font-size: 1.5rem;
          }
          .why-us-desc {
            font-size: var(--font-size-sm);
            margin-bottom: var(--spacing-md);
          }
          .why-us-feature-desc {
            max-height: 0;
            overflow: hidden;
            opacity: 0;
            transition: max-height 0.3s ease, opacity 0.3s ease;
          }
          .why-us-feature--open .why-us-feature-desc {
            max-height: 100px;
            opacity: 1;
          }
          .why-us-feature-arrow {
            transform: rotate(90deg);
            transition: transform 0.3s ease;
          }
          .why-us-feature--open .why-us-feature-arrow {
            transform: rotate(-90deg);
          }
        }
      `}</style>
    </section>
  )
}
