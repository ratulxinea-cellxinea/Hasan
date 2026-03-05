const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: {
    name: "help",
    version: "1.20",
    author: "Ktkhang | MahMUD",
    countDown: 5,
    role: 0,
    shortDescription: { en: "View command usage in stylish format with VIP highlight" },
    longDescription: { en: "List all commands with VIP commands highlighted separately" },
    category: "info",
    guide: { en: "help <command>" },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);

    if (!args.length) {
      const categories = {};
      let msg = `✨💫 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 𝗟𝗶𝘀𝘁 💫✨\n\n`;

      // Group commands by category (excluding VIP first)
      for (const [name, value] of commands) {
        if (value.config.role > 1) continue; // skip VIP for now
        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(value.config.name);
      }

      // Normal commands section
      for (const category of Object.keys(categories)) {
        const cmds = categories[category].commands.sort().map(c => `⚡ ${c}`).join("  ");
        msg += `╭─⭓ 🔹 ${category.toUpperCase()}\n│ ${cmds}\n╰────────────⭓\n\n`;
      }

      // VIP commands section (role > 1)
      const vipCmdsList = Array.from(commands.values())
        .filter(c => c.config.role > 1)
        .map(c => `🔥 ${c.config.name}`); // VIP commands highlighted with 🔥

      if (vipCmdsList.length) {
        const vipCmds = vipCmdsList.join("  ");
        msg += `╭─⭓ 🔐 VIP COMMANDS 🔐\n│ ${vipCmds}\n╰────────────⭓\n\n`;
        msg += `💎 Only VIP users can access these commands\n\n`;
      }

      msg += `💡 Type ${prefix}help <command> to see usage\n`;
      msg += `🛡 Admin: Mehedi Hasan`;

      try {
        const sent = await message.reply({ body: msg });
        setTimeout(() => message.unsend(sent.messageID), 80000);
      } catch (err) {
        console.error("Error sending help message:", err);
      }

    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`❌ Command "${commandName}" not found.`);
        return;
      }

      const cfg = command.config;
      const roleStr = roleTextToString(cfg.role);
      const longDesc = cfg.longDescription?.en || "No description";
      const guideBody = cfg.guide?.en || "No guide available";
      const usage = guideBody.replace(/{he}/g, prefix).replace(/{lp}/g, cfg.name);

      const detailedMsg = `
╭─⭓ 🎀 ${cfg.name.toUpperCase()}
│ 📃 Aliases: ${cfg.aliases?.join(", ") || "None"}
├── INFO
│ 📝 Description: ${longDesc}
│ 👑 Admin: Mehedi Hasan
│ 📚 Guide: ${usage}
├── Usage
│ ⭐ Version: ${cfg.version || "1.0"}
│ 🔐 Role: ${roleStr}
╰────────────⭓
      `;

      try {
        const sent = await message.reply(detailedMsg);
        setTimeout(() => message.unsend(sent.messageID), 80000);
      } catch (err) {
        console.error("Error sending command info:", err);
      }
    }
  },
};

function roleTextToString(roleNum) {
  switch (roleNum) {
    case 0: return "0 (All users)";
    case 1: return "1 (Group admins)";
    case 2: return "2 (VIP / Bot admins)";
    default: return "Unknown role";
  }
}
