const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "22.0",
    author: "Fix By ChatGPT",
    countDown: 5,
    role: 0,
    shortDescription: "Bangla Caption (Live from BioCaption)",
    longDescription: "Fetch stylish Bangla captions directly from biocaption.com",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      const url =
        "https://biocaption.com/সেরা-ফেসবুক-ক্যাপশন/"; // This is the main page
      
      const response = await axios.get(url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36"
        }
      });

      const $ = cheerio.load(response.data);

      let captions = [];

      // Site এ মূল caption Paragraph আসবে এই selector দিয়ে
      $("div.entry-content p").each((i, el) => {
        let text = $(el).text().trim();
        if (
          text &&
          text.length > 20 &&
          !text.includes("http") &&
          !text.includes("Facebook")
        ) {
          captions.push(text);
        }
      });

      if (!captions.length) {
        return api.sendMessage(
          "⚠️ Caption fetch করা যায়নি! /cp আবার try করো।",
          event.threadID
        );
      }

      const caption = captions[Math.floor(Math.random() * captions.length)];

      const reacts = [
        "🌸","🌺","🌷","🌹","🌻","🌼","💐","🪷",
        "🌿","🍃","🌱","🌳","🌾",
        "🕊️","🐦","🐤","🐥","🦜","🦢",
        "✨","⭐","🌟","🤍","💗","☮️","🌙","🌈"
      ];

      const randomReacts = reacts
        .sort(() => 0.5 - Math.random())
        .slice(0, 10);

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
      api.sendMessage(
        "⚠️ Caption আনতে সমস্যা হয়েছে! পরে আবার /cp দাও।",
        event.threadID
      );
    }
  }
};
