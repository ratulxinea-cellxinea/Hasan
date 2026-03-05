const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "vip",
    version: "4.1",
    author: "Hasan",
    countDown: 5,
    role: 2,
    description: "VIP System with auto-expire",
    category: "owner",
    guide: {
      en:
`vip add [uid/@tag/reply] [time]
vip remove [uid]
vip list
vip check @user

Time format: 30d = 30 days, 12h = 12 hours, 30m = 30 minutes`
    }
  },

  onStart: async function ({ api, args, event, usersData }) {

    const { threadID, messageID } = event;
    const action = args[0];

    if (!config.vipUser)
      config.vipUser = {};

    // REMOVE EXPIRED VIPs
    const now = Date.now();
    for (const uid in config.vipUser) {
      if (config.vipUser[uid] <= now) {
        delete config.vipUser[uid];
      }
    }
    writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

    // NAME FIX
    async function getName(uid) {
      try {
        let name = await usersData.getName(uid);
        if (!name) name = "Unknown User";
        return name;
      } catch {
        return "Unknown User";
      }
    }

    // NO ACTION -> MENU
    if (!action) {
      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 VIP SYSTEM 👑

vip add [uid/@tag/reply] [time]
vip remove [uid]
vip list
vip check @user

Example:
vip add 1000xxxxx 12h`,
        threadID,
        messageID
      );
    }

    // ADD VIP
    if (action === "add") {
      let uid =
        Object.keys(event.mentions)[0] ||
        event.messageReply?.senderID ||
        args[1];

      if (!uid)
        return api.sendMessage("UID / Tag dao", threadID, messageID);

      let timeArg = args[2] || "30d"; // default 30 days
      let expire = Date.now();

      const match = timeArg.match(/^(\d+)(d|h|m)$/i);
      if (!match)
        return api.sendMessage("Time format wrong! Use 30d / 12h / 45m", threadID, messageID);

      const value = parseInt(match[1]);
      const unit = match[2].toLowerCase();

      if (unit === "d") expire += value * 86400000;
      if (unit === "h") expire += value * 3600000;
      if (unit === "m") expire += value * 60000;

      config.vipUser[uid] = expire;
      writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

      const name = await getName(uid);
      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 ${name}

Baby tmi ekon theke VIP user 😘
⏳ VIP Time: ${timeArg}`,
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

        if (msLeft <= 0) continue; // skip expired

        let days = Math.floor(msLeft / 86400000);
        let hours = Math.floor((msLeft % 86400000) / 3600000);
        let minutes = Math.floor((msLeft % 3600000) / 60000);

        msg += `${i}. ${name}\nUID: ${uid}\n⏳ ${days}d ${hours}h ${minutes}m left\n\n`;
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
