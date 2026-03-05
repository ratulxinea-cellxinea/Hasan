const { config } = global.GoatBot;
const { writeFileSync } = require("fs-extra");

module.exports = {
  config: {
    name: "vip",
    version: "4.0",
    author: "Hasan",
    countDown: 5,
    role: 2,
    description: "VIP System",
    category: "owner",
    guide: {
      en:
`vip add [uid/@tag/reply] [days]
vip remove [uid]
vip list
vip check`
    }
  },

  onStart: async function ({ api, args, event, usersData }) {

    const { threadID, messageID } = event;
    const action = args[0];

    if (!config.vipUser)
      config.vipUser = {};

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

    // MENU
    if (!action) {

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 VIP SYSTEM 👑

vip add [uid/@tag] [days]
vip remove [uid]
vip list
vip check @user

Example:
vip add 1000xxxxx 7`,
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

      let days = parseInt(args[2]) || 30;

      if (!uid)
        return api.sendMessage("UID / Tag dao", threadID, messageID);

      const expire = Date.now() + days * 86400000;

      config.vipUser[uid] = expire;

      writeFileSync(global.client.dirConfig, JSON.stringify(config, null, 2));

      const name = await getName(uid);

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 ${name}

Baby tmi ekon theke VIP user 😘
⏳ VIP Time: ${days} days`,
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

        const daysLeft = Math.floor(
          (config.vipUser[uid] - Date.now()) / 86400000
        );

        msg += `${i}. ${name}\nUID: ${uid}\n⏳ ${daysLeft} days left\n\n`;

        i++;
      }

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(msg, threadID, messageID);
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

      const daysLeft = Math.floor(
        (config.vipUser[uid] - Date.now()) / 86400000
      );

      api.setMessageReaction("👑", messageID, () => {}, true);

      return api.sendMessage(
`👑 ${name}
⏳ VIP Remaining: ${daysLeft} days`,
        threadID,
        messageID
      );
    }
  }
};
