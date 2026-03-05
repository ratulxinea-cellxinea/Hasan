const axios = require("axios");
const fs = require("fs");
const path = require("path");

const mahmhd = async () => {
  const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/exe/main/baseApiUrl.json");
  return base.data.mahmud;
};

module.exports = {
  config: {
    name: "fakechat",
    aliases: ["fc", "F", "fake"],
    version: "2.1",
    author: "MahMUD",
    role: 0,
    category: "fun",
    description: "Generate fake chat (VIP Only) with stylish Xineas BBZChat Bot",
    countDown: 5,
  },

  onStart: async ({ event, message, args, usersData, api, config }) => {

    // VIP CHECK
    if (!config.vipUser || !config.vipUser[event.senderID] || config.vipUser[event.senderID] < Date.now()) {
      return message.reply(
        "❌❌ | Only 👑 VIP users can use this command!\n✨ Become VIP to unlock **Xineas BBZChat Bot** stylish fake chats!"
      );
    }

    try {
      let targetId;
      let userText = args.join(" ").trim();

      // DETERMINE TARGET USER
      if (event.messageReply) {
        targetId = event.messageReply.senderID || event.messageReply.sender?.id;
      } else if (event.mentions && Object.keys(event.mentions).length > 0) {
        targetId = Object.keys(event.mentions)[0];
        const mentionName = event.mentions[targetId];
        userText = args.join(" ").replace(new RegExp(`@?${mentionName}`, "gi"), "").trim();
      } else if (args.length > 0 && /^\d+$/.test(args[0])) {
        targetId = args[0];
        userText = args.slice(1).join(" ").trim();
      } else {
        return message.reply("❌ Reply, mention, or provide user UID to generate fake chat.");
      }

      if (!userText) return message.reply("❌ Please provide text for the fake chat.");

      // GET USER NAME
      let userName = "Unknown";
      try {
        userName = (await usersData.getName(targetId)) || targetId;
      } catch {
        userName = targetId;
      }

      // CALL API
      const baseApi = await mahmhd();
      const apiUrl = `${baseApi}/api/fakechat?id=${targetId}&name=${encodeURIComponent(
        userName
      )}&text=${encodeURIComponent(userText)}`;

      const response = await axios.get(apiUrl, { responseType: "arraybuffer" });
      const filePath = path.join(__dirname, `fakechat_${Date.now()}.png`);
      fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

      // SEND STYLISH VIP MESSAGE
      await message.reply({
        body: `✨👑 **Xineas BBZChat Bot** 👑✨\n\n🗨️ **Target:** ${userName}\n💬 **Message:** ${userText}\n\n💖 Thank you for using VIP features!`,
        attachment: fs.createReadStream(filePath),
      });

      // DELETE TEMP FILE
      setTimeout(() => {
        try { fs.unlinkSync(filePath); } catch {}
      }, 5000);

    } catch {
      await message.reply("🥹 Error occurred! Contact **Xineas BBZChat Bot Support**.");
    }
  },
};
