import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, { threshold: 0.2 })

  const testimonials = [
    {
      quote: 'The team\'s technical expertise and professionalism exceeded our expectations. They delivered a robust enterprise solution that transformed our operations.',
      name: 'Sarah Johnson',
      role: 'VP of Engineering',
      company: 'E-commerce Platform'
    },
    {
      quote: 'TechNext delivered an outstanding mobile application that our users love. Their attention to detail and commitment to quality is remarkable.',
      name: 'Michael Chen',
      role: 'CTO',
      company: 'FinTech Startup'
    },
    {
      quote: 'Working with TechNext was a game-changer for our digital transformation. They brought innovative solutions and deep technical knowledge to every challenge.',
      name: 'Amanda Williams',
      role: 'Product Director',
      company: 'Healthcare Solutions'
    },
    {
      quote: 'Their AI and data analytics solutions helped us achieve a 40% improvement in operational efficiency. Truly a world-class technology partner.',
      name: 'David Park',
      role: 'Head of Innovation',
      company: 'Logistics Company'
    },
  ]

  const nextTestimonial = useCallback(() => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 400)
  }, [isAnimating, testimonials.length])

  const prevTestimonial = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
    setTimeout(() => setIsAnimating(false), 400)
  }

  useEffect(() => {
    const interval = setInterval(nextTestimonial, 6000)
    return () => clearInterval(interval)
  }, [nextTestimonial])

  const current = testimonials[currentIndex]

  return (
    <section className="testimonials section" id="testimonials" ref={sectionRef}>
      <div className="container">
        <h2 className="section-title animate-on-scroll">
          What our <span className="accent">clients say</span>
        </h2>

        <div className={`testimonial-card animate-on-scroll delay-1`}>
          <div className="testimonial-stars">
            {[...Array(5)].map((_, i) => (
              <svg key={i} className="testimonial-star" width="18" height="18" viewBox="0 0 24 24" fill="var(--color-primary)" stroke="none">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <div className="testimonial-quote-mark" aria-hidden="true">"</div>
          <AnimatePresence mode="wait">
            <motion.blockquote
              key={currentIndex}
              className="testimonial-quote"
              initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            >
              {current.quote}
            </motion.blockquote>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex + '-author'}
              className="testimonial-author"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="testimonial-avatar">
                {current.name.charAt(0)}
              </div>
              <div>
                <div className="testimonial-name">{current.name}</div>
                <div className="testimonial-role">{current.role}, {current.company}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="testimonial-nav">
            <button className="testimonial-arrow" onClick={prevTestimonial} aria-label="Previous testimonial">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="testimonial-dots">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  className={`testimonial-dot ${i === currentIndex ? 'active' : ''}`}
                  onClick={() => { setCurrentIndex(i) }}
                  aria-label={`Testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button className="testimonial-arrow" onClick={nextTestimonial} aria-label="Next testimonial">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .testimonials {
          background: var(--color-bg);
        }

        .testimonial-card {
          max-width: 720px;
          margin: 0 auto;
          text-align: center;
          padding: var(--spacing-3xl) var(--spacing-2xl);
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
        }

        .testimonial-stars {
          display: flex;
          justify-content: center;
          gap: 4px;
          margin-bottom: var(--spacing-lg);
        }

        .testimonial-star {
          filter: drop-shadow(0 1px 2px rgba(50, 83, 220, 0.3));
        }

        .testimonial-quote-mark {
          font-family: Georgia, serif;
          font-size: 5rem;
          line-height: 0.6;
          color: var(--color-primary);
          opacity: 0.2;
          margin-bottom: var(--spacing-md);
        }

        .testimonial-quote {
          font-size: var(--font-size-xl);
          font-weight: 500;
          line-height: 1.7;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-2xl);
          font-style: normal;
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .testimonial-quote.fading {
          opacity: 0.3;
          transform: translateY(4px);
        }

        .testimonial-author {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-2xl);
          transition: opacity 0.3s ease;
        }

        .testimonial-author.fading {
          opacity: 0.3;
        }

        .testimonial-avatar {
          width: 44px;
          height: 44px;
          background: var(--color-primary);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: var(--font-size-lg);
        }

        .testimonial-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
          text-align: left;
        }

        .testimonial-role {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          text-align: left;
        }

        .testimonial-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-lg);
        }

        .testimonial-arrow {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--color-border-strong);
          border-radius: 50%;
          color: var(--color-text-muted);
          transition: all var(--transition-fast);
          background: transparent;
        }

        .testimonial-arrow:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .testimonial-dots {
          display: flex;
          gap: var(--spacing-sm);
        }

        .testimonial-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--color-border-strong);
          padding: 0;
          transition: all var(--transition-fast);
          cursor: pointer;
        }

        .testimonial-dot.active {
          background: var(--color-primary);
          transform: scale(1.3);
        }

        @media (max-width: 768px) {
          .testimonial-card {
            padding: var(--spacing-2xl) var(--spacing-lg);
          }
          .testimonial-quote {
            font-size: var(--font-size-base);
          }
        }
      `}</style>
    </section>
  )
}
