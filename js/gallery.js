// 照片页逻辑：四分类切换、一句话弹窗、今日幸运照片、今日新闻。
// Gallery logic: category switch, one-line dialog, lucky photo of the day, and today's news.
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (pair) => pair[lang] || pair.en;

  const menuPanel = document.querySelector("#catMenu");
  const menuBtn = document.querySelector("#catMenuBtn");
  const menuLabel = document.querySelector("#catMenuLabel");
  const sortHot = document.querySelector("#sortHot");
  const sortAll = document.querySelector("#sortAll");
  const sortFav = document.querySelector("#sortFav");
  const grid = document.querySelector(".cat-gallery");
  const luckyBtn = document.querySelector("#luckyBtn");
  const storyBox = document.querySelector("#storyBox");
  const luckyBox = document.querySelector("#luckyBox");
  const newsList = document.querySelector("#newsList");
  const newsTitle = document.querySelector("#newsTitle");
  const newsNote = document.querySelector("#newsNote");
  if (!menuPanel || !grid) return;

  // 热门 / 综合 / 收藏 文案
  // Hot / All / Favourites labels
  const SORT = {
    en: ["Hot", "All", "Favourites"],
    zh: ["热门", "综合", "收藏"],
    de: ["Beliebt", "Alle", "Favoriten"],
  }[lang];
  document.querySelector("[data-sort-hot]").textContent = SORT[0];
  document.querySelector("[data-sort-all]").textContent = SORT[1];
  const randomBtn = document.querySelector("#randomBtn");
  const randomSpan = document.querySelector("[data-random]");
  if (randomSpan) {
    randomSpan.textContent = { en: "Surprise me", zh: "随手一张", de: "Überrasch mich" }[lang];
  }
  if (randomBtn) {
    randomBtn.addEventListener("click", () => {
      const list = photosOf(current);
      const i = Math.floor(Math.random() * list.length);
      location.href = "photo.html?cat=" + current.id + "&p=" + i;
    });
  }
  if (document.querySelector("[data-sort-fav]")) {
    document.querySelector("[data-sort-fav]").textContent = SORT[2];
  }

  // 喜欢/收藏提示与空状态
  // Like/favourite hint and the empty state
  const UI_TEXT = {
    en: {
      hint: "Likes and favourites are saved only in this browser — this site has no server.",
      empty: "No favourites yet — press ★ on a photo to collect it.",
      likeOn: "You like this photo",
      likeOff: "Like this photo",
      favOn: "In your favourites",
      favOff: "Save to favourites",
    },
    zh: {
      hint: "喜欢和收藏只存在你自己的浏览器里——这个站没有服务器。",
      empty: "还没有收藏——在照片上点 ★ 把它收进来。",
      likeOn: "你已经喜欢这张照片",
      likeOff: "喜欢这张照片",
      favOn: "已收藏",
      favOff: "收藏这张照片",
    },
    de: {
      hint: "Likes und Favoriten werden nur in diesem Browser gespeichert — diese Seite hat keinen Server.",
      empty: "Noch keine Favoriten — drücke ★ auf einem Foto, um es zu sammeln.",
      likeOn: "Dieses Foto gefällt dir",
      likeOff: "Foto gefällt mir",
      favOn: "In deinen Favoriten",
      favOff: "Als Favorit speichern",
    },
  }[lang];
  // 已看进度：详情页看过哪些，这里显示 x/y
  // View progress: which photos were opened on their detail page
  const viewedKey = "pf-viewed";
  const readViewed = () => {
    try {
      return new Set(JSON.parse(localStorage.getItem(viewedKey) || "[]"));
    } catch (e) {
      return new Set();
    }
  };
  const viewedChip = document.createElement("span");
  viewedChip.className = "viewed-chip";

  const hintEl = document.querySelector("#likeHint");
  if (hintEl) hintEl.textContent = UI_TEXT.hint;

  // 喜欢/收藏存在 localStorage（本浏览器），静态站没有服务器
  // Likes and favourites live in localStorage (this browser); the site has no server
  const store = (() => {
    let likes = new Set();
    let favs = new Set();
    try {
      likes = new Set(JSON.parse(localStorage.getItem("pf-likes") || "[]"));
      favs = new Set(JSON.parse(localStorage.getItem("pf-favs") || "[]"));
    } catch (e) { /* 忽略损坏的数据 / ignore broken data */ }
    const save = () => {
      try {
        localStorage.setItem("pf-likes", JSON.stringify([...likes]));
        localStorage.setItem("pf-favs", JSON.stringify([...favs]));
      } catch (e) { /* 无痕模式下存不了也没关系 / fine if it cannot be saved */ }
    };
    return {
      isLike: (p) => likes.has(p.src),
      isFav: (p) => favs.has(p.src),
      toggleLike(p) {
        if (likes.has(p.src)) likes.delete(p.src); else likes.add(p.src);
        save();
      },
      toggleFav(p) {
        if (favs.has(p.src)) favs.delete(p.src); else favs.add(p.src);
        save();
      },
    };
  })();

  // 每个分类自己的主题色：切换时写到 body 上，CSS 变量跟着换
  // Each category has its own accent colour, set on <body> so the CSS variables follow
  const CAT_COLORS = {
    humanities: "#0e7490",
    food: "#dc2626",
    animals: "#ea580c",
    landscape: "#15803d",
  };

  // 主打图 + 扩展图库合并成这一类的全部照片
  // Featured photos plus the extended pool make up the full category
  const photosOf = (cat) => cat.photos.concat((typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || []);

  // 热门：主打图 + 按日期从池里挑 6 张（每天不一样，线性取数保证不重复）
  // Hot: featured photos plus 6 date-seeded picks from the pool
  const hotPhotos = (cat) => {
    const pool = (typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || [];
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    const picks = [];
    const seen = new Set(cat.photos.map((p) => p.src));
    let idx = seed % Math.max(pool.length, 1);
    let guard = 0;
    while (picks.length < 6 && guard < pool.length + 6) {
      const p = pool[idx % pool.length];
      if (!seen.has(p.src)) {
        seen.add(p.src);
        picks.push(p);
      }
      idx += 1;
      guard += 1;
    }
    return cat.photos.concat(picks);
  };

  let sortMode = "all";

  // 洗牌：每次展示顺序随机
  // Shuffle: display order is random on every visit
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = a[i];
      a[i] = a[j];
      a[j] = tmp;
    }
    return a;
  };
  // 相邻不出现同一物种：一眼看去不重样
  // No two same-species photos next to each other
  const arrangeBySpecies = (list) => {
    const out = [];
    const rest = list.slice();
    while (rest.length) {
      let pick = rest.findIndex((p, i) => i > 0 && (!out.length || p.species !== out[out.length - 1].species));
      if (pick === -1) pick = 0;
      out.push(rest.splice(pick, 1)[0]);
    }
    return out;
  };
  let lastOrderKey = "";
  let shownOrder = [];

  // 图片路径按页面位置加前缀：zh/de 页面的资源在上一层
  // Image paths get a prefix by page location: assets live one level up on zh/de pages
  const pathParts = location.pathname.split("/").filter(Boolean);
  const IMG = pathParts.includes("zh") || pathParts.includes("de") ? "../" : "";

  const params = new URLSearchParams(location.search);
  let currentId = GALLERY.categories.some((c) => c.id === params.get("cat"))
    ? params.get("cat") : GALLERY.categories[0].id;
  let current = GALLERY.categories.find((c) => c.id === currentId);

  // 类别下拉面板
  menuPanel.innerHTML = "";
  GALLERY.categories.forEach((cat) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat-btn";
    b.dataset.cat = cat.id;
    b.setAttribute("aria-pressed", String(cat.id === current.id));
    // 双语标签：当前语言 + 英文（英文页则显示英文 + 中文）
    // Bilingual label: current language + English (or English + Chinese on EN pages)
    const second = lang === "en" ? cat.label.zh : cat.label.en;
    b.textContent = cat.emoji + " " + T(cat.label) + " · " + second;
    b.addEventListener("click", () => {
      current = cat;
      history.replaceState(null, "", "?cat=" + cat.id);
      render();
      setMenuOpen(false);
    });
    menuPanel.appendChild(b);
  });

  // 类别下拉开关（class + hidden 双保险）
  // Category menu toggle (class plus hidden, belt and braces)
  function setMenuOpen(open) {
    menuPanel.classList.toggle("is-open", open);
    menuPanel.hidden = !open;
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", () => setMenuOpen(menuPanel.hidden));
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".cat-menu")) setMenuOpen(false);
  });

  // 热门 / 综合 / 收藏
  function setSort(mode) {
    sortMode = mode;
    [sortHot, sortAll, sortFav].forEach((b) => {
      b.classList.toggle("is-active", b.dataset.mode === mode);
      b.setAttribute("aria-pressed", String(b.dataset.mode === mode));
    });
    render();
  }
  sortHot.dataset.mode = "hot";
  sortAll.dataset.mode = "all";
  if (sortFav) sortFav.dataset.mode = "fav";
  sortHot.addEventListener("click", () => setSort("hot"));
  sortAll.addEventListener("click", () => setSort("all"));
  if (sortFav) sortFav.addEventListener("click", () => setSort("fav"));

  function updateViewedChip() {
    const photos = photosOf(current);
    const viewed = readViewed();
    const seen = photos.filter((p, i) => viewed.has(current.id + "|" + i)).length;
    const label = { en: "Viewed", zh: "已看", de: "Gesehen" }[lang];
    viewedChip.textContent = "👀 " + label + " " + seen + "/" + photos.length;
    if (seen === photos.length && photos.length) {
      viewedChip.textContent += " 🎉";
    }
  }

  function render() {
    document.body.dataset.cat = current.id;

    menuPanel.querySelectorAll(".cat-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.cat === current.id);
      b.setAttribute("aria-pressed", String(b.dataset.cat === current.id));
    });

    const second = lang === "en" ? current.label.zh : current.label.en;
    menuLabel.textContent = current.emoji + " " + T(current.label) + " · " + second;

    luckyBtn.textContent = "🎲 " + T(current.lucky);
    updateViewedChip();
    if (!viewedChip.isConnected) {
      const tools = document.querySelector(".gallery-tools");
      if (tools) tools.appendChild(viewedChip);
    }

    const all = photosOf(current);
    const base = sortMode === "hot" ? hotPhotos(current)
      : sortMode === "fav" ? all.filter((p) => store.isFav(p)) : all;

    // 每次打开/换类别/换排序都重新洗牌，照片顺序随机
    // Reshuffle on every load, category change and sort change
    const orderKey = current.id + "|" + sortMode + "|" + (sortMode === "fav" ? base.length : "");
    if (orderKey !== lastOrderKey) {
      lastOrderKey = orderKey;
      shownOrder = arrangeBySpecies(shuffle(base));
    }
    const shown = shownOrder;

    // 热门用大卡布局，和综合明显区分
    // Hot uses big cards so it never looks like the same group as All
    grid.classList.toggle("is-hot", sortMode === "hot");

    grid.innerHTML = "";
    if (!shown.length) {
      const note = document.createElement("p");
      note.className = "cat-empty";
      note.textContent = UI_TEXT.empty;
      grid.appendChild(note);
      loadNews();
      return;
    }

    shown.forEach((photo, order) => {
      const fig = document.createElement("figure");
      fig.className = "cat-item";
      fig.style.setProperty("--i", String(order % 12));

      const imgWrap = document.createElement("div");
      imgWrap.className = "cat-img";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "cat-item-btn";
      btn.setAttribute("aria-label", T(photo.alt));

      const img = document.createElement("img");
      img.src = IMG + photo.src;
      img.alt = T(photo.alt);
      if (photo.srcset) img.srcset = photo.srcset.split(", ").map((e) => IMG + e).join(", ");
      img.sizes = "(min-width: 1000px) 300px, 92vw";
      img.width = photo.w;
      img.height = photo.h;
      img.loading = "lazy";
      img.decoding = "async";

      // 右下角：喜欢 ♥ 与收藏 ★
      // Bottom-right corner: like and favourite
      const actions = document.createElement("div");
      actions.className = "cat-actions";

      const likeBtn = document.createElement("button");
      likeBtn.type = "button";
      likeBtn.className = "like-btn" + (store.isLike(photo) ? " is-on" : "");
      likeBtn.setAttribute("aria-pressed", String(store.isLike(photo)));
      likeBtn.setAttribute("aria-label", store.isLike(photo) ? UI_TEXT.likeOn : UI_TEXT.likeOff);
      likeBtn.textContent = "♥";
      likeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        store.toggleLike(photo);
        const on = store.isLike(photo);
        likeBtn.classList.toggle("is-on", on);
        likeBtn.setAttribute("aria-pressed", String(on));
        likeBtn.setAttribute("aria-label", on ? UI_TEXT.likeOn : UI_TEXT.likeOff);
      });

      const favBtn = document.createElement("button");
      favBtn.type = "button";
      favBtn.className = "fav-btn" + (store.isFav(photo) ? " is-on" : "");
      favBtn.setAttribute("aria-pressed", String(store.isFav(photo)));
      favBtn.setAttribute("aria-label", store.isFav(photo) ? UI_TEXT.favOn : UI_TEXT.favOff);
      favBtn.textContent = store.isFav(photo) ? "★" : "☆";
      favBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        store.toggleFav(photo);
        const on = store.isFav(photo);
        favBtn.classList.toggle("is-on", on);
        favBtn.textContent = on ? "★" : "☆";
        favBtn.setAttribute("aria-pressed", String(on));
        favBtn.setAttribute("aria-label", on ? UI_TEXT.favOn : UI_TEXT.favOff);
        if (sortMode === "fav") render();
      });

      actions.appendChild(likeBtn);
      actions.appendChild(favBtn);

      // 热门角标
      if (sortMode === "hot") {
        const badge = document.createElement("span");
        badge.className = "hot-badge";
        badge.textContent = "🔥 " + SORT[0];
        imgWrap.appendChild(badge);
      }

      const cap = document.createElement("figcaption");
      const line = document.createElement("span");
      line.className = "cat-line";
      line.textContent = T(photo.line);
      const credit = document.createElement("span");
      credit.className = "cat-credit";
      credit.textContent = T(photo.credit);
      const tag = document.createElement("span");
      tag.className = "cat-tag";
      tag.textContent = current.emoji + " " + T(current.label);
      cap.appendChild(line);
      cap.appendChild(credit);
      cap.appendChild(tag);

      btn.appendChild(img);
      imgWrap.appendChild(btn);
      imgWrap.appendChild(actions);
      fig.appendChild(imgWrap);
      fig.appendChild(cap);
      grid.appendChild(fig);

      // 点照片 → 跳转到独立详情页（故事 + 历史介绍 + 来历）
      // Clicking a photo opens its own detail page (story + history + provenance)
      const pIndex = all.indexOf(photo);
      btn.addEventListener("click", () => {
        location.href = "photo.html?cat=" + current.id + "&p=" + pIndex;
      });
    });

    loadNews();
  }

  function bigSrc(photo) {
    return IMG + (photo.srcset ? photo.srcset.split(", ").pop().split(" ")[0] : photo.src);
  }

  function openStory(photo) {
    storyBox.innerHTML = "";
    const img = document.createElement("img");
    img.src = bigSrc(photo);
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
    close.textContent = lang === "zh" ? "关闭" : lang === "de" ? "Schließen" : "Close";
    close.addEventListener("click", () => storyBox.close());
    storyBox.appendChild(close);

    storyBox.showModal();
    close.focus();
  }

  function todayIndex(cat) {
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    return seed % cat.photos.length;
  }

  luckyBtn.addEventListener("click", () => {
    const photos = photosOf(current);
    const d = new Date();
    const seed = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
    let idx = seed % photos.length;

    // 把某张幸运照片填进弹窗；reroll 时原地换内容
    // Fill the dialog with one lucky photo; re-roll replaces the content in place
    function buildLucky(i) {
      const photo = photos[i];
      const detailUrl = "photo.html?cat=" + current.id + "&p=" + i;

      luckyBox.innerHTML = "";
      const title = document.createElement("h2");
      title.className = "dialog-title";
      title.textContent = T(current.lucky);
      luckyBox.appendChild(title);

      // 图片和「查看详情」都跳到这张照片的独立页面
      // Both the image and the details button open this photo's own page
      const imgLink = document.createElement("a");
      imgLink.className = "dialog-img-link";
      imgLink.href = detailUrl;
      const img = document.createElement("img");
      img.src = bigSrc(photo);
      img.alt = T(photo.alt);
      imgLink.appendChild(img);
      luckyBox.appendChild(imgLink);

      const name = document.createElement("p");
      name.className = "dialog-line";
      const prefix = lang === "zh" ? "今天的是：" : lang === "de" ? "Heute ist es: " : "Today's is: ";
      name.textContent = prefix + T(photo.alt);
      luckyBox.appendChild(name);

      // 简介：来历一行
      const intro = document.createElement("p");
      intro.className = "dialog-sub";
      intro.textContent = T(photo.credit);
      luckyBox.appendChild(intro);

      // 它今天会带来什么——单独一行标签，说得明明白白
      // What it brings you today — its own labelled line
      const label = document.createElement("p");
      label.className = "dialog-label";
      label.textContent = lang === "zh" ? "它今天会给你带来" : lang === "de" ? "Was es dir heute bringt" : "What it brings you today";
      luckyBox.appendChild(label);

      const meaning = document.createElement("p");
      meaning.className = "dialog-sub";
      meaning.textContent = T(photo.luckyLine);
      luckyBox.appendChild(meaning);

      const details = document.createElement("a");
      details.className = "dialog-link";
      details.href = detailUrl;
      details.textContent = lang === "zh" ? "查看详情 →" : lang === "de" ? "Details ansehen →" : "View details →";
      luckyBox.appendChild(details);

      // 右下角：重新换一张幸运
      // Bottom-right corner: draw a different lucky photo
      const foot = document.createElement("div");
      foot.className = "dialog-foot";
      const close = document.createElement("button");
      close.type = "button";
      close.className = "dialog-close";
      close.textContent = lang === "zh" ? "带走今天的运气" : lang === "de" ? "Nimm das Glück mit" : "Take today's luck";
      close.addEventListener("click", () => luckyBox.close());
      const reroll = document.createElement("button");
      reroll.type = "button";
      reroll.className = "dialog-reroll";
      reroll.textContent = lang === "zh" ? "🔄 换一张" : lang === "de" ? "🔄 Nochmal ziehen" : "🔄 Draw another";
      reroll.addEventListener("click", () => {
        if (photos.length < 2) return;
        let next;
        do {
          next = Math.floor(Math.random() * photos.length);
        } while (next === idx);
        idx = next;
        buildLucky(idx);
      });
      foot.appendChild(close);
      foot.appendChild(reroll);
      luckyBox.appendChild(foot);

      luckyBox.showModal();
      close.focus();
    }

    buildLucky(idx);
  });

  // ---- 今日新闻：Wikipedia 头版「In the news」，按关键词挑本类的，每天自动更新 ----
  // Today's news: Wikipedia's "In the news", filtered by category keywords, refreshed daily
  function loadNews() {
    if (newsTitle) newsTitle.textContent = T(current.news.title);

    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const ymd = d.getFullYear() + "/" + pad(d.getMonth() + 1) + "/" + pad(d.getDate());

    // 按页面语言取对应语言维基的「In the news」；该语言没有时退回英文维基
    // Fetch "In the news" from the Wikipedia edition matching the page language; fall back to English when it has none
    const WIKI = { en: "en.wikipedia.org", zh: "zh.wikipedia.org", de: "de.wikipedia.org" };
    const host = WIKI[lang] || "en.wikipedia.org";
    let feedLang = lang;

    const fetchFeed = (h) =>
      fetch("https://" + h + "/api/rest_v1/feed/featured/" + ymd).then((r) => r.json());

    // 中文维基的 featured 接口没有新闻字段，改解析「新聞動態」页面
    // The Chinese Wikipedia's featured feed has no news field, so parse the 新聞動態 page instead
    const loadZhItems = () =>
      fetch("https://zh.wikipedia.org/w/api.php?action=parse&page=" +
            encodeURIComponent("Wikipedia:新聞動態") + "&prop=text&format=json&origin=*")
        .then((r) => r.json())
        .then((data) => {
          const doc = new DOMParser().parseFromString(data.parse.text["*"], "text/html");
          const items = [];
          doc.querySelectorAll("li").forEach((li) => {
            const text = li.textContent.replace(/\[[^\]]*\]/g, "").replace(/\s+/g, " ").trim();
            if (text.length < 10) return;
            const a = li.querySelector("a");
            let link = "";
            if (a && a.getAttribute("href")) {
              const href = a.getAttribute("href");
              link = href.startsWith("http") ? href : "https://zh.wikipedia.org" + href;
            }
            items.push({ text, link });
          });
          return items;
        });

    const feedPromise = lang === "zh"
      ? loadZhItems()
          .catch(() => null)
          .then((items) => {
            if (items && items.length) return { zhItems: items };
            feedLang = "en";
            return fetchFeed("en.wikipedia.org").then((d) => ({ data: d }));
          })
      : fetchFeed(host)
          .catch(() => null)
          .then((data) => {
            if ((!data || !Array.isArray(data.news) || data.news.length === 0) && lang !== "en") {
              feedLang = "en";
              return fetchFeed("en.wikipedia.org").then((d) => ({ data: d }));
            }
            if (!data || !Array.isArray(data.news)) throw new Error("feed unavailable");
            return { data };
          });

    feedPromise.then((payload) => {
        let items;
        if (payload.zhItems) {
          items = payload.zhItems;
        } else {
          items = (payload.data.news || []).map((n) => {
          const text = n.story
            .replace(/<[^>]+>/g, "")
            .replace(/&quot;/g, '"')
            .replace(/&#0?39;/g, "'")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&ndash;/g, "\u2013")
            .replace(/&mdash;/g, "\u2014")
            .replace(/&nbsp;/g, " ")
            .replace(/&amp;/g, "&")
            .replace(/\s+/g, " ")
            .trim();
          let link = "";
          const m = n.story.match(/href="([^"]+)"/);
          if (m) link = m[1].startsWith("http") ? m[1] : "https://en.wikipedia.org" + m[1];
          return { text, link };
        });
        }

        // 严格按本类关键词匹配：拉丁词用整词边界（避免 cat 命中 category），中文直接包含
        // Strict per-category matching: whole words for Latin (so "cat" misses "category"), plain contains for Chinese
        const kw = (current.news.keywords && (current.news.keywords[feedLang] || current.news.keywords.en)) || [];
        const latinKw = kw
          .filter((k) => /[a-zA-Z]/.test(k))
          .map((k) => new RegExp("\\b" + k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\b", "i"));
        const cjkKw = kw.filter((k) => /[\u4e00-\u9fa5]/.test(k));
        const matched = items.filter((it) => {
          const text = it.text;
          if (cjkKw.some((k) => text.includes(k))) return true;
          return latinKw.some((re) => re.test(text));
        });
        // 没匹配就不显示无关新闻——宁可空着也不张冠李戴
        // No match means no unrelated headlines: an honest empty state instead
        const shown = matched.slice(0, 3);

        newsList.innerHTML = "";
        shown.forEach((it) => {
          const li = document.createElement("li");
          if (it.link) {
            const a = document.createElement("a");
            a.href = it.link;
            a.rel = "noopener noreferrer";
            a.textContent = it.text;
            li.appendChild(a);
          } else {
            li.textContent = it.text;
          }
          newsList.appendChild(li);
        });

        if (!matched.length) {
          newsNote.textContent = T(current.news.fallback) + " ";
          const q = {
            humanities: "culture art museum news",
            food: "food cuisine news",
            animals: "animals wildlife news",
            landscape: "environment nature climate news",
          }[current.id] || "news";
          const a = document.createElement("a");
          a.href = "https://news.google.com/search?q=" + encodeURIComponent(q);
          a.rel = "noopener noreferrer";
          a.target = "_blank";
          a.textContent = lang === "zh" ? "打开本类今日新闻 →" : lang === "de" ? "Themen-Nachrichten öffnen →" : "Open this category's news →";
          newsNote.appendChild(a);
        } else if (newsNote) {
          newsNote.textContent = "";
        }
      })
      .catch(() => {
        if (newsNote) {
          newsNote.textContent = lang === "zh"
            ? "新闻暂时加载不出来，点这里看维基百科今天的要闻："
            : lang === "de"
              ? "Nachrichten lassen sich gerade nicht laden — die Schlagzeilen von heute gibt es bei Wikipedia:"
              : "News could not load right now — today's headlines are on Wikipedia:";
          const a = document.createElement("a");
          a.href = "https://en.wikipedia.org/wiki/Portal:Current_events";
          a.rel = "noopener noreferrer";
          a.textContent = "Wikipedia";
          newsNote.appendChild(a);
        }
      });
  }

  render();
})();
