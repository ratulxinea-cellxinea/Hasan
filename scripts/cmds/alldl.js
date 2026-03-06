const axios = require("axios");
const fs = require("fs-extra");

const baseApiUrl = async () => {
  const base = await axios.get(
    `https://raw.githubusercontent.com/Mostakim0978/D1PT0/refs/heads/main/baseApiUrl.json`
  );
  return base.data.api;
};

module.exports = {
  config: {
    name: "alldl",
    version: "1.1.0",
    author: "Dipto + Edit Mehedi Hasan",
    countDown: 2,
    role: 0,
    description: {
      en: "Download video from TikTok, Facebook, Instagram, YouTube and more"
    },
    category: "MEDIA",
    guide: {
      en: "[video_link]"
    }
  },

  onStart: async function ({ api, args, event }) {

    const link = event.messageReply?.body || args[0];

    if (!link) {
      api.setMessageReaction("❌", event.messageID, () => {}, true);
      return api.sendMessage(
        "⚠️ | Please give a video link",
        event.threadID,
        event.messageID
      );
    }

    try {

      api.setMessageReaction("⏳", event.messageID, () => {}, true);

      const { data } = await axios.get(
        `${await baseApiUrl()}/alldl?url=${encodeURIComponent(link)}`
      );

      if (!data.result) {
        api.setMessageReaction("❌", event.messageID, () => {}, true);
        return api.sendMessage(
          "❌ | Video not found!",
          event.threadID,
          event.messageID
        );
      }

      const cache = __dirname + "/cache";
      if (!fs.existsSync(cache)) fs.mkdirSync(cache);

      const filePath = `${cache}/alldl_${Date.now()}.mp4`;

      const video = await axios.get(data.result, {
        responseType: "arraybuffer"
      });

      fs.writeFileSync(filePath, Buffer.from(video.data));

      const short = await global.utils.shortenURL(data.result);

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      api.sendMessage(
        {
          body: `
╭━━━〔 ⚡ ALL VIDEO DOWNLOADER ⚡ 〕━━━╮
┃
┃ 👑 𝗔𝗗𝗠𝗜𝗡 ➤ Mehedi Hasan
┃
┃ 📥 𝗦𝗧𝗔𝗧𝗨𝗦 ➤ Download Complete
┃ 🌐 𝗦𝗢𝗨𝗥𝗖𝗘 ➤ Social Media
┃
┃ 🔗 𝗩𝗜𝗗𝗘𝗢 𝗟𝗜𝗡𝗞
┃ ${short}
┃
╰━━━━━━━━━━━━━━━━━━━━━━━━╯
`,
          attachment: fs.createReadStream(filePath)
        },
        event.threadID,
        () => fs.unlinkSync(filePath),
        event.messageID
      );

      // imgur support
      if (link.startsWith("https://i.imgur.com")) {

        const ext = link.substring(link.lastIndexOf("."));

        const response = await axios.get(link, {
          responseType: "arraybuffer"
        });

        const filename = `${cache}/imgur${ext}`;

        fs.writeFileSync(filename, Buffer.from(response.data));

        api.sendMessage(
          {
            body: "🖼️ | Imgur file downloaded successfully",
            attachment: fs.createReadStream(filename)
          },
          event.threadID,
          () => fs.unlinkSync(filename),
          event.messageID
        );
      }

    } catch (error) {

      api.setMessageReaction("❎", event.messageID, () => {}, true);

      api.sendMessage(
        "❌ | Download failed. Try another link.",
        event.threadID,
        event.messageID
      );
    }
  }
};
