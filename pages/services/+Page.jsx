import { useEffect, useRef } from 'react'

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

  const services = [
    {
      icon: '\u{1F4BB}',
      title: 'Web Development',
      desc: 'Build enterprise-grade web applications with modern frameworks like React, Next.js, and Vue. From single-page apps to complex platforms.',
      features: ['Custom Web Applications', 'E-commerce Platforms', 'Progressive Web Apps', 'CMS Development'],
    },
    {
      icon: '\u{1F9E0}',
      title: 'AI & Machine Learning',
      desc: 'Integrate cutting-edge AI capabilities into your business processes. From predictive analytics to natural language processing.',
      features: ['Custom AI Models', 'Chatbots & Virtual Assistants', 'Computer Vision', 'Predictive Analytics'],
    },
    {
      icon: '\u{1F4F1}',
      title: 'Mobile Development',
      desc: 'Native and cross-platform mobile apps that deliver exceptional user experiences across iOS and Android.',
      features: ['React Native', 'Flutter', 'Kotlin Multiplatform', 'iOS & Android Native'],
    },
    {
      icon: '\u{2601}\u{FE0F}',
      title: 'Cloud Solutions',
      desc: 'Scalable cloud infrastructure and migration services. Optimize your operations with AWS, Azure, and Google Cloud.',
      features: ['Cloud Migration', 'DevOps & CI/CD', 'Microservices Architecture', 'Serverless Solutions'],
    },
    {
      icon: '\u{1F3A8}',
      title: 'UX/UI Design',
      desc: 'Human-centered design that drives engagement and conversion. Research-backed interfaces that users love.',
      features: ['User Research', 'Interface Design', 'Design Systems', 'Prototyping & Testing'],
    },
    {
      icon: '\u{1F4CA}',
      title: 'ERP Solutions',
      desc: 'Enterprise resource planning with Odoo and custom solutions. Streamline your operations end-to-end.',
      features: ['Odoo Implementation', 'Custom ERP', 'Business Process Automation', 'System Integration'],
    },
  ]

  return (
    <div className="page services-page" ref={sectionRef}>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content animate-on-scroll">
            <span className="page-label">OUR SERVICES</span>
            <h1 className="page-title">
              What we <span className="accent">build</span>
            </h1>
            <p className="page-desc">
              End-to-end technology solutions tailored to your business needs.
              From concept to deployment, we deliver excellence.
            </p>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="container">
        <div className="services-full-grid">
          {services.map((service, i) => (
            <div key={service.title} className={`service-full-card animate-on-scroll delay-${i % 3}`}>
              <span className="service-full-icon">{service.icon}</span>
              <h2 className="service-full-title">{service.title}</h2>
              <p className="service-full-desc">{service.desc}</p>
              <ul className="service-full-features">
                {service.features.map((f) => (
                  <li key={f}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--color-primary)" strokeWidth="2.5">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/contact" className="arrow-link">
                Get started
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .services-full-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl);
          padding: var(--spacing-5xl) 0;
        }

        .service-full-card {
          padding: var(--spacing-2xl);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-surface);
          transition: all var(--transition-base);
        }

        .service-full-card:hover {
          border-color: var(--color-primary);
          box-shadow: var(--shadow-card-hover);
          transform: translateY(-4px);
        }

        .service-full-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: var(--spacing-lg);
        }

        .service-full-title {
          font-size: var(--font-size-xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
        }

        .service-full-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: var(--spacing-lg);
        }

        .service-full-features {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-xl);
        }

        .service-full-features li {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
        }

        @media (max-width: 1024px) {
          .services-full-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .services-full-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
