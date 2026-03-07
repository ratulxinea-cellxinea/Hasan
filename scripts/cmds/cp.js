const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "19.0",
    author: "Nazim Ultra Direct Fix",
    countDown: 5,
    role: 0,
    shortDescription: "Bangla Caption",
    longDescription: "Fetch direct Bangla caption from site with react",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      // User-Agent দিয়ে fetch
      const url = "https://biocaption.com/সেরা-ফেসবুক-ক্যাপশন/";
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
        }
      });

      const $ = cheerio.load(res.data);

      let captions = [];
      // শুধুমাত্র site এর মূল content থেকে paragraph নাও
      $("div.entry-content p").each((i, el) => {
        const text = $(el).text().trim();
        if (text.length > 25 && text.length < 200 && !text.includes("http") && !text.includes("Facebook")) {
          captions.push(text);
        }
      });

      if (!captions.length) {
        return api.sendMessage("⚠️ Caption fetch করা যায়নি! পরে চেষ্টা করো /cp", event.threadID);
      }

      const caption = captions[Math.floor(Math.random() * captions.length)];

      const reacts = [
        "🌸","🌺","🌷","🌹","🌻","🌼","💐","🪷",
        "🌿","🍃","🌱","🌳","🌾",
        "🕊️","🐦","🐤","🐥","🦜","🦢",
        "✨","⭐","🌟","🤍","💗","☮️","🌙","🌈"
      ];

      const randomReacts = reacts.sort(() => 0.5 - Math.random()).slice(0, 10);

      const msg = `╔═════════════════╗
       🌸 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 🌸
╚═════════════════╝

${caption}

╔══════════════════╗
🕊️ Admin : Mehedi Hasan
╚══════════════════╝

🌸 /cp 𝙩𝙮𝙥𝙚 𝙖𝙜𝙖𝙞𝙣`;

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
      console.log("CP Error:", err);
      api.sendMessage("⚠️ Caption আনতে সমস্যা হয়েছে! পরে আবার /cp দাও", event.threadID);
    }
  }
};
