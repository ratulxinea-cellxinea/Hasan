const axios = require("axios");
const fs = require("fs");
const path = require("path");

const baseApiUrl = async () => {
  const base = await axios.get(
    "https://raw.githubusercontent.com/Mostakim0978/D1PT0/main/baseApiUrl.json"
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "alldl",
    version: "2.0",
    author: "Dipto + Edit Mehedi Hasan",
    countDown: 2,
    role: 0,
    shortDescription: {
      en: "Download video from social media"
    },
    longDescription: {
      en: "Download video from TikTok, Facebook, Instagram, YouTube"
    },
    category: "MEDIA",
    guide: {
      en: "{pn} [video_link] or reply link"
    }
  },

  onStart: async function ({ api, event, args }) {
    try {

      const link = event.messageReply?.body || args[0];

      if (!link) {
        return api.sendMessage(
          "⚠️ | Please give a video link",
          event.threadID,
          event.messageID
        );
      }

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiUrl = await baseApiUrl();

      const { data } = await axios.get(
        `${apiUrl}/alldl?url=${encodeURIComponent(link)}`
      );

      if (!data || !data.result) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage(
          "❌ | Video not found!",
          event.threadID,
          event.messageID
        );
      }

      const cachePath = path.join(__dirname, "cache");

      if (!fs.existsSync(cachePath)) {
        fs.mkdirSync(cachePath);
      }

      const filePath = path.join(cachePath, `alldl_${Date.now()}.mp4`);

      const video = await axios.get(data.result, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(video.data));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(
        {
          body: `╭━━━〔 ⚡ ALL VIDEO DOWNLOADER ⚡ 〕━━━╮
┃
┃ 👑 ADMIN ➤ Mehedi Hasan
┃
┃ 📥 STATUS ➤ Download Complete
┃ 🌐 SOURCE ➤ Social Media
┃
┃ 🔗 VIDEO LINK
┃ ${data.result}
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (err) {

      console.log(err);

      api.setMessageReaction("❎", event.messageID, () => {}, true);

      api.sendMessage(
        "❌ | Download failed. Try another link.",
        event.threadID,
        event.messageID
      );
    }
  }
};
