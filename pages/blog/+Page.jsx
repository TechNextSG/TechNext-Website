import { useState, useEffect, useRef } from 'react'
import { useData } from 'vike-react/useData'
import { Head } from 'vike-react/Head'
import SEOHead from '../../src/components/SEOHead'
import useScrollReveal from '../../src/hooks/useScrollReveal'

export { Page }

// Skeleton loader for cards
function CardSkeleton() {
  return (
    <div className="blog-card skeleton-card" aria-hidden="true">
      <div className="blog-card-image skeleton-shimmer" />
      <div className="blog-card-content">
        <div className="skeleton-line skeleton-tag" />
        <div className="skeleton-line skeleton-title" />
        <div className="skeleton-line skeleton-title-2" />
        <div className="skeleton-line skeleton-excerpt" />
        <div className="skeleton-line skeleton-meta" />
      </div>
    </div>
  )
}

function FeaturedSkeleton() {
  return (
    <div className="blog-featured skeleton-featured" aria-hidden="true">
      <div className="blog-featured-image skeleton-shimmer" />
      <div className="blog-featured-content">
        <div className="skeleton-line skeleton-tag" />
        <div className="skeleton-line" style={{ width: '90%', height: 28 }} />
        <div className="skeleton-line" style={{ width: '70%', height: 28, marginTop: 8 }} />
        <div className="skeleton-line" style={{ width: '100%', height: 14, marginTop: 16 }} />
        <div className="skeleton-line" style={{ width: '80%', height: 14, marginTop: 6 }} />
        <div className="skeleton-line skeleton-meta" style={{ marginTop: 20 }} />
      </div>
    </div>
  )
}

