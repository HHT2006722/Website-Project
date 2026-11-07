// 首页装饰图池：每次刷新，每类随机抽一张。
// Home image pool: on every load each category picks one image at random.
(function () {
  const POOL = {
    humanities: ["img/cat-humanities-1.jpg", "img/cat-humanities-2.jpg", "img/cat-humanities-3.jpg", "img/pool-humanities-1.jpg", "img/pool-humanities-10.jpg", "img/pool-humanities-11.jpg", "img/pool-humanities-12.jpg", "img/pool-humanities-13.jpg", "img/pool-humanities-14.jpg", "img/pool-humanities-15.jpg", "img/pool-humanities-16.jpg", "img/pool-humanities-17.jpg", "img/pool-humanities-18.jpg", "img/pool-humanities-19.jpg", "img/pool-humanities-2.jpg", "img/pool-humanities-20.jpg", "img/pool-humanities-21.jpg", "img/pool-humanities-22.jpg", "img/pool-humanities-23.jpg", "img/pool-humanities-24.jpg", "img/pool-humanities-25.jpg", "img/pool-humanities-26.jpg", "img/pool-humanities-27.jpg", "img/pool-humanities-3.jpg", "img/pool-humanities-4.jpg", "img/pool-humanities-5.jpg", "img/pool-humanities-6.jpg", "img/pool-humanities-7.jpg", "img/pool-humanities-8.jpg", "img/pool-humanities-9.jpg"],
    food: ["img/cat-food-1.jpg", "img/cat-food-2.jpg", "img/cat-food-3.jpg", "img/cat-food-dish.jpg", "img/pool-food-1.jpg", "img/pool-food-10.jpg", "img/pool-food-11.jpg", "img/pool-food-12.jpg", "img/pool-food-13.jpg", "img/pool-food-14.jpg", "img/pool-food-15.jpg", "img/pool-food-16.jpg", "img/pool-food-17.jpg", "img/pool-food-18.jpg", "img/pool-food-19.jpg", "img/pool-food-2.jpg", "img/pool-food-20.jpg", "img/pool-food-21.jpg", "img/pool-food-22.jpg", "img/pool-food-23.jpg", "img/pool-food-24.jpg", "img/pool-food-25.jpg", "img/pool-food-26.jpg", "img/pool-food-3.jpg", "img/pool-food-4.jpg", "img/pool-food-5.jpg", "img/pool-food-6.jpg", "img/pool-food-7.jpg", "img/pool-food-8.jpg", "img/pool-food-9.jpg"],
    animals: ["img/work-01-768.webp", "img/work-02-768.webp", "img/work-03-768.webp", "img/work-04-768.webp", "img/work-05-768.webp", "img/work-06-768.webp", "img/pool-animals-1.jpg", "img/pool-animals-10.jpg", "img/pool-animals-11.jpg", "img/pool-animals-12.jpg", "img/pool-animals-13.jpg", "img/pool-animals-14.jpg", "img/pool-animals-15.jpg", "img/pool-animals-16.jpg", "img/pool-animals-17.jpg", "img/pool-animals-18.jpg", "img/pool-animals-19.jpg", "img/pool-animals-2.jpg", "img/pool-animals-20.jpg", "img/pool-animals-21.jpg", "img/pool-animals-22.jpg", "img/pool-animals-23.jpg", "img/pool-animals-24.jpg", "img/pool-animals-25.jpg", "img/pool-animals-26.jpg", "img/pool-animals-27.jpg", "img/pool-animals-28.jpg", "img/pool-animals-29.jpg", "img/pool-animals-3.jpg", "img/pool-animals-30.jpg", "img/pool-animals-4.jpg", "img/pool-animals-5.jpg", "img/pool-animals-6.jpg", "img/pool-animals-7.jpg", "img/pool-animals-8.jpg", "img/pool-animals-9.jpg"],
    landscape: ["img/cat-landscape-1.jpg", "img/cat-landscape-2.jpg", "img/cat-landscape-3.jpg", "img/pool-landscape-1.jpg", "img/pool-landscape-10.jpg", "img/pool-landscape-11.jpg", "img/pool-landscape-12.jpg", "img/pool-landscape-13.jpg", "img/pool-landscape-14.jpg", "img/pool-landscape-15.jpg", "img/pool-landscape-16.jpg", "img/pool-landscape-17.jpg", "img/pool-landscape-18.jpg", "img/pool-landscape-19.jpg", "img/pool-landscape-2.jpg", "img/pool-landscape-20.jpg", "img/pool-landscape-21.jpg", "img/pool-landscape-22.jpg", "img/pool-landscape-23.jpg", "img/pool-landscape-24.jpg", "img/pool-landscape-25.jpg", "img/pool-landscape-26.jpg", "img/pool-landscape-27.jpg", "img/pool-landscape-3.jpg", "img/pool-landscape-4.jpg", "img/pool-landscape-5.jpg", "img/pool-landscape-6.jpg", "img/pool-landscape-7.jpg", "img/pool-landscape-8.jpg", "img/pool-landscape-9.jpg"]
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
