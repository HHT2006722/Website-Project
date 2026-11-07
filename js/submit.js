// 投稿页逻辑：预览、字数、生成 GitHub Issue 与邮件链接。
// Submit page logic: preview, counter, build the GitHub issue and mail links.
(function () {
  const docLang = (document.documentElement.lang || "en").toLowerCase();
  const lang = docLang.startsWith("zh") ? "zh" : docLang.startsWith("de") ? "de" : "en";

  const STR = {
    en: {
      need: "Fill the place, photographer and story first — then press the button again.",
      ghTitle: "Photo submission: {where}",
      ghBody: "**Photo submission**\n\nWhere: {where}\nWhen: {when}\nPhotographer: {who}\n\nStory:\n{story}\n\n(Attach the photo by dragging it into this box.)",
      mailSubject: "Photo submission: {where}",
      mailBody: "Where: {where}\nWhen: {when}\nPhotographer: {who}\n\nStory:\n{story}\n\n(Photo attached to this email.)",
    },
    zh: {
      need: "请先填好地点、拍摄者和故事，再点一次按钮。",
      ghTitle: "照片投稿：{where}",
      ghBody: "**照片投稿**\n\n地点：{where}\n时间：{when}\n拍摄者：{who}\n\n故事：\n{story}\n\n（把照片拖进这个输入框即可附上。）",
      mailSubject: "照片投稿：{where}",
      mailBody: "地点：{where}\n时间：{when}\n拍摄者：{who}\n\n故事：\n{story}\n\n（照片作为附件随邮件发出。）",
    },
    de: {
      need: "Bitte zuerst Ort, Fotograf/in und Geschichte ausfüllen — dann noch einmal klicken.",
      ghTitle: "Foto-Einreichung: {where}",
      ghBody: "**Foto-Einreichung**\n\nOrt: {where}\nWann: {when}\nFotograf/in: {who}\n\nGeschichte:\n{story}\n\n(Foto per Ziehen in dieses Feld anhängen.)",
      mailSubject: "Foto-Einreichung: {where}",
      mailBody: "Ort: {where}\nWann: {when}\nFotograf/in: {who}\n\nGeschichte:\n{story}\n\n(Foto hängt an dieser E-Mail.)",
    },
  }[lang];

  const T = (key, values) => STR[key].replace(/\{(\w+)\}/g, (_, k) => (values || {})[k] || "");

  const form = document.querySelector("#submitForm");
  const photoInput = document.querySelector("#photo");
  const preview = document.querySelector("#photoPreview");
  const whereEl = document.querySelector("#where");
  const whenEl = document.querySelector("#when");
  const whoEl = document.querySelector("#who");
  const storyEl = document.querySelector("#story");
  const countEl = document.querySelector("#storyCount");
  const ghBtn = document.querySelector("#ghBtn");
  const mailLink = document.querySelector("#mailLink");
  const status = document.querySelector("#submitStatus");
  if (!form) return;

  const REPO = "https://github.com/HHT2006722/Website-Project";
  const MAIL = "zjy1972422hht@163.com";

  // 预览：只读进浏览器，不上传任何东西
  // Preview: read locally only — nothing is uploaded
  photoInput.addEventListener("change", () => {
    const file = photoInput.files && photoInput.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      preview.src = reader.result;
      preview.hidden = false;
    };
    reader.readAsDataURL(file);
  });

  storyEl.addEventListener("input", () => {
    if (countEl) countEl.textContent = storyEl.value.length;
  });

  const values = () => ({
    where: whereEl.value.trim(),
    when: whenEl.value || "—",
    who: whoEl.value.trim(),
    story: storyEl.value.trim(),
  });

  const fieldsOk = () => whereEl.value.trim() && whoEl.value.trim() && storyEl.value.trim();

  function buildLinks() {
    const v = values();
    const title = T("ghTitle", v);
    const body = T("ghBody", v);
    return {
      gh: REPO + "/issues/new?title=" + encodeURIComponent(title) + "&body=" + encodeURIComponent(body),
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
      if (status) status.textContent = T("need");
      return;
    }
    if (status) status.textContent = "";
    window.open(buildLinks().gh, "_blank", "noopener");
  });

  mailLink.addEventListener("click", (e) => {
    if (!fieldsOk()) {
      e.preventDefault();
      if (status) status.textContent = T("need");
    }
  });
})();
