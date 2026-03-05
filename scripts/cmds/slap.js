const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "slap",
        version: "1.8",
        author: "SaGor",
        countDown: 5,
        role: 0,
        shortDescription: "Fun slap image",
        longDescription: "Send a fun slap image with reactions",
        category: "FUN & GAME",
        guide: { en: "{pn} @tag or reply" }
    },

    langs: {
        en: { noTag: "যারে থাপড়াবি ওরে মেনশন দে বা reply কর 🤓" }
    },

    onStart: async function({ event, message, usersData, args, getLang, api }) {
        const senderID = event.senderID;
        let targetID;

        if (Object.keys(event.mentions).length > 0) {
            targetID = Object.keys(event.mentions)[0];
        } else if (event.messageReply) {
            targetID = event.messageReply.senderID;
        } else {
            return message.reply(getLang("noTag"));
        }

        try {
            const avatar1 = await usersData.getAvatarUrl(senderID) || `https://graph.facebook.com/${senderID}/picture?type=large`;
            const avatar2 = await usersData.getAvatarUrl(targetID) || `https://graph.facebook.com/${targetID}/picture?type=large`;

            // Generate slap image
            const slap = new DIG.Slap();
            const slapImageBuffer = await slap.getImage(avatar1, avatar2); // buffer guaranteed

            // Save temp
            const tmpDir = path.join(__dirname, "tmp");
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
            const filePath = path.join(tmpDir, `${senderID}_${targetID}_slap.png`);
            fs.writeFileSync(filePath, slapImageBuffer); // write buffer

            // Message content
            const content = args.join(" ").replace(Object.keys(event.mentions)[0] || "", "").trim() || "Bópppp 😵‍💫😵";

            // Send message
            message.reply({ body: content, attachment: fs.createReadStream(filePath) }, async (err, info) => {
                fs.unlinkSync(filePath); // delete after send

                // Add reactions
                const reactions = ["😂","😵","💥","🤕","😎","🤣","😡","😱","💢","👊"];
                for (const emoji of reactions) {
                    try {
                        await api.sendMessage({ react: { emoji, mid: info.messageID } }, event.threadID);
                    } catch(e) { console.log(e); }
                }
            });

        } catch(e) {
            console.error("Slap image error:", e);
            return message.reply("😓 ছবি তৈরি করা যায়নি, আবার try কর।");
        }
    }
};
