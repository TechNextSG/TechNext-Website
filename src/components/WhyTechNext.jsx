import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { openBookingModal } from './BookingModal'
import { useT } from '../i18n/I18nProvider'

const ACCORDION_ITEMS = [
  { id: 'speed',    titleKey: 'why.acc.speed.t',  bodyKey: 'why.acc.speed.d',  color: 'c-yellow' },
  { id: 'ai-native', titleKey: 'why.acc.ai.t',     bodyKey: 'why.acc.ai.d',     color: 'c-blue' },
  { id: 'erp',      titleKey: 'why.acc.erp.t',    bodyKey: 'why.acc.erp.d',    color: 'c-pink' },
  { id: 'global',   titleKey: 'why.acc.global.t', bodyKey: 'why.acc.global.d', color: 'c-green' },
  { id: 'people',   titleKey: 'why.acc.people.t', bodyKey: 'why.acc.people.d', color: 'c-lavender' },
]

const FEATURES = [
  { dot: '#2563EB', tKey: 'why.feat1.t', dKey: 'why.feat1.d' },
  { dot: '#EAB308', tKey: 'why.feat2.t', dKey: 'why.feat2.d' },
  { dot: '#EC4899', tKey: 'why.feat3.t', dKey: 'why.feat3.d' },
  { dot: '#16A34A', tKey: 'why.feat4.t', dKey: 'why.feat4.d' },
]

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function WhyTechNext() {
  const t = useT()
  const [openId, setOpenId] = useState('speed')

  return (
    <section id="why" className="why-section">
      <div className="container">
        <motion.div
          className="why-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <div className="section-label section-label-green">{t('why.label')}</div>
          <h2 className="section-title">
            {t('why.h2.l1')}<br />
            <span className="hand-highlight">{t('why.h2.l2')}</span>
          </h2>
          <p className="section-sub">{t('why.sub')}</p>
        </motion.div>

        <motion.div
          className="why-layout"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={sectionFade}
        >
          <div className="why-accordion" role="tablist">
            {ACCORDION_ITEMS.map((item) => {
              const isOpen = openId === item.id
              return (
                <div key={item.id} className={`why-acc-item ${item.color} ${isOpen ? 'open' : ''}`}>
                  <button
                    className="why-acc-trigger"
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                    aria-expanded={isOpen}
                  >
                    <span>{t(item.titleKey)}</span>
                    <span className="why-acc-icon">{isOpen ? '−' : '+'}</span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        className="why-acc-body"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <p>{t(item.bodyKey)}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )
            })}
          </div>

          <div className="why-panel">
            <div className="why-panel-title">{t('why.panel.title')}</div>
            <p className="why-panel-sub">{t('why.panel.sub')}</p>
            {FEATURES.map((f) => (
              <div key={f.tKey} className="why-feat">
                <div className="why-feat-dot" style={{ background: f.dot }} />
                <div>
                  <div className="why-feat-title">{t(f.tKey)}</div>
                  <div className="why-feat-desc">{t(f.dKey)}</div>
                </div>
              </div>
            ))}
            <button type="button" className="cta-primary why-panel-cta" onClick={openBookingModal}>
              {t('why.cta')}
            </button>
          </div>
        </motion.div>
      </div>

      <style>{`
        .why-section {
          background: #fff;
          padding: 100px 0;
        }

        .why-head {
          text-align: left;
          margin-bottom: 3rem;
        }

        .section-label-green {
          color: #166534 !important;
          background: transparent !important;
        }
        .section-label-green::before {
          background: #166534 !important;
        }

        .why-layout {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
        }

        /* Accordion */
        .why-accordion {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .why-acc-item {
          border-radius: 16px;
          padding: 0;
          position: relative;
          cursor: default;
          transition: all 0.2s;
          border: none;
          overflow: hidden;
        }
        .why-acc-item::before {
          content: '';
          position: absolute;
          top: 0; left: 16px;
          width: 32px; height: 6px;
          border-radius: 0 0 4px 4px;
        }
        .why-acc-item:hover { transform: translateX(4px); box-shadow: 0 4px 16px rgba(0,0,0,0.08); }

        .why-acc-item.c-yellow { background: #fef9c3; }
        .why-acc-item.c-yellow::before { background: #eab308; }
        .why-acc-item.c-blue { background: #dbeafe; }
        .why-acc-item.c-blue::before { background: #2563eb; }
        .why-acc-item.c-pink { background: #fce7f3; }
        .why-acc-item.c-pink::before { background: #ec4899; }
        .why-acc-item.c-green { background: #dcfce7; }
        .why-acc-item.c-green::before { background: #16a34a; }
        .why-acc-item.c-lavender { background: #ede9fe; }
        .why-acc-item.c-lavender::before { background: #8b5cf6; }

        .why-acc-trigger {
          width: 100%;
          padding: 1.4rem 1.6rem 1.4rem 1.6rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          font-family: var(--font-hand);
          font-size: 1.4rem;
          font-weight: 700;
          text-align: left;
          color: var(--color-text-primary);
          background: transparent;
          border: none;
          cursor: pointer;
          margin-top: 0.5rem;
        }
        .why-acc-icon {
          font-size: 1.5rem;
          color: var(--color-text-primary);
          font-weight: 400;
          line-height: 1;
          width: 24px;
          text-align: center;
          flex-shrink: 0;
        }
        .why-acc-body {
          padding: 0 1.6rem;
        }
        .why-acc-body p {
          font-size: 0.85rem;
          color: #475569;
          line-height: 1.6;
          padding-bottom: 1.4rem;
        }

        /* Panel */
        .why-panel {
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 24px;
          padding: 2rem;
          box-shadow: 0 4px 20px rgba(0,0,0,0.07);
          position: sticky;
          top: 84px;
        }
        .why-panel-title {
          font-family: var(--font-hand);
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 0.5rem;
        }
        .why-panel-sub {
          font-size: 0.85rem;
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.8rem;
        }
        .why-feat {
          display: flex;
          gap: 12px;
          padding: 1rem 0;
          align-items: flex-start;
          border-bottom: 1px solid #e2e8f0;
        }
        .why-feat:last-of-type { border-bottom: none; }
        .why-feat-dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          margin-top: 5px;
          flex-shrink: 0;
        }
        .why-feat-title {
          font-size: 0.88rem;
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: 2px;
        }
        .why-feat-desc {
          font-size: 0.8rem;
          color: #64748b;
          line-height: 1.55;
        }
        .why-panel-cta {
          margin-top: 1.8rem;
          width: 100%;
          justify-content: center;
          display: inline-flex;
        }

        @media (max-width: 1024px) {
          .why-layout { grid-template-columns: 1fr; }
          .why-panel { position: static; }
        }

        @media (max-width: 768px) {
          .why-section { padding: var(--spacing-2xl) 0; }
        }
      `}</style>
    </section>
  )
}
