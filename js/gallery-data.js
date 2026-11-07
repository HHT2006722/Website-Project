// 四类照片的数据：每张只有一句话，另有出处和今日幸运含义。
// Gallery data: four categories; each photo has one line, a credit, and a lucky meaning.
const GALLERY = {
  categories: [
    {
      id: "humanities",
      emoji: "🏙️",
      label: { en: "Humanities", zh: "人文" },
      gate: { en: "People on streets and in markets", zh: "街头与市场里的人" },
      lucky: { en: "Lucky Moment of the Day", zh: "今日幸运人文" },
      photos: [
        {
          src: "img/cat-humanities-1.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "A cake stall at Penistone Market Barn", zh: "市集里的蛋糕摊" },
          line: { en: "A cake stall in a market: small trade gathers strangers around one table.",
                  zh: "市集里的一块蛋糕摊：小买卖把陌生人聚到同一张桌前。" },
          luckyLine: { en: "Today is good for sharing — treat someone to something.",
                       zh: "今天适合分享——请人吃点什么。" },
          credit: { en: "Photo: Cake stall in Penistone Market Barn · CC BY 2.0 · Wikimedia Commons",
                    zh: "图：Cake stall in Penistone Market Barn · CC BY 2.0 · Wikimedia Commons" }
        },
        {
          src: "img/cat-humanities-2.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "A boy selling vegetables in Maracaibo", zh: "卖菜的少年" },
          line: { en: "A boy selling vegetables: some childhoods start working early.",
                  zh: "卖菜的少年：有些童年比别的童年更早开始工作。" },
          luckyLine: { en: "Today, remember that what you have is not a given.",
                       zh: "今天提醒自己：你有的，并不理所当然。" },
          credit: { en: "Photo: Child selling vegetables, Maracaibo · CC0 · Wikimedia Commons",
                    zh: "图：Child selling vegetables, Maracaibo · CC0 · Wikimedia Commons" }
        },
        {
          src: "img/cat-humanities-3.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "People at Kenting night market", zh: "垦丁夜市的人群" },
          line: { en: "The crowd at Kenting's night market: busyness itself is a view.",
                  zh: "垦丁夜市的人群：热闹本身也是一种风景。" },
          luckyLine: { en: "Today, go where the people are — luck sits in the crowd.",
                       zh: "今天往人多的地方走，运气藏在人群里。" },
          credit: { en: "Photo: Kenting shopping street night market · CC BY 2.0 · Wikimedia Commons",
                    zh: "图：Kenting night market · CC BY 2.0 · Wikimedia Commons" }
        }
      ]
    },
    {
      id: "food",
      emoji: "🍜",
      label: { en: "Food", zh: "美食" },
      gate: { en: "Food that stops you in your tracks", zh: "让人走不动路的食物" },
      lucky: { en: "Lucky Food of the Day", zh: "今日幸运美食" },
      photos: [
        {
          src: "img/cat-food-1.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "A street food market in Bizerte", zh: "突尼斯街头的食物摊" },
          line: { en: "A street food market in Bizerte: taste comes before language.",
                  zh: "突尼斯街头的食物摊：味道先于语言。" },
          luckyLine: { en: "Today, eat one proper meal and enjoy it slowly.",
                       zh: "今天好好吃一顿，慢慢吃。" },
          credit: { en: "Photo: Open street food market in Bizerte · CC BY-SA 4.0 · Wikimedia Commons",
                    zh: "图：Open street food market in Bizerte · CC BY-SA 4.0 · Wikimedia Commons" }
        },
        {
          src: "img/cat-food-2.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "Food trucks at Reffen, Copenhagen", zh: "哥本哈根 Reffen 餐车集市" },
          line: { en: "Copenhagen's food truck market: a city putting its tastes on display.",
                  zh: "哥本哈根的餐车集市：一座城市把自己的味道摆出来。" },
          luckyLine: { en: "Today, try one thing you have never eaten before.",
                       zh: "今天尝一样从没吃过的东西。" },
          credit: { en: "Photo: Reffen Copenhagen Street Food Market · CC BY-SA 4.0 · Wikimedia Commons",
                    zh: "图：Reffen Copenhagen Street Food Market · CC BY-SA 4.0 · Wikimedia Commons" }
        },
        {
          src: "img/cat-food-3.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "Eating under the open sky at Reffen", zh: "天空下的露天座位" },
          line: { en: "Eating under the open sky: food pulls people close.",
                  zh: "在天空下吃饭：食物把天南地北的人拉近。" },
          luckyLine: { en: "Today, share a meal with someone.",
                       zh: "今天找个人一起吃饭。" },
          credit: { en: "Photo: Reffen Copenhagen Street Food Market (5) · CC BY-SA 4.0 · Wikimedia Commons",
                    zh: "图：Reffen Copenhagen Street Food Market (5) · CC BY-SA 4.0 · Wikimedia Commons" }
        }
      ]
    },
    {
      id: "animals",
      emoji: "🐾",
      label: { en: "Animals", zh: "动物" },
      gate: { en: "Animals photographed through glass", zh: "隔着玻璃拍下的动物" },
      lucky: { en: "Lucky Animal of the Day", zh: "今日幸运动物" },
      photos: [
        {
          src: "img/work-01-768.webp",
          srcset: "img/work-01-480.webp 480w, img/work-01-768.webp 768w, img/work-01-960.webp 960w, img/work-01-1600.webp 1600w",
          w: 1600, h: 900,
          alt: { en: "A green iguana on gravel, head turned to the lens", zh: "一只绿鬣蜥趴在碎石上" },
          line: { en: "Shot right against the glass — the closer, the softer the fingerprints.",
                  zh: "贴着玻璃拍的绿鬣蜥：贴得越近，指纹越虚。" },
          luckyLine: { en: "Today rewards patience: what you want will come on its own.",
                       zh: "今天适合等待：你想的东西会自己过来。" },
          credit: { en: "My photo · iPhone 13 Pro · 5 Apr 2024", zh: "我的照片 · iPhone 13 Pro · 2024.04.05" }
        },
        {
          src: "img/work-02-768.webp",
          srcset: "img/work-02-480.webp 480w, img/work-02-768.webp 768w, img/work-02-960.webp 960w, img/work-02-1600.webp 1600w",
          w: 1600, h: 900,
          alt: { en: "Two cockatiels on a branch before a wooden wall", zh: "木墙前的两只鹦鹉" },
          line: { en: "Side light draws the cracks in the wall; the two birds split front and back on their own.",
                  zh: "侧光勾出木墙的裂纹，两只鸟自己分出了前后。" },
          luckyLine: { en: "Today, say what is on your mind — someone will answer.",
                       zh: "今天把想说的话说出来，会有人回应。" },
          credit: { en: "My photo · iPhone 13 Pro · 5 Apr 2024", zh: "我的照片 · iPhone 13 Pro · 2024.04.05" }
        },
        {
          src: "img/work-03-768.webp",
          srcset: "img/work-03-480.webp 480w, img/work-03-768.webp 768w, img/work-03-960.webp 960w, img/work-03-1280.webp 1280w",
          w: 1280, h: 1707,
          alt: { en: "An otter resting on a clear tube, looking at the lens", zh: "趴在透明管子上的小水獭" },
          line: { en: "Droplets and reflections can't be cleaned, so they sit at the edges — the eye is the focus.",
                  zh: "水珠和反光赶不走，就推到画面边上，眼睛才是焦点。" },
          luckyLine: { en: "Today, make room to play — being serious can wait.",
                       zh: "今天留点时间玩，认真可以等一等。" },
          credit: { en: "My photo · iPhone 13 Pro · 5 Apr 2024", zh: "我的照片 · iPhone 13 Pro · 2024.04.05" }
        },
        {
          src: "img/work-04-768.webp",
          srcset: "img/work-04-480.webp 480w, img/work-04-768.webp 768w, img/work-04-960.webp 960w, img/work-04-1440.webp 1440w",
          w: 1440, h: 810,
          alt: { en: "A pale hedgehog foraging beside a pile of pellets", zh: "在饲料堆旁找吃的刺猬" },
          line: { en: "Top light too weak: pull the exposure down. Dark can be saved; blur cannot.",
                  zh: "顶光太弱，压暗曝光：宁可暗，别糊。" },
          luckyLine: { en: "Today, prepare first, then act.",
                       zh: "今天先准备好，再动手。" },
          credit: { en: "My photo · iPhone 13 Pro · 5 Apr 2024", zh: "我的照片 · iPhone 13 Pro · 2024.04.05" }
        },
        {
          src: "img/work-05-768.webp",
          srcset: "img/work-05-480.webp 480w, img/work-05-768.webp 768w, img/work-05-960.webp 960w, img/work-05-1440.webp 1440w",
          w: 1440, h: 810,
          alt: { en: "A pale animal crouched on a log in a shaft of light", zh: "一束光里的白色动物" },
          line: { en: "Waited fifteen minutes for the spot to cross its back — where the light is matters more than settings.",
                  zh: "等射灯扫到背上等了十几分钟：光的位置比参数重要。" },
          luckyLine: { en: "Today, a light will fall on you — stand where it can reach.",
                       zh: "今天会有一束光打在你身上，站到它够得着的地方。" },
          credit: { en: "My photo · iPhone 13 Pro · 5 Apr 2024", zh: "我的照片 · iPhone 13 Pro · 2024.04.05" }
        },
        {
          src: "img/work-06-768.webp",
          srcset: "img/work-06-480.webp 480w, img/work-06-768.webp 768w, img/work-06-960.webp 960w, img/work-06-1440.webp 1440w",
          w: 1440, h: 810,
          alt: { en: "Two pigs lying side by side in a hole in the wall", zh: "墙洞里并排的两只猪" },
          line: { en: "Two pigs side by side in the wall — the pink snouts are the only warm colour.",
                  zh: "墙洞里并排的两只猪，粉鼻子是全画面唯一的暖色。" },
          luckyLine: { en: "Today is for rest — enough is enough.",
                       zh: "今天适合休息，够了就是够了。" },
          credit: { en: "My photo · iPhone 13 Pro · 5 Apr 2024", zh: "我的照片 · iPhone 13 Pro · 2024.04.05" }
        }
      ]
    },
    {
      id: "landscape",
      emoji: "⛰️",
      label: { en: "Landscape", zh: "风景" },
      gate: { en: "Mountains and lakes", zh: "山川与湖泊" },
      lucky: { en: "Lucky Landscape of the Day", zh: "今日幸运风景" },
      photos: [
        {
          src: "img/cat-landscape-1.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "Lake Louise, Canada", zh: "加拿大的路易斯湖" },
          line: { en: "Lake Louise: the mountains hold the lake.",
                  zh: "路易斯湖：山把湖抱在怀里。" },
          luckyLine: { en: "Today, look farther than usual — the answer is further out.",
                       zh: "今天把目光放远一点，答案在更远处。" },
          credit: { en: "Photo: Lake Louise panorama 2019 · CC BY-SA 4.0 · Wikimedia Commons",
                    zh: "图：Lake Louise pano 2019 · CC BY-SA 4.0 · Wikimedia Commons" }
        },
        {
          src: "img/cat-landscape-2.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "Mountain lake Skazka in the Ergaki range", zh: "叶尔加基山脉的斯卡兹卡湖" },
          line: { en: "Siberia's rocks and lake: quiet enough to hear yourself.",
                  zh: "西伯利亚的石头和湖：安静到听得见自己。" },
          luckyLine: { en: "Today, keep a little silence for yourself.",
                       zh: "今天给自己留一点安静。" },
          credit: { en: "Photo: Ergaki, Mountain lake Skazka · CC BY 4.0 · Wikimedia Commons",
                    zh: "图：Ergaki, Mountain lake Skazka · CC BY 4.0 · Wikimedia Commons" }
        },
        {
          src: "img/cat-landscape-3.jpg", w: 1200, h: 800, srcset: "",
          alt: { en: "Jökulsárlón glacier lagoon, Iceland", zh: "冰岛的杰古沙龙冰湖" },
          line: { en: "Iceland's glacier lagoon: blue ice drifts to the sea.",
                  zh: "冰岛的冰湖：蓝色冰块漂向海。" },
          luckyLine: { en: "Today is good for planning the next journey.",
                       zh: "今天适合开始计划下一段路。" },
          credit: { en: "Photo: Jökulsárlón lake, Iceland · CC BY 2.0 · Wikimedia Commons",
                    zh: "图：Jökulsárlón lake, Iceland · CC BY 2.0 · Wikimedia Commons" }
        }
      ]
    }
  ]
};
