// 照片详情页：从 GALLERY + GALLERY_POOL 里按 ?cat=&p= 找到照片，展示故事/介绍/来历。
// Photo detail page: find the photo by ?cat=&p= and show story, description and provenance.
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (pair) => (pair && (pair[lang] || pair.en)) || "";

  const STR = {
    en: { back: "← Back to photos", story: "Its story", about: "About it", prov: "Where it comes from",
          more: "Full description and history on Wikimedia Commons →", lucky: "Its meaning for today",
          prev: "← Previous", next: "Next →", copy: "Copy link", copied: "Link copied", notfound: "This photo was not found.",
          ownAbout: "Taken by the site's author — the story line below is the full note on this photo." },
    zh: { back: "← 回到照片页", story: "它的故事", about: "相关介绍", prov: "它的来历",
          more: "在维基共享资源上看完整介绍与历史 →", lucky: "它今天会带来",
          prev: "← 上一张", next: "下一张 →", copy: "复制链接", copied: "链接已复制", notfound: "没找到这张照片。",
          ownAbout: "本站作者拍摄——下面那句就是关于这张照片的全部说明。" },
    de: { back: "← Zurück zu den Fotos", story: "Seine Geschichte", about: "Darüber", prov: "Woher es stammt",
          more: "Vollständige Beschreibung und Geschichte auf Wikimedia Commons →", lucky: "Was es dir heute bringt",
          prev: "← Zurück", next: "Weiter →", copy: "Link kopieren", copied: "Link kopiert", notfound: "Dieses Foto wurde nicht gefunden.",
          ownAbout: "Vom Autor der Seite aufgenommen — die Zeile unten ist die ganze Notiz zu diesem Foto." },
  }[lang];

  const pathParts = location.pathname.split("/").filter(Boolean);
  const IMG = pathParts.includes("zh") || pathParts.includes("de") ? "../" : "";

  const params = new URLSearchParams(location.search);
  const catId = params.get("cat");
  const idx = parseInt(params.get("p"), 10);
  const cat = (GALLERY.categories || []).find((c) => c.id === catId);
  const pool = (typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[catId] || [];
  const photos = cat ? cat.photos.concat(pool) : [];
  const photo = Number.isInteger(idx) && idx >= 0 && idx < photos.length ? photos[idx] : null;

  const img = document.querySelector("#photoImg");
  const titleEl = document.querySelector("#photoTitle");
  const catEl = document.querySelector("#photoCat");
  const lineEl = document.querySelector("#photoLine");
  const descEl = document.querySelector("#photoDesc");
  const provEl = document.querySelector("#photoProv");
  const srcEl = document.querySelector("#photoSource");
  const luckyEl = document.querySelector("#photoLucky");
  const backEl = document.querySelector("#photoBack");
  const prevEl = document.querySelector("#photoPrev");
  const nextEl = document.querySelector("#photoNext");
  const copyEl = document.querySelector("#photoCopy");
  const creditEl = document.querySelector("#photoCredit");
  const headingEls = document.querySelectorAll(".photo-h2");

  document.body.dataset.cat = catId || "";

  backEl.innerHTML = "";
  const back = document.createElement("a");
  back.href = "works.html" + (cat ? "?cat=" + cat.id : "");
  back.textContent = STR.back;
  backEl.appendChild(back);

  if (!photo) {
    titleEl.textContent = STR.notfound;
    img.hidden = true;
    headingEls.forEach((h) => { h.hidden = true; });
    prevEl.hidden = true;
    nextEl.hidden = true;
    copyEl.hidden = true;
    return;
  }

  const rel = (i) => {
    if (i < 0 || i >= photos.length) return null;
    return "photo.html?cat=" + cat.id + "&p=" + i;
  };

  img.src = IMG + photo.src;
  img.alt = T(photo.alt);
  if (photo.srcset) img.srcset = photo.srcset.split(", ").map((e) => IMG + e).join(", ");
  document.title = T(photo.alt) + " · " + document.title.split(" · ").pop();

  titleEl.textContent = T(photo.line);
  catEl.textContent = cat.emoji + " " + T(cat.label);
  lineEl.textContent = T(photo.line);

  const desc = T(photo.desc) || T(photo.line);
  descEl.textContent = (photo.desc && photo.desc.en) ? desc : (photo.source ? desc : STR.ownAbout);

  provEl.textContent = T(photo.credit);
  creditEl.textContent = T(photo.credit);

  if (photo.source) {
    srcEl.href = photo.source;
    srcEl.textContent = STR.more;
    srcEl.target = "_blank";
  } else {
    srcEl.hidden = true;
  }

  luckyEl.textContent = "🎲 " + STR.lucky + "：" + T(photo.luckyLine);

  const pRel = rel(idx - 1);
  const nRel = rel(idx + 1);
  if (pRel) prevEl.href = pRel; else prevEl.hidden = true;
  if (nRel) nextEl.href = nRel; else nextEl.hidden = true;

  copyEl.addEventListener("click", () => {
    const url = location.origin + location.pathname + "?cat=" + cat.id + "&p=" + idx;
    const done = () => { copyEl.textContent = STR.copied; setTimeout(() => { copyEl.textContent = STR.copy; }, 1500); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(done, done);
    } else {
      done();
    }
  });
})();
