const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "slap",
    version: "4.0",
    author: "SaGor Fixed",
    countDown: 5,
    role: 0,
    shortDescription: "Slap someone",
    longDescription: "Send slap gif",
    category: "FUN & GAME",
    guide: {
      en: "{pn} @tag / reply"
    }
  },

  langs: {
    en: {
      noTag: "যারে থাপ্পড় দিবি তাকে mention দে বা reply কর 🤓"
    }
  },

  onStart: async function ({ event, message, args, getLang }) {

    let targetID;

    if (Object.keys(event.mentions).length > 0) {
      targetID = Object.keys(event.mentions)[0];
    } 
    else if (event.messageReply) {
      targetID = event.messageReply.senderID;
    } 
    else {
      return message.reply(getLang("noTag"));
    }

    try {

      // slap gif API
      const res = await axios.get("https://nekos.best/api/v2/slap");
      const imageUrl = res.data.results[0].url;

      const img = await axios.get(imageUrl, { responseType: "arraybuffer" });

      const tmpDir = path.join(__dirname, "tmp");
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

      const filePath = path.join(tmpDir, `slap_${Date.now()}.gif`);

      fs.writeFileSync(filePath, Buffer.from(img.data));

      const text =
        args.join(" ")
          .replace(Object.keys(event.mentions)[0] || "", "")
          .trim() || "💥 ধামাকা থাপ্পড়!";

      await message.reply({
        body: text,
        attachment: fs.createReadStream(filePath)
      });

      fs.unlinkSync(filePath);

    } catch (err) {
      console.log(err);
      message.reply("❌ Slap GIF আনতে পারলাম না, আবার try কর");
    }
  }
};
