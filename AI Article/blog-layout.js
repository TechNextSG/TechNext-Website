/* =============================================================
   TechNext Blog — 3-Column Layout Enhancement
   Adds: sticky share sidebar (left) + recommended articles (right)
   ============================================================= */

const ARTICLES = [
  { title: "GPT-5: OpenAI's Most Capable Agentic AI Model Yet",            url: "gpt5-openai-agentic-ai-2025.html",            img: "https://picsum.photos/seed/gpt5ai2026/400/225",    cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "Big Tech AI Infrastructure Spending: Q1 2026 Earnings",         url: "big-tech-ai-infrastructure-2026.html",         img: "https://picsum.photos/seed/bigtech26/400/225",     cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "LG and NVIDIA: The Physical AI Era Has Officially Begun",       url: "lg-nvidia-physical-ai-era.html",               img: "https://picsum.photos/seed/lgnvidia26/400/225",    cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "AI Agent Governance: Regulators Are Flagging Control Gaps",     url: "ai-agent-governance-2025.html",                img: "https://picsum.photos/seed/aigovern/400/225",      cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "GitHub Copilot Moves to Per-Token Pricing",                     url: "github-copilot-per-token-pricing.html",        img: "https://picsum.photos/seed/githubtoken/400/225",   cat: "AI & Tech",   date: "May 2, 2026"  },
  { title: "AI Agents in 2026: Reshaping Enterprise Operations",            url: "ai-agents-enterprise-automation.html",         img: "https://picsum.photos/seed/aiagent26/400/225",     cat: "AI & Tech",   date: "Apr 28, 2026" },
  { title: "RAG Systems for Enterprise: The Complete Guide",                url: "rag-systems-enterprise-guide.html",            img: "https://picsum.photos/seed/ragsystem/400/225",     cat: "AI & Tech",   date: "Apr 25, 2026" },
  { title: "Local LLM Deployment: Running AI On-Premise",                   url: "local-llm-on-premise-enterprise.html",         img: "https://picsum.photos/seed/localllmx/400/225",     cat: "AI & Tech",   date: "Apr 22, 2026" },
  { title: "Context Engineering: The New Discipline for AI Systems",        url: "context-engineering-new-discipline.html",      img: "https://picsum.photos/seed/contexte/400/225",      cat: "AI & Tech",   date: "Apr 18, 2026" },
  { title: "Odoo 18: New Features and the Enterprise Upgrade Decision",     url: "odoo-18-features-upgrade-guide.html",          img: "https://picsum.photos/seed/odoo18f/400/225",       cat: "Odoo ERP",    date: "Apr 15, 2026" },
  { title: "Integrating AI with Odoo ERP: Implementation Guide",           url: "odoo-ai-integration-guide.html",               img: "https://picsum.photos/seed/odooaiint/400/225",     cat: "Odoo ERP",    date: "Apr 12, 2026" },
  { title: "Odoo vs SAP in 2026: Which ERP Is Right for You?",             url: "odoo-vs-sap-enterprise-comparison.html",       img: "https://picsum.photos/seed/odoosap6/400/225",      cat: "Odoo ERP",    date: "Apr 8, 2026"  },
  { title: "Why Southeast Asian SMEs Are Switching to Odoo ERP",           url: "odoo-erp-sme-southeast-asia.html",             img: "https://picsum.photos/seed/odoosea6/400/225",      cat: "Odoo ERP",    date: "Apr 5, 2026"  },
  { title: "Vietnam's Digital Economy in 2026: AI Accelerates",             url: "vietnam-digital-economy-ai-2026.html",         img: "https://picsum.photos/seed/vndigital/400/225",     cat: "Vietnam",     date: "Apr 28, 2026" },
  { title: "Vietnam's Tech Talent: Why Global Companies Build Dev Hubs",    url: "vietnam-tech-talent-dev-hub.html",             img: "https://picsum.photos/seed/vntalent/400/225",      cat: "Vietnam",     date: "Apr 20, 2026" },
  { title: "Vietnam Software Exports Hit $8B: Becoming an AI Powerhouse",  url: "vietnam-software-exports-2026.html",           img: "https://picsum.photos/seed/vnsoftex/400/225",      cat: "Vietnam",     date: "Apr 10, 2026" },
  { title: "Singapore's National AI Strategy 2.0: What to Know",           url: "singapore-national-ai-strategy-2026.html",     img: "https://picsum.photos/seed/sgaistrat/400/225",     cat: "Singapore",   date: "May 5, 2026"  },
  { title: "Singapore Smart Nation: AI Transforming Government Services",   url: "singapore-smart-nation-enterprise-ai.html",   img: "https://picsum.photos/seed/sgsmart/400/225",       cat: "Singapore",   date: "Apr 30, 2026" },
  { title: "Philippines Digital Transformation 2026: AI Beyond BPO",       url: "philippines-digital-transformation-2026.html", img: "https://picsum.photos/seed/phdigital/400/225",     cat: "Philippines", date: "May 8, 2026"  },
  { title: "The Philippines BPO Industry's AI Revolution",                  url: "philippines-bpo-ai-revolution.html",           img: "https://picsum.photos/seed/phbpoai/400/225",       cat: "Philippines", date: "May 1, 2026"  },
];

