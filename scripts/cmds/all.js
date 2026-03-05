module.exports = {
	config: {
		name: "all",
		version: "3.0",
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
			return message.reply("❌ গ্রুপে কোনো member পাওয়া যায়নি!");

		let body = `📢 𝗘𝗩𝗘𝗥𝗬𝗢𝗡𝗘 𝗖𝗔𝗟𝗟 📢

🐸 সবাই চিপা থেকে বের হও!
🔥 না হলে আগুন দিমু!

😂 যারা লুকাইয়া আছো, ধরা খাইবা কিন্তু!
👀 গ্রুপে এসে একটা হাই দাও!

━━━━━━━━━━━━━━`;

		const mentions = participantIDs.map(id => ({
			tag: "‎",
			id
		}));

		return message.reply({
			body,
			mentions
		});
	}
};
