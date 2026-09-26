"""Generate vercel.json: clean URLs, redirects for every retired URL, and the security
headers. Run automatically at the end of `python _src/build.py`.

The Content-Security-Policy allows inline scripts by SHA-256 hash instead of
'unsafe-inline'. The hashes are computed here from the built pages, so any change to an
inline snippet (the intro gate, the consent defaults, the Google tag loaders) is picked
up on the next build. Never hand-edit the hashes in vercel.json.
"""
import base64
import hashlib
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
# Case-insensitive and tolerant of whitespace/attributes in the closing tag: a missed
# inline script would not get a hash and the CSP would silently block it.
INLINE_SCRIPT = re.compile(r"<script\b(?![^>]*\bsrc\s*=)([^>]*)>(.*?)</script\b[^>]*>", re.S | re.I)

# Google's regional domains used by Ads for visitors in our markets (CSP cannot wildcard a TLD).
GOOGLE_REGIONAL = ["https://www.google.com.sg", "https://www.google.com.vn",
                   "https://www.google.com.ph", "https://www.google.de"]

REDIRECTS = [
    # --- retired on 2026-09-26 when the site became pure v2 -----------------------
    # The old blog (20 articles, English + Vietnamese), careers and gallery were removed.
    # Each old article URL - in both its /ai-article/ and /blog/ forms - goes to the
    # closest v2 page so its search history carries over instead of turning into 404s.
    ("/blog/rag-systems-enterprise-guide", "/solutions/ai-knowledge"),
    ("/blog/rag-systems-enterprise-guide.html", "/solutions/ai-knowledge"),
    ("/ai-article/rag-systems-enterprise-guide", "/solutions/ai-knowledge"),
    ("/ai-article/rag-systems-enterprise-guide.html", "/solutions/ai-knowledge"),
    ("/blog/ai-agents-enterprise-automation", "/solutions/ai-automation"),
    ("/blog/ai-agents-enterprise-automation.html", "/solutions/ai-automation"),
    ("/ai-article/ai-agents-enterprise-automation", "/solutions/ai-automation"),
    ("/ai-article/ai-agents-enterprise-automation.html", "/solutions/ai-automation"),
    ("/blog/ai-agent-governance-2025", "/solutions/ai-automation"),
    ("/blog/ai-agent-governance-2025.html", "/solutions/ai-automation"),
    ("/ai-article/ai-agent-governance-2025", "/solutions/ai-automation"),
    ("/ai-article/ai-agent-governance-2025.html", "/solutions/ai-automation"),
    ("/blog/odoo-ai-integration-guide", "/odoo/ai-integration"),
    ("/blog/odoo-ai-integration-guide.html", "/odoo/ai-integration"),
    ("/ai-article/odoo-ai-integration-guide", "/odoo/ai-integration"),
    ("/ai-article/odoo-ai-integration-guide.html", "/odoo/ai-integration"),
    ("/blog/odoo-18-features-upgrade-guide", "/solutions/odoo-erp"),
    ("/blog/odoo-18-features-upgrade-guide.html", "/solutions/odoo-erp"),
    ("/ai-article/odoo-18-features-upgrade-guide", "/solutions/odoo-erp"),
    ("/ai-article/odoo-18-features-upgrade-guide.html", "/solutions/odoo-erp"),
    ("/blog/odoo-erp-sme-southeast-asia", "/solutions/odoo-erp"),
    ("/blog/odoo-erp-sme-southeast-asia.html", "/solutions/odoo-erp"),
    ("/ai-article/odoo-erp-sme-southeast-asia", "/solutions/odoo-erp"),
    ("/ai-article/odoo-erp-sme-southeast-asia.html", "/solutions/odoo-erp"),
    ("/blog/odoo-vs-sap-enterprise-comparison", "/solutions/enterprise"),
    ("/blog/odoo-vs-sap-enterprise-comparison.html", "/solutions/enterprise"),
    ("/ai-article/odoo-vs-sap-enterprise-comparison", "/solutions/enterprise"),
    ("/ai-article/odoo-vs-sap-enterprise-comparison.html", "/solutions/enterprise"),
    ("/blog/big-tech-ai-infrastructure-2026", "/solutions/ai"),
    ("/blog/big-tech-ai-infrastructure-2026.html", "/solutions/ai"),
    ("/ai-article/big-tech-ai-infrastructure-2026", "/solutions/ai"),
    ("/ai-article/big-tech-ai-infrastructure-2026.html", "/solutions/ai"),
    ("/blog/context-engineering-new-discipline", "/solutions/ai"),
    ("/blog/context-engineering-new-discipline.html", "/solutions/ai"),
    ("/ai-article/context-engineering-new-discipline", "/solutions/ai"),
    ("/ai-article/context-engineering-new-discipline.html", "/solutions/ai"),
    ("/blog/github-copilot-per-token-pricing", "/solutions/ai"),
    ("/blog/github-copilot-per-token-pricing.html", "/solutions/ai"),
    ("/ai-article/github-copilot-per-token-pricing", "/solutions/ai"),
    ("/ai-article/github-copilot-per-token-pricing.html", "/solutions/ai"),
    ("/blog/gpt5-openai-agentic-ai-2025", "/solutions/ai"),
    ("/blog/gpt5-openai-agentic-ai-2025.html", "/solutions/ai"),
    ("/ai-article/gpt5-openai-agentic-ai-2025", "/solutions/ai"),
    ("/ai-article/gpt5-openai-agentic-ai-2025.html", "/solutions/ai"),
    ("/blog/lg-nvidia-physical-ai-era", "/solutions/ai"),
    ("/blog/lg-nvidia-physical-ai-era.html", "/solutions/ai"),
    ("/ai-article/lg-nvidia-physical-ai-era", "/solutions/ai"),
    ("/ai-article/lg-nvidia-physical-ai-era.html", "/solutions/ai"),
    ("/blog/local-llm-on-premise-enterprise", "/solutions/ai"),
    ("/blog/local-llm-on-premise-enterprise.html", "/solutions/ai"),
    ("/ai-article/local-llm-on-premise-enterprise", "/solutions/ai"),
    ("/ai-article/local-llm-on-premise-enterprise.html", "/solutions/ai"),
    ("/blog/philippines-bpo-ai-revolution", "/solutions/ai"),
    ("/blog/philippines-bpo-ai-revolution.html", "/solutions/ai"),
    ("/ai-article/philippines-bpo-ai-revolution", "/solutions/ai"),
    ("/ai-article/philippines-bpo-ai-revolution.html", "/solutions/ai"),
    ("/blog/singapore-national-ai-strategy-2026", "/solutions/ai"),
    ("/blog/singapore-national-ai-strategy-2026.html", "/solutions/ai"),
    ("/ai-article/singapore-national-ai-strategy-2026", "/solutions/ai"),
    ("/ai-article/singapore-national-ai-strategy-2026.html", "/solutions/ai"),
    ("/blog/singapore-smart-nation-enterprise-ai", "/solutions/ai"),
    ("/blog/singapore-smart-nation-enterprise-ai.html", "/solutions/ai"),
    ("/ai-article/singapore-smart-nation-enterprise-ai", "/solutions/ai"),
    ("/ai-article/singapore-smart-nation-enterprise-ai.html", "/solutions/ai"),
    ("/blog/philippines-digital-transformation-2026", "/"),
    ("/blog/philippines-digital-transformation-2026.html", "/"),
    ("/ai-article/philippines-digital-transformation-2026", "/"),
    ("/ai-article/philippines-digital-transformation-2026.html", "/"),
    ("/blog/vietnam-digital-economy-ai-2026", "/"),
    ("/blog/vietnam-digital-economy-ai-2026.html", "/"),
    ("/ai-article/vietnam-digital-economy-ai-2026", "/"),
    ("/ai-article/vietnam-digital-economy-ai-2026.html", "/"),
    ("/blog/vietnam-software-exports-2026", "/company"),
    ("/blog/vietnam-software-exports-2026.html", "/company"),
    ("/ai-article/vietnam-software-exports-2026", "/company"),
    ("/ai-article/vietnam-software-exports-2026.html", "/company"),
    ("/blog/vietnam-tech-talent-dev-hub", "/company"),
    ("/blog/vietnam-tech-talent-dev-hub.html", "/company"),
    ("/ai-article/vietnam-tech-talent-dev-hub", "/company"),
    ("/ai-article/vietnam-tech-talent-dev-hub.html", "/company"),
    ("/blog", "/"), ("/blog/", "/"), ("/blog/:path*", "/"), ("/blog.html", "/"),
    ("/ai-article", "/"), ("/ai-article/", "/"), ("/ai-article/:path*", "/"),
    ("/careers", "/company"), ("/careers/", "/company"), ("/careers.html", "/company"),
    ("/gallery", "/company"), ("/gallery/", "/company"), ("/gallery.html", "/company"),
    # --- the old site served these as directories; v2 serves files -----------------
    ("/privacy/", "/privacy"),
    ("/terms/", "/terms"),
    # --- old pages with a v2 equivalent ----------------------------------------------
    ("/contact", "/company"), ("/contact/", "/company"),
    ("/odoo-erp-singapore", "/solutions/odoo-erp"), ("/odoo-erp-singapore/", "/solutions/odoo-erp"),
    ("/ai-automation-vietnam", "/solutions/ai-automation"), ("/ai-automation-vietnam/", "/solutions/ai-automation"),
    # --- the internal landing page and its predecessor, removed 2026-09-26 ----------
    # (":path*" does not match a bare trailing slash on Vercel, so each form is listed)
    ("/lp", "/"), ("/lp/", "/"), ("/lp/:path*", "/"),
    ("/landing_page", "/"), ("/landing_page/", "/"), ("/landing_page/:path*", "/"),
]


