// 看图猜类别：10 题，答对加分
// Guess the category: ten questions, score at the end
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";
  const T = (p) => (p && (p[lang] || p.en)) || "";
  const parts = location.pathname.split("/").filter(Boolean);
  const IMG = parts.includes("zh") || parts.includes("de") ? "../" : "";
  const body = document.querySelector("#pageBody");

  const S = {
    en: { start: "Start the quiz", q: "Which kind is this photo?", right: "Right!", wrong: "Not quite — it is",
          next: "Next question", score: "Score", again: "Play again", done: "You scored {a} of {b}.",
          browse: "Browse the photos →", qn: "Question {i} of {n}" },
    zh: { start: "开始猜", q: "这张照片属于哪一类？", right: "对了！", wrong: "不对——其实是",
          next: "下一题", score: "得分", again: "再玩一次", done: "你答对了 {a} / {b} 题。",
          browse: "去照片页继续逛 →", qn: "第 {i} 题，共 {n} 题" },
    de: { start: "Quiz starten", q: "Zu welcher Art gehört dieses Foto?", right: "Richtig!", wrong: "Leider nicht — es ist",
          next: "Nächste Frage", score: "Punkte", again: "Nochmal spielen", done: "Du hast {a} von {b} richtig.",
          browse: "Zu den Fotos →", qn: "Frage {i} von {n}" },
  }[lang];

  const photosOf = (cat) => cat.photos.concat((typeof GALLERY_POOL !== "undefined" ? GALLERY_POOL : {})[cat.id] || []);
  let deck = [];
  let q = 0;
  let score = 0;

  function buildDeck() {
    deck = [];
    GALLERY.categories.forEach((cat) => {
      const list = photosOf(cat);
      for (let i = 0; i < 3; i++) {
        const p = list[Math.floor(Math.random() * list.length)];
        deck.push({ cat, photo: p });
      }
    });
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = deck[i]; deck[i] = deck[j]; deck[j] = t;
    }
    deck = deck.slice(0, 10);
    q = 0;
    score = 0;
  }

  function start() {
    buildDeck();
    body.innerHTML = "";
    const bar = document.createElement("p");
    bar.className = "quiz-bar";
    body.appendChild(bar);
    const wrap = document.createElement("div");
    wrap.className = "quiz-wrap";
    body.appendChild(wrap);
    next();
  }

  function next() {
    if (q >= deck.length) return end();
    body.innerHTML = "";
    const bar = document.createElement("p");
    bar.className = "quiz-bar";
    bar.textContent = S.qn.replace("{i}", q + 1).replace("{n}", deck.length) + " · " + S.score + ": " + score;
    body.appendChild(bar);

    const item = deck[q];
    const img = document.createElement("img");
    img.className = "quiz-img";
    img.src = IMG + item.photo.src;
    img.alt = T(item.photo.alt);
    body.appendChild(img);

    const ask = document.createElement("p");
    ask.className = "quiz-ask";
    ask.textContent = S.q;
    body.appendChild(ask);

    const opts = document.createElement("div");
    opts.className = "quiz-opts";
    // 正确答案 + 3 个干扰项
    const others = GALLERY.categories.filter((c) => c.id !== item.cat.id);
    for (let i = others.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = others[i]; others[i] = others[j]; others[j] = t;
    }
    const choices = [item.cat].concat(others.slice(0, 3));
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = choices[i]; choices[i] = choices[j]; choices[j] = t;
    }

    const result = document.createElement("p");
    result.className = "quiz-result";

    choices.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "cat-pick-btn";
      b.textContent = c.emoji + " " + T(c.label);
      b.addEventListener("click", () => {
        opts.querySelectorAll("button").forEach((x) => { x.disabled = true; });
        if (c.id === item.cat.id) {
          score += 1;
          b.classList.add("is-right");
          result.textContent = S.right + " " + T(item.photo.line);
        } else {
          b.classList.add("is-wrong");
          opts.querySelectorAll("button").forEach((x) => {
            if (x.textContent === item.cat.emoji + " " + T(item.cat.label)) x.classList.add("is-right");
          });
          result.textContent = S.wrong + " " + T(item.cat.label) + " — " + T(item.photo.line);
        }
        const go = document.createElement("a");
        go.className = "button";
        go.href = "photo.html?cat=" + item.cat.id + "&p=" + photosOf(item.cat).indexOf(item.photo);
        go.textContent = S.browse;
        const nx = document.createElement("button");
        nx.type = "button";
        nx.className = "button button-ghost";
        nx.textContent = S.next;
        nx.addEventListener("click", () => { q += 1; next(); });
        result.appendChild(document.createElement("br"));
        result.appendChild(go);
        result.appendChild(nx);
      });
      opts.appendChild(b);
    });
    body.appendChild(opts);
    body.appendChild(result);
  }

  function end() {
    body.innerHTML = "";
    const done = document.createElement("p");
    done.className = "quiz-done";
    done.textContent = S.done.replace("{a}", score).replace("{b}", deck.length);
    const again = document.createElement("button");
    again.type = "button";
    again.className = "button";
    again.textContent = S.again;
    again.addEventListener("click", start);
    const browse = document.createElement("a");
    browse.className = "button button-ghost";
    browse.href = "works.html";
    browse.textContent = S.browse;
    body.appendChild(done);
    body.appendChild(again);
    body.appendChild(browse);
  }

  const startBtn = document.createElement("button");
  startBtn.type = "button";
  startBtn.className = "button button-big";
  startBtn.textContent = "▶ " + S.start;
  startBtn.addEventListener("click", start);
  body.appendChild(startBtn);
})();
