const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
	config: {
		name: "slap",
		version: "3.0",
		author: "SaGor Fixed",
		countDown: 5,
		role: 0,
		shortDescription: "Slap someone",
		longDescription: "Send slap image",
		category: "FUN & GAME",
		guide: {
			en: "{pn} @tag / reply"
		}
	},

	langs: {
		en: {
			noTag: "যারে থাপড় দিবি ওরে mention দে বা reply কর 🤓"
		}
	},

	onStart: async function ({ event, message, usersData, args, getLang }) {

		const senderID = event.senderID;
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

			const avatar1 = `https://graph.facebook.com/${senderID}/picture?width=512&height=512`;
			const avatar2 = `https://graph.facebook.com/${targetID}/picture?width=512&height=512`;

			const api = `https://nekos.life/api/v2/img/slap`;

			const res = await axios.get(api);
			const imageUrl = res.data.url;

			const img = await axios.get(imageUrl, { responseType: "arraybuffer" });

			const tmpDir = path.join(__dirname, "tmp");
			if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);

			const filePath = path.join(tmpDir, `slap_${Date.now()}.jpg`);

			fs.writeFileSync(filePath, Buffer.from(img.data));

			const msg =
				args.join(" ")
					.replace(Object.keys(event.mentions)[0] || "", "")
					.trim() || "👋 ধামাকা থাপ্পড় 🤣";

			await message.reply({
				body: msg,
				attachment: fs.createReadStream(filePath)
			});

			fs.unlinkSync(filePath);

		} catch (err) {
			console.log(err);
			message.reply("❌ Slap image আনতে সমস্যা হয়েছে");
		}
	}
};
