/* ===========================================================
   韩宏涛的练习本 — 交互脚本
   1. 移动端菜单：开合、Esc 关闭、点链接关闭、大屏复位
   2. 作品灯箱：打开、关闭、焦点回收
   3. 联系表单：校验、错误提示、邮件客户端兜底
   4. 页脚年份
   每个模块都先判断元素是否存在，任何页面引用本文件都不会报错。
   =========================================================== */
'use strict';

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
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) setOpen(false);
  });

  // Esc 关闭并把焦点还给按钮
  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (toggle.getAttribute('aria-expanded') !== 'true') return;
    setOpen(false);
    toggle.focus();
  });

  // 从手机宽度拉到大屏时，清掉内联状态，交给 CSS 控制
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
  const triggers = Array.from(document.querySelectorAll('.gallery-item'));
  let lastTrigger = null;

  triggers.forEach((link) => {
    link.addEventListener('click', (event) => {
      // 让浏览器默认的新标签打开行为不生效，改用对话框
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
      event.preventDefault();

      lastTrigger = link;
      const thumb = link.querySelector('img');
      const display = link.getAttribute('href');
      const alt = link.dataset.alt || (thumb ? thumb.alt : '');

      img.src = display;
      img.alt = alt;
      caption.textContent = link.dataset.caption || (thumb ? thumb.alt : '');

      dialog.showModal();
      // 打开后焦点直接落在关闭按钮，键盘用户第一下就能退出
      closeBtn.focus();
    });
  });

  closeBtn.addEventListener('click', () => dialog.close());

  // 点遮罩（对话框自身）关闭；点内容不关闭
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });

  // 关闭后把焦点还给触发元素
  dialog.addEventListener('close', () => {
    if (lastTrigger) {
      lastTrigger.focus();
      lastTrigger = null;
    }
  });
})();

/* ---------- 3. 联系表单 ---------- */
(function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const status = document.querySelector('#formStatus');
  const TO = 'zjy1972422hht@163.com';

  // 结构检查：本地部分 + @ + 域名（含至少两级）+ 顶级域
  const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

  function errorFor(field) {
    const value = field.value.trim();
    if (!value) return '这一项不能为空';
    if (field.type === 'email' && !EMAIL_RE.test(value)) {
      return '请输入有效的邮箱地址，例如 name@example.com';
    }
    if (field.id === 'message' && value.length < 5) {
      return '至少写 5 个字，方便我了解你的来意';
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
        status.textContent = '还有 ' + fields.filter((f) => f.getAttribute('aria-invalid') === 'true').length + ' 项需要修改，请检查标红的地方。';
      }
      firstInvalid.focus();
      return;
    }

    // 纯静态站点没有后台：用邮件客户端作为送达方式，并如实告知
    const name = form.querySelector('#name').value.trim();
    const email = form.querySelector('#email').value.trim();
    const message = form.querySelector('#message').value.trim();
    const subject = encodeURIComponent('[网站留言] ' + name);
    const body = encodeURIComponent(message + '\n\n——\n' + name + '\n' + email);

    if (status) {
      status.className = 'status is-ok';
      status.textContent = '已打开你的邮件客户端，请在那里确认发送。如果没有任何反应，请直接写邮件到 ' + TO + '。';
    }

    window.location.href = 'mailto:' + TO + '?subject=' + subject + '&body=' + body;
    form.reset();
  });
})();

/* ---------- 4. 页脚年份 ---------- */
(function initYear() {
  const el = document.querySelector('#year');
  if (el) el.textContent = String(new Date().getFullYear());
})();
