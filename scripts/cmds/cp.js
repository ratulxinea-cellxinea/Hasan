const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "7.0",
    author: "Nazim + Ultra Fix",
    countDown: 5,
    role: 0,
    shortDescription: "Stylish Bangla Caption",
    longDescription: "Get stylish bangla caption with flower & peace reactions",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {

      const url = "https://biocaption.com/%E0%A6%B8%E0%A7%87%E0%A6%B0%E0%A6%BE-%E0%A6%AB%E0%A7%87%E0%A6%B8%E0%A6%AC%E0%A7%81%E0%A6%95-%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AA%E0%A6%B6%E0%A6%A8/";
      const res = await axios.get(url);

      const $ = cheerio.load(res.data);
      let captions = [];

      $("p").each((i, el) => {
        const text = $(el).text().trim();

        if (
          text.length > 25 &&
          text.length < 200 &&
          !text.includes("http") &&
          !text.includes("Facebook")
        ) {
          captions.push(text);
        }
      });

      if (!captions.length) {
        return api.sendMessage("🌸 সুন্দর Caption পাওয়া যায়নি! পরে আবার চেষ্টা করো 🕊️", event.threadID);
      }

      const randomCaption =
        captions[Math.floor(Math.random() * captions.length)];

      const emojis = [
        "🌸","🌺","🌷","🌹","🥀","🌻","🌼","💐","🪷","🌿",
        "🍃","🌾","🌱","🌳","🕊️","☮️","✌️","✨","💮","🏵️",
        "🪻","🌙","🌤️","🌈","🌊","💗","🤍","💞","💓","🌟"
      ];

      const randomReacts = emojis
        .sort(() => 0.5 - Math.random())
        .slice(0, 15);

      const msg = `╭━━━〔 🌸 𝐒𝐓𝐘𝐋𝐈𝐒𝐇 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 🌸 〕━━━╮

   ${randomCaption}

╰━━━〔 🕊️ 𝐁𝐈𝐎 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 🕊️ 〕━━━╯

🌸 𝐀𝐝𝐦𝐢𝐧 : 𝐌𝐞𝐡𝐞𝐝𝐢 𝐇𝐚𝐬𝐚𝐧  
✦ /cp 𝙩𝙮𝙥𝙚 𝙖𝙜𝙖𝙞𝙣`;

      const sent = await api.sendMessage(msg, event.threadID);

      for (const emoji of randomReacts) {
        try {
          await api.setMessageReaction(
            emoji,
            sent.messageID,
            () => {},
            true
          );
        } catch {}
      }

    } catch (err) {
      console.log(err);
      api.sendMessage("⚠️ Caption আনতে সমস্যা হয়েছে! আবার চেষ্টা করো /cp", event.threadID);
    }
  }
};
