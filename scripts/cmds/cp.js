const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "cp",
    aliases: [],
    version: "1.0",
    author: "Hasan",
    countDown: 5,
    role: 0,
    shortDescription: "Bangla Caption",
    longDescription: "Get random caption from banglacaptionstatus.com",
    category: "fun"
  },

  onStart: async function ({ message }) {
    try {

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
        return message.reply("❌ Caption পাওয়া যায়নি!");
      }

      const randomCaption =
        captions[Math.floor(Math.random() * captions.length)];

      return message.reply(
        `╔══════════════╗
   ✨ 𝑩𝒂𝒏𝒈𝒍𝒂 𝑪𝒂𝒑𝒕𝒊𝒐𝒏 ✨
╚══════════════╝

${randomCaption}

━━━━━━━━━━━━━━
Type /cp again 😌`
      );

    } catch (err) {
      console.error(err);
      return message.reply("⚠️ Website থেকে caption আনতে সমস্যা হচ্ছে!");
    }
  }
};
