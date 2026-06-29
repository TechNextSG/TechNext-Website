import { Config } from 'vike-react/Config'
import { Head } from 'vike-react/Head'

const SITE = {
  name: 'TechNext',
  url: 'https://technextasia.com',
  description: 'TechNext — AI-native company building enterprise intelligence for global clients across 10 countries. Odoo ERP, AI Agents, RAG systems.',
  logo: 'https://technextasia.com/technext-logo.png',
}

/**
 * SEOHead — Dynamic meta tags + JSON-LD structured data per page.
 * Usage: <SEOHead title="Page Title" description="..." type="website|article" article={postData} />
 */
export default function SEOHead({ title, description, type = 'website', image, url, article, noindex }) {
  const fullTitle = title ? `${title} | ${SITE.name}` : `${SITE.name} — Top IT Services Company in Southeast Asia`
  const desc = description || SITE.description
  const pageUrl = url || SITE.url
  const ogImage = image || `${SITE.url}/og-default.png`

  // Organization JSON-LD (all pages)
  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'TechNext Solutions',
    url: SITE.url,
    logo: SITE.logo,
    description: SITE.description,
    address: { '@type': 'PostalAddress', addressRegion: 'Southeast Asia' },
    sameAs: ['https://github.com/salem98'],
  }

  // BlogPosting JSON-LD (blog posts only)
  const articleSchema = article ? {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image,
    datePublished: article.created_at,
    dateModified: article.updated_at || article.created_at,
    author: {
      '@type': 'Person',
      name: article.author || 'TechNext Team',
      url: SITE.url,
    },
    publisher: {
      '@type': 'Organization',
      name: 'TechNext Solutions',
      logo: { '@type': 'ImageObject', url: SITE.logo },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': pageUrl },
    keywords: article.seo_keywords?.join(', ') || article.tag,
  } : null

  // FAQ schema (if article has FAQ content)
  const faqSchema = article?.content?.includes('## Frequently Asked Questions') ? (() => {
    const faqRegex = /### (.+?)\n\n([^#]+?)(?=\n### |\n## |$)/g
    const faqs = []
    let match
    const faqSection = article.content.split('## Frequently Asked Questions')[1] || ''
    while ((match = faqRegex.exec(faqSection)) !== null) {
      faqs.push({
        '@type': 'Question',
        name: match[1].trim(),
        acceptedAnswer: { '@type': 'Answer', text: match[2].trim() },
      })
    }
    return faqs.length ? {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs,
    } : null
  })() : null

  return (
    <>
      <Config title={fullTitle} />
      <Config description={desc} />
      <Head>
        {noindex && <meta name="robots" content="noindex,nofollow" />}

        {/* Open Graph */}
        <meta property="og:type" content={type === 'article' ? 'article' : 'website'} />
        <meta property="og:title" content={fullTitle} />
        <meta property="og:description" content={desc} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:site_name" content={SITE.name} />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={fullTitle} />
        <meta name="twitter:description" content={desc} />
        <meta name="twitter:image" content={ogImage} />

        {/* Article-specific */}
        {article && <meta property="article:published_time" content={article.created_at} />}
        {article && <meta property="article:author" content={article.author || 'TechNext Team'} />}
        {article && <meta property="article:tag" content={article.tag} />}

        {/* JSON-LD Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }} />
        {articleSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />}
        {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}
      </Head>
    </>
  )
}
