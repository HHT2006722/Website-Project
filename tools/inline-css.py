# -*- coding: utf-8 -*-
"""把 css/styles.css 同步进每个页面的 <style>，并保证 <html> 上有 js 类。

为什么内联：实测 GitHub Pages 的 styles.css 偶发要 9-11 秒才返回，
而它是渲染阻塞资源——卡住时页面就是无样式状态，弱网/微信里看起来
像「打不开」。内联之后首屏不再依赖第二个网络请求。

用法：python tools/inline-css.py
每次改完 css/styles.css 都要跑一次（脚本会替换已有的 <style> 内容）。
"""
import io, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS_PATH = os.path.join(ROOT, "css", "styles.css")
PAGES = ["index.html", "works.html", "journal.html", "about.html", "contact.html", "404.html",
         "zh/index.html", "zh/works.html", "zh/journal.html", "zh/about.html",
         "zh/contact.html", "zh/404.html"]

JS_FLAG = "<script>document.documentElement.classList.add('js');</script>\n"
HEADER = "    /* 本段由 tools/inline-css.py 从 css/styles.css 生成；改样式请改源文件后重跑 */\n"

LINK_RE = re.compile(r'[ \t]*<link rel="stylesheet" href="css/styles\.css">\n')
# 匹配脚本生成的 style 块（含标记注释），整段替换
STYLE_RE = re.compile(r'  <style>\n    /\* 本段由 tools/inline-css\.py.*?\n  </style>\n', re.S)


def main():
    with io.open(CSS_PATH, encoding="utf-8") as f:
        css = f.read()
    if "</style" in css:
        raise SystemExit("CSS 里出现了 </style，无法安全内联")

    block = "  <style>\n" + HEADER + css.rstrip("\n") + "\n  </style>\n"

    for name in PAGES:
        p = os.path.join(ROOT, *name.split("/"))
        with io.open(p, encoding="utf-8") as f:
            s = f.read()

        changed = False

        if LINK_RE.search(s):
            s = LINK_RE.sub(block, s, count=1)
            changed = True
            how = "link → style"
        elif STYLE_RE.search(s):
            s = STYLE_RE.sub(block, s, count=1)
            changed = True
            how = "刷新 style"
        else:
            how = "未找到样式位置"

        if "classList.add('js')" not in s:
            s = s.replace("<head>\n", "<head>\n  " + JS_FLAG, 1)
            changed = True

        if changed:
            with io.open(p, "w", encoding="utf-8", newline="\n") as f:
                f.write(s)
            print(f"OK   {name}: {how}（{len(css)} 字符）")
        else:
            print(f"SKIP {name}: {how}")


if __name__ == "__main__":
    main()
