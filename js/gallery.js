// 照片页逻辑：四分类切换、一句话弹窗、今日幸运照片、今日新闻。
// Gallery logic: category switch, one-line dialog, lucky photo of the day, and today's news.
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (pair) => pair[lang] || pair.en;

  const switchNav = document.querySelector(".cat-switch");
  const grid = document.querySelector(".cat-gallery");
  const luckyBtn = document.querySelector("#luckyBtn");
  const storyBox = document.querySelector("#storyBox");
  const luckyBox = document.querySelector("#luckyBox");
  const newsList = document.querySelector("#newsList");
  const newsTitle = document.querySelector("#newsTitle");
  const newsNote = document.querySelector("#newsNote");
  if (!switchNav || !grid) return;

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

  const params = new URLSearchParams(location.search);
  let currentId = GALLERY.categories.some((c) => c.id === params.get("cat"))
    ? params.get("cat") : GALLERY.categories[0].id;
  let current = GALLERY.categories.find((c) => c.id === currentId);

  switchNav.innerHTML = "";
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
    });
    switchNav.appendChild(b);
  });

  function render() {
    document.body.dataset.cat = current.id;

    switchNav.querySelectorAll(".cat-btn").forEach((b) => {
      b.classList.toggle("is-active", b.dataset.cat === current.id);
      b.setAttribute("aria-pressed", String(b.dataset.cat === current.id));
    });

    luckyBtn.textContent = "🎲 " + T(current.lucky);

    grid.innerHTML = "";
    photosOf(current).forEach((photo) => {
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

    loadNews();
  }

  function bigSrc(photo) {
    return photo.srcset ? photo.srcset.split(", ").pop().split(" ")[0] : photo.src;
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
    const photo = photos[seed % photos.length];

    luckyBox.innerHTML = "";
    const title = document.createElement("h2");
    title.className = "dialog-title";
    title.textContent = T(current.lucky);
    luckyBox.appendChild(title);

    const img = document.createElement("img");
    img.src = bigSrc(photo);
    img.alt = T(photo.alt);
    luckyBox.appendChild(img);

    const name = document.createElement("p");
    name.className = "dialog-line";
    const prefix = lang === "zh" ? "今天的是：" : lang === "de" ? "Heute ist es: " : "Today's is: ";
    name.textContent = prefix + T(photo.alt);
    luckyBox.appendChild(name);

    const meaning = document.createElement("p");
    meaning.className = "dialog-sub";
    meaning.textContent = T(photo.luckyLine);
    luckyBox.appendChild(meaning);

    const close = document.createElement("button");
    close.type = "button";
    close.className = "dialog-close";
    close.textContent = lang === "zh" ? "带走今天的运气" : lang === "de" ? "Nimm das Glück mit" : "Take today's luck";
    close.addEventListener("click", () => luckyBox.close());
    luckyBox.appendChild(close);

    luckyBox.showModal();
    close.focus();
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

        const kw = (current.news.keywords && (current.news.keywords[feedLang] || current.news.keywords.en)) || [];
        const matched = items.filter((it) => kw.some((k) => it.text.toLowerCase().includes(k)));
        const shown = (matched.length ? matched : items).slice(0, 3);

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
          newsNote.textContent = T(current.news.fallback);
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
