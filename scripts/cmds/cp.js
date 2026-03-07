const fs = require("fs");
const path = require("path");

module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "20.0",
    author: "Nazim Ultra Direct Fix",
    countDown: 5,
    role: 0,
    shortDescription: "Bangla Caption",
    longDescription: "Fetch direct Bangla caption from cache with react",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      // captions.json ফাইল থেকে fetch
      const filePath = path.join(__dirname, "captions.json");
      if (!fs.existsSync(filePath)) {
        return api.sendMessage("⚠️ Caption file পাওয়া যায়নি! পরে চেষ্টা করো /cp", event.threadID);
      }

      const data = fs.readFileSync(filePath, "utf-8");
      const captions = JSON.parse(data);

      if (!captions.length) {
        return api.sendMessage("⚠️ Caption load করা যায়নি! পরে চেষ্টা করো /cp", event.threadID);
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
