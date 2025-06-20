const { cmd } = require('../command');
const axios = require('axios');
const { proto } = require('@whiskeysockets/baileys');

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdown", "fbvideo"],
    desc: "Download Facebook video with quality options",
    category: "downloader",
    react: "📘",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply, command }) => {
    try {
        if (!q) return reply("📌 Please provide a valid Facebook video link.");
        if (!q.includes("facebook.com") && !q.includes("fb.watch"))
            return reply("❌ Invalid Facebook video URL.");

        reply("⏳ Fetching Facebook video...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/facebook?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.urls || !Array.isArray(data.urls)) {
            return reply("❌ Failed to fetch video data.");
        }

        const hdVideo = data.urls.find(x => x.hd)?.hd;
        const sdVideo = data.urls.find(x => x.sd)?.sd;

        if (!hdVideo && !sdVideo) return reply("❌ No HD or SD video found.");

        const buttons = [];

        if (hdVideo) buttons.push({ buttonId: `.fbhd ${hdVideo}`, buttonText: { displayText: "🎥 HD Video" }, type: 1 });
        if (sdVideo) buttons.push({ buttonId: `.fbsd ${sdVideo}`, buttonText: { displayText: "📽️ SD Video" }, type: 1 });

        const buttonMessage = {
            text: `🎬 *Facebook Video Found*\n\n📄 *Title:* ${data.title || "No Title"}\n\nChoose a quality:`,
            footer: "SHABAN-MD Facebook Downloader",
            buttons,
            headerType: 1
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.error("❌ Facebook Downloader Error:", e);
        reply(`⚠️ An error occurred:\n${e.message}`);
    }
});
// Handle HD button
cmd({
    pattern: "fbhd",
    react: "🎞️",
    hidden: true,
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    const url = args[0];
    if (!url) return reply("❌ HD video URL not found.");
    await conn.sendMessage(m.chat, {
        video: { url },
        caption: "🎥 *HD Facebook Video*",
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });
});

// Handle SD button
cmd({
    pattern: "fbsd",
    react: "🎞️",
    hidden: true,
    filename: __filename
},
async (conn, mek, m, { args, reply }) => {
    const url = args[0];
    if (!url) return reply("❌ SD video URL not found.");
    await conn.sendMessage(m.chat, {
        video: { url },
        caption: "📽️ *SD Facebook Video*",
        contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: mek });
});