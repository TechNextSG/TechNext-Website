export default function CorporateStructure() {
    const companies = [
        {
            logo: '🎮',
            name: 'GAME BIZ',
            type: 'B2B, B2C',
            category: 'CO & PUBLISHING GAME DEV',
            description: 'Game development and publishing solutions'
        },
        {
            logo: '📊',
            name: 'lever8',
            type: 'B2B',
            category: 'MARKETING CONSULTING',
            description: 'Go to market strategy + Global / Local execution'
        },
        {
            logo: '🔗',
            name: 'CONNEX',
            type: 'B2B, B2C',
            category: 'BPO',
            description: 'Cost-Effective Business Process Outsourcing'
        }
    ]

    const features = [
        {
            icon: '🤖',
            color: '#8b5cf6',
            title: 'AI-Powered Features & Analytics'
        },
        {
            icon: '📋',
            color: '#06b6d4',
            title: 'Order, Quotation & Payment Management'
        },
        {
            icon: '📈',
            color: '#10b981',
            title: 'Task & Progress Management'
        }
    ]

    return (
        <section className="corporate section" id="about">
            <div className="container">
                <div className="section-label">[ Business Model ]</div>
                <h2 className="corporate-title">
                    CORPORATE<br />
                    <span className="title-highlight">STRUCTURE</span>
                    <span className="title-dot">.</span>
                </h2>

                <div className="corporate-layout">
                    {/* Left: Company Cards */}
                    <div className="company-cards">
                        {companies.map((company, index) => (
                            <div key={company.name} className="company-card glass-card" style={{ '--delay': `${index * 0.1}s` }}>
                                <div className="company-header">
                                    <div className="company-logo">{company.logo}</div>
                                    <span className="company-name">{company.name}</span>
                                    <span className="company-type">{company.type}</span>
                                </div>
                                <div className="company-category">{company.category}</div>
                                <p className="company-desc">{company.description}</p>

                                {/* Flow connector */}
                                <div className="flow-connector">
                                    <div className="connector-line"></div>
                                    <div className="connector-label">Database</div>
                                    <div className="connector-arrow">▶</div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Center: Main Hub */}
                    <div className="central-hub">
                        <div className="hub-circle">
                            <div className="hub-inner">
                                <span className="hub-text">GL</span>
                            </div>
                            <div className="hub-ring ring-1"></div>
                            <div className="hub-ring ring-2"></div>
                        </div>
                    </div>

                    {/* Right: Feature Cards */}
                    <div className="feature-cards">
                        {features.map((feature, index) => (
                            <div
                                key={feature.title}
                                className="feature-card glass-card"
                                style={{ '--delay': `${index * 0.15}s`, '--accent': feature.color }}
                            >
                                <div className="feature-icon" style={{ background: `linear-gradient(135deg, ${feature.color}20, ${feature.color}40)` }}>
                                    {feature.icon}
                                </div>
                                <span className="feature-title">{feature.title}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
        .corporate {
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
        }

        .corporate::after {
          content: '';
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 50%, rgba(14, 165, 233, 0.05) 0%, transparent 65%);
          pointer-events: none;
          z-index: 0;
        }

        .container {
          position: relative;
          z-index: 1;
        }

        .section-label {
          text-align: center;
          font-size: var(--font-size-sm);
          color: var(--color-primary);
          font-weight: 500;
          margin-bottom: var(--spacing-md);
          letter-spacing: 0.1em;
        }

        .corporate-title {
          text-align: center;
          font-size: var(--font-size-5xl);
          font-weight: 800;
          line-height: 1.1;
          margin-bottom: var(--spacing-3xl);
          color: var(--color-text-primary);
        }

        .title-highlight {
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .title-dot {
          color: #ef4444;
        }

        .corporate-layout {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          gap: var(--spacing-2xl);
          align-items: center;
        }

        /* Company Cards */
        .company-cards {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .company-card {
          position: relative;
          padding: var(--spacing-lg);
          animation: fadeInLeft 0.6s ease forwards;
          animation-delay: var(--delay);
          opacity: 0;
        }

        @keyframes fadeInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .company-header {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .company-logo {
          font-size: 1.5rem;
        }

        .company-name {
          font-family: var(--font-heading);
          font-weight: 700;
          font-size: var(--font-size-lg);
          color: var(--color-text-primary);
        }

        .company-type {
          margin-left: auto;
          padding: var(--spacing-xs) var(--spacing-sm);
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-full);
          font-size: var(--font-size-xs);
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .company-category {
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-primary);
          margin-bottom: var(--spacing-xs);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .company-desc {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
        }

        /* Flow Connectors */
        .flow-connector {
          position: absolute;
          right: -80px;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
          gap: var(--spacing-xs);
        }

        .connector-line {
          width: 40px;
          height: 2px;
          background: repeating-linear-gradient(
            90deg,
            var(--color-text-muted) 0px,
            var(--color-text-muted) 4px,
            transparent 4px,
            transparent 8px
          );
          background-size: 8px 2px;
          animation: dashMove 2s linear infinite;
        }

        @keyframes dashMove {
          from {
            background-position: 0 0;
          }
          to {
            background-position: 8px 0;
          }
        }

        .connector-label {
          font-size: var(--font-size-xs);
          color: var(--color-text-muted);
          white-space: nowrap;
        }

        .connector-arrow {
          color: var(--color-primary);
          font-size: 0.7rem;
        }

        /* Central Hub */
        .central-hub {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--spacing-2xl);
        }

        .hub-circle {
          position: relative;
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hub-inner {
          width: 80px;
          height: 80px;
          background: var(--gradient-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
          box-shadow: 0 0 40px rgba(14, 165, 233, 0.3);
          transition: box-shadow var(--transition-base), transform var(--transition-base);
        }

        .hub-circle:hover .hub-inner {
          box-shadow: 0 0 60px rgba(14, 165, 233, 0.6), 0 0 100px rgba(14, 165, 233, 0.3);
          transform: scale(1.05);
        }

        .hub-text {
          font-family: var(--font-heading);
          font-size: var(--font-size-2xl);
          font-weight: 800;
          color: white;
        }

        .hub-ring {
          position: absolute;
          border-radius: 50%;
          border: 2px solid var(--color-primary);
          opacity: 0.3;
          animation: pulse-ring 2s ease-in-out infinite;
        }

        .ring-1 {
          width: 100px;
          height: 100px;
          animation-delay: 0s;
        }

        .ring-2 {
          width: 120px;
          height: 120px;
          animation-delay: 0.5s;
        }

        @keyframes pulse-ring {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.1;
          }
        }

        /* Feature Cards */
        .feature-cards {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-md);
        }

        .feature-card {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          padding: var(--spacing-lg);
          animation: fadeInRight 0.6s ease forwards;
          animation-delay: var(--delay);
          opacity: 0;
          transition: all var(--transition-base);
        }

        .feature-card:hover {
          transform: translateX(-8px);
          box-shadow: var(--shadow-lg), 0 0 20px color-mix(in srgb, var(--accent) 20%, transparent);
        }

        @keyframes fadeInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .feature-icon {
          width: 48px;
          height: 48px;
          border-radius: var(--radius-lg);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          flex-shrink: 0;
        }

        .feature-title {
          font-family: var(--font-heading);
          font-weight: 600;
          font-size: var(--font-size-base);
          color: var(--color-text-primary);
        }

        @media (max-width: 1024px) {
          .corporate-layout {
            grid-template-columns: 1fr;
            gap: var(--spacing-3xl);
          }

          .flow-connector {
            display: none;
          }

          .central-hub {
            order: -1;
          }

          .corporate-title {
            font-size: var(--font-size-4xl);
          }
        }

        @media (max-width: 640px) {
          .corporate-title {
            font-size: var(--font-size-3xl);
          }
        }
      `}</style>
        </section>
    )
}
