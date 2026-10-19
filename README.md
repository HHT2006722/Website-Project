# 韩宏涛的练习本

插画练习记录站。纯 HTML / CSS / JavaScript，没有构建步骤、没有服务端、没有数据库，直接托管在 GitHub Pages。

**线上地址**：<https://hht2006722.github.io/Website-Project/>

## 页面

| 页面 | 内容 |
|---|---|
| `index.html` | 首页：自我介绍 + 三张近期作品 + 最新日志 |
| `works.html` | 作品画廊，六张图，点击可用灯箱放大 |
| `journal.html` | 练习日志：拆解笔记（画面分析）+ 做站记录（技术复盘），带目录锚点 |
| `about.html` | 关于我、工具、版权说明 |
| `contact.html` | 联系方式 + 留言表单（调用本机邮件客户端） |
| `404.html` | 自定义 404 页 |

## 目录结构

```
/
├── index.html  works.html  journal.html  about.html  contact.html  404.html
├── css/styles.css          所有样式，含设计变量与响应式规则
├── js/script.js            菜单、灯箱、表单校验、页脚年份
├── img/                    作品图（每张含 480 / 960 / 1600 三档 WebP）
├── favicon.ico  favicon-32.png  apple-touch-icon.png
├── og-cover.jpg            社交分享卡片（1200×630）
├── sitemap.xml  robots.txt 搜索引擎用
├── DECISIONS.md            技术决策与踩坑记录
└── README.md               本文件
```

## 本地预览

这个站点没有构建步骤，用任意静态服务器指向仓库根目录即可：

```bash
python -m http.server 8000
# 浏览器打开 http://127.0.0.1:8000/
```

直接双击 `index.html` 也能看，但部分浏览器在 `file://` 下对相对路径资源的限制不同，建议用上面的方式。

## 技术要点

- **图片**：每张作品导出 480 / 960 / 1600 三档 WebP，`srcset` + `sizes` 交给浏览器选择；全部带 `width`/`height` 防止布局抖动；首屏下图片 `loading="lazy"`。
- **响应式**：移动优先。基础样式即小屏，700px 以上导航改为横排；网格用 `auto-fill + minmax` 自适应列数，不需要为每档宽度写媒体查询。
- **无障碍**：跳过导航链接、语义化 landmark、`aria-current` 标记当前页、`aria-expanded` / `aria-controls` 控制菜单、`aria-invalid` + `aria-describedby` 关联表单错误、灯箱用原生 `<dialog>` 并处理焦点回收、`:focus-visible` 可见焦点环、`prefers-reduced-motion`。
- **表单**：无后端。客户端做结构校验，通过后调用 `mailto:` 打开本机邮件客户端，页面上明确说明了这一点，不假装已经发送成功。
- **SEO**：每页有 `canonical`、`og:*`、`theme-color`；首页附 `schema.org/Person` 的 JSON-LD；根目录有 `sitemap.xml` 与 `robots.txt`。
- **版权**：站内插画为学习与临摹记录，版权归原作者所有，页面页脚与关于页均有说明。

## 部署

GitHub Pages，从 `main` 分支根目录直接发布。推送到 `main` 后约 1–2 分钟自动生效。
