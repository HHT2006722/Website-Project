# -*- coding: utf-8 -*-
"""把照片导出成三档 WebP，供 srcset 使用。

用法：
    python tools/build-images.py 照片文件夹

约定：
    * 按文件名排序，依次输出为 img/work-01 … work-06
    * 每张导出 480 / 960 / 1600 三个宽度（原图更小时只导出不超过原宽的档）
    * 质量 82，方法 6（体积和清晰度的折中，实测比默认方法小约 15%）

依赖 Pillow：pip install Pillow
"""
import os
import sys

try:
    from PIL import Image
except ImportError:
    sys.exit("需要 Pillow：pip install Pillow")

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "img")
WIDTHS = (480, 960, 1600)
QUALITY = 82


def main():
    if len(sys.argv) < 2:
        sys.exit(__doc__)

    src = sys.argv[1]
    if not os.path.isdir(src):
        sys.exit(f"找不到文件夹：{src}")

    names = sorted(
        f for f in os.listdir(src)
        if os.path.splitext(f)[1].lower() in (".jpg", ".jpeg", ".png", ".webp")
    )
    if not names:
        sys.exit("文件夹里没有图片")

    print(f"找到 {len(names)} 张图片，开始导出：")
    total = 0
    for i, name in enumerate(names, start=1):
        im = Image.open(os.path.join(src, name)).convert("RGB")
        w, h = im.size
        widths = sorted({x for x in WIDTHS if x < w} | {min(w, 1600)})
        for tw in widths:
            th = round(h * tw / w)
            dest = os.path.join(OUT, f"work-{i:02d}-{tw}.webp")
            im.resize((tw, th), Image.LANCZOS).save(dest, "WEBP", quality=QUALITY, method=6)
            kb = os.path.getsize(dest) / 1024
            total += kb
            print(f"  work-{i:02d}-{tw}.webp  {tw}x{th}  {kb:6.1f} KB")

    print(f"\n合计 {total / 1024:.2f} MB。")
    print("接下来：把页面里的 srcset 改成对应的档位，再运行 tools/inline-css.py。")


if __name__ == "__main__":
    main()
