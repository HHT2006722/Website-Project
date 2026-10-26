# 答辩讲稿 / Presentation script

五分钟，七句话。每句对应一个页面或一个动作，说完就点。
Five minutes, seven lines. Each line matches one page or one action — say it, then click.

---

## 演示前 / Before you start

- 打开线上地址，不要用本地文件 / Open the live URL, not a local file:
  `https://hht2006722.github.io/Website-Project/`
- 五个页面先点一遍，图片进缓存 / Click through all five pages once so the images land in the cache.
- 仓库的提交列表提前开一个标签页 / Keep the commit list in another tab.
- 中文版地址记一下：在同一条网址后面加 `zh/` / Remember the Chinese URL: append `zh/`.

## 五分钟路线 / The five-minute route

| 时间 | 页面 | 说这一句 | 做什么 |
|---|---|---|---|
| 0:00 | 首页 | This site is a notebook, not a portfolio: six photographs I took with a phone. / 这是我的观察本，不是作品集：六张用手机拍的照片。 | 停在首屏，鼠标划过导航，让人看到 hover 的下划线 |
| 0:40 | 照片页 | All six were shot on 5 April 2024, indoors, through glass or fencing. / 六张都是 2024 年 4 月 5 日在室内隔着玻璃或栏杆拍的。 | 点开第一张 → 用方向键翻两张 → Esc 关闭 → 点「隔着玻璃」，只剩两张 → 再点「全部」 |
| 1:40 | 笔记页 | Seven notes, each one a problem and what I did about it. / 七篇笔记，每篇一个问题，以及我怎么处理的。 | 从目录点第四篇 → 滚到底，点「↑ 目录」跳回顶部 |
| 2:40 | 关于页 | Born in 2006; the timeline shows when I shot and when I built. / 2006 年生，时间线写着什么时候拍、什么时候做站。 | 指一下时间线，再指一下「怎么判断一张照片」那四条 |
| 3:30 | 联系页 | The site is static, so the form opens your mail app instead of pretending to store anything. / 这是静态站，表单不存东西，点发送会调起邮件客户端。 | 直接点发送 → 三个红字出来 → 填一个错的邮箱 → 改对 → 再点发送 |
| 4:20 | 任意页 | Same page, phone width. / 同一页，手机宽度。 | 开发者工具切设备模式，拖到 375，再拖到 1440 |
| 4:45 | 照片页 | Press Tab: every control is reachable, and Esc closes the big image. / 按 Tab，所有控件都能到；Esc 关掉大图。 | Tab 走三个按钮，Esc |

## 一定会被问的 / Questions you will get

**「照片是你拍的吗？」/ "Did you take these?"**
> Yes. 5 April 2024, iPhone 13 Pro, all six. The originals are on my machine — the copies in the repo are resized to three widths.
> 是我拍的。2024 年 4 月 5 日，iPhone 13 Pro。原图在我电脑上，仓库里的是三个宽度的导出。

**「为什么默认英文？」/ "Why is the site in English by default?"**
> Because the person marking it needs to read it. Chinese is the complete mirror under `zh/`, one click away in the navigation.
> 因为评阅的人要能读。中文整套在 `zh/` 下，导航里一点就切过去。

**「用了什么框架？」/ "What framework?"**
> None. Plain HTML, CSS and JavaScript, hosted on GitHub Pages. No build step — what you see in the repository is what runs.
> 没有框架。纯 HTML、CSS、JavaScript，托管在 GitHub Pages，没有构建步骤。

**「为什么每张图三个尺寸？」/ "Why three sizes per photo?"**
> A thumbnail is about 330 px wide; without it a phone downloads the full 1600 px file. Three widths took the gallery from 585 KB to 436 KB, and on a phone the lightbox now takes the 768 file instead of the 1600.
> 缩略图只有 330 像素宽，不切档的话手机要下 1600 的原图。三档之后画廊从 585 KB 降到 436 KB；灯箱在手机上也只取 768。

**「无障碍怎么测的？」/ "How did you test accessibility?"**
> Keyboard only, a contrast script that resolves real background colours, and Lighthouse. I have not tested with a real screen reader — that is written down as a known limitation.
> 只用键盘走了一遍、写脚本量了对比度、跑了 Lighthouse。没做真实读屏测试，这一条写在文档里。

**「git 历史为什么集中在 10 月？」/ "Why is the git history all in October?"**
> 如实回答：这个站是这段时间做出来的。早期版本的主题（插画）已经被整个换掉，历史里能看到那次替换。
> Answer honestly: this is when the site was built. The earlier version used illustrations; the swap is visible in the history.

## 不要说的 / Do not say

- 不要说照片是「作品级」的 / Don't call the photos professional work — they are phone snapshots with careful decisions.
- 不要说「一整个学期都在做」/ Don't claim semester-long development unless you can show it.
- 不要替插画找理由 / Don't defend the old illustrations — they were removed for a reason, and that reason is a good answer.

## 如果时间只剩两分钟 / If you only get two minutes

首页 → 照片页（点开一张 → 方向键 → Esc → 筛选）→ 笔记页（一篇）→ 手机宽度。
Home → Photos (open one, arrows, Esc, filter) → Notes (one) → phone width.
