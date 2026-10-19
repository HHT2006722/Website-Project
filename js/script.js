// 1) 移动端菜单开合
const navToggle = document.querySelector('#navToggle');
const siteNav = document.querySelector('#siteNav');

navToggle.addEventListener('click', () => {
  const isOpen = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

// 2) 灯箱：只存在于 works.html，先判断是否存在
const lightbox = document.querySelector('#lightbox');

if (lightbox) {
  document.querySelectorAll('.gallery-item').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const thumb = link.querySelector('img');
      lightbox.querySelector('img').src = link.getAttribute('href');
      lightbox.querySelector('img').alt = thumb.alt;
      lightbox.querySelector('figcaption').textContent = link.dataset.caption;
      lightbox.showModal();
    });
  });
  lightbox.querySelector('.lightbox-close')
    .addEventListener('click', () => lightbox.close());
}

// 3) 联系表单客户端校验：只存在于 contact.html
const form = document.querySelector('#contactForm');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    let valid = true;

    form.querySelectorAll('[required]').forEach((field) => {
      const errorEl = document.getElementById(field.id + '-error');
      let message = '';

      if (!field.value.trim()) {
        message = '这一项不能为空';
      } else if (field.type === 'email' && !field.value.includes('@')) {
        message = '请输入有效的邮箱地址';
      }

      if (message) {
        valid = false;
        field.setAttribute('aria-invalid', 'true');
      } else {
        field.removeAttribute('aria-invalid');
      }
      errorEl.textContent = message;
    });

    if (valid) {
      document.getElementById('formSuccess').hidden = false;
      form.reset();
    }
  });
}

// 4) 页脚年份自动更新
document.querySelector('#year').textContent = new Date().getFullYear();