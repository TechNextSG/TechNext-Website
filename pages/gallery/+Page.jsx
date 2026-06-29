import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useT } from '../../src/i18n/I18nProvider'

const PHOTOS = [
  { src: '/gallery/team-01.png',    caption: 'The TechNext core team' },
  { src: '/gallery/team-02.png',    caption: 'Team at work' },
  { src: '/gallery/team-03.png',    caption: 'TechNext team' },
  { src: '/gallery/team-04.png',    caption: 'TechNext team' },
  { src: '/gallery/gallery-01.jpeg', caption: 'Working session on a client AI rollout' },
  { src: '/gallery/gallery-02.jpeg', caption: 'Engineering offsite' },
  { src: '/gallery/gallery-03.jpeg', caption: 'AI workshop in the Vietnam dev hub' },
  { src: '/gallery/gallery-04.jpeg', caption: 'Pairing on an Odoo deployment' },
  { src: '/gallery/gallery-05.jpeg', caption: 'Team building session' },
  { src: '/gallery/gallery-06.jpeg', caption: 'Client delivery day' },
  { src: '/gallery/gallery-07.jpeg', caption: 'TechNext Singapore office' },
  { src: '/gallery/gallery-08.jpeg', caption: 'Sprint kickoff' },
  { src: '/gallery/gallery-09.jpeg', caption: 'AI demo day' },
  { src: '/gallery/gallery-10.jpeg', caption: 'Engineering meetup' },
  { src: '/gallery/gallery-11.jpeg', caption: 'Product launch' },
  { src: '/gallery/gallery-12.jpeg', caption: 'Team lunch' },
  { src: '/gallery/gallery-13.jpeg', caption: 'Code review session' },
  { src: '/gallery/gallery-14.jpeg', caption: 'Client workshop' },
  { src: '/gallery/gallery-15.jpeg', caption: 'Dev hub Vietnam' },
  { src: '/gallery/gallery-16.jpeg', caption: 'Quarterly planning' },
  { src: '/gallery/gallery-17.jpeg', caption: 'Team dinner' },
  { src: '/gallery/gallery-18.jpeg', caption: 'Office day' },
  { src: '/gallery/gallery-19.jpeg', caption: 'Hackathon' },
  { src: '/gallery/gallery-20.jpeg', caption: 'Demo presentation' },
  { src: '/gallery/gallery-21.jpeg', caption: 'Team retreat' },
  { src: '/gallery/gallery-22.jpeg', caption: 'Product review' },
  { src: '/gallery/gallery-23.jpeg', caption: 'Engineering session' },
  { src: '/gallery/gallery-24.jpeg', caption: 'Team event' },
  { src: '/gallery/gallery-25.jpeg', caption: 'TechNext meetup' },
  { src: '/gallery/gallery-26.jpeg', caption: 'Team collaboration' },
]

const sectionFade = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
}

const gridContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } }
}

const tile = {
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] } }
}

