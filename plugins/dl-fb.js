const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fb",
    alias: ["facebook"],
    desc: "Download Facebook videos (HD only)",
    category: "downloader",
    react: "📺",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("📌 Please provide a Facebook video link.");
        if (!q.includes("facebook.com")) return reply("❌ Invalid Facebook link.");

        reply("⏳ Downloading HD video, please wait...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/facebook?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.urls || !data.urls.length) {
            return reply("❌ Failed to fetch video. Try another link.");
        }

        const hdUrl = data.urls[0].hd || data.urls[0].sd;
        if (!hdUrl) return reply("❌ HD video not available.");

        const caption = `🎬 *Facebook Video Downloader*\n\n📌 *Title:* ${data.title || "N/A"}\n\n🤖 *Powered by SHABAN-MD*`;

        await conn.sendMessage(from, {
            video: { url: hdUrl },
            caption: caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("Facebook downloader error:", e);
        reply(`❌ An error occurred: ${e.message}`);
    }
});