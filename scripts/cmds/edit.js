const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

let cachedBaseURL = null;

const mahmud = async () => {
  try {
    if (cachedBaseURL) return cachedBaseURL;

    const { data } = await axios.get(
      "https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json"
    );

    cachedBaseURL = data.mahmud;
    return cachedBaseURL;
  } catch {
    throw new Error("API load failed");
  }
};

module.exports = {
  config: {
    name: "edit",
    version: "2.0",
    author: "MahMUD",
    countDown: 5,
    role: 0,
    category: "image",
    guide: "{p}edit [prompt] (reply image)"
  },

  onStart: async function ({ api, event, args, message }) {

    const prompt = args.join(" ");
    const replied = event.messageReply?.attachments?.[0];

    if (!replied || replied.type !== "photo")
      return message.reply("📸 | একটা ছবিতে reply কর");

    if (!prompt)
      return message.reply("✏️ | কি edit করতে চাস লিখ");

    api.setMessageReaction("🪄", event.messageID, () => {}, true);

    const cacheDir = path.join(__dirname, "cache");
    await fs.ensureDir(cacheDir);

    const imgPath = path.join(cacheDir, `${Date.now()}.jpg`);

    const wait = await message.reply("⏳ | Image edit হচ্ছে... একটু wait কর");

    try {

      const baseURL = await mahmud();

      const res = await axios({
        method: "POST",
        url: `${baseURL}/api/edit`,
        data: {
          prompt: prompt,
          imageUrl: replied.url
        },
        responseType: "arraybuffer"
      });

      fs.writeFileSync(imgPath, Buffer.from(res.data));

      api.setMessageReaction("✅", event.messageID, () => {}, true);

      await message.reply({
        body: `✅ Edit Complete\n\nPrompt: ${prompt}`,
        attachment: fs.createReadStream(imgPath)
      });

    } catch (e) {

      api.setMessageReaction("❌", event.messageID, () => {}, true);

      message.reply("❌ | Server error, পরে আবার try কর");
    }

    setTimeout(() => {
      fs.unlinkSync(imgPath);
      api.unsendMessage(wait.messageID);
    }, 5000);
  }
};
