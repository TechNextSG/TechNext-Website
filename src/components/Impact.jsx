import { motion } from 'framer-motion'
import { openBookingModal } from './BookingModal'
import { useT } from '../i18n/I18nProvider'

const CLIENT_LOGOS = [
  { name: 'Qualcomm',           src: '/client-logos/Qualcomm-Logo.svg.png' },
  { name: 'TSMC',               src: '/client-logos/Tsmc.svg.png' },
  { name: 'Singapore Government', src: '/client-logos/img-logo-singov.webp' },
  { name: 'Smart Space',        src: '/client-logos/smart space.png' },
  { name: 'AutoLife Tech',      src: '/client-logos/autolifetech.png' },
  { name: 'Antech Enviro',      src: '/client-logos/antech_enviro_phils_inc__cover-removebg-preview.png' },
  { name: 'Hirsch Dynamics',    src: '/client-logos/Untitled_design__2_-removebg-preview.png' },
  { name: 'Client',             src: '/client-logos/logo_black.png' },
  { name: 'Client',             src: '/client-logos/unnamed.png' },
]

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function Impact() {
  const t = useT()
  const logos = [...CLIENT_LOGOS, ...CLIENT_LOGOS]

  return (
    <section id="impact" className="impact-section">
      <div className="container">
        <motion.div
          className="impact-head"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <div className="section-label section-label-pink">{t('impact.label')}</div>
          <h2 className="section-title">
            {t('impact.h2.l1')}<br />
            <span className="hand-highlight">{t('impact.h2.l2')}</span>
          </h2>
          <p className="section-sub">{t('impact.sub')}</p>
        </motion.div>

        <motion.div
          className="marquee-outer"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionFade}
        >
          <div className="marquee-track">
            {logos.map((logo, i) => (
              <span key={`${logo.name}-${i}`} className="logo-chip">
                <img src={logo.src} alt={logo.name} />
              </span>
            ))}
          </div>
          <div className="marquee-fade marquee-fade-left" aria-hidden="true" />
          <div className="marquee-fade marquee-fade-right" aria-hidden="true" />
        </motion.div>

        <div className="section-cta-row">
          <button type="button" className="cta-primary" onClick={openBookingModal}>
            {t('impact.cta')}
          </button>
        </div>
      </div>

      <style>{`
        .impact-section {
          background: var(--color-bg);
          padding: 100px 0;
          overflow: hidden;
        }

        .impact-head {
          text-align: left;
          margin-bottom: 2rem;
        }

        .section-label-pink {
          color: #BE185D !important;
          background: transparent !important;
        }
        .section-label-pink::before {
          background: #BE185D !important;
        }

        .marquee-outer {
          width: 100%;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%);
          margin-top: 2rem;
          margin-bottom: 2.5rem;
          padding: 0;
          position: relative;
        }
        .marquee-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: marqueeScroll 32s linear infinite;
        }
        @keyframes marqueeScroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .marquee-outer:hover .marquee-track {
          animation-play-state: paused;
        }
        .logo-chip {
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border: 1.5px solid #e2e8f0;
          border-radius: 16px;
          padding: 20px 32px;
          height: 96px;
          width: 220px;
          flex-shrink: 0;
          cursor: default;
          transition: all 0.25s;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06);
        }
        .logo-chip img {
          max-height: 48px;
          max-width: 140px;
          width: auto;
          height: auto;
          object-fit: contain;
          mix-blend-mode: multiply;
        }
        .logo-chip:hover {
          border-color: var(--color-primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .marquee-fade { display: none; }

        @media (max-width: 768px) {
          .impact-section { padding: 60px 0; }
          .logo-chip { width: 160px; height: 72px; padding: 12px 20px; }
        }
      `}</style>
    </section>
  )
}