def inline_script_hashes():
    """sha256 of every distinct executable inline <script> across the built site."""
    hashes = set()
    for page in ROOT.rglob("*.html"):
        if any(part.startswith((".", "_")) for part in page.relative_to(ROOT).parts):
            continue
        html = page.read_text(encoding="utf-8")
        for attrs, body in INLINE_SCRIPT.findall(html):
            if "application/ld+json" in attrs.lower():
                continue            # data, never executed
            digest = hashlib.sha256(body.encode("utf-8")).digest()
            hashes.add("'sha256-" + base64.b64encode(digest).decode() + "'")
    return sorted(hashes)


def csp(hashes):
    # GA4 sends hits to the BARE analytics.google.com (a *.analytics.google.com wildcard
    # does not match the apex) and to stats.g.doubleclick.net - both caught blocked in a
    # browser test on 2026-09-26, so they are listed explicitly.
    google_img = ["https://*.google-analytics.com", "https://analytics.google.com",
                  "https://*.analytics.google.com", "https://*.googletagmanager.com",
                  "https://*.g.doubleclick.net", "https://www.google.com",
                  "https://pagead2.googlesyndication.com"] + GOOGLE_REGIONAL
    return "; ".join([
        "default-src 'self'",
        # Google tag (GA4 + Ads) and the two Tag Manager containers. Both containers were
        # checked on 2026-09-26: they hold no Custom HTML tags, so no 'unsafe-inline'.
        "script-src 'self' " + " ".join(hashes) + " https://*.googletagmanager.com "
        "https://www.googleadservices.com https://googleads.g.doubleclick.net "
        "https://www.google.com https://pagead2.googlesyndication.com",
        # JS-built markup carries style="--i:n" stagger attributes, and the consent banner
        # is styled inline, so inline styles stay allowed
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
        "font-src 'self' https://fonts.gstatic.com",
        # unsplash: blog covers; odoocdn: official app screenshots on the Odoo pages;
        # i.ytimg: YouTube facade thumbnails; the rest: Google Analytics / Ads pixels
        "img-src 'self' data: https://images.unsplash.com https://odoocdn.com https://i.ytimg.com "
        + " ".join(google_img),
        "connect-src 'self' https://formsubmit.co https://*.google-analytics.com "
        "https://analytics.google.com https://*.analytics.google.com https://*.googletagmanager.com "
        "https://google.com https://www.google.com https://*.g.doubleclick.net https://ad.doubleclick.net "
        "https://pagead2.googlesyndication.com https://www.googleadservices.com "
        + " ".join(GOOGLE_REGIONAL),
        "frame-src https://www.youtube-nocookie.com https://www.googletagmanager.com https://td.doubleclick.net",
        "media-src 'self' https://download.odoocdn.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self' https://formsubmit.co",
        "frame-ancestors 'self'",
        "upgrade-insecure-requests",
    ])


