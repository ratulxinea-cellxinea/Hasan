const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { shortenURL } = global.utils;

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Blankid018/D1PT0/main/baseApiUrl.json"
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "autodl",
    version: "2.0",
    author: "Dipto + Edit Mehedi Hasan",
    countDown: 0,
    role: 0,
    shortDescription: "Auto download video",
    longDescription: "Auto download video from social media links",
    category: "MEDIA",
    guide: {
      en: "Just send video link"
    }
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {
    const link = event.body ? event.body.trim() : "";

    const check = [
      "tiktok.com",
      "vt.tiktok.com",
      "vm.tiktok.com",
      "facebook.com",
      "fb.watch",
      "instagram.com",
      "youtu.be",
      "youtube.com",
      "twitter.com",
      "x.com"
    ];

    if (!check.some(i => link.includes(i))) return;

    try {
      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const cachePath = path.join(__dirname, "cache");
      const filePath = path.join(cachePath, `autodl_${Date.now()}.mp4`);

      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath, { recursive: true });
      }

      const { data } = await axios.get(
        `${await baseApiUrl()}/alldl?url=${encodeURIComponent(link)}`
      );

      const video = await axios({
        url: data.result,
        method: "GET",
        responseType: "stream"
      });

      const writer = fs.createWriteStream(filePath);
      video.data.pipe(writer);

      writer.on("finish", async () => {
        const short = await shortenURL(data.result);

        api.setMessageReaction("✅", event.messageID, () => {}, true);

        api.sendMessage(
          {
            body: `
╭─〔 🌐 AUTO DOWNLOAD 〕─╮
│
│ 👑 Admin : Mehedi Hasan
│ 📥 Video Downloaded Successfully
│
│ 🔗 Link : ${short}
│
╰────────────────╯
`,
            attachment: fs.createReadStream(filePath)
          },
          event.threadID,
          () => fs.unlinkSync(filePath),
          event.messageID
        );
      });

    } catch (err) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      api.sendMessage(
        "❌ | Video download failed!",
        event.threadID,
        event.messageID
      );
    }
  }
};
