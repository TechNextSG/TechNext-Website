export default function NotFound({ embedded = false }) {
    return (
        <div className="not-found" style={embedded ? { minHeight: '60vh' } : undefined}>
            <div className="not-found-content">
                <div className="error-code">
                    <span className="digit">4</span>
                    <span className="digit zero">
                        <svg viewBox="0 0 100 100" className="globe">
                            <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="3" />
                            <ellipse cx="50" cy="50" rx="45" ry="20" fill="none" stroke="currentColor" strokeWidth="2" />
                            <ellipse cx="50" cy="50" rx="20" ry="45" fill="none" stroke="currentColor" strokeWidth="2" />
                            <line x1="5" y1="50" x2="95" y2="50" stroke="currentColor" strokeWidth="2" />
                        </svg>
                    </span>
                    <span className="digit">4</span>
                </div>

                <h1 className="not-found-title">Page Not Found</h1>
                <p className="not-found-text">
                    Oops! The page you're looking for doesn't exist or has been moved.
                </p>

                <div className="not-found-actions">
                    <a href="/" className="btn btn-primary btn-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                        <span>Back to Home</span>
                    </a>
                    <a href="/#contact" className="btn btn-secondary btn-lg">
                        <span>Contact Support</span>
                    </a>
                </div>

                <div className="floating-shapes">
                    <div className="shape shape-1"></div>
                    <div className="shape shape-2"></div>
                    <div className="shape shape-3"></div>
                </div>
            </div>

            <style>{`
        .not-found {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-bg);
          position: relative;
          overflow: hidden;
          padding: var(--spacing-xl);
        }

        .not-found::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--gradient-mesh);
          opacity: 0.5;
        }

        .not-found-content {
          text-align: center;
          position: relative;
          z-index: 1;
        }

        .error-code {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--spacing-md);
          margin-bottom: var(--spacing-xl);
        }

        .digit {
          font-family: var(--font-heading);
          font-size: 8rem;
          font-weight: 800;
          background: var(--gradient-primary);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          line-height: 1;
        }

        .digit.zero {
          width: 120px;
          height: 120px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .globe {
          width: 100%;
          height: 100%;
          color: var(--color-primary);
          animation: spin 20s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .not-found-title {
          font-family: var(--font-heading);
          font-size: var(--font-size-3xl);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-md);
        }

        .not-found-text {
          font-size: var(--font-size-lg);
          color: var(--color-text-muted);
          max-width: 400px;
          margin: 0 auto var(--spacing-2xl);
        }

        .not-found-actions {
          display: flex;
          gap: var(--spacing-md);
          justify-content: center;
          flex-wrap: wrap;
        }

        .floating-shapes {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          animation: float 6s ease-in-out infinite;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          background: var(--color-primary);
          top: -100px;
          left: -100px;
          animation-delay: 0s;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          background: var(--color-accent);
          bottom: -50px;
          right: -50px;
          animation-delay: -2s;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          background: #8b5cf6;
          top: 50%;
          right: 10%;
          animation-delay: -4s;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }

        @media (max-width: 640px) {
          .digit {
            font-size: 5rem;
          }

          .digit.zero {
            width: 80px;
            height: 80px;
          }

          .not-found-title {
            font-size: var(--font-size-2xl);
          }

          .not-found-actions {
            flex-direction: column;
          }
        }
      `}</style>
        </div>
    )
}
