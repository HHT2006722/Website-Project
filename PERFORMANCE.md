# 性能实测记录

用 Lighthouse 13.5.0 跑首页与照片页，移动端模拟（375×812，DPR 2），
对象是本地静态服务器（`python -m http.server`），不是线上地址——
所以分数反映的是页面本身，不含 CDN 与真实网络波动。

## 结果

| 页面 | 性能 | 可访问性 | 最佳实践 | SEO | LCP | 总传输 |
|---|---|---|---|---|---|---|
| 首页 · 修复前 | 100 | **96** | 100 | 100 | 1.1 s | 418 KiB |
| 首页 · 最终 | 100 | **100** | 100 | 100 | 0.9 s | 311 KiB |
| 照片页 · 修复前 | **93** | 100 | 100 | 100 | 3.2 s | 585 KiB |
| 照片页 · 最终 | **100** | 100 | 100 | 100 | 1.5 s | 436 KiB |

最终两页的四项分数都是 100。

## 修了什么

### 1. 页脚对比度 4.12 → 5.75

Lighthouse 只报了一项没通过：`.footer-note` 的颜色对比度 4.12，低于 WCAG AA 的 4.5。
原因是它用了 `opacity: .85`——把 `#6b5f55` 稀释成 `#80766c`。
去掉 opacity，直接用原来的文字色就解决了。

> 教训：半透明不是「稍微淡一点」，它实打实降低对比度。颜色该用色值调，不要靠透明度。

### 2. 照片页 LCP 3.2 s → 1.5 s

两个动作：

- **首图不再懒加载**：第一张在首屏，给它 `fetchpriority="high"`、去掉 `loading="lazy"`，不用排在后面等。
- **补一档 768w**：DPR 2 下 343 px 宽的图需要约 690 px，原来的档位是 480 / 960，浏览器只能跳到 960。加一档 768 之后正好命中，六张合计从 585 KiB 降到 436 KiB。

实测选择结果：

| 屏幕像素密度 | 实际下载 |
|---|---|
| DPR 1 | 480w |
| DPR 2 | 768w |
| DPR 3 | 最大档（1280–1600w） |

### 3. 一次失败的尝试（记录一下）

第一次加 768w 时，替换脚本写坏了 `srcset`：768w 后面误粘了文件名，还漏掉了 960w。
浏览器只解析出 480 / 1600 两档，DPR 2 直接下 1600——

**性能从 93 掉到 81，LCP 从 3.2 s 涨到 5.1 s，总传输从 585 KiB 涨到 979 KiB。**

修好格式后回到 100。这件事的教训：`srcset` 写错不会报错，只会让你多下几倍流量；
改完必须看 Network 面板里实际请求的是哪一档。

## 没有做的事（以及为什么）

| 项目 | Lighthouse 提示 | 为什么不做 |
|---|---|---|
| 压缩 CSS | 可省约 4 KiB | 样式已经内联进页面，压缩后几乎无法阅读和讲解。4 KiB 换一份能逐行解释的代码，值得 |
| 压缩 JS | 可省约 3 KiB | 同上 |
| 缓存头 | `cache-insight` 0 分 | 这是本地服务器的行为，GitHub Pages 实际会发 `cache-control: max-age=600` |
| 未使用 CSS | 可省约 11 KiB | 六个页面共用一份样式表，总会有页面用不到的部分；拆成六份反而难维护 |

## 已知局限

- **测的是本地服务器**。线上经过 GitHub Pages 的 CDN，Lighthouse 在真实网络下会受线路影响（这个站到 GitHub 的线路本身就不稳定）。
- **没有在真机上测**。桌面 Chrome 模拟移动端，不等于真实手机：Safari、微信内置浏览器的表现没有覆盖。
- **分数会波动**。同一份代码连跑三次，性能分可能在 97–100 之间浮动，不要拿单次分数当结论。

## 怎么复现

```bash
# 1. 起本地服务器
python -m http.server 8000

# 2. 跑 Lighthouse（需要 Node 与 Chrome）
npx lighthouse http://127.0.0.1:8000/index.html \
  --only-categories=performance,accessibility,best-practices,seo \
  --form-factor=mobile --screenEmulation.mobile \
  --screenEmulation.width=375 --screenEmulation.height=812 \
  --screenEmulation.deviceScaleFactor=2 --view
```
