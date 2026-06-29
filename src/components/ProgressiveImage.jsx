import { useState, useEffect } from 'react'

export default function ProgressiveImage({ src, alt, className = '', ...props }) {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new Image()
    img.onload = () => setLoaded(true)
    img.src = src
  }, [src])

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`progressive-img ${loaded ? 'progressive-img--loaded' : ''} ${className}`}
        loading="lazy"
        {...props}
      />
      <style>{`
        .progressive-img {
          filter: blur(15px);
          transform: scale(1.04);
          transition: filter 0.6s ease, transform 0.6s ease;
        }
        .progressive-img--loaded {
          filter: blur(0);
          transform: scale(1);
        }
      `}</style>
    </>
  )
}