function Page() {
  const data = useData()
  const ssrPosts = data?.posts
  const ssrPagination = data?.pagination

  const getInitialPage = () => {
    if (ssrPagination?.page) return ssrPagination.page
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search)
      return parseInt(params.get('page')) || 1
    }
    return 1
  }

  const sectionRef = useRef(null)
  useScrollReveal(sectionRef)

  const [posts, setPosts] = useState(ssrPosts || [])
  const [loading, setLoading] = useState(!ssrPosts)
  const [activeTag, setActiveTag] = useState(null)
  const [page, setPage] = useState(getInitialPage)
  const [pagination, setPagination] = useState(ssrPagination || null)

  useEffect(() => {
    if (ssrPosts && !activeTag && page === getInitialPage()) return

    const params = new URLSearchParams()
    if (activeTag) params.set('tag', activeTag)
    params.set('page', page)
    params.set('limit', '12')

    setLoading(true)
    fetch(`/api/posts?${params}`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || [])
        setPagination(data.pagination || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeTag, page])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const url = new URL(window.location.href)
    if (page > 1) {
      url.searchParams.set('page', page)
    } else {
      url.searchParams.delete('page')
    }
    window.history.replaceState({}, '', url.toString())
  }, [page])

  const handleTagChange = (tag) => {
    setActiveTag(tag)
    setPage(1)
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const featured = posts.find(p => p.featured)
  const rest = posts.filter(p => !p.featured)
  const tags = ['TECH BLOG', 'INSIGHTS', 'CASE STUDY', 'TECHNOLOGY', 'INDUSTRY', 'DESIGN']
  const formatDate = (d) => new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  const estimateReadTime = (excerpt) => Math.max(2, Math.ceil((excerpt || '').split(/\s+/).length / 40) + 2)

  // SEO
  const canonicalUrl = page > 1 ? `https://technext.asia/blog?page=${page}` : 'https://technext.asia/blog'
  const prevUrl = page > 1 ? (page === 2 ? 'https://technext.asia/blog' : `https://technext.asia/blog?page=${page - 1}`) : null
  const nextUrl = pagination && page < pagination.pages ? `https://technext.asia/blog?page=${page + 1}` : null

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog & Insights | TechNext',
    description: 'Breakthrough innovations, real-world technology insights, and thought leadership from TechNext.',
    url: canonicalUrl,
    mainEntity: {
      '@type': 'ItemList',
      numberOfItems: pagination?.total || posts.length,
      itemListElement: posts.map((post, i) => ({
        '@type': 'ListItem',
        position: ((page - 1) * 12) + i + 1,
        url: `https://technext.asia/blog/${post.slug}`,
        name: post.title,
      })),
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://technext.asia' },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: 'https://technext.asia/blog' },
    ],
  }

  return (
    <div className="page blog-page" ref={sectionRef}>
      <SEOHead
        title={page > 1 ? `Blog & Insights — Page ${page}` : 'Blog & Insights'}
        description="Breakthrough innovations, real-world technology insights, and thought leadership from voices across TechNext."
        url={canonicalUrl}
      />
      <Head>
        <link rel="canonical" href={canonicalUrl} />
        {prevUrl && <link rel="prev" href={prevUrl} />}
        {nextUrl && <link rel="next" href={nextUrl} />}
      </Head>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* Page Hero */}
      <div className="page-hero">
        <div className="container">
          <div className="page-hero-content animate-on-scroll">
            <span className="page-label">BLOG & INSIGHTS</span>
            <h1 className="page-title">
              On Trend. Onward. <span className="accent-red">OnTech.</span>
            </h1>
            <p className="page-desc">
              Breakthrough innovations, real-world technology insights, and thought leadership
              from voices across TechNext.
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Tag Filter — horizontal scroll on mobile */}
        <div className="blog-tags-wrapper">
          <nav className="blog-tags" aria-label="Filter by category">
            <button
              className={`tag-btn ${!activeTag ? 'active' : ''}`}
              onClick={() => handleTagChange(null)}
              aria-pressed={!activeTag}
            >All</button>
            {tags.map(tag => (
              <button
                key={tag}
                className={`tag-btn ${activeTag === tag ? 'active' : ''}`}
                onClick={() => handleTagChange(tag)}
                aria-pressed={activeTag === tag}
              >{tag}</button>
            ))}
          </nav>
        </div>

        {loading ? (
          <>
            <FeaturedSkeleton />
            <div className="blog-grid">
              {[1, 2, 3, 4, 5, 6].map(i => <CardSkeleton key={i} />)}
            </div>
          </>
        ) : posts.length === 0 ? (
          <div className="blog-empty">
            <div className="blog-empty-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
              </svg>
            </div>
            <p className="blog-empty-text">No posts found for "{activeTag}"</p>
            <p className="blog-empty-sub">Try a different category or browse all articles.</p>
            {activeTag && (
              <button className="blog-empty-btn" onClick={() => handleTagChange(null)}>
                View all posts
              </button>
            )}
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <a href={`/blog/${featured.slug}`} className="blog-featured-link">
                <div className="blog-featured">
                  <div className="blog-featured-image">
                    <img
                      src={featured.cover_image || '/blog-featured.png'}
                      alt={featured.title}
                      width={800}
                      height={500}
                      loading="eager"
                      fetchpriority="high"
                    />
                    <div className="featured-badge">Featured</div>
                  </div>
                  <div className="blog-featured-content">
                    <span className="blog-tag">{featured.tag}</span>
                    <h2 className="blog-featured-title">{featured.title}</h2>
                    <p className="blog-featured-excerpt">{featured.excerpt}</p>
                    <div className="blog-card-meta">
                      <span className="blog-meta-date">{formatDate(featured.created_at)}</span>
                      <span className="blog-meta-dot">&middot;</span>
                      <span className="blog-meta-read">{estimateReadTime(featured.excerpt)} min read</span>
                    </div>
                    <span className="featured-read-more">
                      Read article
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </span>
                  </div>
                </div>
              </a>
            )}

            {/* Articles Grid */}
            <div className="blog-grid">
              {rest.map((post, index) => (
                <a href={`/blog/${post.slug}`} key={post.id} className="blog-card-link">
                  <article className="blog-card" style={{ animationDelay: `${index * 60}ms` }}>
                    <div className="blog-card-image">
                      <img
                        src={post.cover_image || '/blog-featured.png'}
                        alt={post.title}
                        width={400}
                        height={250}
                        loading="lazy"
                      />
                    </div>
                    <div className="blog-card-content">
                      <span className="blog-tag">{post.tag}</span>
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-excerpt">{post.excerpt}</p>
                      <div className="blog-card-meta">
                        <span className="blog-meta-date">{formatDate(post.created_at)}</span>
                        <span className="blog-meta-dot">&middot;</span>
                        <span className="blog-meta-read">{estimateReadTime(post.excerpt)} min read</span>
                      </div>
                    </div>
                  </article>
                </a>
              ))}
            </div>

            {/* Pagination */}
            {pagination && pagination.pages > 1 && (
              <nav className="blog-pagination" aria-label="Blog pagination">
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  aria-label="Previous page"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15 18 9 12 15 6"/></svg>
                  Previous
                </button>
                <div className="pagination-pages">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`pagination-num ${page === p ? 'active' : ''}`}
                      onClick={() => handlePageChange(p)}
                      aria-label={`Page ${p}`}
                      aria-current={page === p ? 'page' : undefined}
                    >{p}</button>
                  ))}
                </div>
                <button
                  className="pagination-btn"
                  onClick={() => handlePageChange(Math.min(pagination.pages, page + 1))}
                  disabled={page >= pagination.pages}
                  aria-label="Next page"
                >
                  Next
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </nav>
            )}
          </>
        )}
      </div>

      <style>{`
        /* Tag Filter — horizontal scroll on mobile */
        .blog-tags-wrapper {
          position: relative;
          margin: 0 calc(-1 * var(--spacing-lg));
          padding: 0 var(--spacing-lg);
        }
        .blog-tags {
          display: flex;
          gap: 8px;
          padding: var(--spacing-lg) 0 var(--spacing-xl);
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          -webkit-overflow-scrolling: touch;
        }
        .blog-tags::-webkit-scrollbar { display: none; }
        .tag-btn {
          padding: 8px 18px;
          border: 1px solid var(--color-border);
          border-radius: 100px;
          background: transparent;
          color: var(--color-text-muted);
          font-size: var(--font-size-xs);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .tag-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(50, 83, 220, 0.04);
        }
        .tag-btn.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
          box-shadow: 0 2px 8px rgba(50, 83, 220, 0.25);
        }

        /* Featured Article */
        .blog-featured-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .blog-featured {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: var(--spacing-3xl);
          padding: var(--spacing-3xl) 0 var(--spacing-5xl);
          border-bottom: 1px solid var(--color-border);
          margin-bottom: var(--spacing-3xl);
        }
        .blog-featured-image {
          border-radius: var(--radius-2xl);
          overflow: hidden;
          aspect-ratio: 16 / 10;
          background: var(--color-bg-tertiary);
          position: relative;
        }
        .blog-featured-image img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .blog-featured-link:hover .blog-featured-image img {
          transform: scale(1.04);
        }
        .featured-badge {
          position: absolute;
          top: 16px;
          left: 16px;
          padding: 4px 12px;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(8px);
          color: white;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          border-radius: 100px;
        }
        .blog-featured-content {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .blog-tag {
          font-size: var(--font-size-xs);
          font-weight: 700;
          color: var(--color-red, #E11927);
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: var(--spacing-sm);
        }
        .blog-featured-title {
          font-size: var(--font-size-2xl);
          font-weight: 800;
          color: var(--color-text-primary);
          line-height: 1.2;
          margin-bottom: var(--spacing-md);
          transition: color 0.2s;
        }
        .blog-featured-link:hover .blog-featured-title {
          color: var(--color-primary);
        }
        .blog-featured-excerpt {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.7;
          margin-bottom: var(--spacing-lg);
        }
        .featured-read-more {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          color: var(--color-primary);
          margin-top: var(--spacing-md);
          transition: gap 0.2s;
        }
        .blog-featured-link:hover .featured-read-more {
          gap: 10px;
        }

        /* Card Meta */
        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: var(--font-size-xs);
          color: var(--color-text-light);
        }
        .blog-meta-dot { opacity: 0.4; }
        .blog-meta-read { color: var(--color-text-muted); }

        /* Articles Grid */
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--spacing-xl);
          padding-bottom: var(--spacing-3xl);
        }
        .blog-card-link {
          text-decoration: none;
          color: inherit;
          display: block;
        }
        .blog-card {
          transition: transform var(--transition-base);
          animation: cardFadeIn 0.4s ease both;
        }
        @keyframes cardFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .blog-card:hover { transform: translateY(-6px); }
        .blog-card-image {
          border-radius: var(--radius-xl);
          overflow: hidden;
          aspect-ratio: 16 / 10;
          background: var(--color-bg-tertiary);
          margin-bottom: var(--spacing-md);
        }
        .blog-card-image img {
          width: 100%; height: 100%; object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .blog-card:hover img { transform: scale(1.05); }
        .blog-card-content { padding: var(--spacing-xs) 0; }
        .blog-card-title {
          font-size: var(--font-size-lg);
          font-weight: 700;
          color: var(--color-text-primary);
          line-height: 1.3;
          margin-bottom: var(--spacing-sm);
          transition: color 0.2s;
        }
        .blog-card-link:hover .blog-card-title {
          color: var(--color-primary);
        }
        .blog-card-excerpt {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          line-height: 1.6;
          margin-bottom: var(--spacing-sm);
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .accent-red { color: var(--color-red, #E11927); }

        /* Empty State */
        .blog-empty {
          text-align: center;
          padding: 80px 0;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .blog-empty-icon {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: var(--color-bg-tertiary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-text-light);
          margin-bottom: var(--spacing-lg);
        }
        .blog-empty-text {
          font-size: var(--font-size-lg);
          font-weight: 600;
          color: var(--color-text-primary);
          margin-bottom: var(--spacing-xs);
        }
        .blog-empty-sub {
          font-size: var(--font-size-sm);
          color: var(--color-text-muted);
          margin-bottom: var(--spacing-lg);
        }
        .blog-empty-btn {
          padding: 10px 24px;
          background: var(--color-primary);
          color: white;
          border: none;
          border-radius: 100px;
          font-size: var(--font-size-sm);
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .blog-empty-btn:hover {
          background: var(--color-primary);
          box-shadow: 0 4px 12px rgba(50, 83, 220, 0.3);
          transform: translateY(-1px);
        }

        /* Skeleton Loaders */
        .skeleton-shimmer {
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-border) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-card .blog-card-image {
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-border) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        .skeleton-line {
          height: 12px;
          border-radius: 6px;
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-border) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          margin-bottom: 8px;
        }
        .skeleton-tag { width: 80px; height: 10px; }
        .skeleton-title { width: 90%; height: 16px; }
        .skeleton-title-2 { width: 60%; height: 16px; }
        .skeleton-excerpt { width: 100%; height: 12px; }
        .skeleton-meta { width: 120px; height: 10px; margin-top: 4px; }
        .skeleton-featured .blog-featured-image {
          background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-border) 50%, var(--color-bg-tertiary) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }

        /* Pagination */
        .blog-pagination {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: var(--spacing-xl) 0 var(--spacing-5xl);
        }
        .pagination-pages {
          display: flex;
          gap: 4px;
        }
        .pagination-btn {
          padding: 8px 16px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .pagination-btn:hover:not(:disabled) {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(50, 83, 220, 0.04);
        }
        .pagination-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        .pagination-num {
          width: 36px;
          height: 36px;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          background: transparent;
          color: var(--color-text-secondary);
          font-size: var(--font-size-sm);
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pagination-num:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: rgba(50, 83, 220, 0.04);
        }
        .pagination-num.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
          box-shadow: 0 2px 8px rgba(50, 83, 220, 0.25);
        }

        @media (max-width: 1024px) {
          .blog-grid { grid-template-columns: repeat(2, 1fr); }
          .blog-featured { grid-template-columns: 1fr; }
        }
        @media (max-width: 640px) {
          .blog-grid { grid-template-columns: 1fr; }
          .blog-pagination { flex-wrap: wrap; }
          .blog-tags-wrapper {
            margin: 0 -16px;
            padding: 0 16px;
          }
        }
      `}</style>
    </div>
  )
}
