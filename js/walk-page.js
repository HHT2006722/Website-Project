// 单条漫游页：按顺序显示五张照片
// Single walk page: show its five photos in order
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (p) => (p && (p[lang] || p.en)) || "";
  const parts = location.pathname.split("/").filter(Boolean);
  const IMG = parts.includes("zh") || parts.includes("de") ? "../" : "";

  const params = new URLSearchParams(location.search);
  const ids = Object.keys(WALKS);
  const wid = WALKS[params.get("w")] ? params.get("w") : ids[0];
  const w = WALKS[wid];
  const body = document.querySelector("#pageBody");

  document.title = T(w.title) + " · " + document.title.split(" · ").pop();
  document.querySelector("h1").textContent = T(w.title);
  document.querySelector(".lead").textContent = T(w.lead);

  const find = (src, cat) => {
    const pool = (typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || [];
    const all = cat.photos.concat(pool);
    const i = all.findIndex((p) => p.src === src);
    return i === -1 ? null : { photo: all[i], index: i, cat };
  };
  const locate = (src) => {
    for (const cat of GALLERY.categories) {
      const hit = find(src, cat);
      if (hit) return hit;
    }
    return null;
  };

  const list = document.createElement("div");
  list.className = "walk-list";
  w.srcs.forEach((src, k) => {
    const loc = locate(src);
    if (!loc) return;
    const a = document.createElement("a");
    a.className = "walk-item";
    a.href = "photo.html?cat=" + loc.cat.id + "&p=" + loc.index;
    const img = document.createElement("img");
    img.src = IMG + loc.photo.src;
    img.alt = T(loc.photo.alt);
    img.loading = "lazy";
    const cap = document.createElement("span");
    cap.className = "walk-cap";
    cap.textContent = (k + 1) + ". " + T(loc.photo.line);
    a.appendChild(img);
    a.appendChild(cap);
    list.appendChild(a);
  });
  body.appendChild(list);

  const nav = document.createElement("p");
  nav.className = "walk-nav";
  const back = document.createElement("a");
  back.href = "walks.html";
  back.className = "button button-ghost";
  back.textContent = lang === "zh" ? "← 全部漫游" : lang === "de" ? "← Alle Spaziergänge" : "← All walks";
  nav.appendChild(back);
  const i = ids.indexOf(wid);
  const prevId = ids[(i - 1 + ids.length) % ids.length];
  const nextId = ids[(i + 1) % ids.length];
  const prev = document.createElement("a");
  prev.href = "walk.html?w=" + prevId;
  prev.className = "button button-ghost";
  prev.textContent = lang === "zh" ? "上一条漫游" : lang === "de" ? "Vorheriger" : "Previous walk";
  const next = document.createElement("a");
  next.href = "walk.html?w=" + nextId;
  next.className = "button button-ghost";
  next.textContent = lang === "zh" ? "下一条漫游" : lang === "de" ? "Nächster Spaziergang" : "Next walk";
  nav.appendChild(prev);
  nav.appendChild(next);
  body.appendChild(nav);
})();
