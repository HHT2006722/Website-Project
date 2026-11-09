// 收藏夹页：列出 ★ 收藏的所有照片（按类别分组）
// Favourites page: everything saved with ★, grouped by category
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (p) => (p && (p[lang] || p.en)) || "";
  const parts = location.pathname.split("/").filter(Boolean);
  const IMG = parts.includes("zh") || parts.includes("de") ? "../" : "";
  const body = document.querySelector("#pageBody");

  let favs = new Set();
  try {
    favs = new Set(JSON.parse(localStorage.getItem("pf-favs") || "[]"));
  } catch (e) { favs = new Set(); }

  if (!favs.size) {
    const p = document.createElement("p");
    p.className = "cat-empty";
    p.textContent = { en: "Nothing saved yet — press ★ on any photo.",
                      zh: "还没有收藏——在任意照片上点 ★ 就行。",
                      de: "Noch nichts gespeichert — drücke ★ auf einem Foto." }[lang];
    body.appendChild(p);
    return;
  }

  GALLERY.categories.forEach((cat) => {
    const pool = (typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || [];
    const all = cat.photos.concat(pool);
    const saved = all.map((p, i) => ({ p, i })).filter((x) => favs.has(x.p.src));
    if (!saved.length) return;
    const h = document.createElement("h2");
    h.className = "fav-cat";
    h.textContent = cat.emoji + " " + T(cat.label);
    body.appendChild(h);
    const grid = document.createElement("div");
    grid.className = "fav-grid";
    saved.forEach(({ p, i }) => {
      const a = document.createElement("a");
      a.className = "fav-item";
      a.href = "photo.html?cat=" + cat.id + "&p=" + i;
      const img = document.createElement("img");
      img.src = IMG + p.src;
      img.alt = T(p.alt);
      img.loading = "lazy";
      const cap = document.createElement("span");
      cap.className = "fav-cap";
      cap.textContent = T(p.line);
      a.appendChild(img);
      a.appendChild(cap);
      grid.appendChild(a);
    });
    body.appendChild(grid);
  });
})();
