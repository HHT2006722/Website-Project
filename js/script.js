/* ===========================================================
   韩宏涛的观察本 — 交互脚本
   1. 移动端菜单：开合、Esc 关闭、点链接关闭、大屏复位
   2. 作品灯箱：打开、关闭、焦点回收
   3. 联系表单：校验、错误提示、邮件客户端兜底
   4. 页脚年份
   每个模块都先判断元素是否存在，任何页面引用本文件都不会报错。
   =========================================================== */
'use strict';

/* ---------- 界面文案：按 <html lang> 选中英文 ---------- */
const STRINGS = {
  zh: {
    filterStatus: (shown, total) => '显示 ' + shown + ' 张，共 ' + total + ' 张',
    lightboxStatus: (index, total, caption) => '第 ' + index + ' 张，共 ' + total + ' 张：' + caption,
    required: '这一项不能为空',
    email: '请输入有效的邮箱地址，例如 name@example.com',
    tooShort: '至少写 5 个字，方便我了解你的来意',
    fixCount: (n) => '还有 ' + n + ' 项需要修改，请检查标红的地方。',
    mailtoOpened: (to) => '已打开你的邮件客户端，请在那里确认发送。如果没有任何反应，请直接写邮件到 ' + to + '。'
  },
  en: {
    filterStatus: (shown, total) => 'Showing ' + shown + ' of ' + total + ' photos',
    lightboxStatus: (index, total, caption) => index + ' of ' + total + ' · ' + caption,
    required: 'This field can\'t be empty',
    email: 'Enter a valid email address, for example name@example.com',
    tooShort: 'A few more words, so I know what this is about',
    fixCount: (n) => (n === 1 ? '1 field still needs fixing' : n + ' fields still need fixing') + ' — see the highlighted ones.',
    mailtoOpened: (to) => 'Your mail app should have opened — confirm and send there. If nothing happened, write to ' + to + '.'
  }
};
const T = STRINGS[(document.documentElement.lang || 'en').toLowerCase().startsWith('zh') ? 'zh' : 'en'];

/* ---------- 1. 导航菜单 ---------- */
(function initNav() {
  const toggle = document.querySelector('#navToggle');
  const nav = document.querySelector('#siteNav');
  if (!toggle || !nav) return;

  const icon = toggle.querySelector('.nav-toggle-icon');
  const desktop = window.matchMedia('(min-width: 700px)');

  function setOpen(open) {
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (icon) icon.textContent = open ? '✕' : '☰';
  }

  toggle.addEventListener('click', () => {
    setOpen(toggle.getAttribute('aria-expanded') !== 'true');
  });

  // 点链接后收起，避免菜单遮住刚跳到的内容
  // Collapse after following a link, so the menu doesn't cover what you just jumped to.
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Esc 关闭并把焦点还给按钮
  // Close on Esc and return focus to the button.
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });

  // 从手机宽度拉到大屏时，清掉内联状态，交给 CSS 控制
  // Going from phone to desktop: clear the inline state and let CSS take over.
  desktop.addEventListener('change', (event) => {
    if (event.matches) setOpen(false);
  });
})();

