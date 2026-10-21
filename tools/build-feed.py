# -*- coding: utf-8 -*-
"""从 journal.html 生成 feed.xml（RSS 2.0）。

用法：python tools/build-feed.py
每次改了 journal.html 之后跑一次。
"""
import io
import os
import re
import html
from datetime import datetime
from xml.sax.saxutils import escape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JOURNAL = os.path.join(ROOT, "journal.html")
OUT = os.path.join(ROOT, "feed.xml")

BASE = "https://hht2006722.github.io/Website-Project/"
SITE_TITLE = "韩宏涛的观察本"
SITE_DESC = "动物摄影与拍摄笔记：隔着玻璃拍到的照片，以及每次拍摄的取舍。"
WEEKDAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def strip_tags(s):
    s = re.sub(r"<[^>]+>", "", s)
    return re.sub(r"\s+", " ", html.unescape(s)).strip()


def rfc822(date_str):
    d = datetime.strptime(date_str, "%Y-%m-%d")
    return f"{WEEKDAYS[d.weekday()]}, {d.day:02d} {MONTHS[d.month - 1]} {d.year} 00:00:00 +0800"


def main():
    text = io.open(JOURNAL, encoding="utf-8").read()

    articles = re.findall(
        r'<article id="([\w\-]+)"[^>]*>(.*?)</article>', text, re.S
    )
    if not articles:
        raise SystemExit("没有解析到任何 article")

    items = []
    for aid, body in articles:
        m = re.search(r"<h2>(.*?)</h2>", body, re.S)
        title = strip_tags(m.group(1)) if m else aid

        m = re.search(r'<time datetime="([\d\-]+)"', body)
        date = m.group(1) if m else "2026-10-19"

        # 第一段没有 class 的正文段落（跳过 post-meta、photo-note 等）
        paras = re.findall(r"<p(?: class=\"([^\"]*)\")?>(.*?)</p>", body, re.S)
        summary = ""
        for cls, content in paras:
            if cls and "post-meta" in cls:
                continue
            summary = strip_tags(content)
            if summary:
                break
        # 分类：post-meta 里「· 做站记录」那半截
        kind = ""
        meta = re.search(r'<p class="post-meta">([\s\S]*?)</p>', body)
        if meta:
            raw = meta.group(1)
            # 去掉「最后更新」那一小段，只留发布日期和分类
            raw = re.sub(r'<span class="post-updated">[\s\S]*?</span>', '', raw)
            parts = [x.strip() for x in re.sub(r"<[^>]+>", "", raw).split("·")]
            if len(parts) > 1:
                kind = parts[1].strip()

        if len(summary) > 140:
            summary = summary[:140].rstrip() + "…"

        link = f"{BASE}journal.html#{aid}"
        items.append({
            "kind": kind,
            "title": title,
            "link": link,
            "guid": link,
            "date": date,
            "summary": summary,
        })

    now = datetime.now()
    build = f"{WEEKDAYS[now.weekday()]}, {now.day:02d} {MONTHS[now.month - 1]} {now.year} " \
            f"{now.hour:02d}:{now.minute:02d}:00 +0800"

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<?xml-stylesheet type="text/xsl" href="feed.xsl"?>',
        '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">',
        "  <channel>",
        f"    <title>{escape(SITE_TITLE)}</title>",
        f"    <link>{escape(BASE)}</link>",
        f"    <description>{escape(SITE_DESC)}</description>",
        "    <language>zh-CN</language>",
        f"    <lastBuildDate>{build}</lastBuildDate>",
        f'    <atom:link href="{escape(BASE)}feed.xml" rel="self" type="application/rss+xml"/>',
    ]
    for it in items:
        block = [
            "    <item>",
            f"      <title>{escape(it['title'])}</title>",
            f"      <link>{escape(it['link'])}</link>",
            f'      <guid isPermaLink="true">{escape(it['guid'])}</guid>',
            f"      <pubDate>{rfc822(it['date'])}</pubDate>",
            f"      <atom:updated>{it['date']}</atom:updated>",
            f"      <description>{escape(it['summary'])}</description>",
            (f"      <category>{escape(it['kind'])}</category>" if it.get("kind") else None),
            "    </item>",
        ]
        lines += [x for x in block if x]
    lines += ["  </channel>", "</rss>"]

    with io.open(OUT, "w", encoding="utf-8", newline="\n") as f:
        f.write("\n".join(lines) + "\n")

    print(f"OK feed.xml：{len(items)} 条")
    for it in items:
        print(f"  {it['date']}  {it['title']}")


if __name__ == "__main__":
    main()
