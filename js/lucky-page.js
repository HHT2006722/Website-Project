// 幸运页：四类今日幸运 + 连续天数 + 最近七天 + 生成分享卡
// Lucky page: today's four lucky photos, streak, last seven days, share card
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (p) => (p && (p[lang] || p.en)) || "";
  const parts = location.pathname.split("/").filter(Boolean);
  const IMG = parts.includes("zh") || parts.includes("de") ? "../" : "";
  const body = document.querySelector("#pageBody");

  const S = {
    en: { brings: "What it brings you today", details: "View details →", share: "Share card",
          history: "The last seven days", streak: "🔥 Day {n} in a row", badge3: "🏅 3-day streak", badge7: "🏅 7-day streak",
          badge30: "🏅 30-day streak", locked: "keep coming back", downloaded: "Card saved",
          cardTag: "today's luck", made: "made with" },
    zh: { brings: "它今天会给你带来", details: "查看详情 →", share: "生成分享卡",
          history: "最近七天", streak: "🔥 连续第 {n} 天", badge3: "🏅 连续 3 天", badge7: "🏅 连续 7 天",
          badge30: "🏅 连续 30 天", locked: "继续来就有", downloaded: "分享卡已保存",
          cardTag: "今日幸运", made: "来自" },
    de: { brings: "Was es dir heute bringt", details: "Details ansehen →", share: "Teilen-Karte",
          history: "Die letzten sieben Tage", streak: "🔥 Tag {n} in Folge", badge3: "🏅 3 Tage in Folge", badge7: "🏅 7 Tage in Folge",
          badge30: "🏅 30 Tage in Folge", locked: "bleib dran", downloaded: "Karte gespeichert",
          cardTag: "Glück von heute", made: "von" },
  }[lang];

  const photosOf = (cat) => cat.photos.concat((typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || []);
  const seedOf = (date) => date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

  // 连续天数 + 徽章
  let streak = 0;
  try {
    streak = parseInt(localStorage.getItem("pf-streak") || "0", 10) || 0;
  } catch (e) { streak = 0; }
  const st = document.createElement("p");
  st.className = "streak-line";
  st.textContent = S.streak.replace("{n}", streak);
  body.appendChild(st);
  const badges = document.createElement("p");
  badges.className = "badge-line";
  [[3, S.badge3], [7, S.badge7], [30, S.badge30]].forEach(([need, label]) => {
    const b = document.createElement("span");
    b.className = "badge" + (streak >= need ? " is-on" : "");
    b.textContent = label + (streak >= need ? "" : " (" + S.locked + ")");
    badges.appendChild(b);
  });
  body.appendChild(badges);

  const today = new Date();
  const grid = document.createElement("div");
  grid.className = "lucky-grid";

  GALLERY.categories.forEach((cat) => {
    const list = photosOf(cat);
    const photo = list[seedOf(today) % list.length];
    const card = document.createElement("div");
    card.className = "lucky-card";

    const img = document.createElement("img");
    img.src = IMG + photo.src;
    img.alt = T(photo.alt);
    const name = document.createElement("h2");
    name.textContent = cat.emoji + " " + T(photo.alt);
    const label = document.createElement("p");
    label.className = "dialog-label";
    label.textContent = S.brings;
    const meaning = document.createElement("p");
    meaning.textContent = T(photo.luckyLine);

    const link = document.createElement("a");
    link.className = "button button-ghost";
    const idx = seedOf(today) % list.length;
    link.href = "photo.html?cat=" + cat.id + "&p=" + idx;
    link.textContent = S.details;

    const shareBtn = document.createElement("button");
    shareBtn.type = "button";
    shareBtn.className = "button button-ghost";
    shareBtn.textContent = "📸 " + S.share;

    card.appendChild(img);
    card.appendChild(name);
    card.appendChild(label);
    card.appendChild(meaning);
    card.appendChild(link);
    card.appendChild(shareBtn);
    grid.appendChild(card);

    // 分享卡：canvas 1080×1350，图 + 一句话 + 幸运语 + 站名
    shareBtn.addEventListener("click", () => {
      const W = 1080, H = 1350;
      const cv = document.createElement("canvas");
      cv.width = W;
      cv.height = H;
      const ctx = cv.getContext("2d");
      const im = new Image();
      im.onload = () => {
        const scale = Math.max(W / im.width, (H * 0.72) / im.height);
        const dw = im.width * scale, dh = im.height * scale;
        ctx.fillStyle = "#111";
        ctx.fillRect(0, 0, W, H);
        ctx.drawImage(im, (W - dw) / 2, 0, dw, dh);
        const grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
        grad.addColorStop(0, "rgba(10,8,6,0)");
        grad.addColorStop(0.55, "rgba(10,8,6,0.85)");
        grad.addColorStop(1, "rgba(10,8,6,0.97)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, H * 0.55, W, H * 0.45);

        ctx.fillStyle = "#ffffff";
        ctx.font = "600 46px system-ui, sans-serif";
        const wrap = (text, maxW, y, lineH, maxLines) => {
          const words = text.split(/(\s+)/);
          let line = "";
          let lines = 0;
          for (const w of words) {
            const test = line + w;
            if (ctx.measureText(test).width > maxW && line) {
              ctx.fillText(line.trim(), 70, y);
              y += lineH;
              line = w;
              lines += 1;
              if (lines >= maxLines - 1) break;
            } else {
              line = test;
            }
          }
          if (line && lines < maxLines) ctx.fillText(line.trim(), 70, y);
          return y;
        };
        let y = wrap(T(photo.line), W - 140, H - 300, 62, 3);
        ctx.fillStyle = "#f3a35c";
        ctx.font = "500 34px system-ui, sans-serif";
        y = wrap(T(photo.luckyLine), W - 140, y + 60, 46, 2);
        ctx.fillStyle = "rgba(255,255,255,.75)";
        ctx.font = "400 28px system-ui, sans-serif";
        ctx.fillText(S.cardTag + " · " + S.made + " Photo Fortune", 70, H - 70);

        const dl = document.createElement("a");
        dl.href = cv.toDataURL("image/png");
        dl.download = "photo-fortune-" + cat.id + ".png";
        dl.click();
        shareBtn.textContent = "✅ " + S.downloaded;
      };
      im.src = IMG + photo.src;
    });
  });
  body.appendChild(grid);

  // 最近七天：按已选类别列出
  const histTitle = document.createElement("h2");
  histTitle.className = "fav-cat";
  histTitle.textContent = S.history;
  body.appendChild(histTitle);

  const tabs = document.createElement("div");
  tabs.className = "cat-pick";
  const histList = document.createElement("div");
  histList.className = "hist-list";

  const renderHistory = (cat) => {
    histList.innerHTML = "";
    const list = photosOf(cat);
    for (let i = 0; i < 7; i++) {
      const d = new Date(today.getTime() - i * 86400000);
      const idx = seedOf(d) % list.length;
      const photo = list[idx];
      const row = document.createElement("a");
      row.className = "hist-row";
      row.href = "photo.html?cat=" + cat.id + "&p=" + idx;
      const im = document.createElement("img");
      im.src = IMG + photo.src;
      im.alt = T(photo.alt);
      im.loading = "lazy";
      const info = document.createElement("span");
      info.className = "hist-info";
      const date = document.createElement("strong");
      date.textContent = d.toISOString().slice(0, 10);
      const nm = document.createElement("span");
      nm.textContent = T(photo.alt);
      info.appendChild(date);
      info.appendChild(nm);
      row.appendChild(im);
      row.appendChild(info);
      histList.appendChild(row);
    }
  };

  GALLERY.categories.forEach((cat, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat-pick-btn" + (i === 0 ? " is-active" : "");
    b.textContent = cat.emoji + " " + T(cat.label);
    b.addEventListener("click", () => {
      tabs.querySelectorAll(".cat-pick-btn").forEach((x) => x.classList.toggle("is-active", x === b));
      renderHistory(cat);
    });
    tabs.appendChild(b);
  });
  body.appendChild(tabs);
  body.appendChild(histList);
  renderHistory(GALLERY.categories[0]);
})();
