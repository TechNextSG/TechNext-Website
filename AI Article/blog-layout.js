/* =============================================================
   TechNext Blog — Layout Engine v2
   Right sidebar: TOC + Share card  |  Below: Recommended grid
   ============================================================= */

const ARTICLES = [
  { title: "GPT-5: OpenAI's Most Capable Agentic AI Model Yet",            url: "gpt5-openai-agentic-ai-2025.html",            img: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=400&h=225&fit=crop&q=80", cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "Big Tech AI Infrastructure Spending: Q1 2026 Earnings",         url: "big-tech-ai-infrastructure-2026.html",         img: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&h=225&fit=crop&q=80",  cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "LG and NVIDIA: The Physical AI Era Has Officially Begun",       url: "lg-nvidia-physical-ai-era.html",               img: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=225&fit=crop&q=80", cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "AI Agent Governance: Regulators Are Flagging Control Gaps",     url: "ai-agent-governance-2025.html",                img: "https://images.unsplash.com/photo-1589994965851-a8f479c573a9?w=400&h=225&fit=crop&q=80", cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "GitHub Copilot Moves to Per-Token Pricing",                     url: "github-copilot-per-token-pricing.html",        img: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=225&fit=crop&q=80",  cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "AI Agents in 2026: Reshaping Enterprise Operations",            url: "ai-agents-enterprise-automation.html",         img: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=400&h=225&fit=crop&q=80", cat: "AI & Tech",   date: "Apr 28, 2026" },
  { title: "RAG Systems for Enterprise: The Complete Guide",                url: "rag-systems-enterprise-guide.html",            img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=225&fit=crop&q=80",  cat: "AI & Tech",   date: "Apr 25, 2026" },
  { title: "Local LLM Deployment: Running AI On-Premise",                   url: "local-llm-on-premise-enterprise.html",         img: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=400&h=225&fit=crop&q=80",  cat: "AI & Tech",   date: "Apr 22, 2026" },
  { title: "Context Engineering: The New Discipline for AI Systems",        url: "context-engineering-new-discipline.html",      img: "https://images.unsplash.com/photo-1673875824513-a07bbbf0e8f7?w=400&h=225&fit=crop&q=80", cat: "AI & Tech",   date: "Apr 18, 2026" },
  { title: "Odoo 18: New Features and the Enterprise Upgrade Decision",     url: "odoo-18-features-upgrade-guide.html",          img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=225&fit=crop&q=80", cat: "Odoo ERP",    date: "Apr 15, 2026" },
  { title: "Integrating AI with Odoo ERP: Implementation Guide",           url: "odoo-ai-integration-guide.html",               img: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop&q=80",  cat: "Odoo ERP",    date: "Apr 12, 2026" },
  { title: "Odoo vs SAP in 2026: Which ERP Is Right for You?",             url: "odoo-vs-sap-enterprise-comparison.html",       img: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400&h=225&fit=crop&q=80", cat: "Odoo ERP",    date: "Apr 8, 2026"  },
  { title: "Why Southeast Asian SMEs Are Switching to Odoo ERP",           url: "odoo-erp-sme-southeast-asia.html",             img: "https://images.unsplash.com/photo-1559526324-593bc073d938?w=400&h=225&fit=crop&q=80",  cat: "Odoo ERP",    date: "Apr 5, 2026"  },
  { title: "Vietnam's Digital Economy in 2026: AI Accelerates",             url: "vietnam-digital-economy-ai-2026.html",         img: "https://images.unsplash.com/photo-1557750255-c76072a7aad1?w=400&h=225&fit=crop&q=80",  cat: "Vietnam",     date: "Apr 28, 2026" },
  { title: "Vietnam's Tech Talent: Why Global Companies Build Dev Hubs",    url: "vietnam-tech-talent-dev-hub.html",             img: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=225&fit=crop&q=80", cat: "Vietnam",     date: "Apr 20, 2026" },
  { title: "Vietnam Software Exports Hit $8B: Becoming an AI Powerhouse",  url: "vietnam-software-exports-2026.html",           img: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=400&h=225&fit=crop&q=80", cat: "Vietnam",     date: "Apr 10, 2026" },
  { title: "Singapore's National AI Strategy 2.0: What to Know",           url: "singapore-national-ai-strategy-2026.html",     img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&h=225&fit=crop&q=80", cat: "Singapore",   date: "May 5, 2026"  },
  { title: "Singapore Smart Nation: AI Transforming Government Services",   url: "singapore-smart-nation-enterprise-ai.html",   img: "https://images.unsplash.com/photo-1570867765124-6a22e6631823?w=400&h=225&fit=crop&q=80", cat: "Singapore",   date: "Apr 30, 2026" },
  { title: "Philippines Digital Transformation 2026: AI Beyond BPO",       url: "philippines-digital-transformation-2026.html", img: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=225&fit=crop&q=80", cat: "Philippines", date: "May 8, 2026"  },
  { title: "The Philippines BPO Industry's AI Revolution",                  url: "philippines-bpo-ai-revolution.html",           img: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=400&h=225&fit=crop&q=80", cat: "Philippines", date: "May 1, 2026"  },
];

const BLOG_LANG = {
  en: { nav_about:'About', nav_gallery:'Gallery', nav_blog:'Blog', nav_careers:'Careers', nav_contact:'Contact', nav_book:'Book Now' },
  vn: { nav_about:'Giới Thiệu', nav_gallery:'Thư Viện', nav_blog:'Blog', nav_careers:'Tuyển Dụng', nav_contact:'Liên Hệ', nav_book:'Đặt Lịch' },
  ph: { nav_about:'Tungkol', nav_gallery:'Galeria', nav_blog:'Blog', nav_careers:'Karera', nav_contact:'Makipag-ugnayan', nav_book:'Mag-book' },
  de: { nav_about:'Über Uns', nav_gallery:'Galerie', nav_blog:'Blog', nav_careers:'Karriere', nav_contact:'Kontakt', nav_book:'Termin Buchen' }
};

function applyBlogLang(lang) {
  localStorage.setItem('tn_lang', lang);
  const t = BLOG_LANG[lang] || BLOG_LANG.en;
  document.querySelectorAll('.lang-btn').forEach(b => b.classList.toggle('active', b.textContent.trim().toLowerCase() === lang));
  document.querySelectorAll('[data-k]').forEach(el => { const k = el.getAttribute('data-k'); if (t[k] !== undefined) el.innerHTML = t[k]; });
}

document.addEventListener('DOMContentLoaded', function () {
  const articleWrap = document.querySelector('.article-wrap');
  if (!articleWrap) return;

  // Remove old share bar
  const oldShareBar = articleWrap.querySelector('.share-bar');
  if (oldShareBar) oldShareBar.remove();

  // ── Build TOC from h2 headings ─────────────────────────────────
  const headings = Array.from(articleWrap.querySelectorAll('.article-body h2'));
  headings.forEach((h, i) => { if (!h.id) h.id = 'section-' + i; });

  // ── Page layout: article | sidebar ────────────────────────────
  const pageLayout = document.createElement('div');
  pageLayout.className = 'article-page-layout';
  articleWrap.parentNode.insertBefore(pageLayout, articleWrap);

  const articleMain = document.createElement('main');
  articleMain.className = 'article-main';
  articleMain.appendChild(articleWrap);
  pageLayout.appendChild(articleMain);

  // ── Right sidebar ──────────────────────────────────────────────
  const sidebar = document.createElement('aside');
  sidebar.className = 'article-sidebar';

  if (headings.length > 0) {
    const toc = document.createElement('div');
    toc.className = 'toc-card';
    toc.innerHTML = `
      <p class="sidebar-card-label">In This Article</p>
      <nav class="toc-nav">
        ${headings.map(h => `<a href="#${h.id}" class="toc-link">${h.textContent.trim()}</a>`).join('')}
      </nav>`;
    sidebar.appendChild(toc);
  }

  const pageUrl   = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);
  const shareCard = document.createElement('div');
  shareCard.className = 'share-card';
  shareCard.innerHTML = `
    <p class="sidebar-card-label">Share This Article</p>
    <div class="share-card-btns">
      <a class="share-card-btn s-linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
        LinkedIn
      </a>
      <a class="share-card-btn s-twitter" href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
        X (Twitter)
      </a>
      <a class="share-card-btn s-facebook" href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
        Facebook
      </a>
      <button class="share-card-btn s-copy" id="shareCopyBtn">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
        Copy Link
      </button>
    </div>`;
  sidebar.appendChild(shareCard);
  pageLayout.appendChild(sidebar);

  // ── Recommended section below article ─────────────────────────
  const currentFile = window.location.pathname.split('/').pop() || window.location.href.split('/').pop().split('?')[0];
  const recommended = ARTICLES.filter(a => a.url !== currentFile).slice(0, 6);

  const recSection = document.createElement('section');
  recSection.className = 'rec-section';
  recSection.innerHTML = `
    <div class="rec-section-inner">
      <h3 class="rec-section-heading">More Articles</h3>
      <div class="rec-grid">
        ${recommended.map(a => `
          <a href="${a.url}" class="rec-article-card">
            <img src="${a.img}" alt="${a.title}" class="rec-article-img" loading="lazy" onerror="this.onerror=null;this.src='https://picsum.photos/seed/${a.url.replace('.html','')}/400/225'">
            <div class="rec-article-body">
              <span class="rec-article-cat">${a.cat}</span>
              <p class="rec-article-title">${a.title}</p>
              <span class="rec-article-date">${a.date}</span>
            </div>
          </a>`).join('')}
      </div>
    </div>`;

  const footer = document.querySelector('.site-footer');
  if (footer) footer.parentNode.insertBefore(recSection, footer);
  else document.body.appendChild(recSection);

  // ── Copy link handler ──────────────────────────────────────────
  const copyBtn = document.getElementById('shareCopyBtn');
  if (copyBtn) {
    const origHTML = copyBtn.innerHTML;
    copyBtn.addEventListener('click', function () {
      const done = () => {
        copyBtn.innerHTML = copyBtn.innerHTML.replace('Copy Link', 'Copied!');
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.innerHTML = origHTML; copyBtn.classList.remove('copied'); }, 2000);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(window.location.href).then(done).catch(done);
      else { const ta = document.createElement('textarea'); ta.value = window.location.href; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); document.body.removeChild(ta); done(); }
    });
  }

  // ── TOC active section tracking ────────────────────────────────
  if (headings.length > 0) {
    const tocLinks = document.querySelectorAll('.toc-link');
    const onScroll = () => {
      let idx = 0;
      headings.forEach((h, i) => { if (h.getBoundingClientRect().top < 120) idx = i; });
      tocLinks.forEach((l, i) => l.classList.toggle('active', i === idx));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Load shared booking modal ──────────────────────────────────
  if (!document.getElementById('bookingModal')) {
    const bkScript = document.createElement('script');
    bkScript.src = '../booking-modal.js';
    document.head.appendChild(bkScript);
  }

  // ── Nav: lang switcher (first) then Book Now ───────────────────
  const navRight = document.querySelector('#mainNav .nav-right');
  const navApply = navRight && navRight.querySelector('.nav-apply');
  if (navRight && navApply) {
    navApply.href = '#';
    navApply.removeAttribute('target');
    navApply.removeAttribute('rel');
    navApply.setAttribute('data-k', 'nav_book');
    navApply.setAttribute('onclick', 'openBooking();return false;');
    navApply.textContent = 'Book Now';

    const switcher = document.createElement('div');
    switcher.className = 'lang-switcher';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Language');
    switcher.innerHTML = '<button class="lang-btn" onclick="applyBlogLang(\'en\')">EN</button><button class="lang-btn" onclick="applyBlogLang(\'vn\')">VN</button><button class="lang-btn" onclick="applyBlogLang(\'ph\')">PH</button><button class="lang-btn" onclick="applyBlogLang(\'de\')">DE</button>';
    navApply.insertAdjacentElement('beforebegin', switcher);
  }

  const navLinkMap = { 'About':'nav_about', 'Gallery':'nav_gallery', 'Blog':'nav_blog', 'Careers':'nav_careers', 'Contact':'nav_contact' };
  document.querySelectorAll('.nav-links a').forEach(a => {
    const k = navLinkMap[a.textContent.trim()];
    if (k) a.setAttribute('data-k', k);
  });

  const savedLang = localStorage.getItem('tn_lang');
  if (savedLang && BLOG_LANG[savedLang]) applyBlogLang(savedLang);
  else {
    const l = (navigator.language || '').toLowerCase();
    if (l.startsWith('vi')) applyBlogLang('vn');
    else if (l.startsWith('de')) applyBlogLang('de');
    else if (l.startsWith('fil') || l.startsWith('tl')) applyBlogLang('ph');
    else applyBlogLang('en');
  }
});
