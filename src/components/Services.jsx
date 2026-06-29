import { motion } from 'framer-motion'
import { openBookingModal } from './BookingModal'
import { useT } from '../i18n/I18nProvider'

const SERVICES = [
  { color: 'yellow',   nameKey: 'svc.ai.name',   descKey: 'svc.ai.desc',   tags: ['LangChain', 'CrewAI', 'Claude'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="4" width="16" height="16" rx="3" /><rect x="9" y="9" width="6" height="6" /><line x1="9" y1="4" x2="9" y2="2" /><line x1="15" y1="4" x2="15" y2="2" /><line x1="9" y1="22" x2="9" y2="20" /><line x1="15" y1="22" x2="15" y2="20" /><line x1="4" y1="9" x2="2" y2="9" /><line x1="4" y1="15" x2="2" y2="15" /><line x1="22" y1="9" x2="20" y2="9" /><line x1="22" y1="15" x2="20" y2="15" /></svg>
  },
  { color: 'blue',     nameKey: 'svc.rag.name',  descKey: 'svc.rag.desc',  tags: ['Vector DB', 'Embeddings', 'LLMs'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></svg>
  },
  { color: 'pink',     nameKey: 'svc.conv.name', descKey: 'svc.conv.desc', tags: ['NLP', 'Multilingual', 'WhatsApp'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
  },
  { color: 'lavender', nameKey: 'svc.odoo.name', descKey: 'svc.odoo.desc', tags: ['Odoo', 'ERP', 'Automation'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3" /><path d="M3 5v14c0 1.66 4.03 3 9 3s9-1.34 9-3V5" /><path d="M3 12c0 1.66 4.03 3 9 3s9-1.34 9-3" /></svg>
  },
  { color: 'green',    nameKey: 'svc.web.name',  descKey: 'svc.web.desc',  tags: ['React', 'KMP', 'SwiftUI'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
  },
  { color: 'peach',    nameKey: 'svc.cyber.name', descKey: 'svc.cyber.desc', tags: ['Cloud', 'IaC', 'Security'],
    icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
  },
]

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

const cardContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

const cardItem = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function Services() {
  const t = useT()
  return (
    <section id="services" className="services-section">
      <div className="container">
        <motion.div
          className="services-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <div className="section-label section-label-blue">{t('svc.label')}</div>
          <h2 className="section-title">
            {t('svc.h2.l1')}<br />
            <span className="hand-highlight">{t('svc.h2.l2')}</span>
          </h2>
          <p className="section-sub">{t('svc.sub')}</p>
        </motion.div>

        <motion.div
          className="svc-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={cardContainer}
        >
          {SERVICES.map((svc) => (
            <motion.div
              key={svc.nameKey}
              className={`svc-card svc-${svc.color}`}
              variants={cardItem}
            >
              <span className="svc-icon">{svc.icon}</span>
              <div className="svc-name">{t(svc.nameKey)}</div>
              <div className="svc-desc">{t(svc.descKey)}</div>
              <div className="svc-tags">
                {svc.tags.map((tag) => <span key={tag} className="svc-tag">{tag}</span>)}
              </div>
            </motion.div>
          ))}
        </motion.div>

        <div className="section-cta-row">
          <button type="button" className="cta-primary" onClick={openBookingModal}>
            {t('svc.cta')}
          </button>
        </div>
      </div>

      <style>{`
        .services-section {
          background: #fff;
          padding: 100px 0;
        }

        .services-head {
          text-align: left;
          margin-bottom: 3rem;
        }

        .section-label-blue {
          color: var(--color-primary) !important;
          background: transparent !important;
        }
        .section-label-blue::before {
          background: var(--color-primary) !important;
        }

        .svc-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.2rem;
          margin-bottom: 1.5rem;
        }

        .svc-card {
          border-radius: 22px;
          padding: 2rem 1.8rem;
          transition: all 0.3s;
          position: relative;
          overflow: hidden;
          border: none;
        }
        .svc-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 6px;
          border-radius: 22px 22px 0 0;
        }
        .svc-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0,0,0,0.1); }

        .svc-yellow   { background: #fef9c3; }
        .svc-yellow::before   { background: #eab308; }
        .svc-blue     { background: #dbeafe; }
        .svc-blue::before     { background: #2563eb; }
        .svc-pink     { background: #fce7f3; }
        .svc-pink::before     { background: #ec4899; }
        .svc-lavender { background: #ede9fe; }
        .svc-lavender::before { background: #8b5cf6; }
        .svc-green    { background: #dcfce7; }
        .svc-green::before    { background: #16a34a; }
        .svc-peach    { background: #ffedd5; }
        .svc-peach::before    { background: #f97316; }

        .svc-icon {
          display: block;
          margin-bottom: 1.2rem;
          width: 2.5rem;
          height: 2.5rem;
        }
        .svc-icon svg { width: 100%; height: 100%; display: block; }

        .svc-yellow .svc-icon svg { stroke: #d97706; }
        .svc-blue   .svc-icon svg { stroke: #2563eb; }
        .svc-pink   .svc-icon svg { stroke: #ec4899; }
        .svc-lavender .svc-icon svg { stroke: #8b5cf6; }
        .svc-green  .svc-icon svg { stroke: #16a34a; }
        .svc-peach  .svc-icon svg { stroke: #f97316; }

        .svc-name {
          font-family: var(--font-hand);
          font-size: 1.6rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.7rem;
          line-height: 1.2;
        }

        .svc-desc {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.65;
          margin-bottom: 1.4rem;
        }

        .svc-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          margin-top: 1.2rem;
        }
        .svc-tag {
          padding: 4px 12px;
          background: rgba(255,255,255,0.7);
          border: 1px solid rgba(0,0,0,0.08);
          border-radius: 100px;
          font-size: 0.72rem;
          font-weight: 600;
          color: #374151;
        }

        @media (max-width: 1100px) {
          .svc-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .services-section { padding: 60px 0; }
          .svc-grid { grid-template-columns: 1fr 1fr; gap: 0.8rem; }
          .svc-card { padding: 1.5rem; }
        }
      `}</style>
    </section>
  )
}
