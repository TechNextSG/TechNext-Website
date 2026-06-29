import { lazy, Suspense, useState, useRef } from 'react'
import useScrollReveal from '../../src/hooks/useScrollReveal'

const Offices = lazy(() => import('../../src/components/Offices'))

export { Page }

function Page() {
  const sectionRef = useRef(null)
  useScrollReveal(sectionRef)

  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const formRef = useRef(null)

  const validateField = (name, value) => {
    if (name === 'name' && !value.trim()) return 'Name is required'
    if (name === 'email') {
      if (!value.trim()) return 'Email is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email'
    }
    if (name === 'message' && !value.trim()) return 'Message is required'
    return ''
  }

  const handleBlur = (e) => {
    const { name, value } = e.target
    setTouched(prev => ({ ...prev, [name]: true }))
    setErrors(prev => ({ ...prev, [name]: validateField(name, value) }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const newErrors = {}
    const newTouched = {}
    ;['name', 'email', 'message'].forEach(field => {
      newTouched[field] = true
      newErrors[field] = validateField(field, formData.get(field) || '')
    })
    setTouched(newTouched)
    setErrors(newErrors)
    if (Object.values(newErrors).some(e => e)) return

    setSubmitting(true)
    setSubmitError('')

    try {
      const payload = {
        name: formData.get('name'),
        email: formData.get('email'),
        company: formData.get('company') || '',
        phone: '',
        service: formData.get('service') || '',
        budget: '',
        message: formData.get('message'),
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Something went wrong')
      }

      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 6000)
      formRef.current?.reset()
      setTouched({})
      setErrors({})
    } catch (err) {
      setSubmitError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldClass = (name) => {
    if (!touched[name]) return 'form-input'
    return `form-input ${errors[name] ? 'form-input--error' : 'form-input--valid'}`
  }
  return (
    <div className="page contact-page" ref={sectionRef}>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content animate-on-scroll">
            <span className="page-label">CONTACT US</span>
            <h1 className="page-title">
              Let's <span className="accent">talk</span>
            </h1>
            <p className="page-desc">
              Ready to start your next project? We'd love to hear from you.
              Reach out and let's build something amazing together.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Content */}
      <div className="container">
        <div className="contact-grid">
          {/* Contact Form */}
          <div className="contact-form-card">
            <h2 className="contact-form-title">Send us a message</h2>
            {submitted && (
              <div className="contact-toast">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><path d="M22 4L12 14.01l-3-3" /><circle cx="12" cy="12" r="10" /></svg>
                Message sent! We'll get back to you soon.
              </div>
            )}
            {submitError && (
              <div className="contact-toast contact-toast--error">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5"><circle cx="12" cy="12" r="10" /><path d="M15 9l-6 6M9 9l6 6" /></svg>
                {submitError}
              </div>
            )}
            <form className="contact-form" ref={formRef} onSubmit={handleSubmit} noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name" className="form-label">Full Name *</label>
                  <input type="text" id="name" name="name" className={fieldClass('name')} placeholder="Your name" onBlur={handleBlur} required aria-invalid={!!(touched.name && errors.name)} aria-describedby={touched.name && errors.name ? 'name-error' : undefined} />
                  {touched.name && errors.name && <span id="name-error" className="form-error" role="alert">{errors.name}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email" className="form-label">Email *</label>
                  <input type="email" id="email" name="email" className={fieldClass('email')} placeholder="you@company.com" onBlur={handleBlur} required aria-invalid={!!(touched.email && errors.email)} aria-describedby={touched.email && errors.email ? 'email-error' : undefined} />
                  {touched.email && errors.email && <span id="email-error" className="form-error" role="alert">{errors.email}</span>}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="company" className="form-label">Company</label>
                <input type="text" id="company" name="company" className="form-input" placeholder="Your company name" />
              </div>
              <div className="form-group">
                <label htmlFor="service" className="form-label">Service Interested In</label>
                <select id="service" name="service" className="form-input">
                  <option value="">Select a service</option>
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>AI Solutions</option>
                  <option>Cloud Services</option>
                  <option>UX/UI Design</option>
                  <option>ERP Solutions</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea id="message" name="message" className={fieldClass('message')} placeholder="Tell us about your project..." rows="5" onBlur={handleBlur} required aria-invalid={!!(touched.message && errors.message)} aria-describedby={touched.message && errors.message ? 'message-error' : undefined}></textarea>
                {touched.message && errors.message && <span id="message-error" className="form-error" role="alert">{errors.message}</span>}
              </div>
              <button type="submit" className="btn btn-primary btn-lg contact-submit" disabled={submitting}>
                {submitting ? 'Sending...' : 'Send Message'}
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-info-card">
              <h3 className="contact-info-title">{'\u{1F4E7}'} Email</h3>
              <a href="mailto:admin@technext.asia" className="contact-info-value">admin@technext.asia</a>
            </div>
            <div className="contact-info-card">
              <h3 className="contact-info-title">{'\u{1F4DE}'} Singapore</h3>
              <a href="tel:+6584272549" className="contact-info-value">+65 8427 2549</a>
            </div>
            <div className="contact-info-card">
              <h3 className="contact-info-title">{'\u{1F4DE}'} Vietnam</h3>
              <a href="tel:+84792030623" className="contact-info-value">+84 792 030 623</a>
            </div>
            <div className="contact-info-card">
              <h3 className="contact-info-title">{'\u{1F4DE}'} Philippines</h3>
              <a href="tel:+61292345288" className="contact-info-value">+63 917 123 4567</a>
            </div>
          </div>
        </div>
      </div>

      {/* Offices */}
      <Suspense fallback={null}>
        <Offices />
      </Suspense>

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--spacing-3xl);
          padding: var(--spacing-3xl) 0 var(--spacing-5xl);
        }

        .contact-form-card {
          padding: var(--spacing-3xl);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-2xl);
          background: var(--color-surface);
        }

        .contact-form-title {
          font-size: var(--font-size-xl);
          font-weight: 800;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-2xl);
        }

        .contact-form {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        .form-label {
          display: block;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-text-secondary);
          margin-bottom: var(--spacing-xs);
        }

        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border-strong);
          border-radius: var(--radius-md);
          font-family: var(--font-body);
          font-size: var(--font-size-sm);
          color: var(--color-text-primary);
          background: var(--color-bg);
          transition: border-color var(--transition-fast);
        }

        .form-input:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(50, 83, 220, 0.1);
        }

        .form-input--valid {
          border-color: #22c55e;
        }

        .form-input--valid:focus {
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }

        .form-input--error {
          border-color: #ef4444;
        }

        .form-input--error:focus {
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }

        .form-error {
          display: block;
          font-size: var(--font-size-xs);
          color: #ef4444;
          margin-top: 4px;
          font-weight: 500;
        }

        .contact-toast {
          display: flex;
          align-items: center;
          gap: var(--spacing-sm);
          padding: 0.75rem 1rem;
          background: #22c55e;
          color: white;
          border-radius: var(--radius-md);
          font-size: var(--font-size-sm);
          font-weight: 600;
          margin-bottom: var(--spacing-lg);
          animation: slideInToast 0.4s ease;
        }

        @keyframes slideInToast {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .contact-toast--error {
          background: #ef4444;
        }

        .form-textarea {
          resize: vertical;
          min-height: 120px;
        }

        .contact-submit {
          width: fit-content;
        }

        .contact-info {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
        }

        .contact-info-card {
          padding: var(--spacing-xl);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-xl);
          background: var(--color-surface);
          transition: border-color var(--transition-base);
        }

        .contact-info-card:hover {
          border-color: var(--color-primary);
        }

        .contact-info-title {
          font-size: var(--font-size-sm);
          font-weight: 700;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-xs);
        }

        .contact-info-value {
          font-size: var(--font-size-base);
          color: var(--color-primary);
          font-weight: 600;
        }

        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr;
          }
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  )
}
