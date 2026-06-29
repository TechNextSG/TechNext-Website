import { useEffect, useRef, useState } from 'react'
import useScrollReveal from '../hooks/useScrollReveal'

function useCountUp(target, suffix = '', duration = 2000, startCounting = false) {
  const [display, setDisplay] = useState(`0${suffix}`)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!startCounting || hasAnimated.current) return
    hasAnimated.current = true
    const startTime = performance.now()
    const isDecimal = String(target).includes('.')
    const step = (timestamp) => {
      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = isDecimal
        ? (eased * target).toFixed(1)
        : Math.floor(eased * target)
      setDisplay(`${current}${suffix}`)
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, suffix, duration, startCounting])

  return display
}

export default function Stats() {
  const sectionRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)
  useScrollReveal(sectionRef, { threshold: 0.2 })

  // Riêng cho Stats: detect visibility để trigger count-up
  useEffect(() => {
    const section = sectionRef.current
    if (!section) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setIsVisible(true) },
      { threshold: 0.2 }
    )
    observer.observe(section)
    return () => observer.disconnect()
  }, [])

  const yearsValue = useCountUp(4, '+', 1200, isVisible)
  const projectsValue = useCountUp(10, '+', 1800, isVisible)
  const clientsValue = useCountUp(10, '+', 1600, isVisible)
  const ratingValue = useCountUp(4.9, '/5', 2000, isVisible)

  const stats = [
    { value: yearsValue, label: 'Years of Experience', icon: '📅' },
    { value: projectsValue, label: 'Projects Delivered', icon: '🚀' },
    { value: clientsValue, label: 'Happy Clients', icon: '🤝' },
    { value: ratingValue, label: 'Client Rating', icon: '⭐' },
  ]

  return (
    <section className="stats section section--grey" id="about" ref={sectionRef}>
      <div className="container">
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`stat-item animate-on-scroll delay-${index + 1}`}
            >
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .stats {
          padding: var(--spacing-4xl) 0;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--spacing-xl);
        }

        .stat-item {
          text-align: center;
          padding: var(--spacing-2xl) var(--spacing-lg);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          transition: all var(--transition-base);
        }

        .stat-item:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-md);
          transform: translateY(-2px);
        }

        .stat-value {
          display: block;
          font-family: var(--font-heading);
          font-size: var(--font-size-5xl);
          font-weight: 900;
          color: var(--color-text-primary);
          letter-spacing: -0.04em;
          line-height: 1;
          margin-bottom: var(--spacing-sm);
        }

        .stat-label {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        @media (max-width: 1024px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
          }
          .stat-item {
            padding: var(--spacing-lg) var(--spacing-sm);
          }
          .stat-value {
            font-size: var(--font-size-3xl);
          }
        }

        @media (max-width: 480px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: var(--spacing-md);
          }
          .stat-item {
            padding: var(--spacing-lg) var(--spacing-sm);
          }
          .stat-value {
            font-size: var(--font-size-3xl);
          }
        }
      `}</style>
    </section>
  )
}
