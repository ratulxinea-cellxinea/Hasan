const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let cachedBaseURL = null; // cache for faster response

const mahmud = async () => {
  try {
    if (cachedBaseURL) return cachedBaseURL; // use cache

    const { data } = await axios.get(
      "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json",
      { timeout: 5000 }
    );

    cachedBaseURL = data.mahmud;
    return cachedBaseURL;
  } catch (err) {
    throw new Error("Base API Load Failed");
  }
};

module.exports = {
  config: {
    name: "edit",
    version: "1.8",
    author: "MahMUD",
    countDown: 5, // reduced cooldown for faster use
    role: 0,
    category: "image",
    guide: { en: "{p}edit [prompt] reply to image" }
  },

  onStart: async function ({ api, event, args, message }) {

    const obfuscatedAuthor = String.fromCharCode(77, 97, 104, 77, 85, 68);
    if (module.exports.config.author !== obfuscatedAuthor) {
      return message.reply("❌ | Author name change kora jabe na baby 😾");
    }

    const prompt = args.join(" ").trim();
    const repliedImage = event.messageReply?.attachments?.[0];

    if (!prompt || !repliedImage || repliedImage.type !== "photo") {
      return message.reply("🖼️ | Baby, ekta photo reply kore prompt dao na please 💕");
    }

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const imgPath = path.join(cacheDir, `${Date.now()}_edit.jpg`);

    const waitMsg = await message.reply(
      "✨ | Mehedi Hasan editing your image... please baby wait 💖🪄"
    );

    try {
      const baseURL = await mahmud();

      const res = await axios({
        method: "POST",
        url: `${baseURL}/api/edit`,
        data: {
          prompt: prompt, // Bangla / English both supported
          imageUrl: repliedImage.url
        },
        responseType: "arraybuffer",
        timeout: 20000 // faster fail if slow
      });

      await fs.writeFile(imgPath, Buffer.from(res.data));

      await message.reply({
        body: `🌸 | Successfully Edited For: "${prompt}" 💕`,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (err) {
      console.error(err.message);
      message.reply("🥹 | Oops baby... server busy! Try again after some time 💔");
    } finally {
      setTimeout(() => fs.remove(imgPath).catch(() => {}), 8000);
      if (waitMsg?.messageID) api.unsendMessage(waitMsg.messageID);
    }
  }
};
