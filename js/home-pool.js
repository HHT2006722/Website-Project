// 首页装饰图池：每次刷新，每类随机抽一张。
// Home image pool: on every load each category picks one image at random.
(function () {
  const POOL = {
    humanities: ["img/cat-humanities-1.jpg", "img/cat-humanities-2.jpg", "img/cat-humanities-3.jpg", "img/pool-humanities-1.jpg", "img/pool-humanities-2.jpg", "img/pool-humanities-3.jpg", "img/pool-humanities-4.jpg", "img/pool-humanities-5.jpg", "img/pool-humanities-6.jpg", "img/pool-humanities-7.jpg"],
    food: ["img/cat-food-1.jpg", "img/cat-food-2.jpg", "img/cat-food-3.jpg", "img/cat-food-dish.jpg", "img/pool-food-1.jpg", "img/pool-food-2.jpg", "img/pool-food-3.jpg", "img/pool-food-4.jpg", "img/pool-food-5.jpg", "img/pool-food-6.jpg", "img/pool-food-7.jpg"],
    animals: ["img/work-01-768.webp", "img/work-02-768.webp", "img/work-03-768.webp", "img/work-04-768.webp", "img/work-05-768.webp", "img/work-06-768.webp", "img/pool-animals-1.jpg", "img/pool-animals-2.jpg", "img/pool-animals-3.jpg", "img/pool-animals-4.jpg", "img/pool-animals-5.jpg", "img/pool-animals-6.jpg", "img/pool-animals-7.jpg"],
    landscape: ["img/cat-landscape-1.jpg", "img/cat-landscape-2.jpg", "img/cat-landscape-3.jpg", "img/pool-landscape-1.jpg", "img/pool-landscape-2.jpg", "img/pool-landscape-3.jpg", "img/pool-landscape-4.jpg", "img/pool-landscape-5.jpg", "img/pool-landscape-6.jpg", "img/pool-landscape-7.jpg"]
  };

  // zh/de 页面的资源在上一层
  // On the zh/de pages the assets live one level up
  const parts = location.pathname.split("/").filter(Boolean);
  const prefix = parts.includes("zh") || parts.includes("de") ? "../" : "";

  const pick = (cat) => {
    const pool = POOL[cat] || [];
    return prefix + pool[Math.floor(Math.random() * pool.length)];
  };

  document.querySelectorAll("[data-pool]").forEach((el) => {
    const src = pick(el.dataset.pool);
    if (!src) return;
    if (el.tagName === "IMG") el.src = src;
    else el.style.backgroundImage = 'url("' + src + '")';
  });
})();
