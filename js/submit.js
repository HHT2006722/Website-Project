// 投稿页：先选分类 → 选故事（配套故事或自写）→ 选照片 → 填来历。
// Submit page: category first, then story, then the photo, then provenance.
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";

  const STR = {
    en: {
      need: "Pick a category, a story and a photographer first — then press the button again.",
      ghTitle: "Photo submission: {story}",
      ghBody: "**Photo submission**\n\nCategory: {cat}\nStory: {story}\nWhere: {where}\nWhen: {when}\nPhotographer: {who}\n\n(Attach the photo by dragging it into this box.)",
      mailSubject: "Photo submission: {story}",
      mailBody: "Category: {cat}\nStory: {story}\nWhere: {where}\nWhen: {when}\nPhotographer: {who}\n\n(Photo attached to this email.)",
      own: "… write your own",
    },
    zh: {
      need: "请先选好分类、故事和拍摄者，再点一次按钮。",
      ghTitle: "照片投稿：{story}",
      ghBody: "**照片投稿**\n\n分类：{cat}\n故事：{story}\n地点：{where}\n时间：{when}\n拍摄者：{who}\n\n（把照片拖进这个输入框即可附上。）",
      mailSubject: "照片投稿：{story}",
      mailBody: "分类：{cat}\n故事：{story}\n地点：{where}\n时间：{when}\n拍摄者：{who}\n\n（照片作为附件随邮件发出。）",
      own: "……自己写一个",
    },
    de: {
      need: "Bitte zuerst Kategorie, Geschichte und Fotograf/in ausfüllen — dann noch einmal klicken.",
      ghTitle: "Foto-Einreichung: {story}",
      ghBody: "**Foto-Einreichung**\n\nKategorie: {cat}\nGeschichte: {story}\nOrt: {where}\nWann: {when}\nFotograf/in: {who}\n\n(Foto per Ziehen in dieses Feld anhängen.)",
      mailSubject: "Foto-Einreichung: {story}",
      mailBody: "Kategorie: {cat}\nGeschichte: {story}\nOrt: {where}\nWann: {when}\nFotograf/in: {who}\n\n(Foto hängt an dieser E-Mail.)",
      own: "… eigene schreiben",
    },
  }[lang];

  const T = (key, values) => STR[key].replace(/\{(\w+)\}/g, (_, k) => (values || {})[k] || "");

  const form = document.querySelector("#submitForm");
  if (!form) return;

  const promptsEl = document.querySelector("#prompts-data");
  let CATS = {};
  try {
    CATS = JSON.parse(promptsEl.textContent);
  } catch (e) {
    CATS = {};
  }

  const catPick = document.querySelector("#catPick");
  const storyPick = document.querySelector("#storyPick");
  const storyEl = document.querySelector("#story");
  const countEl = document.querySelector("#storyCount");
  const photoInput = document.querySelector("#photo");
  const preview = document.querySelector("#photoPreview");
  const whereEl = document.querySelector("#where");
  const whenEl = document.querySelector("#when");
  const whoEl = document.querySelector("#who");
  const ghBtn = document.querySelector("#ghBtn");
  const mailLink = document.querySelector("#mailLink");
  const status = document.querySelector("#submitStatus");

  const REPO = "https://github.com/HHT2006722/Website-Project";
  const MAIL = "zjy1972422hht@163.com";

  let currentCat = null;

  const steps = {
    2: document.querySelector('.step[data-step="2"]'),
    3: document.querySelector('.step[data-step="3"]'),
    4: document.querySelector('.step[data-step="4"]'),
  };

  const show = (n) => { if (steps[n]) steps[n].hidden = false; };
  const L = (pair) => (pair && (pair[lang] || pair.en)) || "";

  // 1) 分类按钮
  Object.keys(CATS).forEach((id) => {
    const c = CATS[id];
    const b = document.createElement("button");
    b.type = "button";
    b.className = "cat-pick-btn";
    b.dataset.cat = id;
    b.textContent = (c.emoji || "") + " " + L(c.label);
    b.addEventListener("click", () => {
      currentCat = id;
      catPick.querySelectorAll(".cat-pick-btn").forEach((x) => {
        x.classList.toggle("is-active", x === b);
        x.setAttribute("aria-pressed", String(x === b));
      });
      fillStories();
      show(2);
      steps[2].scrollIntoView({ behavior: "smooth", block: "nearest" });
    });
    catPick.appendChild(b);
  });

  // 2) 故事
  function fillStories() {
    const c = CATS[currentCat];
    storyPick.innerHTML = "";
    (c.prompts || []).forEach((p) => {
      const opt = document.createElement("option");
      opt.value = L(p);
      opt.textContent = L(p);
      storyPick.appendChild(opt);
    });
    const own = document.createElement("option");
    own.value = "__own__";
    own.textContent = STR.own;
    storyPick.appendChild(own);
    storyEl.value = storyPick.value;
    if (countEl) countEl.textContent = storyEl.value.length;
    if (storyEl.value.trim()) show(3);
  }

  storyPick.addEventListener("change", () => {
    if (storyPick.value !== "__own__") {
      storyEl.value = storyPick.value;
    } else {
      storyEl.value = "";
      storyEl.focus();
    }
    if (countEl) countEl.textContent = storyEl.value.length;
    if (storyEl.value.trim()) show(3);
  });

  storyEl.addEventListener("input", () => {
    if (countEl) countEl.textContent = storyEl.value.length;
    const promptValues = [...storyPick.options].filter((o) => o.value !== "__own__").map((o) => o.value);
    if (!promptValues.includes(storyEl.value) && storyEl.value) {
      storyPick.value = "__own__";
    }
    if (storyEl.value.trim()) show(3);
  });

  // 3) 照片
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.hidden = false;
      show(4);
      steps[4].scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
    reader.readAsDataURL(file);
  });

  const fieldsOk = () => currentCat && storyEl.value.trim() && whoEl.value.trim();

  const values = () => ({
    cat: L(CATS[currentCat].label),
    story: storyEl.value.trim(),
    where: whereEl.value.trim() || "—",
    when: whenEl.value || "—",
    who: whoEl.value.trim(),
  });

  function buildLinks() {
    const v = values();
    return {
      gh: REPO + "/issues/new?title=" + encodeURIComponent(T("ghTitle", v)) + "&body=" + encodeURIComponent(T("ghBody", v)),
      mail: "mailto:" + MAIL + "?subject=" + encodeURIComponent(T("mailSubject", v)) +
            "&body=" + encodeURIComponent(T("mailBody", v)),
    };
  }

  function refreshMail() {
    if (fieldsOk()) {
      mailLink.href = buildLinks().mail;
    } else {
      mailLink.href = "#";
    }
  }

  [whereEl, whenEl, whoEl, storyEl].forEach((el) => el.addEventListener("input", refreshMail));

  ghBtn.addEventListener("click", () => {
    if (!fieldsOk()) {
      if (status) status.textContent = STR.need;
      return;
    }
    if (status) status.textContent = "";
    window.open(buildLinks().gh, "_blank", "noopener");
  });

  mailLink.addEventListener("click", (e) => {
    if (!fieldsOk()) {
      e.preventDefault();
      if (status) status.textContent = STR.need;
    }
  });
})();
