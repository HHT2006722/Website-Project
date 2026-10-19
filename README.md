# 韩宏涛的观察本

动物摄影观察站。纯 HTML / CSS / JavaScript，没有构建步骤、没有服务端、没有数据库，直接托管在 GitHub Pages。

**线上地址**：<https://hht2006722.github.io/Website-Project/>

## 页面

| 页面 | 内容 |
|---|---|
| `index.html` | 首页：自我介绍 + 最近在练什么 + 三张照片 + 最新笔记 |
| `works.html` | 六张照片，点击可放大，底部按钮前后翻看 |
| `journal.html` | 拍摄笔记（怎么拍、为什么拍废了）+ 做站记录 |
| `about.html` | 关于我、器材、拍摄方向 |
| `contact.html` | 联系方式 + 留言表单（调用本机邮件客户端） |
| `404.html` | 自定义 404 页 |

> 文件名沿用 `works.html` / `journal.html`，是为了不破坏已经分享出去的链接；页面里的文案是「照片」「笔记」。

## 目录结构

```
/
├── index.html  works.html  journal.html  about.html  contact.html  404.html
├── css/styles.css          样式源文件（会被内联进各页，见下）
├── js/script.js            菜单、灯箱（含前后切换与焦点陷阱）、表单校验
├── img/                    照片，每张含 480 / 960 / 1600 三档 WebP
├── tools/inline-css.py     把 css/styles.css 内联进六个页面
├── tools/build-images.py   把照片导出成三档 WebP
├── tools/build-feed.py     从 journal.html 生成 feed.xml
├── feed.xml                RSS 订阅源
├── favicon.ico  favicon-32.png  apple-touch-icon.png
├── og-cover.jpg            社交分享卡片（1200×630）
├── sitemap.xml  robots.txt 搜索引擎用
├── DECISIONS.md            技术决策与踩坑记录
├── ACCESSIBILITY.md        无障碍清单：做了什么、怎么测的、没做什么
├── PLAN.md                 任务池与推进节奏
└── README.md               本文件
```

## 本地预览

没有构建步骤，用任意静态服务器指向仓库根目录即可：

```bash
python -m http.server 8000
# 浏览器打开 http://127.0.0.1:8000/
```

## 改东西之后要跑的命令

**改样式**（`css/styles.css`）之后，页面不会自动变——样式是内联的：

```bash
python tools/inline-css.py
```

**改笔记**（`journal.html`）之后，重新生成订阅源：

```bash
python tools/build-feed.py
```

**换照片**：把照片放进一个文件夹，然后：

```bash
python tools/build-images.py 照片文件夹
```

脚本按文件名排序输出 `img/work-01` … `work-06` 的三档 WebP。
之后把页面里的 `srcset` 改成对应档位（原图小于 1600 宽时不会生成 1600 档），
再跑一次 `inline-css.py`。

## 技术要点

- **CSS 内联**：实测 GitHub Pages 的 `styles.css` 偶发要 9–11 秒才返回（同一批请求里 HTML / JS / 图片都在 1 秒内）。它是渲染阻塞资源，卡住时页面就是无样式状态，在微信里看起来像「打不开」。所以把样式内联进 HTML，首屏不再依赖第二个请求；代价是每页多约 11 KB。
- **渐进增强**：导航默认展开，只有在 `<html>` 上成功加上 `js` 类之后才折叠成菜单按钮。脚本没加载成功或被 WebView 屏蔽时，手机上依然能点进每一页。
- **照片**：每张导出 480 / 960 / 1600 三档 WebP，`srcset` + `sizes` 交给浏览器选择；全部带 `width`/`height` 防止布局抖动；首屏外图片 `loading="lazy"`。竖图按原比例显示，不裁切、不硬塞进横图格子。
- **灯箱**：原生 `<dialog>` + `showModal()`，支持上一张/下一张（首尾循环）、`role="status"` 播报当前是第几张，关闭后焦点回到当前这张。补了显式焦点陷阱——实测这个浏览器里 Tab 会跑到背景元素。
- **响应式**：移动优先。基础样式即小屏，700px 以上导航改为横排；网格用 `auto-fill + minmax` 自适应列数。
- **表单**：无后端。客户端做结构校验，通过后调用 `mailto:` 打开本机邮件客户端，页面上明确说明了这一点，不假装已经发送成功。
- **SEO**：每页有 `canonical`、`og:*`、`theme-color`；首页附 `schema.org/Person` 的 JSON-LD；根目录有 `sitemap.xml` 与 `robots.txt`。
- **版权**：站内照片均为本人拍摄，页脚与关于页均有说明。

## 部署

GitHub Pages，从 `main` 分支根目录直接发布。推送到 `main` 后约 1–2 分钟自动生效。
