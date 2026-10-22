# -*- coding: utf-8 -*-
"""Tell IndexNow engines (Bing, Yandex, Seznam, Naver, Yep) that pages changed. Run after a deploy is live:
    python -B _src/indexnow.py                 # every URL in sitemap.xml
    python -B _src/indexnow.py bir-cas blog/x  # just these paths
Google does not use IndexNow: use Search Console (sitemap + URL inspection) for Google."""
import json
import re
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
import sitedata as S  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
HOST = re.sub(r"^https?://|/$", "", S.SITE_URL)


def main(paths):
    if paths:
        urls = [S.SITE_URL + p.lstrip("/") for p in paths]
    else:
        urls = re.findall(r"<loc>([^<]+)</loc>", (ROOT / "sitemap.xml").read_text(encoding="utf-8"))
    body = json.dumps({"host": HOST, "key": S.INDEXNOW_KEY, "keyLocation": f"{S.SITE_URL}{S.INDEXNOW_KEY}.txt",
                       "urlList": urls}).encode("utf-8")
    req = urllib.request.Request("https://api.indexnow.org/indexnow", data=body, method="POST",
                                 headers={"Content-Type": "application/json; charset=utf-8"})
    try:
        with urllib.request.urlopen(req, timeout=30) as r:
            print(f"IndexNow: HTTP {r.status} for {len(urls)} URLs")
    except urllib.error.HTTPError as e:
        print(f"IndexNow: HTTP {e.code} {e.reason} for {len(urls)} URLs")


if __name__ == "__main__":
    main(sys.argv[1:])
