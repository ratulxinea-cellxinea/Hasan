const axios = require("axios");

const mahmud = [
"baby","bby","babu","bbu","jan","bot","জান","জানু","বেবি","wifey","hinata"
];

const baseApiUrl = async () => {
const base = await axios.get("https://raw.githubusercontent.com/mahmudx7/HINATA/main/baseApiUrl.json");
return base.data.mahmud;
};

module.exports = {
config:{
name:"hinata",
aliases:["baby","bby","bbu","jan","janu","wifey","bot"],
version:"1.8",
author:"MahMUD",
countDown:2,
role:0,
description:"Chat with Hinata AI",
category:"chat"
},

onChat: async function ({ api, event, commandName }) {

const message = event.body?.toLowerCase() || "";

if (
event.type !== "message_reply" &&
mahmud.some(word => message.startsWith(word)) &&
!message.startsWith("baby teach") &&
!message.startsWith("bby teach") &&
!message.startsWith("jan teach") &&
!message.startsWith("janu teach") &&
!message.startsWith("bot teach") &&
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

const msgParts = message.trim().split(/\s+/);

if (msgParts.length === 1 && event.attachments.length === 0) {

const randomReplies=[
"babu khuda lagse🥺",
"Hop beda😾,Boss বল boss😼",
"আমাকে ডাকলে ,আমি কিন্তূ কিস করে দেবো😘",
"গোলাপ ফুল এর জায়গায় আমি দিলাম তোমায় মেসেজ",
"বলো কি বলবা, সবার সামনে বলবা নাকি?🤭",
"𝗜 𝗹𝗼𝘃𝗲 𝘆𝗼𝐮😘",
"𝗕𝗯𝘆 𝗯𝗼𝗹𝗹𝗮 𝗽𝗮𝗽 𝗵𝗼𝗶𝗯𝗼 😒",
"𝗕𝗲𝘀𝗵𝗶 𝗱𝗮𝗸𝗹𝗲 𝗮𝗺𝗺𝘂 𝗯𝗼𝗸𝗮 𝗱𝗲𝗯𝗮 🥺",
"𝙏𝙪𝙢𝙖𝙧 𝙜𝙛 𝙣𝙖𝙞, 𝙩𝙖𝙮 𝙖𝙢𝙠 𝙙𝙖𝙠𝙨𝙤? 😂",
"আমাকে ডেকো না,আমি ব্যাস্ত আসি🙆🏻‍♀",
"আমার সোনার বাংলা, তারপরে লাইন কি? 🙈",
"🍺 এই নাও জুস খাও!",
"হটাৎ আমাকে মনে পড়লো 🙄",
"𝗔𝘀𝘀𝗮𝗹𝗮𝗺𝘂𝗹𝗮𝗶𝗸𝘂𝗺 🐤",
"খাওয়া দাওয়া করসো 🙄",
"এত কাছেও এসো না,প্রেম এ পরে যাবো তো 🙈",
"𝗛𝗲𝘆 𝗛𝗮𝗻𝗱𝘀𝗼𝗺𝗲 😁",
"আরে Bolo আমার জান, কেমন আসো? 😚",
"একটা BF খুঁজে দাও 😿",
"আমাকে না দেকে একটু পড়তেও বসতে তো পারো 🥺",
"তোর বিয়ে হয় নি 𝗕𝗯𝘆 হইলো কিভাবে🙄",
"চৌধুরী সাহেব আমি গরিব হতে পারি😾",
"আমি অন্যের জিনিসের সাথে কথা বলি না😏",
"দেখা হলে কাঠগোলাপ দিও🤗",
"আগে একটা গান বলো ☹",
"বার বার ডাকলে মাথা গরম হয় 😑",
"আজকে আমার মন ভালো নেই 🙉",
"আমি হাজারো মশার Crush😓",
"মন সুন্দর বানাও মুখের জন্য Snapchat আছেই 🌚"
];

const reply=randomReplies[Math.floor(Math.random()*randomReplies.length)];

return api.sendMessage(reply,event.threadID,(err,info)=>{
if(!err)global.GoatBot.onReply.set(info.messageID,{commandName,author:event.senderID});
},event.messageID);

}else{

let userText=message;

for(const p of mahmud){
if(message.startsWith(p)){
userText=message.substring(p.length).trim();
break;
}
}

try{
const baseUrl=await baseApiUrl();
const res=await axios.post(`${baseUrl}/api/hinata`,{
text:userText,
style:3,
attachments:event.attachments
});

return api.sendMessage(res.data.message,event.threadID,(err,info)=>{
if(!err)global.GoatBot.onReply.set(info.messageID,{commandName,author:event.senderID});
},event.messageID);

}catch(e){console.error(e);}
}

}
}
};
