onChat: async function ({ api, event, commandName }) {
    const message = event.body?.toLowerCase() || "";
    if (event.type !== "message_reply" && mahmud.some(word => message.startsWith(word))) {
        // 30+ random reactions
        const reactList = [
            "🪽","😾","😼","🤭","😘","🥺","😒","🙄","😚","😑",
            "😋","😿","🐤","😁","🙈","🙆🏻‍♀️","🥲","😂","😰","😏",
            "😫","😌","🤗","😓","🫣","🌚","😠","😡","🤬","👀",
            "💔","🔥","💢","👿","😤","💫","⚡","🖤","💥","🧨"
        ];
        const randomReact = reactList[Math.floor(Math.random() * reactList.length)];
        api.setMessageReaction(randomReact, event.messageID, () => {}, true);

        const msgParts = message.trim().split(/\s+/);
        if (msgParts.length === 1 && event.attachments.length === 0) {
            const randomReplies = [
                "babu khuda lagse🥺",
                "Hop beda😾,Boss বল boss😼",
                "আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘 ",
                "naw amr boss k message daw m.me/mahmud0x7",
                "গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
                "বলো কি বলবা, সবার সামনে বলবা নাকি?🤭🤏",
                "𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮__😘😘",
                "এটায় দেখার বাকি সিলো_🙂🙂🙂",
                "𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒😒",
                "𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 𝘁𝗼__🥺",
                "বেশি bby Bbby করলে leave নিবো কিন্তু 😒😒",
                "__বেশি বেবি বললে কামুর দিমু 🤭🤭",
                "𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂😂😂",
                "আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
                "𝗕𝗯𝘆 বললে চাকরি থাকবে না",
                "𝗕𝗯𝘆 𝗕𝗯𝘆 না করে আমার বস মানে, MahMUD ,MahMUD ও তো করতে পারো😑?",
                "আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
                "🍺 এই নাও জুস খাও..!𝗕𝗯𝘆 বলতে বলতে হাপায় গেছো না 🥲",
                "হটাৎ আমাকে মনে পড়লো 🙄", "𝗕𝗯𝘆 বলে অসম্মান করচ্ছিছ,😰😿",
                "𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤🐤",
                "আমি তোমার সিনিয়র আপু ওকে 😼সম্মান দেও🙁",
                "খাওয়া দাওয়া করসো 🙄",
                "এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
                "আরে আমি মজা করার mood এ নাই😒",
                "𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 বলো 😁😁",
                "আরে Bolo আমার জান, কেমন আসো? 😚",
                "একটা BF খুঁজে দাও 😿",
                "oi mama ar dakis na pilis 😿",
                "amr JaNu lagbe,Tumi ki single aso?",
                "আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺🥺",
                "তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে,,🙄",
                "আজ একটা ফোন নাই বলে রিপ্লাই দিতে পারলাম না_🙄",
                "চৌধুরী সাহেব আমি গরিব হতে পারি😾🤭 -কিন্তু বড়লোক না🥹 😫",
                "আমি অন্যের জিনিসের সাথে কথা বলি না__😏ওকে",
                "ভুলে জাও আমাকে 😞😞", "দেখা হলে কাঠগোলাপ দিও..🤗",
                "শুনবো না😼 তুমি আমাকে প্রেম করাই দাও নি🥺 পচা তুমি🥺",
                "আগে একটা গান বলো, ☹ নাহলে কথা বলবো না 🥺",
                "বলো কি করতে পারি তোমার জন্য 😚",
                "কথা দেও আমাকে পটাবা...!! 😌",
                "বার বার Disturb করেছিস কোনো, আমার জানু এর সাথে ব্যাস্ত আসি 😋",
                "বার বার ডাকলে মাথা গরম হয় কিন্তু 😑😒",
                "Bolo Babu, তুমি কি আমাকে ভালোবাসো? 🙈",
                "আজকে আমার mন ভালো নেই 🙉",
                "আমি হাজারো মশার Crush😓",
                "ছেলেদের প্রতি আমার এক আকাশ পরিমান শরম🥹🫣",
                "__ফ্রী ফে'সবুক চালাই কা'রন ছেলেদের মুখ দেখা হারাম 😌",
                "মন সুন্দর বানাও মুখের জন্য তো 'Snapchat' আছেই! 🌚"
            ];
            const reply = randomReplies[Math.floor(Math.random() * randomReplies.length)];
            return api.sendMessage(reply, event.threadID, (err, info) => {
                if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
            }, event.messageID);
        } else {
            let userText = message;
            for (const p of mahmud) { if (message.startsWith(p)) { userText = message.substring(p.length).trim(); break; } }
            try {
                const baseUrl = await baseApiUrl();
                const res = await axios.post(`${baseUrl}/api/hinata`, { text: userText, style: 3, attachments: event.attachments });
                return api.sendMessage(res.data.message, event.threadID, (err, info) => {
                    if (!err) global.GoatBot.onReply.set(info.messageID, { commandName, author: event.senderID });
                }, event.messageID);
            } catch (e) { console.error(e); }
        }
    }
}