/* ---------- 2. 作品灯箱 ---------- */
(function initLightbox() {
  const dialog = document.querySelector('#lightbox');
  if (!dialog) return;

  const img = dialog.querySelector('img');
  const caption = dialog.querySelector('figcaption');
  const closeBtn = dialog.querySelector('.lightbox-close');
  const prevBtn = dialog.querySelector('.lightbox-prev');
  const nextBtn = dialog.querySelector('.lightbox-next');
  const status = dialog.querySelector('.lightbox-status');
  const triggers = Array.from(document.querySelectorAll('.gallery-item'));
  if (!triggers.length) return;

  // 先把每张图的地址、替代文字、说明整理成数组，切换时按索引取
  // Build an array of src / alt / caption first, then index into it when switching.
  const items = triggers.map((link) => {
    const thumb = link.querySelector('img');
    return {
      src: link.getAttribute('href'),
      alt: link.dataset.alt || (thumb ? thumb.alt : ''),
      caption: link.dataset.caption || (thumb ? thumb.alt : ''),
      // 记下大图真实宽高：竖图打开时不会先按横图占位再跳一下
      // Store the real width and height: a portrait photo won't reserve a landscape box and jump.
      w: Number(link.dataset.w) || 0,
      h: Number(link.dataset.h) || 0,
      // 缩略图那组候选宽度也带上，灯箱里可以让浏览器按屏幕密度挑，
      // Carry the thumbnail's candidate widths too, so the browser can pick by pixel density in the lightbox,
      // 手机不必为了看大图去下 1600 那档
      // a phone does not need the 1600 file just to look at one photo.
      srcset: thumb ? thumb.getAttribute('srcset') || '' : '',
    };
  });

  // 当前能翻到的图。默认是全部；被筛选隐藏的图不参与前后切换——
  // The photos you can page through. All of them by default; filtered-out ones are excluded —
  // 否则筛到 2 张、打开灯箱却还能翻到被藏起来的另外 4 张。
  // otherwise filtering to 2 photos would still let you page into the other 4.
  let order = triggers.map((_, i) => i);
  let current = 0;

  function refreshOrder() {
    const visible = triggers
      .map((_, i) => i)
      .filter((i) => {
        const figure = triggers[i].closest('figure');
        return !figure || !figure.hidden;
      });
    order = visible.length ? visible : triggers.map((_, i) => i);
    if (!order.length) order = [0];
  }

  function render(index) {
    // 取模实现首尾循环：第一张的「上一张」是最后一张
    // Modulo gives wrap-around: Previous on the first photo lands on the last.
    current = (index + order.length) % order.length;
    const item = items[order[current]];
    if (item.w && item.h) {
      img.width = item.w;
      img.height = item.h;
    }
    if (item.srcset) {
      img.srcset = item.srcset;
      // 对话框最大 1000px，手机上接近满宽；按这个算，浏览器就不会取最大档
      // The dialog is at most 1000px wide, nearly full width on a phone; with that the browser won't take the largest file.
      img.sizes = '(min-width: 1064px) 1000px, 94vw';
    }
    img.src = item.src;
    img.alt = item.alt;
    caption.textContent = item.caption;
    if (status) {
      status.textContent = T.lightboxStatus(current + 1, order.length, item.caption);
    }
  }

  function openAt(index) {
    refreshOrder();
    const position = order.indexOf(index);
    render(position === -1 ? 0 : position);
    if (!dialog.open) dialog.showModal();
    // 打开后焦点落在关闭按钮：键盘用户第一下就能退出
    // Focus lands on Close after opening, so keyboard users can leave immediately.
    closeBtn.focus();
  }

  triggers.forEach((link, index) => {
    link.addEventListener('click', (event) => {
      // 修饰键点击保留浏览器默认行为（新标签打开原图）
      // Keep the browser default on modifier clicks (open the original in a new tab).
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();
      openAt(index);
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => render(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => render(current + 1));

  // 方向键切换：← 上一张、→ 下一张。只在对话框打开时生效，
  // Arrow keys: left is previous, right is next. Only while the dialog is open,
  // 避免影响页面正常滚动（对话框关着时方向键照常滚页面）。
  // so normal page scrolling is unaffected when it is closed.
  document.addEventListener('keydown', (event) => {
    if (!dialog.open) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      render(current - 1);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      render(current + 1);
    }
  });
  closeBtn.addEventListener('click', () => dialog.close());

  // 点遮罩（对话框自身）关闭；点内容不关闭
  // Clicking the backdrop (the dialog itself) closes; clicking the content does not.
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // focus-trap：把 Tab 限制在对话框内。
  // focus-trap: keep Tab inside the dialog.
  // 原生 <dialog> 的 showModal() 在部分浏览器里仍会让 Tab 走到背景元素，
  // The native <dialog> showModal() still lets Tab escape to background elements in some browsers,
  // 所以这里显式首尾相连，保证键盘用户出不去。
  // so the two ends are wired together to keep keyboard users in.
  dialog.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const focusables = Array.from(
      dialog.querySelectorAll('button, a[href], input, select, textarea')
    ).filter((el) => !el.disabled && el.getClientRects().length > 0);
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    const active = document.activeElement;

    if (event.shiftKey && (active === first || !dialog.contains(active))) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (active === last || !dialog.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  });

  // 关闭后把焦点还给「当前正在看的那张图」的触发链接，
  // On close, return focus to the link of the photo you are actually looking at,
  // 而不是最初点开的那张——切换过图片之后，原来的位置已经不对了
  // not the one you first opened — after paging, the original spot is no longer right.
  dialog.addEventListener('close', () => {
    const target = triggers[order[current]];
    if (target) target.focus();
  });
})();

/* ---------- 3. 联系表单 ---------- */
(function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const status = document.querySelector('#formStatus');
  const TO = 'zjy1972422hht@163.com';

  // 结构检查：本地部分 + @ + 域名（含至少两级）+ 顶级域
  // Structure check: local part + @ + domain (at least two labels) + top-level domain.
  const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

  function errorFor(field) {
    const value = field.value.trim();
    if (!value) return T.required;
    if (field.type === 'email' && !EMAIL_RE.test(value)) {
      return T.email;
    }
    if (field.id === 'message' && value.length < 5) {
      return T.tooShort;
    }
    return '';
  }

  function showError(field, message) {
    const slot = document.getElementById(field.id + '-error');
    if (slot) slot.textContent = message;
    if (message) {
      field.setAttribute('aria-invalid', 'true');
    } else {
      field.removeAttribute('aria-invalid');
    }
  }

  // 输入时即时清掉该字段的错误，减少「改完还红着」的困惑
  // Clear a field's error as you type, so it doesn't stay red after being fixed.
  form.addEventListener('input', (event) => {
    const field = event.target;
    if (field.matches('input, textarea')) showError(field, '');
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const fields = Array.from(form.querySelectorAll('[required]'));
    let firstInvalid = null;

    fields.forEach((field) => {
      const message = errorFor(field);
      showError(field, message);
      if (message && !firstInvalid) firstInvalid = field;
    });

    if (firstInvalid) {
      if (status) {
        status.className = 'status is-error';
        status.textContent = T.fixCount(fields.filter((f) => f.getAttribute('aria-invalid') === 'true').length);
      }
      firstInvalid.focus();
      return;
    }

    // 纯静态站点没有后台：用邮件客户端作为送达方式，并如实告知
    // A static site has no backend: delivery goes through the mail client, and the page says so.
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const subject = encodeURIComponent('[网站留言] ' + name);
    const body = encodeURIComponent(message + '\n\n——\n' + name + '\n' + email);

    if (status) {
      status.className = 'status is-ok';
      status.textContent = T.mailtoOpened(TO);
    }

    window.location.href = 'mailto:' + TO + '?subject=' + subject + '&body=' + body;
    form.reset();
  });
})();

/* ---------- 5. 照片筛选 ---------- */
(function initGalleryFilter() {
  const bar = document.querySelector('.filters');
  if (!bar) return;

  const buttons = Array.from(bar.querySelectorAll('.filter-btn'));
  const figures = Array.from(document.querySelectorAll('.gallery figure'));
  const status = document.querySelector('.filter-status');
  if (!figures.length) return;

  function apply(filter) {
    let shown = 0;
    figures.forEach((figure) => {
      const match = filter === 'all' || figure.dataset.category === filter;
      // hidden 属性由浏览器负责隐藏，无需再改样式
      // The browser hides the element via the hidden attribute; no extra CSS needed.
      figure.hidden = !match;
      if (match) shown += 1;
    });

    buttons.forEach((button) => {
      const on = button.dataset.filter === filter;
      button.classList.toggle('is-active', on);
      button.setAttribute('aria-pressed', String(on));
    });

    if (status) status.textContent = T.filterStatus(shown, figures.length);
    syncUrl(filter);
  }

  // 把筛选写进地址：分享出去的链接、刷新之后都停在同一组
  // Write the filter into the address: shared links and refreshes stay on the same group.
  function syncUrl(filter) {
    const url = new URL(window.location.href);
    if (filter === 'all') {
      url.searchParams.delete('type');
    } else {
      url.searchParams.set('type', filter);
    }
    // replaceState 不新增历史记录，按浏览器返回键不会在筛选之间来回跳
    // replaceState adds no history entry, so Back doesn't bounce between filters.
    history.replaceState(null, '', url);
  }

  bar.addEventListener('click', (event) => {
    const button = event.target.closest('.filter-btn');
    if (button) apply(button.dataset.filter);
  });

  // 从地址里读回上次的筛选；无效值当作「全部」
  // Read the filter back from the address; an invalid value means "all".
  const wanted = new URLSearchParams(window.location.search).get('type');
  const known = buttons.some((button) => button.dataset.filter === wanted);
  apply(known ? wanted : 'all');
})();

/* ---------- 6. 留言字数计数 ---------- */
(function initMessageCounter() {
  const textarea = document.querySelector('#message');
  const counter = document.querySelector('#message-count');
  if (!textarea || !counter) return;

  const max = Number(textarea.getAttribute('maxlength')) || 500;

  function update() {
    const n = textarea.value.length;
    counter.textContent = String(n);
    // 快到上限时把数字变红，提醒还能写多少
    // Turn the number red near the limit, as a reminder of what is left.
    counter.classList.toggle('is-near-limit', n >= max * 0.9);
  }

  textarea.addEventListener('input', update);
  update();
})();

/* ---------- 7. 图片加载失败时的兜底 ---------- */
(function initImageFallback() {
  // 捕获阶段监听，图片加载失败也能收到
  // Listen in the capture phase so failed image loads are caught too.
  document.addEventListener('error', (event) => {
    const img = event.target;
    if (!img || img.tagName !== 'IMG') return;
    if (img.dataset.failed) return;
    img.dataset.failed = '1';
    img.classList.add('img-failed');
    // 不替换元素：浏览器本身会把 alt 文字显示出来，这里只加一层边框提示
    // Don't replace the element: the browser already shows the alt text; this only adds a border.
  }, true);
})();

/* ---------- 4. 页脚年份 ---------- */
(function initYear() {
  const el = document.querySelector('#year');
  if (el) el.textContent = String(new Date().getFullYear());
})();
