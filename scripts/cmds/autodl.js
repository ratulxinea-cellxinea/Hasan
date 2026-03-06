const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "autodl",
    version: "4.0",
    author: "Dipto + Edit Mehedi Hasan",
    countDown: 0,
    role: 0,
    shortDescription: "Auto video downloader",
    longDescription: "Auto download videos from social links",
    category: "MEDIA"
  },

  onStart: async function () {},

  onChat: async function ({ api, event }) {

    if (!event.body) return;

    const link = event.body.trim();

    if (!link.match(/(tiktok|facebook|fb.watch|instagram|youtu|twitter|x.com)/i)) return;

    try {

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const apiUrl = `https://api.ryzendesu.vip/api/downloader/alldl?url=${encodeURIComponent(link)}`;

      const res = await axios.get(apiUrl);

      const videoUrl =
        res.data?.url ||
        res.data?.result ||
        res.data?.data?.url;

      if (!videoUrl) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage(
          "❌ | Video not found!",
          event.threadID,
          event.messageID
        );
      }

      const cache = path.join(__dirname, "cache");

      if (!fs.existsSync(cache)) {
        fs.mkdirSync(cache);
      }

      const filePath = path.join(cache, `autodl_${Date.now()}.mp4`);

      const video = await axios({
        url: videoUrl,
        method: "GET",
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(video.data));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(
        {
          body: `╭━━━〔 ⚡ AUTO VIDEO DOWNLOADER ⚡ 〕━━━╮
┃
┃ 👑 ADMIN ➤ Mehedi Hasan
┃ 🚀 STATUS ➤ Download Complete
┃ 📥 SOURCE ➤ Social Media
┃
┃ 🎬 VIDEO READY
┃ ⚡ FAST DOWNLOADED
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

    } catch (err) {

      console.log(err);

      api.setMessageReaction("❌", event.messageID, () => {}, true);

      api.sendMessage(
        "❌ | Download failed. Try another link.",
        event.threadID,
        event.messageID
      );

    }

  }
};