const ICONS = {
  linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>`,
  twitter:  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>`,
  facebook: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>`,
  copy:     `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`,
  check:    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" width="18" height="18"><polyline points="20 6 9 17 4 12"/></svg>`,
};

document.addEventListener('DOMContentLoaded', function () {
  const articleWrap = document.querySelector('.article-wrap');
  if (!articleWrap) return;

  // Remove existing share bar — replaced by left sidebar
  const existingShareBar = articleWrap.querySelector('.share-bar');
  if (existingShareBar) existingShareBar.remove();

  const pageUrl   = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  // ── LEFT SIDEBAR: vertical share icons ────────────────────────
  const shareSidebar = document.createElement('aside');
  shareSidebar.className = 'share-sidebar';
  shareSidebar.innerHTML = `
    <div class="share-sticky">
      <span class="share-v-label">Share</span>
      <a class="share-v-btn s-linkedin" href="https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}" target="_blank" rel="noopener" title="Share on LinkedIn">${ICONS.linkedin}</a>
      <a class="share-v-btn s-twitter"  href="https://twitter.com/intent/tweet?url=${pageUrl}&text=${pageTitle}" target="_blank" rel="noopener" title="Share on X">${ICONS.twitter}</a>
      <a class="share-v-btn s-facebook" href="https://www.facebook.com/sharer/sharer.php?u=${pageUrl}" target="_blank" rel="noopener" title="Share on Facebook">${ICONS.facebook}</a>
      <button class="share-v-btn s-copy" id="shareVCopy" title="Copy link">${ICONS.copy}</button>
    </div>
  `;

  // ── CENTER: article main ───────────────────────────────────────
  const articleMain = document.createElement('main');
  articleMain.className = 'article-main';

  // ── RIGHT SIDEBAR: recommended articles ───────────────────────
  const currentFile = window.location.pathname.split('/').pop()
    || window.location.href.split('/').pop().split('?')[0];
  const recommended = ARTICLES.filter(a => a.url !== currentFile).slice(0, 5);

  const recSidebar = document.createElement('aside');
  recSidebar.className = 'recommended-sidebar';
  recSidebar.innerHTML = `
    <h3 class="rec-heading">More Articles</h3>
    ${recommended.map(a => `
      <a href="${a.url}" class="rec-card">
        <img src="${a.img}" alt="${a.title}" class="rec-card-img" loading="lazy">
        <div class="rec-card-body">
          <span class="rec-cat">${a.cat}</span>
          <p class="rec-title">${a.title}</p>
          <span class="rec-date">${a.date}</span>
        </div>
      </a>
    `).join('')}
  `;

  // ── BUILD LAYOUT ───────────────────────────────────────────────
  const layout = document.createElement('div');
  layout.className = 'article-layout';
  articleWrap.parentNode.insertBefore(layout, articleWrap);
  articleMain.appendChild(articleWrap);
  layout.appendChild(shareSidebar);
  layout.appendChild(articleMain);
  layout.appendChild(recSidebar);

  // Copy link handler
  const copyBtn = document.getElementById('shareVCopy');
  if (copyBtn) {
    copyBtn.addEventListener('click', function () {
      const copy = () => {
        copyBtn.innerHTML = ICONS.check;
        copyBtn.classList.add('copied');
        setTimeout(() => { copyBtn.innerHTML = ICONS.copy; copyBtn.classList.remove('copied'); }, 2000);
      };
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href).then(copy).catch(copy);
      } else {
        const ta = document.createElement('textarea');
        ta.value = window.location.href;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        copy();
      }
    });
  }
});
