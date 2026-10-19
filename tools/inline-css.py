# -*- coding: utf-8 -*-
"""把 css/styles.css 内联进每个页面，并加上无 JS / 老浏览器的兜底。

为什么内联：实测 GitHub Pages 的 styles.css 偶发要 9-11 秒才返回，
而它是渲染阻塞资源——卡住时页面就是无样式状态，弱网/微信里看起来
像「打不开」。内联之后首屏不再依赖第二个网络请求。

用法：python tools/inline-css.py
修改样式请改 css/styles.css，然后重新运行本脚本。
"""
import io, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS_PATH = os.path.join(ROOT, "css", "styles.css")
PAGES = ["index.html", "works.html", "journal.html", "about.html", "contact.html", "404.html"]

LINK_RE = re.compile(r'[ \t]*<link rel="stylesheet" href="css/styles\.css">\n')
JS_FLAG = '<script>document.documentElement.classList.add(\'js\');</script>\n'
STYLE_OPEN = '  <style>\n    /* 本段由 tools/inline-css.py 从 css/styles.css 生成；改样式请改源文件后重跑 */\n'


def main():
    with io.open(CSS_PATH, encoding="utf-8") as f:
        css = f.read()
    if "</style" in css:
        raise SystemExit("CSS 里出现了 </style，无法安全内联")

    block = STYLE_OPEN + css.rstrip("\n") + "\n  </style>\n"

    for name in PAGES:
        p = os.path.join(ROOT, name)
        with io.open(p, encoding="utf-8") as f:
            s = f.read()

        has_js_flag = "classList.add('js')" in s
        has_inline = LINK_RE.search(s) is None

        if has_inline and has_js_flag:
            print(f"SKIP {name}: 已内联")
            continue

        if not has_inline:
            s = LINK_RE.sub(block, s, count=1)
        if not has_js_flag:
            # 加在 <head> 开头，早于样式解析，避免闪烁
            s = s.replace("<head>\n", "<head>\n  " + JS_FLAG, 1)

        with io.open(p, "w", encoding="utf-8", newline="\n") as f:
            f.write(s)
        print(f"OK   {name}: 内联 CSS({len(css)} 字符) + js 标记")


if __name__ == "__main__":
    main()
