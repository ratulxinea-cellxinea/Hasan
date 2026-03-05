const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "vip",
		version: "2.1",
		author: "Hasan",
		countDown: 5,
		role: 2,
		description: "VIP add remove list check",
		category: "owner",
		guide: "{pn} vip add/remove/list/check"
	},

	onStart: async function ({ api, message, args, usersData, event }) {

		const action = args[0]?.toLowerCase();
		const { threadID, messageID } = event;

		if (!config.vipUser)
			config.vipUser = [];

		switch (action) {

			case "add": {

				let uids = Object.keys(event.mentions).length > 0
					? Object.keys(event.mentions)
					: event.messageReply
						? [event.messageReply.senderID]
						: args.slice(1);

				if (!uids.length)
					return api.sendMessage("⚠️ Tag / reply / ID dao", threadID, messageID);

				for (const uid of uids) {

					if (!config.vipUser.includes(uid))
						config.vipUser.push(uid);

					const name = await usersData.getName(uid);

					// VIP MESSAGE
					api.sendMessage({
						body: `👑 ${name}\n\nBaby tmi ekon theke VIP user 😘`,
						mentions: [{
							id: uid,
							tag: name
						}]
					}, threadID);
				}

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return api.sendMessage("✅ VIP Successfully Added", threadID, messageID);
			}

			case "remove": {

				let uid = Object.keys(event.mentions)[0] || event.messageReply?.senderID;

				if (!uid)
					return api.sendMessage("⚠️ Tag / reply user", threadID, messageID);

				if (config.vipUser.includes(uid)) {
					config.vipUser.splice(config.vipUser.indexOf(uid), 1);
					writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));
					return api.sendMessage("🚫 VIP Removed", threadID, messageID);
				}

				else
					return api.sendMessage("❌ User VIP na", threadID, messageID);
			}

			case "list": {

				if (!config.vipUser.length)
					return api.sendMessage("❌ VIP list empty", threadID, messageID);

				let msg = "👑 VIP USER LIST 👑\n\n";

				for (let i = 0; i < config.vipUser.length; i++) {

					const name = await usersData.getName(config.vipUser[i]);

					msg += `${i + 1}. ${name}\n`;
				}

				return api.sendMessage(msg, threadID, messageID);
			}

			case "check": {

				let uid = Object.keys(event.mentions)[0] || event.senderID;

				const name = await usersData.getName(uid);

				if (config.vipUser.includes(uid))
					return api.sendMessage(`👑 ${name} is VIP user`, threadID, messageID);

				else
					return api.sendMessage(`❌ ${name} VIP na`, threadID, messageID);
			}
		}
	}
};
