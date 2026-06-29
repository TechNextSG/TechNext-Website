import { useState, useEffect, useRef, useMemo } from 'react'
import { useData } from 'vike-react/useData'
import { Config } from 'vike-react/Config'
import { Head } from 'vike-react/Head'
import { marked } from 'marked'
import DOMPurifyLib from 'dompurify'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import cssLang from 'highlight.js/lib/languages/css'
import xml from 'highlight.js/lib/languages/xml'
import json from 'highlight.js/lib/languages/json'
import bash from 'highlight.js/lib/languages/bash'
import sqlLang from 'highlight.js/lib/languages/sql'
import SEOHead from '../../../src/components/SEOHead'
import NotFound from '../../../src/components/NotFound'

// Register languages
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('js', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('ts', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('css', cssLang)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('shell', bash)
hljs.registerLanguage('sql', sqlLang)

export { Page }

function Page() {
  const { post: ssrPost } = useData()

  const slug = typeof window !== 'undefined' ? window.location.pathname.split('/blog/')[1] : null
  const [post, setPost] = useState(ssrPost || null)
  const [loading, setLoading] = useState(!ssrPost)
  const [error, setError] = useState(null)
  const [relatedPosts, setRelatedPosts] = useState([])
  const [activeTocId, setActiveTocId] = useState(null)
  const [mobileTocOpen, setMobileTocOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const contentRef = useRef(null)

  useEffect(() => {
    if (ssrPost || !slug) return
    fetch(`/api/posts?slug=${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('Post not found')
        return r.json()
      })
      .then(data => { setPost(data); setLoading(false) })
      .catch(err => { setError(err.message); setLoading(false) })
  }, [slug, ssrPost])

  useEffect(() => {
    if (!post?.tag) return
    fetch(`/api/posts?tag=${encodeURIComponent(post.tag)}&limit=4`)
      .then(r => r.json())
      .then(data => {
        const related = (data.posts || []).filter(p => p.slug !== post.slug).slice(0, 3)
        setRelatedPosts(related)
      })
      .catch(() => {})
  }, [post?.tag, post?.slug])

  useEffect(() => {
    if (!contentRef.current) return
    contentRef.current.querySelectorAll('pre code').forEach(block => {
      if (!block.dataset.highlighted) {
        hljs.highlightElement(block)
        block.dataset.highlighted = 'true'
      }
    })
  }, [post?.content])

  useEffect(() => {
    if (!contentRef.current) return
    const headings = contentRef.current.querySelectorAll('h2, h3')
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveTocId(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: 0 }
    )

    headings.forEach(h => observer.observe(h))
    return () => observer.disconnect()
  }, [post?.content])

  const { htmlContent, toc } = useMemo(() => {
    if (!post?.content) return { htmlContent: '', toc: [] }

    const tocItems = []
    const renderer = new marked.Renderer()

    renderer.heading = function ({ text, depth }) {
      if (depth === 2 || depth === 3) {
        const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-|-$/g, '')
        tocItems.push({ id, text, depth })
        return `<h${depth} id="${id}">${text}</h${depth}>`
      }
      return `<h${depth}>${text}</h${depth}>`
    }

    const raw = marked.parse(post.content, { renderer })
    const clean = typeof window !== 'undefined'
      ? DOMPurifyLib.sanitize(raw, {
          ADD_TAGS: ['iframe'],
          ADD_ATTR: ['target', 'rel', 'loading', 'fetchpriority'],
        })
      : raw

    return { htmlContent: clean, toc: tocItems }
  }, [post?.content])

  if (loading) return (
    <div className="page" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader-spinner" style={{ width: 40, height: 40, border: '3px solid var(--color-border)', borderTopColor: 'var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (error || !post) return <NotFound embedded />

  const readTime = Math.max(1, Math.ceil((post.content || '').split(/\s+/).length / 200))
  const dateStr = new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://technext.asia' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://technext.asia/blog' },
      { '@type': 'ListItem', position: 3, name: post.title, item: `https://technext.asia/blog/${post.slug}` },
    ],
  }

  return (
    <>
      <Config title={`${post.title} | TechNext Asia`} />
      <Config description={post.excerpt || post.title} />
      <Head>
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt || ''} />
        <meta property="og:url" content={`https://technext.asia/blog/${post.slug}`} />
        {post.cover_image && <meta property="og:image" content={post.cover_image} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.excerpt || ''} />
        <link rel="canonical" href={`https://technext.asia/blog/${post.slug}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "headline": post.title,
          "description": post.excerpt,
          "author": { "@type": "Organization", "name": "TechNext Solutions" },
          "publisher": { "@type": "Organization", "name": "TechNext Solutions", "logo": { "@type": "ImageObject", "url": "https://technext.asia/favicon.svg" }},
          "datePublished": post.created_at,
          "url": `https://technext.asia/blog/${post.slug}`,
          "image": post.cover_image || "https://technext.asia/og-image.png",
        })}} />
      </Head>

      <div className="page blog-post-page">
        <SEOHead
          title={post.title}
          description={post.excerpt}
          type="article"
          image={post.cover_image}
          url={`https://technext.asia/blog/${post.slug}`}
          article={post}
        />

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

        <div className="post-header-wrapper">
          {post.cover_image && (
            <div className="post-cover-hero">
              <img src={post.cover_image} alt={post.title} width={1200} height={480} loading="eager" fetchpriority="high" />
              <div className="post-cover-overlay" />
            </div>
          )}

          <div className="container">
            <div className="post-header">
              <a href="/blog" className="back-link">← Back to Blog</a>
              <span className="blog-tag">{post.tag}</span>
              <h1 className="post-title">{post.title}</h1>
              <div className="post-meta-bar">
                <div className="post-author">
                  <div className="author-avatar">{(post.author || 'T')[0]}</div>
                  <div>
                    <span className="author-name">{post.author}</span>
                    <span className="post-date">{dateStr} · {readTime} min read</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container">
          {toc.length > 2 && (
            <nav className="mobile-toc" aria-label="Table of contents">
              <button
                className="mobile-toc-toggle"
                onClick={() => setMobileTocOpen(!mobileTocOpen)}
                aria-expanded={mobileTocOpen}
              >
                <span>Table of Contents</span>
                <span className={`mobile-toc-arrow ${mobileTocOpen ? 'open' : ''}`}>&#9662;</span>
              </button>
              {mobileTocOpen && (
                <ul className="mobile-toc-list">
                  {toc.map(item => (
                    <li key={item.id} className={`toc-item ${item.depth === 3 ? 'toc-sub' : ''}`}>
                      <a href={`#${item.id}`} onClick={(e) => {
                        e.preventDefault()
                        setMobileTocOpen(false)
                        document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                      }}>{item.text}</a>
                    </li>
                  ))}
                </ul>
              )}
            </nav>
          )}

          <div className="post-layout">
            {toc.length > 2 && (
              <aside className="post-toc" aria-label="Table of contents">
                <div className="toc-sticky">
                  <span className="toc-title">In this article</span>
                  <ul className="toc-list">
                    {toc.map(item => (
                      <li key={item.id} className={`toc-item ${item.depth === 3 ? 'toc-sub' : ''} ${activeTocId === item.id ? 'toc-active' : ''}`}>
                        <a href={`#${item.id}`} aria-current={activeTocId === item.id ? 'true' : undefined} onClick={(e) => {
                          e.preventDefault()
                          document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                        }}>{item.text}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            )}

            <article
              ref={contentRef}
              className="post-content"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          </div>

          <div className="post-author-bio">
            <div className="author-bio-avatar">{(post.author || 'T')[0]}</div>
            <div className="author-bio-info">
              <span className="author-bio-label">Written by</span>
              <span className="author-bio-name">{post.author || 'TechNext Team'}</span>
              <p className="author-bio-desc">
                Sharing insights on technology, innovation, and digital transformation from Southeast Asia.
              </p>
            </div>
          </div>

          <div className="post-share">
            <span className="share-label">Share this article</span>
            <div className="share-buttons">
              <button
                className={`share-btn share-copy ${copied ? 'copied' : ''}`}
                onClick={() => {
                  navigator.clipboard.writeText(`https://technext.asia/blog/${post.slug}`)
                  setCopied(true)
                  setTimeout(() => setCopied(false), 2000)
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  {copied ? (
                    <polyline points="20 6 9 17 4 12" />
                  ) : (
                    <>
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                    </>
                  )}
                </svg>
                {copied ? 'Copied!' : 'Copy link'}
              </button>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`https://technext.asia/blog/${post.slug}`)}`} target="_blank" rel="noopener" className="share-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                Twitter
              </a>
              <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://technext.asia/blog/${post.slug}`)}`} target="_blank" rel="noopener" className="share-btn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                LinkedIn
              </a>
            </div>
          </div>

          {relatedPosts.length > 0 && (
            <section className="related-posts" aria-label="Related articles">
              <h2 className="related-title">Related Articles</h2>
              <div className="related-grid">
                {relatedPosts.map(rp => (
                  <a href={`/blog/${rp.slug}`} key={rp.id} className="related-card">
                    <div className="related-card-image">
                      <img src={rp.cover_image || '/blog-featured.png'} alt={rp.title} loading="lazy" />
                    </div>
                    <div className="related-card-content">
                      <span className="blog-tag">{rp.tag}</span>
                      <h3 className="related-card-title">{rp.title}</h3>
                      <span className="blog-meta">{formatDate(rp.created_at)}</span>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          )}
        </div>

        <style>{`
          .post-header-wrapper { position: relative; margin-bottom: var(--spacing-3xl); }
          .post-cover-hero { position: relative; width: 100%; max-height: 480px; overflow: hidden; }
          .post-cover-hero img { width: 100%; height: 480px; object-fit: cover; }
          .post-cover-overlay { position: absolute; bottom: 0; left: 0; right: 0; height: 50%; background: linear-gradient(to top, var(--color-bg, #fff) 0%, transparent 100%); }
          .post-header { position: relative; max-width: 740px; margin: -60px auto 0; z-index: 2; }
          .post-header-wrapper:not(:has(.post-cover-hero)) .post-header { margin-top: var(--spacing-3xl); }
          .back-link { display: inline-block; font-size: var(--font-size-sm); color: var(--color-text-muted); text-decoration: none; margin-bottom: var(--spacing-lg); transition: color 0.2s; }
          .back-link:hover { color: var(--color-primary); }
          .blog-tag { display: inline-block; font-size: 11px; font-weight: 700; color: white; background: var(--color-red, #E11927); padding: 3px 10px; border-radius: 3px; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: var(--spacing-md); }
          .post-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 800; color: var(--color-text-primary); line-height: 1.2; margin-bottom: var(--spacing-lg); }
          .post-meta-bar { display: flex; align-items: center; justify-content: space-between; padding-bottom: var(--spacing-xl); border-bottom: 1px solid var(--color-border); margin-bottom: var(--spacing-xl); }
          .post-author { display: flex; align-items: center; gap: 12px; }
          .author-avatar { width: 40px; height: 40px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 16px; }
          .author-name { display: block; font-weight: 600; font-size: var(--font-size-sm); color: var(--color-text-primary); }
          .post-date { display: block; font-size: var(--font-size-xs); color: var(--color-text-muted); }
          .post-layout { display: flex; gap: var(--spacing-3xl); max-width: 1060px; margin: 0 auto; position: relative; }
          .post-toc { width: 220px; flex-shrink: 0; order: 2; }
          .toc-sticky { position: sticky; top: 100px; }
          .toc-title { display: block; font-size: var(--font-size-xs); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: var(--color-text-muted); margin-bottom: var(--spacing-md); }
          .toc-list { list-style: none; padding: 0; margin: 0; border-left: 2px solid var(--color-border); }
          .toc-item { padding: 4px 0 4px 16px; border-left: 2px solid transparent; margin-left: -2px; transition: all 0.2s; }
          .toc-item a { font-size: 13px; color: var(--color-text-muted); text-decoration: none; line-height: 1.4; display: block; transition: color 0.2s; }
          .toc-item a:hover { color: var(--color-primary); }
          .toc-sub { padding-left: 28px; }
          .toc-active { border-left-color: var(--color-primary); }
          .toc-active a { color: var(--color-primary); font-weight: 600; }
          .post-content { max-width: 740px; flex: 1; min-width: 0; font-size: 1.05rem; line-height: 1.85; color: var(--color-text-secondary); padding-bottom: var(--spacing-3xl); order: 1; }
          .post-content h2 { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); margin: var(--spacing-3xl) 0 var(--spacing-md); scroll-margin-top: 100px; }
          .post-content h3 { font-size: var(--font-size-lg); font-weight: 600; color: var(--color-text-primary); margin: var(--spacing-xl) 0 var(--spacing-sm); scroll-margin-top: 100px; }
          .post-content p { margin-bottom: var(--spacing-lg); }
          .post-content a { color: var(--color-primary); text-decoration: underline; }
          .post-content ul, .post-content ol { margin: var(--spacing-md) 0 var(--spacing-lg) var(--spacing-xl); }
          .post-content li { margin-bottom: var(--spacing-xs); }
          .post-content blockquote { border-left: 3px solid var(--color-primary); padding: var(--spacing-md) var(--spacing-lg); background: var(--color-bg-tertiary); border-radius: 0 var(--radius-md) var(--radius-md) 0; margin: var(--spacing-lg) 0; font-style: italic; color: var(--color-text-muted); }
          .post-content pre { background: #1e1e2e; border: 1px solid var(--color-border); border-radius: var(--radius-md); padding: var(--spacing-lg); overflow-x: auto; font-size: 0.9rem; margin: var(--spacing-lg) 0; }
          .post-content code { background: var(--color-bg-tertiary); padding: 2px 6px; border-radius: 4px; font-size: 0.9em; }
          .post-content pre code { background: none; padding: 0; color: #cdd6f4; }
          .post-content img { max-width: 100%; border-radius: var(--radius-lg); margin: var(--spacing-lg) 0; }
          .hljs-keyword { color: #cba6f7; } .hljs-string { color: #a6e3a1; } .hljs-number { color: #fab387; } .hljs-comment { color: #6c7086; font-style: italic; } .hljs-function { color: #89b4fa; } .hljs-title { color: #89b4fa; } .hljs-params { color: #f2cdcd; } .hljs-built_in { color: #f38ba8; } .hljs-attr { color: #89dceb; } .hljs-selector-class { color: #a6e3a1; } .hljs-selector-tag { color: #cba6f7; } .hljs-property { color: #89dceb; } .hljs-variable { color: #cdd6f4; } .hljs-operator { color: #89dceb; } .hljs-punctuation { color: #bac2de; } .hljs-meta { color: #f38ba8; } .hljs-type { color: #f9e2af; }
          .post-author-bio { max-width: 740px; margin: 0 auto; padding: var(--spacing-xl); background: var(--color-bg-tertiary); border-radius: var(--radius-xl); display: flex; gap: var(--spacing-lg); align-items: center; }
          .author-bio-avatar { width: 56px; height: 56px; border-radius: 50%; background: var(--color-primary); color: white; display: flex; align-items: center; justify-content: center; font-weight: 700; font-size: 22px; flex-shrink: 0; }
          .author-bio-info { display: flex; flex-direction: column; }
          .author-bio-label { font-size: var(--font-size-xs); color: var(--color-text-light); text-transform: uppercase; letter-spacing: 0.08em; font-weight: 600; margin-bottom: 2px; }
          .author-bio-name { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary); margin-bottom: 4px; }
          .author-bio-desc { font-size: var(--font-size-sm); color: var(--color-text-muted); line-height: 1.5; margin: 0; }
          .post-share { max-width: 740px; margin: 0 auto; padding: var(--spacing-xl) 0 var(--spacing-3xl); border-top: 1px solid var(--color-border); margin-top: var(--spacing-xl); display: flex; align-items: center; gap: var(--spacing-lg); }
          .share-label { font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-secondary); white-space: nowrap; }
          .share-buttons { display: flex; gap: 8px; }
          .share-btn { padding: 8px 14px; border: 1px solid var(--color-border); border-radius: 100px; font-size: 13px; font-weight: 500; color: var(--color-text-secondary); text-decoration: none; transition: all 0.2s; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; background: transparent; }
          .share-btn:hover { border-color: var(--color-primary); color: var(--color-primary); background: rgba(50, 83, 220, 0.04); }
          .share-copy.copied { border-color: #22c55e; color: #22c55e; background: rgba(34, 197, 94, 0.06); }
          .related-posts { max-width: 1060px; margin: 0 auto; padding: var(--spacing-3xl) 0 var(--spacing-5xl); border-top: 1px solid var(--color-border); }
          .related-title { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-text-primary); margin-bottom: var(--spacing-xl); }
          .related-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--spacing-xl); }
          .related-card { text-decoration: none; color: inherit; transition: transform var(--transition-base); }
          .related-card:hover { transform: translateY(-4px); }
          .related-card-image { border-radius: var(--radius-xl); overflow: hidden; aspect-ratio: 16 / 10; background: var(--color-bg-tertiary); margin-bottom: var(--spacing-md); }
          .related-card-image img { width: 100%; height: 100%; object-fit: cover; transition: transform var(--transition-slow); }
          .related-card:hover img { transform: scale(1.03); }
          .related-card-content { padding: var(--spacing-xs) 0; }
          .related-card-title { font-size: var(--font-size-base); font-weight: 700; color: var(--color-text-primary); line-height: 1.3; margin-bottom: var(--spacing-xs); display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
          .blog-meta { font-size: var(--font-size-sm); color: var(--color-text-light); }
          .mobile-toc { display: none; max-width: 740px; margin: 0 auto var(--spacing-xl); }
          .mobile-toc-toggle { width: 100%; display: flex; align-items: center; justify-content: space-between; padding: 12px 16px; background: var(--color-bg-tertiary); border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: var(--font-size-sm); font-weight: 600; color: var(--color-text-primary); cursor: pointer; transition: all 0.2s; }
          .mobile-toc-toggle:hover { border-color: var(--color-primary); }
          .mobile-toc-arrow { transition: transform 0.2s; font-size: 12px; }
          .mobile-toc-arrow.open { transform: rotate(180deg); }
          .mobile-toc-list { list-style: none; padding: var(--spacing-md) var(--spacing-lg); margin: 0; background: var(--color-bg-tertiary); border: 1px solid var(--color-border); border-top: none; border-radius: 0 0 var(--radius-md) var(--radius-md); }
          .mobile-toc-list .toc-item { padding: 6px 0; }
          .mobile-toc-list .toc-item a { font-size: 14px; color: var(--color-text-secondary); text-decoration: none; transition: color 0.2s; }
          .mobile-toc-list .toc-item a:hover { color: var(--color-primary); }
          .mobile-toc-list .toc-sub { padding-left: 16px; }
          @media (max-width: 1024px) { .post-toc { display: none; } .post-layout { max-width: 740px; } .mobile-toc { display: block; } .related-grid { grid-template-columns: repeat(2, 1fr); } }
          @media (max-width: 768px) { .post-cover-hero, .post-cover-hero img { max-height: 280px; height: 280px; } .post-header { margin-top: -30px; } .related-grid { grid-template-columns: 1fr; } .post-share { flex-direction: column; align-items: flex-start; gap: var(--spacing-md); } .share-buttons { flex-wrap: wrap; } .post-author-bio { flex-direction: column; text-align: center; padding: var(--spacing-lg); } }
        `}</style>
      </div>
    </>
  )
}
