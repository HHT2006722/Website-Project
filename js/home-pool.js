// 首页装饰图池：每次刷新，每类随机抽一张。
// Home image pool: on every load each category picks one image at random.
(function () {
  const POOL = {
    humanities: ["img/pool-humanities-1.jpg", "img/pool-humanities-2.jpg", "img/pool-humanities-3.jpg", "img/pool-humanities-4.jpg", "img/pool-humanities-5.jpg", "img/pool-humanities-6.jpg", "img/pool-humanities-7.jpg", "img/pool-humanities-8.jpg", "img/pool-humanities-9.jpg", "img/pool-humanities-10.jpg", "img/pool-humanities-11.jpg", "img/pool-humanities-12.jpg", "img/pool-humanities-13.jpg", "img/pool-humanities-14.jpg", "img/pool-humanities-15.jpg", "img/pool-humanities-16.jpg", "img/pool-humanities-17.jpg", "img/pool-humanities-18.jpg", "img/pool-humanities-19.jpg", "img/pool-humanities-20.jpg", "img/pool-humanities-21.jpg", "img/pool-humanities-22.jpg", "img/pool-humanities-23.jpg", "img/pool-humanities-24.jpg", "img/pool-humanities-25.jpg", "img/pool-humanities-26.jpg", "img/pool-humanities-27.jpg", "img/pool-humanities-28.jpg", "img/pool-humanities-29.jpg", "img/pool-humanities-30.jpg", "img/pool-humanities-31.jpg", "img/pool-humanities-32.jpg", "img/pool-humanities-33.jpg", "img/pool-humanities-34.jpg", "img/pool-humanities-35.jpg", "img/pool-humanities-36.jpg", "img/pool-humanities-37.jpg", "img/pool-humanities-38.jpg", "img/pool-humanities-39.jpg", "img/pool-humanities-40.jpg", "img/pool-humanities-41.jpg", "img/pool-humanities-42.jpg", "img/pool-humanities-43.jpg", "img/pool-humanities-44.jpg", "img/pool-humanities-45.jpg", "img/pool-humanities-46.jpg", "img/pool-humanities-47.jpg", "img/pool-humanities-48.jpg", "img/pool-humanities-49.jpg", "img/pool-humanities-50.jpg", "img/pool-humanities-51.jpg", "img/pool-humanities-52.jpg", "img/pool-humanities-53.jpg", "img/pool-humanities-54.jpg", "img/pool-humanities-55.jpg", "img/pool-humanities-56.jpg", "img/pool-humanities-57.jpg", "img/pool-humanities-58.jpg", "img/pool-humanities-59.jpg", "img/pool-humanities-60.jpg", "img/pool-humanities-61.jpg", "img/pool-humanities-62.jpg"],
    food: ["img/pool-food-1.jpg", "img/pool-food-2.jpg", "img/pool-food-3.jpg", "img/pool-food-4.jpg", "img/pool-food-5.jpg", "img/pool-food-6.jpg", "img/pool-food-7.jpg", "img/pool-food-8.jpg", "img/pool-food-9.jpg", "img/pool-food-10.jpg", "img/pool-food-11.jpg", "img/pool-food-12.jpg", "img/pool-food-13.jpg", "img/pool-food-14.jpg", "img/pool-food-15.jpg", "img/pool-food-16.jpg", "img/pool-food-17.jpg", "img/pool-food-18.jpg", "img/pool-food-19.jpg", "img/pool-food-20.jpg", "img/pool-food-21.jpg", "img/pool-food-22.jpg", "img/pool-food-23.jpg"],
    animals: ["img/work-01-768.webp", "img/work-02-768.webp", "img/work-03-768.webp", "img/work-04-768.webp", "img/work-05-768.webp", "img/work-06-768.webp", "img/pool-animals-1.jpg", "img/pool-animals-2.jpg", "img/pool-animals-3.jpg", "img/pool-animals-4.jpg", "img/pool-animals-5.jpg", "img/pool-animals-6.jpg", "img/pool-animals-7.jpg", "img/pool-animals-8.jpg", "img/pool-animals-9.jpg", "img/pool-animals-10.jpg", "img/pool-animals-11.jpg", "img/pool-animals-12.jpg", "img/pool-animals-13.jpg", "img/pool-animals-14.jpg", "img/pool-animals-15.jpg", "img/pool-animals-16.jpg", "img/pool-animals-17.jpg", "img/pool-animals-18.jpg"],
    landscape: ["img/pool-landscape-1.jpg", "img/pool-landscape-2.jpg", "img/pool-landscape-3.jpg", "img/pool-landscape-4.jpg", "img/pool-landscape-5.jpg", "img/pool-landscape-6.jpg", "img/pool-landscape-7.jpg", "img/pool-landscape-8.jpg", "img/pool-landscape-9.jpg", "img/pool-landscape-10.jpg", "img/pool-landscape-11.jpg", "img/pool-landscape-12.jpg", "img/pool-landscape-13.jpg", "img/pool-landscape-14.jpg", "img/pool-landscape-15.jpg", "img/pool-landscape-16.jpg", "img/pool-landscape-17.jpg", "img/pool-landscape-18.jpg", "img/pool-landscape-19.jpg", "img/pool-landscape-20.jpg", "img/pool-landscape-21.jpg", "img/pool-landscape-22.jpg", "img/pool-landscape-23.jpg", "img/pool-landscape-24.jpg"],
    painting: ["img/painting-01.jpg", "img/painting-02.jpg", "img/painting-03.jpg", "img/painting-04.jpg", "img/painting-05.jpg", "img/painting-06.jpg", "img/painting-07.jpg", "img/painting-08.jpg", "img/painting-09.jpg", "img/painting-10.jpg", "img/painting-11.jpg", "img/painting-12.jpg", "img/painting-13.jpg", "img/painting-14.jpg", "img/painting-15.jpg", "img/painting-16.jpg"]
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
