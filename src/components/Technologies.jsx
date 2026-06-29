import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useScrollReveal from '../hooks/useScrollReveal'

export default function Technologies() {
  const [activeTab, setActiveTab] = useState('solutions')
  const [activeBrand, setActiveBrand] = useState('enterprise')
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef, { threshold: 0.1 })

  const tabs = [
    { key: 'solutions', label: 'Solutions' },
    { key: 'platforms', label: 'Platforms' },
    { key: 'industries', label: 'Industries' },
  ]

  const tabData = {
    solutions: [
      { name: 'Web Development', desc: 'Enterprise-grade web applications', icon: '💻' },
      { name: 'AI Solutions', desc: 'Machine learning & automation', icon: '🧠' },
      { name: 'Mobile Apps', desc: 'Cross-platform development', icon: '📱' },
      { name: 'Cloud Services', desc: 'Scalable cloud infrastructure', icon: '☁️' },
      { name: 'Cybersecurity', desc: 'End-to-end security solutions', icon: '🛡️' },
      { name: 'ERP Systems', desc: 'Odoo & enterprise planning', icon: '📊' },
    ],
    platforms: [
      { name: 'React', desc: 'Modern UI framework', icon: '⚛️' },
      { name: 'Node.js', desc: 'JavaScript runtime', icon: '🟢' },
      { name: 'Python', desc: 'AI & backend development', icon: '🐍' },
      { name: 'Flutter', desc: 'Cross-platform UI toolkit', icon: '🦋' },
      { name: 'Kubernetes', desc: 'Container orchestration', icon: '☸️' },
      { name: 'AWS', desc: 'Amazon cloud services', icon: '🔶' },
    ],
    industries: [
      { name: 'FinTech', desc: 'Financial technology solutions', icon: '🏦' },
      { name: 'Healthcare', desc: 'Medical & health platforms', icon: '🏥' },
      { name: 'E-commerce', desc: 'Online retail solutions', icon: '🛒' },
      { name: 'Education', desc: 'EdTech & learning platforms', icon: '📚' },
      { name: 'Logistics', desc: 'Supply chain & delivery', icon: '🚚' },
      { name: 'Real Estate', desc: 'PropTech solutions', icon: '🏗️' },
    ],
  }

  const brands = {
    enterprise: {
      color: '#3253DC',
      bgColor: '#3253DC',
      label: 'Enterprise Solutions',
      title: 'Enterprise',
      description: 'Scalable platforms that power mission-critical operations for businesses across 5+ countries.',
      cta: 'Learn about Enterprise',
    },
    startup: {
      color: '#E11927',
      bgColor: '#E11927',
      label: 'Startup Accelerator',
      title: 'Startup',
      description: 'Rapid MVP development, lean architecture, and growth-ready infrastructure for startups.',
      cta: 'Learn about Startups',
    },
  }

  const currentBrand = brands[activeBrand]

  const productGrid = [
    { name: 'Web Apps', icon: '🖥️' },
    { name: 'Mobile', icon: '📱' },
    { name: 'IoT', icon: '🔌' },
    { name: 'DevOps', icon: '⚙️' },
    { name: 'Data & AI', icon: '🤖' },
    { name: 'Design', icon: '🎨' },
    { name: 'Consulting', icon: '💡' },
  ]

  return (
    <section className="tech section" id="technologies" ref={sectionRef}>
      <div className="container">
        {/* Tab Toggle Row */}
        <div className="tech-tab-row animate-on-scroll">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`tech-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 3-Column Solution Grid - AnimatePresence */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="tech-solutions-grid animate-on-scroll delay-1"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            {tabData[activeTab]?.map((item) => (
              <a key={item.name} href="#contact" className="tech-solution-item">
                <div className="tech-solution-left">
                  <span className="tech-solution-icon">{item.icon}</span>
                  <div>
                    <span className="tech-solution-name">{item.name}</span>
                    <span className="tech-solution-desc">{item.desc}</span>
                  </div>
                </div>
                <svg className="tech-solution-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Brand Toggle Section — Qualcomm Snapdragon/Dragonwing style */}
        <div className="brand-section animate-on-scroll">
          <h3 className="brand-section-title">Explore our service tiers</h3>
          <div className="brand-toggle">
            <button
              className={`brand-toggle-btn ${activeBrand === 'enterprise' ? 'active' : ''}`}
              style={{ '--brand-color': brands.enterprise.bgColor }}
              onClick={() => setActiveBrand('enterprise')}
            >
              Enterprise
            </button>
            <button
              className={`brand-toggle-btn ${activeBrand === 'startup' ? 'active' : ''}`}
              style={{ '--brand-color': brands.startup.bgColor }}
              onClick={() => setActiveBrand('startup')}
            >
              Startup
            </button>
          </div>

          {/* Featured Brand Card — AnimatePresence */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeBrand}
              className="brand-showcase"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="brand-card"
                style={{ background: currentBrand.bgColor }}
              >
                <span className="brand-card-label">{currentBrand.label}</span>
                <h3 className="brand-card-title">{currentBrand.title}</h3>
                <p className="brand-card-desc">{currentBrand.description}</p>
                <a href="#contact" className="brand-card-cta">
                  {currentBrand.cta}
                </a>
              </div>
              <div className="brand-card-image">
                <img
                  src={activeBrand === 'enterprise' ? '/service-ai.png' : '/service-mobile.png'}
                  alt={currentBrand.title}
                  loading="lazy"
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Product Grid — Qualcomm XR/Gaming/Compute/Wearables style */}
          <div className="product-grid">
            {productGrid.map((item) => (
              <a key={item.name} href="#contact" className="product-grid-item">
                <span className="product-grid-icon">{item.icon}</span>
                <span className="product-grid-name">{item.name}</span>
                <svg className="product-grid-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .tech {
          background: var(--color-bg);
          padding: var(--spacing-5xl) 0;
        }

        /* Tab Toggle Row */
        .tech-tab-row {
          display: flex;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-2xl);
        }

        .tech-tab {
          padding: 0.75rem 1.75rem;
          font-family: var(--font-heading);
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-muted);
          background: transparent;
          border: 1.5px solid var(--color-border-strong);
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .tech-tab:hover {
          border-color: var(--color-text-secondary);
          color: var(--color-text-primary);
        }

        .tech-tab.active {
          background: var(--color-primary);
          color: white;
          border-color: var(--color-primary);
        }

        /* Solutions Grid */
        .tech-solutions-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
          margin-bottom: var(--spacing-5xl);
        }

        .tech-solution-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: var(--spacing-md);
          padding: var(--spacing-xl) var(--spacing-lg);
          background: var(--color-surface);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .tech-solution-item:hover {
          background: var(--color-bg-secondary);
        }

        .tech-solution-item:hover .tech-solution-arrow {
          transform: translateX(4px);
          color: var(--color-primary);
        }

        .tech-solution-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
        }

        .tech-solution-icon {
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .tech-solution-name {
          display: block;
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
        }

        .tech-solution-desc {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          margin-top: 2px;
        }

        .tech-solution-arrow {
          flex-shrink: 0;
          color: var(--color-text-light);
          transition: all var(--transition-base);
        }

        /* Brand Section */
        .brand-section {
          margin-top: var(--spacing-xl);
        }

        .brand-section-title {
          font-size: var(--font-size-xl);
          font-weight: 700;
          text-align: center;
          margin-bottom: var(--spacing-lg);
          color: var(--color-text-primary);
        }

        .brand-toggle {
          display: flex;
          justify-content: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-2xl);
        }

        .brand-toggle-btn {
          padding: 0.625rem 2rem;
          font-family: var(--font-heading);
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-muted);
          background: transparent;
          border: 1.5px solid var(--color-border-strong);
          border-radius: var(--radius-full);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .brand-toggle-btn.active {
          background: var(--brand-color);
          color: white;
          border-color: var(--brand-color);
        }

        .brand-toggle-btn:hover:not(.active) {
          border-color: var(--color-text-secondary);
          color: var(--color-text-primary);
        }

        /* Brand Showcase */
        .brand-showcase {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-md);
          border-radius: var(--radius-2xl);
          overflow: hidden;
        }

        .brand-card {
          padding: var(--spacing-3xl);
          border-radius: var(--radius-2xl);
          display: flex;
          flex-direction: column;
          justify-content: flex-end;
          min-height: 320px;
          position: relative;
        }

        .brand-card-label {
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: rgba(255, 255, 255, 0.6);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: auto;
        }

        .brand-card-title {
          font-size: clamp(2rem, 4vw, 3rem);
          font-weight: 900;
          color: white;
          letter-spacing: -0.03em;
          margin-bottom: var(--spacing-md);
        }

        .brand-card-desc {
          font-size: var(--font-size-sm);
          color: rgba(255, 255, 255, 0.8);
          line-height: 1.6;
          margin-bottom: var(--spacing-xl);
          max-width: 320px;
        }

        .brand-card-cta {
          display: inline-flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 0.5rem 1.25rem;
          background: rgba(255, 255, 255, 0.15);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: var(--radius-full);
          font-family: var(--font-heading);
          font-size: var(--font-size-sm);
          font-weight: 600;
          transition: all var(--transition-base);
          width: fit-content;
        }

        .brand-card-cta:hover {
          background: rgba(255, 255, 255, 0.25);
        }

        .brand-card-image {
          border-radius: var(--radius-2xl);
          overflow: hidden;
          background: var(--color-bg-tertiary);
        }

        .brand-card-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        /* Product Grid — Qualcomm XR/Gaming/Compute style */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: 1px;
          background: var(--color-border);
          border-radius: var(--radius-xl);
          overflow: hidden;
        }

        .product-grid-item {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: var(--spacing-lg) var(--spacing-md);
          background: var(--color-surface);
          transition: all var(--transition-base);
          cursor: pointer;
        }

        .product-grid-item:hover {
          background: var(--color-bg-secondary);
        }

        .product-grid-item:hover .product-grid-arrow {
          transform: translateX(4px);
          color: var(--color-primary);
        }

        .product-grid-icon {
          font-size: 1.1rem;
        }

        .product-grid-name {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
          flex: 1;
        }

        .product-grid-arrow {
          color: var(--color-text-light);
          transition: all var(--transition-base);
          flex-shrink: 0;
        }

        @media (max-width: 1024px) {
          .tech-solutions-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .tech-solutions-grid {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            -webkit-overflow-scrolling: touch;
            gap: 0;
            background: transparent;
            scrollbar-width: none;
          }
          .tech-solutions-grid::-webkit-scrollbar { display: none; }
          .tech-solution-item {
            min-width: 75vw;
            scroll-snap-align: center;
            flex-shrink: 0;
            border-radius: var(--radius-lg);
            border: 1px solid var(--color-border);
            margin-right: var(--spacing-sm);
          }
          .brand-showcase {
            grid-template-columns: 1fr;
          }
          .brand-card {
            min-height: 200px;
          }
          .brand-card-image {
            min-height: 160px;
            max-height: 200px;
          }
          .product-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .tech-tab-row {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </section>
  )
}
