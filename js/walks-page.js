// 漫游列表页：把每条漫游渲染成卡片
// Walk list page: render each walk as a card
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (p) => (p && (p[lang] || p.en)) || "";
  const parts = location.pathname.split("/").filter(Boolean);
  const IMG = parts.includes("zh") || parts.includes("de") ? "../" : "";
  const body = document.querySelector("#pageBody");
  const STR = { en: "Open walk →", zh: "进入漫游 →", de: "Spaziergang starten →" }[lang];

  const coverOf = (src) => {
    for (const id in (typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})) {
      const hit = GALLERY_POOL[id].find((p) => p.src === src);
      if (hit) return hit;
    }
    for (const cat of GALLERY.categories) {
      const hit = cat.photos.find((p) => p.src === src);
      if (hit) return hit;
    }
    return null;
  };

  Object.keys(WALKS).forEach((id) => {
    const w = WALKS[id];
    const card = document.createElement("a");
    card.className = "walk-card";
    card.href = "walk.html?w=" + id;
    const first = coverOf(w.srcs[0]);
    if (first) {
      const img = document.createElement("img");
      img.src = IMG + first.src;
      img.alt = T(first.alt);
      img.loading = "lazy";
      card.appendChild(img);
    }
    const h = document.createElement("h2");
    h.textContent = T(w.title);
    const p = document.createElement("p");
    p.textContent = T(w.lead);
    const go = document.createElement("span");
    go.className = "walk-go";
    go.textContent = STR;
    card.appendChild(h);
    card.appendChild(p);
    card.appendChild(go);
    body.appendChild(card);
  });
})();
