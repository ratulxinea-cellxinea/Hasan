const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
config: {
name: "autodl",
version: "3.0",
author: "Dipto + Edit Mehedi Hasan",
countDown: 0,
role: 0,
shortDescription: "Auto Download Video",
longDescription: "Download video automatically from link",
category: "MEDIA"
},

onStart: async function () {},

onChat: async function ({ api, event }) {

if (!event.body) return;

const link = event.body.trim();

if (!link.match(/(tiktok|facebook|fb.watch|instagram|youtu|twitter|x.com)/i)) return;

try {

api.setMessageReaction("⏳", event.messageID, () => {}, true);

const apiUrl = `https://api.ryzendesu.vip/api/downloader/alldl?url=${encodeURIComponent(link)}`;

const res = await axios.get(apiUrl);

if (!res.data || !res.data.url) {
return api.sendMessage("❌ | Video download failed!", event.threadID, event.messageID);
}

const videoUrl = res.data.url;

const filePath = path.join(__dirname, "cache", `autodl_${Date.now()}.mp4`);

const video = await axios({
url: videoUrl,
method: "GET",
responseType: "arraybuffer"
});

fs.writeFileSync(filePath, Buffer.from(video.data));

api.setMessageReaction("✅", event.messageID, () => {}, true);

api.sendMessage({
body: `
╭━〔 ⚡ AUTO DOWNLOAD ⚡ 〕━╮
┃
┃ 👑 ADMIN : Mehedi Hasan
┃ 📥 Video Downloaded
┃
┃ 🔗 Link Supported
┃
╰━━━━━━━━━━━━━━━━━━╯
`,
attachment: fs.createReadStream(filePath)
},
event.threadID,
() => fs.unlinkSync(filePath),
event.messageID
);

} catch (e) {

api.setMessageReaction("❌", event.messageID, () => {}, true);

api.sendMessage("❌ | Download error!", event.threadID, event.messageID);

}

}
};
