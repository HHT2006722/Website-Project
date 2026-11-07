// 照片页逻辑：四分类切换、一句话弹窗、今日幸运照片。
// Gallery logic: category switch, one-line dialog, and the lucky photo of the day.
(function () {
  const lang = (document.documentElement.lang || "en").toLowerCase().startsWith("zh") ? "zh" : "en";
  const T = (pair) => pair[lang];

  const switchNav = document.querySelector(".cat-switch");
  const grid = document.querySelector(".cat-gallery");
  const luckyBtn = document.querySelector("#luckyBtn");
  const storyBox = document.querySelector("#storyBox");
  const luckyBox = document.querySelector("#luckyBox");
  if (!switchNav || !grid) return;

  // 从地址读分类，默认第一类
  // Read the category from the URL; default to the first one
  const params = new URLSearchParams(location.search);
  let currentId = GALLERY.categories.some((c) => c.id === params.get("cat"))
    ? params.get("cat") : GALLERY.categories[0].id;
  let current = GALLERY.categories.find((c) => c.id === currentId);

  // ---- 切换按钮 ----
  switchNav.innerHTML = "";
  GALLERY.categories.forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat-btn";
    b.dataset.cat = cat.id;
    b.setAttribute("aria-pressed", String(cat.id === current.id));
    b.textContent = cat.emoji + " " + T(cat.label) + " · " + (lang === "zh" ? cat.label.en : cat.label.zh);
    b.addEventListener("click", () => {
      current = cat;
      history.replaceState(null, "", "?cat=" + cat.id);
      render();
    });
    switchNav.appendChild(b);
  });

  // ---- 画廊 ----
  function render() {
    switchNav.querySelectorAll(".cat-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.cat === current.id);
      b.setAttribute("aria-pressed", String(b.dataset.cat === current.id));
    });

    luckyBtn.textContent = "🎲 " + T(current.lucky);

    grid.innerHTML = "";
    current.photos.forEach((photo) => {
      const fig = document.createElement("figure");
      fig.className = "cat-item";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cat-item-btn";
      btn.setAttribute("aria-label", T(photo.alt));

      const img = document.createElement("img");
      img.src = photo.src;
      img.alt = T(photo.alt);
      if (photo.srcset) img.srcset = photo.srcset;
      img.sizes = "(min-width: 1000px) 300px, 92vw";
      img.width = photo.w;
      img.height = photo.h;
      img.loading = "lazy";
      img.decoding = "async";

      const cap = document.createElement("figcaption");
      const line = document.createElement("span");
      line.className = "cat-line";
      line.textContent = T(photo.line);
      const credit = document.createElement("span");
      credit.className = "cat-credit";
      credit.textContent = T(photo.credit);
      cap.appendChild(line);
      cap.appendChild(credit);

      btn.appendChild(img);
      btn.appendChild(cap);
      fig.appendChild(btn);
      grid.appendChild(fig);

      btn.addEventListener("click", () => openStory(photo));
    });
  }

  // ---- 一句话弹窗 ----
  function openStory(photo) {
    storyBox.innerHTML = "";
    const img = document.createElement("img");
    img.src = photo.srcset ? photo.srcset.split(", ").pop().split(" ")[0] : photo.src;
    img.alt = T(photo.alt);
    img.loading = "eager";
    storyBox.appendChild(img);

    const line = document.createElement("p");
    line.className = "dialog-line";
    line.textContent = T(photo.line);
    storyBox.appendChild(line);

    const credit = document.createElement("p");
    credit.className = "dialog-sub";
    credit.textContent = T(photo.credit);
    storyBox.appendChild(credit);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "dialog-close";
    close.textContent = lang === "zh" ? "关闭" : "Close";
    close.addEventListener("click", () => storyBox.close());
    storyBox.appendChild(close);

    storyBox.showModal();
    close.focus();
  }

  // ---- 今日幸运照片：同一天同一类永远抽到同一张 ----
  // Lucky photo of the day: stable within one day, per category
  function todayIndex(cat) {
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return seed % cat.photos.length;
  }

  luckyBtn.addEventListener("click", () => {
    const photo = current.photos[todayIndex(current)];

    luckyBox.innerHTML = "";
    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = T(current.lucky);
    luckyBox.appendChild(title);

    const img = document.createElement("img");
    img.src = photo.srcset ? photo.srcset.split(", ").pop().split(" ")[0] : photo.src;
    img.alt = T(photo.alt);
    luckyBox.appendChild(img);

    const name = document.createElement("p");
    name.className = "dialog-line";
    name.textContent = lang === "zh" ? "今天的是：" + T(photo.alt) : "Today's is: " + T(photo.alt);
    luckyBox.appendChild(name);

    const meaning = document.createElement("p");
    meaning.className = "dialog-sub";
    meaning.textContent = T(photo.luckyLine);
    luckyBox.appendChild(meaning);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "dialog-close";
    close.textContent = lang === "zh" ? "带走今天的运气" : "Take today's luck";
    close.addEventListener("click", () => luckyBox.close());
    luckyBox.appendChild(close);

    luckyBox.showModal();
    close.focus();
  });

  render();
})();
