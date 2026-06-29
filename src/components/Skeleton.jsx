export function SkeletonCard({ aspectRatio = '16/10' }) {
  return (
    <div className="skeleton-card">
      <div className="skeleton-image" style={{ aspectRatio }} />
      <div className="skeleton-line skeleton-title" />
      <div className="skeleton-line skeleton-text" />
      <div className="skeleton-line skeleton-text short" />
      <style>{`
        .skeleton-card {
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          padding: var(--spacing-lg);
          overflow: hidden;
        }
        .skeleton-image {
          background: var(--color-bg-tertiary);
          border-radius: var(--radius-lg);
          margin-bottom: var(--spacing-lg);
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-line {
          height: 14px;
          border-radius: var(--radius-sm);
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: var(--spacing-sm);
        }
        .skeleton-title {
          height: 20px;
          width: 70%;
          margin-bottom: var(--spacing-md);
        }
        .skeleton-text.short {
          width: 40%;
        }
      `}</style>
    </div>
  )
}

export function SkeletonSection() {
  return (
    <div className="skeleton-section" role="status" aria-label="Loading section">
      <div className="skeleton-section-title" />
      <div className="skeleton-section-subtitle" />
      <div className="skeleton-grid">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
      <style>{`
        .skeleton-section {
          padding: var(--spacing-5xl) 0;
          max-width: 1340px;
          margin: 0 auto;
          padding-left: var(--spacing-xl);
          padding-right: var(--spacing-xl);
        }
        .skeleton-section-title {
          width: 300px;
          height: 32px;
          margin: 0 auto var(--spacing-md);
          border-radius: var(--radius-md);
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-section-subtitle {
          width: 200px;
          height: 16px;
          margin: 0 auto var(--spacing-3xl);
          border-radius: var(--radius-sm);
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-bg-secondary) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl);
        }
        @media (max-width: 768px) {
          .skeleton-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
