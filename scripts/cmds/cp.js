const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "24.0",
    author: "Fixed by ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Stylish Bangla Captions Live",
    longDescription: "Fetches stylish Bangla captions directly from biocaption.com",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      const url = "https://biocaption.com/সেরা-ফেসবুক-ক্যাপশন/";

      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      let captions = [];

      // সমস্ত paragraphs থেকে caption filter
      $("div.entry-content p").each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20 && !text.includes("http") && !text.includes("Facebook")) {
          captions.push(text);
        }
      });

      // যদি captions পাওয়া না যায়
      if (!captions.length) {
        captions.push("🌸 আজকের স্টাইলিশ ক্যাপশন আনতে পারিনি, পরে আবার চেষ্টা করো 🌸");
      }

      const caption = captions[Math.floor(Math.random() * captions.length)];

      // Random React emojis
      const reacts = [
        "🌸","🌺","🌷","🌹","🌻","🌼","💐","🪷",
        "🌿","🍃","🌱","🌳","🌾",
        "🕊️","🐦","🐤","🐥","🦜","🦢",
        "✨","⭐","🌟","🤍","💗","☮️","🌙","🌈"
      ];

      const randomReacts = reacts.sort(() => 0.5 - Math.random()).slice(0, 10);

      // Stylish message
      const msg = `╔═════════════════╗
       🌸 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 🌸
╚═════════════════╝

${caption}

╔══════════════════╗
🕊️ Admin : Mehedi Hasan
╚══════════════════╝

🌸 /cp আবার try করো!`;

      api.sendMessage(msg, event.threadID, async (err, info) => {
        if (!err && info) {
          for (const r of randomReacts) {
            try {
              await api.setMessageReaction(r, info.messageID, () => {}, true);
            } catch {}
          }
        }
      });

    } catch (err) {
      console.error("CP Scrape Error:", err.message);
      // এখানে আর কোনো ত্রুটি দেখানো হবে না, default caption পাঠাবে
      const fallback = "🌸 আজকের স্টাইলিশ ক্যাপশন আনতে পারিনি, পরে আবার চেষ্টা করো 🌸";
      api.sendMessage(fallback, event.threadID);
    }
  }
};
