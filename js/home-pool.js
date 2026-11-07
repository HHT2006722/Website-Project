// 首页装饰图池：每次刷新，每类随机抽一张。
// Home image pool: on every load each category picks one image at random.
(function () {
  const POOL = {
    humanities: ["img/cat-humanities-1.jpg", "img/cat-humanities-2.jpg", "img/cat-humanities-3.jpg", "img/pool-humanities-1.jpg", "img/pool-humanities-12.jpg", "img/pool-humanities-13.jpg", "img/pool-humanities-15.jpg", "img/pool-humanities-2.jpg", "img/pool-humanities-3.jpg", "img/pool-humanities-32.jpg", "img/pool-humanities-35.jpg", "img/pool-humanities-37.jpg", "img/pool-humanities-39.jpg", "img/pool-humanities-4.jpg", "img/pool-humanities-40.jpg", "img/pool-humanities-41.jpg", "img/pool-humanities-42.jpg", "img/pool-humanities-43.jpg", "img/pool-humanities-44.jpg", "img/pool-humanities-45.jpg", "img/pool-humanities-46.jpg", "img/pool-humanities-47.jpg", "img/pool-humanities-48.jpg", "img/pool-humanities-49.jpg", "img/pool-humanities-5.jpg", "img/pool-humanities-50.jpg", "img/pool-humanities-51.jpg", "img/pool-humanities-7.jpg"],
    food: ["img/cat-food-1.jpg", "img/cat-food-2.jpg", "img/cat-food-3.jpg", "img/cat-food-dish.jpg", "img/pool-food-12.jpg", "img/pool-food-15.jpg", "img/pool-food-16.jpg", "img/pool-food-2.jpg", "img/pool-food-24.jpg", "img/pool-food-25.jpg", "img/pool-food-27.jpg", "img/pool-food-3.jpg", "img/pool-food-30.jpg", "img/pool-food-37.jpg", "img/pool-food-38.jpg", "img/pool-food-39.jpg", "img/pool-food-4.jpg", "img/pool-food-40.jpg", "img/pool-food-41.jpg", "img/pool-food-42.jpg", "img/pool-food-43.jpg", "img/pool-food-44.jpg", "img/pool-food-45.jpg", "img/pool-food-46.jpg", "img/pool-food-47.jpg", "img/pool-food-48.jpg", "img/pool-food-49.jpg", "img/pool-food-50.jpg", "img/pool-food-7.jpg"],
    animals: ["img/work-01-768.webp", "img/work-02-768.webp", "img/work-03-768.webp", "img/work-04-768.webp", "img/work-05-768.webp", "img/work-06-768.webp", "img/pool-animals-1.jpg", "img/pool-animals-10.jpg", "img/pool-animals-11.jpg", "img/pool-animals-12.jpg", "img/pool-animals-13.jpg", "img/pool-animals-15.jpg", "img/pool-animals-16.jpg", "img/pool-animals-17.jpg", "img/pool-animals-18.jpg", "img/pool-animals-19.jpg", "img/pool-animals-2.jpg", "img/pool-animals-20.jpg", "img/pool-animals-21.jpg", "img/pool-animals-22.jpg", "img/pool-animals-23.jpg", "img/pool-animals-24.jpg", "img/pool-animals-25.jpg", "img/pool-animals-26.jpg", "img/pool-animals-27.jpg", "img/pool-animals-28.jpg", "img/pool-animals-29.jpg", "img/pool-animals-30.jpg", "img/pool-animals-4.jpg", "img/pool-animals-5.jpg", "img/pool-animals-6.jpg", "img/pool-animals-7.jpg", "img/pool-animals-8.jpg", "img/pool-animals-9.jpg"],
    landscape: ["img/cat-landscape-1.jpg", "img/cat-landscape-2.jpg", "img/cat-landscape-3.jpg", "img/pool-landscape-1.jpg", "img/pool-landscape-10.jpg", "img/pool-landscape-11.jpg", "img/pool-landscape-13.jpg", "img/pool-landscape-14.jpg", "img/pool-landscape-15.jpg", "img/pool-landscape-16.jpg", "img/pool-landscape-17.jpg", "img/pool-landscape-18.jpg", "img/pool-landscape-2.jpg", "img/pool-landscape-24.jpg", "img/pool-landscape-25.jpg", "img/pool-landscape-26.jpg", "img/pool-landscape-27.jpg", "img/pool-landscape-28.jpg", "img/pool-landscape-29.jpg", "img/pool-landscape-3.jpg", "img/pool-landscape-30.jpg", "img/pool-landscape-31.jpg", "img/pool-landscape-32.jpg", "img/pool-landscape-4.jpg", "img/pool-landscape-5.jpg", "img/pool-landscape-6.jpg", "img/pool-landscape-7.jpg", "img/pool-landscape-9.jpg"]
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
