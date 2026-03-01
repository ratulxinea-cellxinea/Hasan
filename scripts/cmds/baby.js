const axios = require("axios");

const mahmud = [
"baby","bby","babu","bbu","jan","bot","জান","জানু","বেবি","wifey","hinata"
];

// 🔥 SAFE BASE URL
const baseApiUrl = async () => {
try{
const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
return base.data.mahmud;
}catch(e){
return "https://hinataai.up.railway.app"; // fallback API
}
};

module.exports = {

config:{
name:"hinata",
aliases:["baby","bby","bbu","jan","janu","wifey","bot"],
version:"2.1",
author:"MahMUD",
countDown:2,
role:0,
description:"Hinata AI",
category:"chat"
},

// ================= MAIN =================

onStart: async function ({ api,event,args }) {

try{

const baseUrl = await baseApiUrl();

// ===== TEACH =====
if(args[0] && args[0].toLowerCase() === "teach"){

const input = args.slice(1).join(" ");
const [trigger,...resArr] = input.split(" - ");
const responses = resArr.join(" - ");

if(!trigger || !responses)
return api.sendMessage("❌ use: baby teach hi - hello",event.threadID,event.messageID);

await axios.post(`${baseUrl}/api/jan/teach`,{
trigger,
responses,
userID:event.senderID
});

return api.sendMessage(`✅ Teach Saved\n${trigger} ➜ ${responses}`,event.threadID,event.messageID);
}

// ===== NORMAL CHAT =====
if(!args[0]) return;

const res = await axios.post(`${baseUrl}/api/hinata`,{
text:args.join(" "),
style:3
});

return api.sendMessage(res.data.message,event.threadID,event.messageID);

}catch(e){
return api.sendMessage("⚠ API Error: "+e.message,event.threadID,event.messageID);
}

},

// ================= AUTO =================

onChat: async function ({ api,event }) {

const message = event.body?.toLowerCase() || "";

if(
event.type !== "message_reply" &&
mahmud.some(w=>message.startsWith(w)) &&
!message.startsWith("baby teach") &&
!message.startsWith("bby teach") &&
!message.startsWith("jan teach") &&
!message.startsWith("hinata teach")
){

const reacts = [
"🪽","😘","😽","😻","😼","😹","💖","💘","💝","💗",
"💓","💞","💕","💟","🔥","✨","🌸","🌺","🦋","🍒",
"🍓","🍭","🥰","😚","😙","🤍","💜","💙","🩷","🫶"
];

api.setMessageReaction(
reacts[Math.floor(Math.random()*reacts.length)],
event.messageID,
()=>{},
true
);

let userText = message;

for(const p of mahmud){
if(message.startsWith(p)){
userText = message.substring(p.length).trim();
break;
}
}

try{

const baseUrl = await baseApiUrl();

const res = await axios.post(`${baseUrl}/api/hinata`,{
text:userText,
style:3
});

return api.sendMessage(res.data.message,event.threadID,event.messageID);

}catch(e){
return api.sendMessage("⚠ Chat API Down",event.threadID,event.messageID);
}

}

}

};