def write_vercel():
    hashes = inline_script_hashes()
    common = [
        {"key": "Content-Security-Policy", "value": csp(hashes)},
        # No includeSubDomains yet: smartweb / smartpos / designs live on other servers
        # whose HTTPS is not ours to guarantee. Add it (and preload) once every subdomain
        # is verified HTTPS.
        {"key": "Strict-Transport-Security", "value": "max-age=31536000"},
        {"key": "X-Content-Type-Options", "value": "nosniff"},
        {"key": "X-Frame-Options", "value": "SAMEORIGIN"},
        {"key": "Referrer-Policy", "value": "strict-origin-when-cross-origin"},
        {"key": "Permissions-Policy",
         "value": "camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()"},
    ]
    config = {
        "cleanUrls": True,
        "redirects": [{"source": s, "destination": d, "permanent": True} for s, d in REDIRECTS],
        "headers": [
            {"source": "/(.*)", "headers": common},
            # css/js/img are versioned by ?v=<content hash>, so they can be cached forever;
            # assets/data/chat-index.json is not, so it is deliberately left out
            {"source": "/assets/(css|js|img)/(.*)",
             "headers": [{"key": "Cache-Control", "value": "public, max-age=31536000, immutable"}]},
        ],
    }
    (ROOT / "vercel.json").write_text(json.dumps(config, indent=2) + "\n", encoding="utf-8")
    return len(hashes)


if __name__ == "__main__":
    print("vercel.json written,", write_vercel(), "inline script hashes")
