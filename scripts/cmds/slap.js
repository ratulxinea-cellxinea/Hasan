const DIG = require("discord-image-generation");
const fs = require("fs-extra");

module.exports = {
    config: {
        name: "slap",
        version: "1.3",
        author: "SaGor",
        countDown: 5,
        role: 0,
        shortDescription: "Fun slap image",
        longDescription: "Send a fun slap image with reactions",
        category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
        guide: {
            en: " {pn} @tag or reply"
        }
    },

    langs: {
        vi: {
            noTag: "Bạn phải tag người bạn muốn tát hoặc reply vào tin nhắn của họ"
        },
        en: {
            noTag: "যারে থাপড়াবি ওরে মেনশন দে বা reply কর 🤓"
        }
    },

    onStart: async function ({ event, message, usersData, args, getLang, api }) {
        const uid1 = event.senderID;
        let uid2;

        // Check if user mentioned someone
        if (Object.keys(event.mentions).length > 0) {
            uid2 = Object.keys(event.mentions)[0];
        } 
        // If no mention, check if replying to a message
        else if (event.messageReply) {
            uid2 = event.messageReply.senderID;
        } 

        if (!uid2) return message.reply(getLang("noTag"));

        const avatarURL1 = await usersData.getAvatarUrl(uid1);
        const avatarURL2 = await usersData.getAvatarUrl(uid2);

        // Use Slap image style
        const img = await new DIG.Slap().getImage(avatarURL1, avatarURL2);

        const pathSave = `${__dirname}/tmp/${uid1}_${uid2}_Slap.png`;
        fs.writeFileSync(pathSave, Buffer.from(img));

        const content = args.join(' ')
            .replace(Object.keys(event.mentions)[0] || "", "");

        message.reply({
            body: `${content || "Bópppp 😵‍💫😵"}`,
            attachment: fs.createReadStream(pathSave)
        }, async (err, info) => {
            fs.unlinkSync(pathSave); // delete after sending

            // Add multiple reactions
            const reactions = ["😂", "😵", "💥", "🤕", "😎"];
            for (let emoji of reactions) {
                try {
                    await api.sendMessage({ react: { emoji, mid: info.messageID } }, event.threadID);
                } catch (e) { console.log(e); }
            }
        });
    }
};
