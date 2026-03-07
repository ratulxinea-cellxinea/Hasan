const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "18.0",
    author: "Nazim Ultra Direct Fix",
    countDown: 5,
    role: 0,
    shortDescription: "Bangla Caption",
    longDescription: "Fetch direct Bangla caption from site with react",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      // সরাসরি site থেকে fetch
      const url = "https://biocaption.com/%E0%A6%B8%E0%A7%87%E0%A6%B0%E0%A6%BE-%E0%A6%AB%E0%A7%87%E0%A6%B8%E0%A6%AC%E0%A7%81%E0%A6%95-%E0%A6%95%E0%A7%8D%E0%A6%AF%E0%A6%BE%E0%A6%AA%E0%A6%B6%E0%A6%A8/";
      const res = await axios.get(url);
      const $ = cheerio.load(res.data);

      let captions = [];
      $("p").each((i, el) => {
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

      // 10টি র্যান্ডম রিয়্যাকশন নাও
      const randomReacts = reacts.sort(() => 0.5 - Math.random()).slice(0, 10);

      const msg = `╔═════════════════╗
       🌸 𝐂𝐀𝐏𝐓𝐈𝐎𝐍 🌸
╚═════════════════╝

${caption}

╔══════════════════╗
🕊️ Admin : Mehedi Hasan
╚══════════════════╝

🌸 /cp 𝙩𝙮𝙥𝙚 𝙖𝙜𝙖𝙞𝙣`;

      // মেসেজ পাঠাও এবং রিয়্যাকশন বসাও
      api.sendMessage(msg, event.threadID, async (err, info) => {
        if (!err && info) {
          for (const r of randomReacts) {
            try {
              await api.setMessageReaction(r, info.messageID, () => {}, true);
            } catch (e) {
              console.log("Reaction error:", e);
            }
          }
        }
      });

    } catch (err) {
      console.log("CP Error:", err);
      api.sendMessage("⚠️ Caption আনতে সমস্যা হয়েছে! পরে আবার /cp দাও", event.threadID);
    }
  }
};