export default function Page() {
  const t = useT()
  const [lightboxIdx, setLightboxIdx] = useState(null)

  const close = () => setLightboxIdx(null)
  const prev = () => setLightboxIdx((i) => (i - 1 + PHOTOS.length) % PHOTOS.length)
  const next = () => setLightboxIdx((i) => (i + 1) % PHOTOS.length)

  return (
    <div className="gallery-page">
      <section className="gallery-hero">
        <div className="container">
          <div className="page-label">{t('gallery.label')}</div>
          <h1 className="page-title">
            {t('gallery.h1.l1')}{' '}
            <span className="hand-highlight">{t('gallery.h1.l2')}</span>
          </h1>
          <p className="page-sub">{t('gallery.sub')}</p>
        </div>
      </section>

      <section className="gallery-grid-section">
        <div className="container">
          <motion.div
            className="gallery-grid"
            variants={gridContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
          >
            {PHOTOS.map((p, i) => (
              <motion.button
                key={p.src}
                className="gallery-tile"
                onClick={() => setLightboxIdx(i)}
                variants={tile}
                type="button"
                aria-label={p.caption}
              >
                <img src={p.src} alt={p.caption} loading="lazy" />
                <span className="gallery-cap">{p.caption}</span>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => { if (e.target === e.currentTarget) close() }}
            role="dialog"
            aria-modal="true"
            aria-label="Photo preview"
          >
            <button className="lb-close" onClick={close} aria-label="Close">✕</button>
            <button className="lb-nav lb-prev" onClick={prev} aria-label="Previous">‹</button>
            <motion.figure
              className="lb-figure"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
              key={lightboxIdx}
            >
              <img src={PHOTOS[lightboxIdx].src} alt={PHOTOS[lightboxIdx].caption} />
              <figcaption>{PHOTOS[lightboxIdx].caption}</figcaption>
            </motion.figure>
            <button className="lb-nav lb-next" onClick={next} aria-label="Next">›</button>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-page {
          background: var(--color-bg);
          min-height: 100vh;
        }

        .gallery-hero {
          padding: calc(80px + var(--spacing-3xl)) 0 var(--spacing-2xl);
          text-align: center;
        }
        .gallery-hero .page-label {
          display: inline-block;
          padding: 4px 12px;
          background: var(--color-pink);
          color: #BE185D;
          border-radius: var(--radius-full);
          font-family: var(--font-body);
          font-size: 0.78rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          margin-bottom: var(--spacing-md);
        }
        .gallery-hero .page-title {
          font-family: var(--font-heading);
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.025em;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
        }
        .gallery-hero .hand-highlight {
          font-family: var(--font-hand);
          color: var(--color-accent);
          font-weight: 700;
          font-size: 1.2em;
          line-height: 0.9;
        }
        .gallery-hero .page-sub {
          font-size: var(--font-size-lg);
          color: var(--color-text-muted);
          line-height: 1.6;
          max-width: 600px;
          margin: 0 auto;
        }

        /* Grid */
        .gallery-grid-section {
          padding: var(--spacing-md) 0 var(--spacing-4xl);
        }
        .gallery-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-md);
        }
        .gallery-tile {
          position: relative;
          aspect-ratio: 4 / 3;
          border-radius: var(--radius-xl);
          overflow: hidden;
          border: none;
          padding: 0;
          background: var(--color-bg-tertiary);
          cursor: pointer;
          transition: all var(--transition-base);
        }
        .gallery-tile:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-lg);
        }
        .gallery-tile img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform var(--transition-slow);
        }
        .gallery-tile:hover img {
          transform: scale(1.04);
        }
        .gallery-cap {
          position: absolute;
          inset: auto 0 0 0;
          padding: var(--spacing-md);
          background: linear-gradient(0deg, rgba(0,0,0,0.85), transparent);
          color: white;
          font-family: var(--font-body);
          font-size: 0.82rem;
          font-weight: 500;
          text-align: left;
          opacity: 0;
          transform: translateY(8px);
          transition: all var(--transition-base);
        }
        .gallery-tile:hover .gallery-cap {
          opacity: 1;
          transform: translateY(0);
        }

        /* Lightbox */
        .lightbox {
          position: fixed; inset: 0; z-index: 2000;
          background: rgba(10, 12, 28, 0.92);
          backdrop-filter: blur(8px);
          display: flex; align-items: center; justify-content: center;
          padding: var(--spacing-xl);
        }
        .lb-close {
          position: absolute;
          top: var(--spacing-md);
          right: var(--spacing-md);
          width: 40px; height: 40px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          color: white;
          border: none;
          font-size: 1.1rem;
          cursor: pointer;
          transition: all var(--transition-fast);
        }
        .lb-close:hover { background: rgba(255,255,255,0.25); }

        .lb-nav {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 48px; height: 48px;
          border-radius: 50%;
          background: rgba(255,255,255,0.15);
          color: white;
          border: none;
          font-size: 1.6rem;
          cursor: pointer;
          transition: background var(--transition-fast);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .lb-nav:hover { background: rgba(255,255,255,0.25); }
        .lb-prev { left: var(--spacing-lg); }
        .lb-next { right: var(--spacing-lg); }

        .lb-figure {
          max-width: 90vw;
          max-height: 80vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--spacing-sm);
        }
        .lb-figure img {
          max-width: 100%;
          max-height: 75vh;
          object-fit: contain;
          border-radius: var(--radius-lg);
        }
        .lb-figure figcaption {
          font-family: var(--font-body);
          font-size: 0.92rem;
          color: rgba(255,255,255,0.85);
          text-align: center;
        }

        @media (max-width: 1024px) {
          .gallery-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .gallery-hero { padding: calc(60px + var(--spacing-xl)) 0 var(--spacing-lg); }
          .gallery-grid { grid-template-columns: 1fr; }
          .lb-nav { width: 36px; height: 36px; font-size: 1.3rem; }
          .lb-prev { left: 8px; }
          .lb-next { right: 8px; }
        }
      `}</style>
    </div>
  )
}
