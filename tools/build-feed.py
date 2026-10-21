# -*- coding: utf-8 -*-
"""从笔记页生成 RSS，支持中英两种语言。
Generate an RSS feed from the notes page, for either language.

用法：
    python tools/build-feed.py              # 英文：journal.html -> feed.xml
    python tools/build-feed.py --lang zh    # 中文：zh/journal.html -> zh/feed.xml
"""
import argparse
import html
import io
import os
import re
from datetime import datetime
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BASE = "https://hht2006722.github.io/Website-Project/"

SITES = {
    "en": {
        "dir": "",
        "src": "journal.html",
        "out": "feed.xml",
        "xsl": "feed.xsl",
        "title": "Han Hongtao's Field Notes",
        "desc": "Animal photography and shooting notes: photos taken through glass, and what each frame cost.",
        "lang": "en",
    },
    "zh": {
        "dir": "zh/",
        "src": "zh/journal.html",
        "out": "zh/feed.xml",
        "xsl": "feed.xsl",
        "title": "韩宏涛的观察本",
        "desc": "动物摄影与拍摄笔记：隔着玻璃拍到的照片，以及每次拍摄的取舍。",
        "lang": "zh-CN",
    },
}

WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def strip_tags(s):
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def rfc822(date_str):
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{WEEKDAYS[d.weekday()]}, {d.day:02d} {MONTHS[d.month - 1]} {d.year} 00:00:00 +0800"


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--lang", choices=["en", "zh"], default="en")
    args = ap.parse_args()

    site = SITES[args.lang]
    base = BASE + site["dir"]
    src = os.path.join(ROOT, *site["src"].split("/"))
    out = os.path.join(ROOT, *site["out"].split("/"))

    with io.open(src, encoding="utf-8") as f:
        text = f.read()

    articles = re.findall(r'<article id="([\w\-]+)"[^>]*>(.*?)</article>', text, re.S)
    if not articles:
        raise SystemExit("没有解析到任何 article")

    items = []
    for aid, body in articles:
        m = re.search(r"<h2>(.*?)</h2>", body, re.S)
        title = strip_tags(m.group(1)) if m else aid

        m = re.search(r'<time datetime="([\d\-]+)"', body)
        date = m.group(1) if m else "2026-10-19"

        # 分类：post-meta 里「· 做站记录 / Build notes」那半截（先剥掉「最后更新」）
        # Category: the part after the dot in post-meta, once the "updated" span is removed
        kind = ""
        meta = re.search(r'<p class="post-meta">([\s\S]*?)</p>', body)
        if meta:
            raw = re.sub(r'<span class="post-updated">[\s\S]*?</span>', "", meta.group(1))
            parts = [x.strip() for x in re.sub(r"<[^>]+>", "", raw).split("·")]
            if len(parts) > 1:
                kind = parts[1]

        paras = re.findall(r'<p(?: class="([^"]*)")?>(.*?)</p>', body, re.S)
        summary = ""
        for cls, content in paras:
            if cls and "post-meta" in cls:
                continue
            summary = strip_tags(content)
            if summary:
                break
        if len(summary) > 140:
            summary = summary[:140].rstrip() + "…"

        link = f"{base}journal.html#{aid}"
        items.append({"kind": kind, "title": title, "link": link,
                      "guid": link, "date": date, "summary": summary})

    now = datetime.now()
    build = (f"{WEEKDAYS[now.weekday()]}, {now.day:02d} {MONTHS[now.month - 1]} {now.year} "
             f"{now.hour:02d}:{now.minute:02d}:00 +0800")

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        f'<?xml-stylesheet type="text/xsl" href="{site["xsl"]}"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "  <channel>",
        f"    <title>{escape(site['title'])}</title>",
        f"    <link>{escape(base)}</link>",
        f"    <description>{escape(site['desc'])}</description>",
        f"    <language>{site['lang']}</language>",
        f"    <lastBuildDate>{build}</lastBuildDate>",
        f'    <atom:link href="{escape(base)}feed.xml" rel="self" type="application/rss+xml"/>',
    ]

    for it in items:
        block = [
            "    <item>",
            f"      <title>{escape(it['title'])}</title>",
            f"      <link>{escape(it['link'])}</link>",
            f'      <guid isPermaLink="true">{escape(it["guid"])}</guid>',
            f"      <pubDate>{rfc822(it['date'])}</pubDate>",
            f"      <atom:updated>{it['date']}</atom:updated>",
            f"      <description>{escape(it['summary'])}</description>",
            (f"      <category>{escape(it['kind'])}</category>" if it["kind"] else None),
            "    </item>",
        ]
        lines += [x for x in block if x]

    lines += ["  </channel>", "</rss>"]

    with io.open(out, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")

    print(f"OK {site['out']}：{len(items)} 条")


if __name__ == "__main__":
    main()
