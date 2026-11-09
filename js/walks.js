// 主题漫游：每条线 5 张照片，按顺序走完一个主题。
// Themed walks: five photos per walk, one theme at a time.
const WALKS = {
  news: {
    title: { en: "People the world reported on", zh: "上过新闻的人", de: "Menschen in den Schlagzeilen" },
    lead: { en: "Five photos of people whose faces ended up on front pages.", zh: "五张照片，五个曾经登上头版的人。", de: "Fünf Fotos von Menschen, deren Gesichter auf Titelseiten landeten." },
    srcs: ["img/cat-humanities-1.jpg", "img/cat-humanities-2.jpg", "img/cat-humanities-3.jpg", "img/pool-humanities-50.jpg", "img/pool-humanities-49.jpg"]
  },
  water: {
    title: { en: "Quiet next to water", zh: "水边的安静", de: "Stille am Wasser" },
    lead: { en: "Five lakes and coasts where the noise stops.", zh: "五个能让人安静下来的湖与海岸。", de: "Fünf Seen und Küsten, an denen der Lärm aufhört." },
    srcs: ["img/cat-landscape-1.jpg", "img/cat-landscape-2.jpg", "img/cat-landscape-3.jpg", "img/pool-landscape-1.jpg", "img/pool-landscape-24.jpg"]
  },
  meal: {
    title: { en: "What a meal looks like", zh: "一餐的样子", de: "Wie eine Mahlzeit aussieht" },
    lead: { en: "Five plates, from pasta to cardamom buns.", zh: "五只盘子，从意面到豆蔻面包。", de: "Fünf Teller, von Pasta bis Kardamom-Brötchen." },
    srcs: ["img/cat-food-1.jpg", "img/cat-food-2.jpg", "img/cat-food-3.jpg", "img/pool-food-37.jpg", "img/pool-food-39.jpg"]
  },
};
