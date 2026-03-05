const DIG = require("discord-image-generation");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
    config: {
        name: "slap",
        version: "1.5",
        author: "SaGor",
        countDown: 5,
        role: 0,
        shortDescription: "Fun slap image",
        longDescription: "Send a fun slap image with reactions",
        category: "𝗙𝗨𝗡 & 𝗚𝗔𝗠𝗘",
        guide: { en: "{pn} @tag or reply" }
    },

    langs: {
        en: { noTag: "যারে থাপড়াবি ওরে মেনশন দে বা reply কর 🤓" }
    },

    onStart: async function ({ event, message, usersData, args, getLang, api }) {
        const uid1 = event.senderID;
        let uid2;

        // Only check mention or reply
        if (Object.keys(event.mentions).length > 0) {
            uid2 = Object.keys(event.mentions)[0];
        } else if (event.messageReply) {
            uid2 = event.messageReply.senderID;
        } else return message.reply(getLang("noTag"));

        // Get avatars
        const avatar1 = await usersData.getAvatarUrl(uid1);
        const avatar2 = await usersData.getAvatarUrl(uid2);

        try {
            // Generate slap image (you can change to another style if you have)
            const imageBuffer = await new DIG.Slap().getImage(avatar1, avatar2);

            // Save temp
            const tmpDir = path.join(__dirname, "tmp");
            if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir);
            const savePath = path.join(tmpDir, `${uid1}_${uid2}_slap.png`);
            fs.writeFileSync(savePath, imageBuffer);

            // Clean content
            const content = args.join(" ").replace(Object.keys(event.mentions)[0] || "", "").trim() || "Bópppp 😵‍💫😵";

            // Reply with image
            message.reply({ body: content, attachment: fs.createReadStream(savePath) }, async (err, info) => {
                fs.unlinkSync(savePath); // delete temp

                // Add multiple reactions
                const reactions = ["😂","😵","💥","🤕","😎"];
                for (let emoji of reactions) {
                    try { await api.sendMessage({ react: { emoji, mid: info.messageID } }, event.threadID); }
                    catch(e){ console.log(e); }
                }
            });
        } catch(e) {
            console.log("Slap generation failed:", e);
            message.reply("😓 ছবি তৈরি করা যায়নি, আবার try কর।");
        }
    }
};
