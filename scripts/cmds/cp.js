const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: [],
    version: "5.0",
    author: "Nazim",
    countDown: 5,
    role: 0,
    shortDescription: "Stylish Bangla Caption + Random React",
    longDescription: "Get stylish caption and auto-react with 50+ flower & peace emojis, change every time",
    category: "fun"
  },

  onStart: async function ({ api, event, message }) {
    try {
      // Fetch captions
      const res = await axios.get("https://banglacaptionstatus.com/stylish-best-caption-bangla/");
      const $ = cheerio.load(res.data);

      let captions = [];

      $("p").each((i, el) => {
        const text = $(el).text().trim();
        if (
          text.length > 25 &&
          text.length < 250 &&
          !text.includes("http") &&
          !text.includes("Facebook") &&
          !text.includes("WhatsApp")
        ) {
          captions.push(text);
        }
      });

      if (!captions.length) {
        return api.sendMessage("🌸 Caption পাওয়া যায়নি! পরে চেষ্টা করো 🕊️", event.threadID);
      }

      const randomCaption =
        captions[Math.floor(Math.random() * captions.length)];

      // 🌸 Full Flower & Peace Emoji List (50+)
      const emojis = [
        "🌸","🌺","🌷","🌹","🥀","🌻","🌼","💐","🪷","🌿",
        "🍃","🌾","🌱","🌲","🌳","🕊️","✌️","☮️","🪶","✨",
        "💮","🏵️","🪻","🌵","🌴","🌙","🌤️","🌈","🌊","🧘‍♂️",
        "🧘‍♀️","💗","🤍","💞","💓","💝","🕯️","🪔","🫶","🤲",
        "🌅","🌄","🍀","🌟","🌌","🌬️","🕊","☀️","🌺","🌸",
        "🌷","🌹","💮","🏵️","🪷","🌻","🍃","🌿","🌼","☮️",
        "🌸","🌺","🌷","🌹","🥀","🌻","🌼","💐","🪷","🌿",
        "🍃","🌾","🌱","🌲","🌳","🕊️","✌️","☮️","🪶","✨"
      ];

      // Random 30 emojis for reactions
      const randomEmojis = emojis
        .sort(() => 0.5 - Math.random())
        .slice(0, 30);

      // Stylish caption message
      const sentMessage = await api.sendMessage(
`╭━❀ 𝐒𝐓𝐘𝐋𝐈𝐒𝐇 𝐁𝐚𝐧𝐠𝐥𝐚 𝐂𝐚𝐩𝐭𝐢𝐨𝐧 ❀━╮
│
│  ${randomCaption}
│
╰━❀━━━━━━━━━━━━━━❀━╯

      ❀ 𝑴𝒆𝒉𝒆𝒅𝒊 𝑯𝒂𝒔𝒂𝒏 ❀`, 
        event.threadID
      );

      // Auto-react with all selected flower & peace emojis
      for (const emoji of randomEmojis) {
        try {
          await api.react(emoji, sentMessage.messageID);
        } catch (e) {
          console.log(`React failed for ${emoji}: ${e.message}`);
        }
      }

    } catch (err) {
      console.error(err);
      return api.sendMessage("🕊️ Caption আনতে সমস্যা হচ্ছে! পরে আবার চেষ্টা করো 🌸", event.threadID);
    }
  }
};
