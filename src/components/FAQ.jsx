import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../i18n/I18nProvider'

const QUESTIONS = [
  { qKey: 'faq.q1', aKey: 'faq.a1', color: 'fi-yellow' },
  { qKey: 'faq.q2', aKey: 'faq.a2', color: 'fi-blue' },
  { qKey: 'faq.q3', aKey: 'faq.a3', color: 'fi-pink' },
  { qKey: 'faq.q4', aKey: 'faq.a4', color: 'fi-green' },
  { qKey: 'faq.q5', aKey: 'faq.a5', color: 'fi-yellow' },
  { qKey: 'faq.q6', aKey: 'faq.a6', color: 'fi-blue' },
]

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function Faq() {
  const t = useT()
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section id="faq" className="faq-section">
      <div className="container">
        <motion.div
          className="faq-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <div className="section-label section-label-peach">{t('faq.label')}</div>
          <h2 className="section-title">
            {t('faq.h2.l1')}<br />
            <span className="hand-highlight">{t('faq.h2.l2')}</span>
          </h2>
          <p className="section-sub">{t('faq.sub')}</p>
        </motion.div>

        <motion.div
          className="faq-list"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={sectionFade}
        >
          {QUESTIONS.map((item, i) => {
            const isOpen = openIndex === i
            return (
              <div key={i} className={`faq-item ${item.color} ${isOpen ? 'open' : ''}`}>
                <button
                  className="faq-q"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                >
                  <span>{t(item.qKey)}</span>
                  <span className="faq-icon">{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      className="faq-a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{ overflow: 'hidden' }}
                    >
                      <p>{t(item.aKey)}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </motion.div>
      </div>

      <style>{`
        .faq-section {
          background: #fff;
          padding: 100px 0;
        }

        .faq-head {
          text-align: center;
          max-width: 720px;
          margin: 0 auto 2.5rem;
        }

        .section-label-peach {
          color: #9A3412 !important;
          background: transparent !important;
        }
        .section-label-peach::before {
          background: #9A3412 !important;
        }

        .faq-list {
          max-width: 760px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 0;
        }

        .faq-item {
          border-radius: 18px;
          margin-bottom: 10px;
          overflow: hidden;
          position: relative;
          border: none;
        }
        .faq-item::before {
          content: '';
          position: absolute;
          top: 0; left: 18px;
          width: 30px; height: 5px;
          border-radius: 0 0 4px 4px;
        }
        .faq-item.fi-yellow { background: #fef9c3; }
        .faq-item.fi-yellow::before { background: #eab308; }
        .faq-item.fi-blue { background: #dbeafe; }
        .faq-item.fi-blue::before { background: #2563eb; }
        .faq-item.fi-pink { background: #fce7f3; }
        .faq-item.fi-pink::before { background: #ec4899; }
        .faq-item.fi-green { background: #dcfce7; }
        .faq-item.fi-green::before { background: #16a34a; }

        .faq-q {
          padding: 1.4rem 1.6rem 1.4rem 1.8rem;
          font-family: var(--font-hand);
          font-size: 1.3rem;
          font-weight: 600;
          color: var(--color-text-primary);
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          gap: 1rem;
          margin-top: 0.5rem;
          width: 100%;
          background: transparent;
          border: none;
          text-align: left;
        }
        .faq-icon {
          font-size: 1.4rem;
          color: var(--color-text-primary);
          font-weight: 400;
          line-height: 1;
          width: 22px;
          text-align: center;
          flex-shrink: 0;
        }
        .faq-a {
          padding: 0 1.8rem;
        }
        .faq-a p {
          font-size: 0.88rem;
          color: #475569;
          line-height: 1.7;
          padding-bottom: 1.4rem;
        }

        @media (max-width: 768px) {
          .faq-section { padding: 60px 0; }
          .faq-q { font-size: 1.1rem; padding: 1rem 1.2rem 1rem 1.4rem; }
          .faq-a { padding: 0 1.4rem; }
        }
      `}</style>
    </section>
  )
}
