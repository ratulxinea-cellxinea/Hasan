const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
	config: {
		name: "vip",
		version: "3.1",
		author: "Hasan",
		countDown: 5,
		role: 2,
		description: "VIP system with time",
		category: "owner",
		guide: "{pn} add/remove/list/check"
	},

	onStart: async function ({ api, args, usersData, event }) {

		const { threadID, messageID } = event;
		const action = args[0]?.toLowerCase();

		if (!config.vipUser)
			config.vipUser = {};

		// NAME FIX FUNCTION
		async function getUserName(uid) {
			try {
				const name = await usersData.getName(uid);
				if (!name || name === "null")
					return `User ${uid}`;
				return name;
			}
			catch {
				return `User ${uid}`;
			}
		}

		switch (action) {

			case "add": {

				let uid =
					Object.keys(event.mentions)[0] ||
					event.messageReply?.senderID ||
					args[1];

				let days = parseInt(args[2]) || 1;

				if (!uid)
					return api.sendMessage("⚠️ UID / Tag / Reply dao", threadID, messageID);

				const name = await getUserName(uid);

				const expire = Date.now() + days * 86400000;

				config.vipUser[uid] = expire;

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return api.sendMessage({
					body: `👑 ${name}

Baby tmi ekon theke VIP user 😘
⏳ Time: ${days} day`,
					mentions: [{ id: uid, tag: name }]
				}, threadID, messageID);
			}

			case "remove": {

				let uid =
					Object.keys(event.mentions)[0] ||
					event.messageReply?.senderID ||
					args[1];

				if (!uid)
					return api.sendMessage("⚠️ UID / Tag dao", threadID, messageID);

				if (!config.vipUser[uid])
					return api.sendMessage("❌ User VIP na", threadID, messageID);

				delete config.vipUser[uid];

				writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

				return api.sendMessage("🚫 VIP Removed", threadID, messageID);
			}

			case "list": {

				if (Object.keys(config.vipUser).length === 0)
					return api.sendMessage("❌ VIP list empty", threadID, messageID);

				let msg = "👑 VIP USER LIST 👑\n\n";
				let i = 1;

				for (const uid in config.vipUser) {

					const name = await getUserName(uid);

					const timeLeft = Math.floor((config.vipUser[uid] - Date.now()) / 86400000);

					msg += `${i}. ${name}\nUID: ${uid}\n⏳ ${timeLeft} day left\n\n`;

					i++;
				}

				return api.sendMessage(msg, threadID, messageID);
			}

			case "check": {

				let uid =
					Object.keys(event.mentions)[0] ||
					event.messageReply?.senderID ||
					event.senderID;

				const name = await getUserName(uid);

				if (!config.vipUser[uid])
					return api.sendMessage(`❌ ${name} VIP na`, threadID, messageID);

				const timeLeft = Math.floor((config.vipUser[uid] - Date.now()) / 86400000);

				return api.sendMessage(`👑 ${name} VIP user\n⏳ ${timeLeft} day left`, threadID, messageID);
			}
		}
	}
};
