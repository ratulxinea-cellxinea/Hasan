const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "vip",
    version: "5.0",
    author: "Hasan + Fix",
    countDown: 5,
    role: 2,
    description: "VIP System with auto-expire",
    category: "owner",
    guide: {
      en: `vip add [uid/@tag/reply] [time]
vip remove [uid]
vip list
vip check @user

Time format:
1m = 1 minute
1h = 1 hour
1d = 1 day`
    }
  },

  onStart: async function ({ api, args, event, usersData }) {

    const { threadID, messageID } = event;
    const action = args[0];

    if (!config.vipUser)
      config.vipUser = {};

    const now = Date.now();

    async function getName(uid) {
      try {
        return await usersData.getName(uid);
      } catch {
        return "User";
      }
    }

    // REMOVE EXPIRED VIP
    for (const uid in config.vipUser) {
      if (config.vipUser[uid] <= now) {

        const name = await getName(uid);

        api.sendMessage(
`╭━━━〔 👑 VIP EXPIRED 〕━━━╮
┃
┃ 💔 Bby ${name}
┃ Tmi ar VIP user nai 😿
┃
┃ ⏳ Tmr VIP time ses hoye gese
┃
┃ 🔐 Owner k bolo abar VIP dite
┃
╰━━━━━━━━━━━━━━━━━━╯`,
          threadID
        );

        delete config.vipUser[uid];
      }
    }

    writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

    if (!action) {

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 VIP SYSTEM 👑

vip add @user 1m
vip add @user 1h
vip add @user 1d

vip remove @user
vip list
vip check @user`,
        threadID,
        messageID
      );
    }

    // ADD VIP
    if (action === "add") {

      let uid;
      let timeArg;

      if (Object.keys(event.mentions).length > 0) {
        uid = Object.keys(event.mentions)[0];
        timeArg = args[1];
      }

      else if (event.messageReply) {
        uid = event.messageReply.senderID;
        timeArg = args[1];
      }

      else {
        uid = args[1];
        timeArg = args[2];
      }

      if (!uid)
        return api.sendMessage("User dao", threadID, messageID);

      if (!timeArg)
        return api.sendMessage("Time dao (1m / 1h / 1d)", threadID, messageID);

      let expire = Date.now();

      const match = timeArg.match(/^(\d+)(m|h|d)$/i);

      if (!match)
        return api.sendMessage("Wrong time format\nExample: 1m / 1h / 1d", threadID, messageID);

      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      if (unit === "m") expire += value * 60000;
      if (unit === "h") expire += value * 3600000;
      if (unit === "d") expire += value * 86400000;

      config.vipUser[uid] = expire;

      writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

      const name = await getName(uid);

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`╭━━━〔 👑 VIP ACTIVATED 〕━━━╮
┃
┃ 💖 Bby ${name}
┃ Tmi ekon VIP user 😘
┃
┃ ⏳ VIP Time: ${timeArg}
┃
┃ 🔓 VIP command unlock hoye gese
┃
╰━━━━━━━━━━━━━━━━━━╯`,
        threadID,
        messageID
      );
    }

    // REMOVE VIP
    if (action === "remove") {

      let uid =
        Object.keys(event.mentions)[0] ||
        event.messageReply?.senderID ||
        args[1];

      if (!config.vipUser[uid])
        return api.sendMessage("User VIP na", threadID, messageID);

      delete config.vipUser[uid];

      writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage("🚫 VIP Removed", threadID, messageID);
    }

    // VIP LIST
    if (action === "list") {

      let msg = "👑 VIP USER LIST 👑\n\n";
      let i = 1;

      for (const uid in config.vipUser) {

        const name = await getName(uid);

        const msLeft = config.vipUser[uid] - Date.now();

        if (msLeft <= 0) continue;

        let days = Math.floor(msLeft / 86400000);
        let hours = Math.floor((msLeft % 86400000) / 3600000);
        let minutes = Math.floor((msLeft % 3600000) / 60000);

        msg += `${i}. ${name}
UID: ${uid}
⏳ ${days}d ${hours}h ${minutes}m left\n\n`;

        i++;
      }

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(msg || "No VIP users", threadID, messageID);
    }

    // CHECK VIP
    if (action === "check") {

      let uid =
        Object.keys(event.mentions)[0] ||
        event.messageReply?.senderID ||
        event.senderID;

      const name = await getName(uid);

      if (!config.vipUser[uid])
        return api.sendMessage(`${name} VIP na`, threadID, messageID);

      const msLeft = config.vipUser[uid] - Date.now();

      if (msLeft <= 0)
        return api.sendMessage(`${name} VIP na`, threadID, messageID);

      let days = Math.floor(msLeft / 86400000);
      let hours = Math.floor((msLeft % 86400000) / 3600000);
      let minutes = Math.floor((msLeft % 3600000) / 60000);

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 ${name}
⏳ VIP Remaining: ${days}d ${hours}h ${minutes}m`,
        threadID,
        messageID
      );
    }
  }
};
