module.exports = {
	config: {
		name: "all",
		version: "2.0",
		author: "NTKhang + Edit",
		countDown: 5,
		role: 1,
		shortDescription: {
			en: "Tag everyone"
		},
		longDescription: {
			en: "Tag all members in the group"
		},
		category: "BOX CHAT",
		guide: {
			en: "{pn}"
		}
	},

	onStart: async function ({ message, event }) {
		const { participantIDs } = event;

		if (!participantIDs || participantIDs.length === 0)
			return message.reply("❌ Member পাওয়া যায়নি");

		let body = "📣 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘 𝗔𝗟𝗘𝗥𝗧\n\n🐸 সবাই চিপা থেকে বের হও!\n🔥 না হলে আগুন দিমু!\n\n";

		const mentions = [];

		for (let i = 0; i < participantIDs.length; i++) {
			body += "@ ";
			mentions.push({
				tag: "@",
				id: participantIDs[i],
				fromIndex: body.length - 2
			});
		}

		return message.reply({
			body,
			mentions
		});
	}
};
