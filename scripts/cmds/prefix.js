const fs = require("fs-extra");
const { utils } = global;

module.exports = {
	config: {
		name: "prefix",
		version: "2.1",
		author: "Mehedi Hasan",
		countDown: 5,
		role: 0,
		description: "Change bot prefix with dark stylish vibe and full image preview",
		category: "config",
		guide: {
			en: "{pn} <new prefix>: change prefix in your box chat\nExample:\n{pn} !\n\n{pn} <new prefix> -g: change system prefix (admin only)\nExample:\n{pn} ! -g\n\n{pn} reset: reset prefix to default"
		}
	},

	langs: {
		en: {
			reset: "✅ | Prefix reset to default: %1",
			onlyAdmin: "❌ | Only admin can change system prefix",
			confirmGlobal: "⚠️ | Please react to confirm changing system prefix",
			confirmThisThread: "⚠️ | Please react to confirm changing box prefix",
			successGlobal: "✅ | System prefix changed to: %1",
			successThisThread: "✅ | Box prefix changed to: %1",
			myPrefix: ({ systemPrefix, threadPrefix, totalCmds, ping, date, time }) =>
`╔═══════🖤 DARK 𝗣𝗥𝗘𝗙𝗜𝗫 𝗜𝗡𝗙𝗢 🖤═══════╗
┃ 🌑 Mehedi Hasan's Chat Bot
┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ✦ Group Prefix : ${threadPrefix}
┃ ✦ System Prefix: ${systemPrefix}
┃ ✦ Commands    : ${totalCmds}
┃ ✦ Ping        : ${ping}ms
┃━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ 🗓️ ${date} | ⏰ ${time}
┃ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━
┃ ✧ Mehedi Hasan
╚════════════════════════════╝
🌌 Full Image Preview Below 👇`
		}
	},

	onStart: async function ({ message, role, args, commandName, event, threadsData }) {
		if (!args[0]) return message.SyntaxError();

		if (args[0] === "reset") {
			await threadsData.set(event.threadID, null, "data.prefix");
			return message.reply(this.langs.en.reset.replace("%1", global.GoatBot.config.prefix));
		}

		const newPrefix = args[0];
		const formSet = {
			commandName,
			author: event.senderID,
			newPrefix,
			setGlobal: args[1] === "-g" ? true : false
		};

		if (formSet.setGlobal && role < 2) return message.reply(this.langs.en.onlyAdmin);

		return message.reply(
			formSet.setGlobal ? this.langs.en.confirmGlobal : this.langs.en.confirmThisThread,
			(err, info) => {
				formSet.messageID = info.messageID;
				global.GoatBot.onReaction.set(info.messageID, formSet);
			}
		);
	},

	onReaction: async function ({ message, threadsData, event, Reaction }) {
		const { author, newPrefix, setGlobal } = Reaction;
		if (event.userID !== author) return;

		if (setGlobal) {
			global.GoatBot.config.prefix = newPrefix;
			fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
			return message.reply(this.langs.en.successGlobal.replace("%1", newPrefix));
		} else {
			await threadsData.set(event.threadID, newPrefix, "data.prefix");
			return message.reply(this.langs.en.successThisThread.replace("%1", newPrefix));
		}
	},

	onChat: async function ({ event, message }) {
		if (!event.body) return;
		if (event.body.toLowerCase() === "prefix") {
			const systemPrefix = global.GoatBot.config.prefix;
			const threadPrefix = utils.getPrefix(event.threadID);
			const totalCmds = Object.keys(global.GoatBot.commands).length;
			const ping = Math.floor(Math.random() * 200) + 100;
			const d = new Date();
			const date = d.toLocaleDateString("en-US", { weekday: "long", day: "2-digit", month: "2-digit", year: "numeric" });
			const time = d.toLocaleTimeString("en-US", { hour12: false });

			const text = this.langs.en.myPrefix({ systemPrefix, threadPrefix, totalCmds, ping, date, time });

			// Full image preview attached
			const stream = await utils.getStreamFromURL("https://i.ibb.co/CKw0MrWs/image1.jpg");
			return message.reply({ body: text, attachment: stream });
		}
	}
};
