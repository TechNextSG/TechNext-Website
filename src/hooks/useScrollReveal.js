import { useEffect } from 'react'

export default function useScrollReveal(sectionRef, options = {}) {
  const {
    threshold = 0.15,
    rootMargin = '0px 0px -50px 0px',
    selector = '.animate-on-scroll',
  } = options

  useEffect(() => {
    if (typeof window === 'undefined') return

    const section = sectionRef.current
    if (!section) return

    // Nếu prefers-reduced-motion: hiện tất cả ngay lập tức
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      section.querySelectorAll(selector).forEach((el) => {
        el.classList.add('visible')
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold, rootMargin }
    )

    const elements = section.querySelectorAll(selector)
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [sectionRef, threshold, rootMargin, selector])
}
