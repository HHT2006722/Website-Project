// 首页装饰图池：每次刷新，每类随机抽一张。
// Home image pool: on every load each category picks one image at random.
(function () {
  const POOL = {
    humanities: ["img/cat-humanities-1.jpg", "img/cat-humanities-2.jpg", "img/cat-humanities-3.jpg", "img/pool-humanities-1.jpg", "img/pool-humanities-100.jpg", "img/pool-humanities-101.jpg", "img/pool-humanities-102.jpg", "img/pool-humanities-103.jpg", "img/pool-humanities-105.jpg", "img/pool-humanities-107.jpg", "img/pool-humanities-108.jpg", "img/pool-humanities-109.jpg", "img/pool-humanities-110.jpg", "img/pool-humanities-111.jpg", "img/pool-humanities-112.jpg", "img/pool-humanities-12.jpg", "img/pool-humanities-13.jpg", "img/pool-humanities-15.jpg", "img/pool-humanities-2.jpg", "img/pool-humanities-3.jpg", "img/pool-humanities-32.jpg", "img/pool-humanities-35.jpg", "img/pool-humanities-37.jpg", "img/pool-humanities-39.jpg", "img/pool-humanities-4.jpg", "img/pool-humanities-41.jpg", "img/pool-humanities-42.jpg", "img/pool-humanities-44.jpg", "img/pool-humanities-45.jpg", "img/pool-humanities-46.jpg", "img/pool-humanities-47.jpg", "img/pool-humanities-5.jpg", "img/pool-humanities-50.jpg", "img/pool-humanities-51.jpg", "img/pool-humanities-52.jpg", "img/pool-humanities-53.jpg", "img/pool-humanities-54.jpg", "img/pool-humanities-55.jpg", "img/pool-humanities-56.jpg", "img/pool-humanities-59.jpg", "img/pool-humanities-60.jpg", "img/pool-humanities-61.jpg", "img/pool-humanities-62.jpg", "img/pool-humanities-63.jpg", "img/pool-humanities-65.jpg", "img/pool-humanities-68.jpg", "img/pool-humanities-69.jpg", "img/pool-humanities-70.jpg", "img/pool-humanities-71.jpg", "img/pool-humanities-72.jpg", "img/pool-humanities-73.jpg", "img/pool-humanities-74.jpg", "img/pool-humanities-76.jpg", "img/pool-humanities-78.jpg", "img/pool-humanities-79.jpg", "img/pool-humanities-80.jpg", "img/pool-humanities-82.jpg", "img/pool-humanities-83.jpg", "img/pool-humanities-84.jpg", "img/pool-humanities-87.jpg", "img/pool-humanities-88.jpg", "img/pool-humanities-89.jpg", "img/pool-humanities-91.jpg", "img/pool-humanities-92.jpg", "img/pool-humanities-93.jpg", "img/pool-humanities-95.jpg", "img/pool-humanities-96.jpg", "img/pool-humanities-98.jpg"],
    food: ["img/cat-food-1.jpg", "img/cat-food-2.jpg", "img/cat-food-3.jpg", "img/cat-food-dish.jpg", "img/pool-food-12.jpg", "img/pool-food-15.jpg", "img/pool-food-16.jpg", "img/pool-food-2.jpg", "img/pool-food-24.jpg", "img/pool-food-25.jpg", "img/pool-food-27.jpg", "img/pool-food-3.jpg", "img/pool-food-30.jpg", "img/pool-food-37.jpg", "img/pool-food-38.jpg", "img/pool-food-39.jpg", "img/pool-food-4.jpg", "img/pool-food-40.jpg", "img/pool-food-41.jpg", "img/pool-food-45.jpg", "img/pool-food-46.jpg", "img/pool-food-48.jpg", "img/pool-food-49.jpg", "img/pool-food-50.jpg", "img/pool-food-51.jpg", "img/pool-food-52.jpg", "img/pool-food-55.jpg"],
    animals: ["img/work-01-768.webp", "img/work-02-768.webp", "img/work-03-768.webp", "img/work-04-768.webp", "img/work-05-768.webp", "img/work-06-768.webp", "img/pool-animals-1.jpg", "img/pool-animals-10.jpg", "img/pool-animals-11.jpg", "img/pool-animals-12.jpg", "img/pool-animals-15.jpg", "img/pool-animals-16.jpg", "img/pool-animals-17.jpg", "img/pool-animals-18.jpg", "img/pool-animals-2.jpg", "img/pool-animals-26.jpg", "img/pool-animals-27.jpg", "img/pool-animals-28.jpg", "img/pool-animals-29.jpg", "img/pool-animals-30.jpg", "img/pool-animals-31.jpg", "img/pool-animals-32.jpg", "img/pool-animals-33.jpg", "img/pool-animals-34.jpg", "img/pool-animals-35.jpg", "img/pool-animals-36.jpg", "img/pool-animals-39.jpg", "img/pool-animals-40.jpg", "img/pool-animals-41.jpg", "img/pool-animals-42.jpg", "img/pool-animals-43.jpg"],
    landscape: ["img/cat-landscape-1.jpg", "img/cat-landscape-2.jpg", "img/cat-landscape-3.jpg", "img/pool-landscape-1.jpg", "img/pool-landscape-10.jpg", "img/pool-landscape-11.jpg", "img/pool-landscape-13.jpg", "img/pool-landscape-15.jpg", "img/pool-landscape-16.jpg", "img/pool-landscape-17.jpg", "img/pool-landscape-24.jpg", "img/pool-landscape-25.jpg", "img/pool-landscape-26.jpg", "img/pool-landscape-27.jpg", "img/pool-landscape-28.jpg", "img/pool-landscape-29.jpg", "img/pool-landscape-3.jpg", "img/pool-landscape-30.jpg", "img/pool-landscape-31.jpg", "img/pool-landscape-32.jpg", "img/pool-landscape-33.jpg", "img/pool-landscape-34.jpg", "img/pool-landscape-35.jpg", "img/pool-landscape-5.jpg", "img/pool-landscape-6.jpg", "img/pool-landscape-7.jpg", "img/pool-landscape-9.jpg"]
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
