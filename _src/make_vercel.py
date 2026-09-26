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
INLINE_SCRIPT = re.compile(r"<script(?![^>]*\bsrc=)([^>]*)>(.*?)</script>", re.S)

# Google's regional domains used by Ads for visitors in our markets (CSP cannot wildcard a TLD).
GOOGLE_REGIONAL = ["https://www.google.com.sg", "https://www.google.com.vn",
                   "https://www.google.com.ph", "https://www.google.de"]

REDIRECTS = [
    # the 20 articles moved from /ai-article/<slug>.html to /blog/<slug>
    ("/ai-article/:slug.html", "/blog/:slug"),
    ("/ai-article/:slug", "/blog/:slug"),
    ("/ai-article", "/blog"),
    ("/ai-article/", "/blog"),
    # the old site served these as directories; the new one serves files
    ("/blog/", "/blog"),
    ("/careers/", "/careers"),
    ("/gallery/", "/gallery"),
    ("/privacy/", "/privacy"),
    ("/terms/", "/terms"),
    # pages that no longer exist on their own
    ("/contact", "/company"),
    ("/contact/", "/company"),
    ("/odoo-erp-singapore", "/solutions/odoo-erp"),
    ("/odoo-erp-singapore/", "/solutions/odoo-erp"),
    ("/ai-automation-vietnam", "/solutions/ai-automation"),
    ("/ai-automation-vietnam/", "/solutions/ai-automation"),
    # the internal landing page (/lp/) and its predecessor were removed on 2026-09-26.
    # ":path*" does not match a bare trailing slash on Vercel, so each form is listed.
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
            if "application/ld+json" in attrs:
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
