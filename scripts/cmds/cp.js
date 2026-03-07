const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "30.0",
    author: "Fixed by ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Live Stylish Bangla Caption",
    longDescription: "Fetches 1 stylish Bangla caption directly from biocaption.com",
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
        timeout: 15000
      });

      const $ = cheerio.load(response.data);
      let captions = [];

      // Live captions grab
      $("div.entry-content").find("p, li, span").each((i, el) => {
        const text = $(el).text().trim();
        if (text && text.length > 20 && !text.includes("http") && !text.includes("Facebook")) {
          captions.push(text);
        }
      });

      // যদি কোনো caption না পাওয়া যায়, fallback
      if (captions.length === 0) {
        return api.sendMessage(
          "🌸 আজকের স্টাইলিশ ক্যাপশন আনতে পারিনি, পরে আবার চেষ্টা করো 🌸",
          event.threadID
        );
      }

      // Randomly pick 1 caption
      const caption = captions[Math.floor(Math.random() * captions.length)];

      // Random emojis
      const reacts = [
        "🌸","🌺","🌷","🌹","🌻","🌼","💐","🪷",
        "🌿","🍃","🌱","🌳","🌾",
        "🕊️","🐦","🐤","🐥","🦜","🦢",
        "✨","⭐","🌟","🤍","💗","☮️","🌙","🌈"
      ];
      const randomReacts = reacts.sort(() => 0.5 - Math.random()).slice(0, 8);

      // Stylish message same আগের মতো
      const msg = `╔═════════════════╗
       🌸 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 🌸
╚═════════════════╝

${caption}

╔══════════════════╗
🕊️ Admin : Mehedi Hasan
╚══════════════════╝

🌸 /cp আবার try করো!`;

      // Send message with reactions
      api.sendMessage(msg, event.threadID, async (err, info) => {
        if (!err && info) {
          for (const r of randomReacts) {
            try { await api.setMessageReaction(r, info.messageID, () => {}, true); } catch {}
          }
        }
      });

    } catch (err) {
      console.error("CP Scrape Error:", err.message);
      api.sendMessage(
        "🌸 আজকের স্টাইলিশ ক্যাপশন আনতে পারিনি, পরে আবার চেষ্টা করো 🌸",
        event.threadID
      );
    }
  }
};
