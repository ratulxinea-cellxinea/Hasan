module.exports = {
  config: {
    name: "cp",
    aliases: ["caption"],
    version: "21.0",
    author: "Nazim Ultra Direct Fix",
    countDown: 5,
    role: 0,
    shortDescription: "Bangla Caption",
    longDescription: "Fetch direct Bangla caption from internal list with react",
    category: "fun"
  },

  onStart: async function ({ api, event }) {
    try {
      // সরাসরি internal captions
      const captions = [
        "সেরা বন্ধু হলো সেই, যা পাশে থাকে খারাপ সময়ে।",
        "মুখে হাসি থাকলেও মন ভরা আবেগ।",
        "জীবন সুন্দর, শুধু চোখ খোলার দরকার।",
        "ভালোবাসা শুধুই অনুভব করা হয়, বোঝানো যায় না।",
        "সপ্ন দেখা মানেই জীবনের রং ধরে রাখা।",
        "নিজেকে ভালোবাসো, তাহলে পৃথিবীও ভালোবাসবে।",
        "যেখানে আশা আছে, সেখানে জীবন আছে।",
        "মাঝে মাঝে একা থাকা মানে শক্তিশালী হওয়া।",
        "সত্যি বন্ধু কখনো তোমাকে ছেড়ে যায় না।",
        "আজকের কষ্ট, আগামীকালের শক্তি।"
      ];

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
