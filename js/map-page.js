// 照片地图：等距圆柱投影，经纬度直接算百分比
// Photo map: equirectangular projection, lat/lon to percentages
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (p) => (p && (p[lang] || p.en)) || "";
  const parts = location.pathname.split("/").filter(Boolean);
  const IMG = parts.includes("zh") || parts.includes("de") ? "../" : "";
  const body = document.querySelector("#pageBody");
  const credit = document.querySelector("#mapCredit");
  if (credit) credit.hidden = false;

  const locate = (src) => {
    for (const cat of GALLERY.categories) {
      const pool = (typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || [];
      const all = cat.photos.concat(pool);
      const i = all.findIndex((p) => p.src === src);
      if (i !== -1) return { cat, photo: all[i], index: i };
    }
    return null;
  };

  const wrap = document.createElement("div");
  wrap.style.backgroundImage = "url(\"" + IMG + "img/world-map.png\")";
  wrap.style.backgroundSize = "100% 100%";

  wrap.className = "map-wrap";

  const pts = (typeof PHOTO_COORDS !== "undefined" ? PHOTO_COORDS : []).map((c) => {
    const loc = locate(c.src);
    return loc ? Object.assign({}, c, loc) : null;
  }).filter(Boolean);

  pts.forEach((pt) => {
    const a = document.createElement("a");
    a.className = "map-dot";
    a.href = "photo.html?cat=" + pt.cat.id + "&p=" + pt.index;
    a.style.left = ((pt.lon + 180) / 360 * 100) + "%";
    a.style.top = ((90 - pt.lat) / 180 * 100) + "%";
    a.title = T(pt.photo.alt);
    a.setAttribute("aria-label", T(pt.photo.alt));
    const dot = document.createElement("span");
    dot.className = "map-dot-mark";
    const tip = document.createElement("span");
    tip.className = "map-tip";
    tip.textContent = T(pt.photo.alt);
    a.appendChild(dot);
    a.appendChild(tip);
    wrap.appendChild(a);
  });
  body.appendChild(wrap);

  const count = document.createElement("p");
  count.className = "hint";
  count.textContent = { en: pts.length + " photos have coordinates in their files.",
                        zh: "有 " + pts.length + " 张照片的文件里带位置信息。",
                        de: pts.length + " Fotos haben Koordinaten in ihren Dateien." }[lang];
  body.appendChild(count);

  const list = document.createElement("div");
  list.className = "walk-list";
  pts.forEach((pt) => {
    const a = document.createElement("a");
    a.className = "walk-item";
    a.href = "photo.html?cat=" + pt.cat.id + "&p=" + pt.index;
    const im = document.createElement("img");
    im.src = IMG + pt.photo.src;
    im.alt = T(pt.photo.alt);
    im.loading = "lazy";
    const cap = document.createElement("span");
    cap.className = "walk-cap";
    cap.textContent = T(pt.photo.alt) + " · " + pt.lat + ", " + pt.lon;
    a.appendChild(im);
    a.appendChild(cap);
    list.appendChild(a);
  });
  body.appendChild(list);
})();
