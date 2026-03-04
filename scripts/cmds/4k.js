const axios = require("axios");

const mahmud = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "4k",
    aliases: ["hd", "upscale", "enhance"],
    version: "2.0",
    author: "MahMUD",
    countDown: 10,
    role: 0,
    description: {
      bn: "✨ AI দিয়ে ছবিকে 4K / HD কোয়ালিটিতে রূপান্তর করুন",
      en: "✨ Enhance image quality to stunning 4K using AI",
      vi: "✨ Nâng cấp hình ảnh lên 4K bằng AI"
    },
    category: "tools",
    guide: {
      bn: "   {pn} [url] ➜ ছবির লিংক দিয়ে HD করুন 📸\n   অথবা ছবির রিপ্লাই দিয়ে {pn} লিখুন 💬",
      en: "   {pn} [url] ➜ Upscale image via URL 📸\n   Or reply to an image with {pn} 💬",
      vi: "   {pn} [url] ➜ Nâng cấp ảnh qua link 📸\n   Hoặc reply ảnh bằng {pn} 💬"
    }
  },

  langs: {
    bn: {
      noImage: "⚠️ বেবি, একটা ছবিতে রিপ্লাই দাও অথবা লিংক দাও! 📸✨",
      wait: "⏳ 𝐀𝐈 𝟒𝐊 𝐄𝐍𝐇𝐀𝐍𝐂𝐄 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆...\n🔄 ছবিটা সুন্দর বানানো হচ্ছে... একটু অপেক্ষা করো 😘✨",
      success: "🌟✨ 𝐇𝐄𝐑𝐄 𝐈𝐒 𝐘𝐎𝐔𝐑 𝟒𝐊 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 ✨🌟\n📸 HD Quality Activated ✅",
      error: "❌ সমস্যা হয়েছে: %1\n📛 প্রয়োজনে Contact MahMUD 🚀"
    },
    en: {
      noImage: "⚠️ Please reply to an image or provide a link! 📸✨",
      wait: "⏳ 𝐀𝐈 𝟒𝐊 𝐄𝐍𝐇𝐀𝐍𝐂𝐄 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆...\n🔄 Enhancing your image... please wait 😘✨",
      success: "🌟✨ 𝐇𝐄𝐑𝐄 𝐈𝐒 𝐘𝐎𝐔𝐑 𝟒𝐊 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 ✨🌟\n📸 HD Quality Activated ✅",
      error: "❌ API Error: %1\n📛 Contact MahMUD for support 🚀"
    },
    vi: {
      noImage: "⚠️ Vui lòng reply ảnh hoặc gửi link! 📸✨",
      wait: "⏳ 𝐀𝐈 𝟒𝐊 𝐄𝐍𝐇𝐀𝐍𝐂𝐄 𝐏𝐑𝐎𝐂𝐄𝐒𝐒𝐈𝐍𝐆...\n🔄 Đang nâng cấp ảnh... vui lòng chờ 😘✨",
      success: "🌟✨ 𝐇𝐄𝐑𝐄 𝐈𝐒 𝐘𝐎𝐔𝐑 𝟒𝐊 𝐌𝐀𝐒𝐓𝐄𝐑𝐏𝐈𝐄𝐂𝐄 ✨🌟\n📸 HD Quality Activated ✅",
      error: "❌ Lỗi API: %1\n📛 Liên hệ MahMUD để được hỗ trợ 🚀"
    }
  },

  onStart: async function ({ api, message, args, event, getLang }) {
    const authorName = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (this.config.author !== authorName) {
      return api.sendMessage("🚫 Unauthorized to change author name!", event.threadID, event.messageID);
    }

    let imgUrl;

    if (event.messageReply?.attachments?.[0]?.type === "photo") {
      imgUrl = event.messageReply.attachments[0].url;
    } else if (args[0]) {
      imgUrl = args.join(" ");
    }

    if (!imgUrl)
      return api.sendMessage(getLang("noImage"), event.threadID, event.messageID);

    const waitMsg = await api.sendMessage(getLang("wait"), event.threadID);
    api.setMessageReaction("🔥", event.messageID, () => {}, true);

    try {
      const baseUrl = await mahmud();
      const apiUrl = `${baseUrl}/api/hd/mahmud?imgUrl=${encodeURIComponent(imgUrl)}`;

      const res = await axios.get(apiUrl, { responseType: "stream" });

      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);

      api.setMessageReaction("✨", event.messageID, () => {}, true);

      return api.sendMessage(
        {
          body: getLang("success"),
          attachment: res.data
        },
        event.threadID,
        event.messageID
      );

    } catch (err) {
      console.error("Error in 4k command:", err);

      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);

      api.setMessageReaction("❌", event.messageID, () => {}, true);

      return api.sendMessage(
        getLang("error", err.message),
        event.threadID,
        event.messageID
      );
    }
  }
};
