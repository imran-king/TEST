const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdown", "fbvideo"],
    desc: "Download Facebook video",
    category: "downloader",
    react: "📘",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {
        if (!q) return reply("📌 Please provide a valid Facebook video link.");
        if (!q.includes("facebook.com") && !q.includes("fb.watch"))
            return reply("❌ Invalid Facebook video URL.");

        reply("🎞️ Downloading Facebook video...");

        const apiUrl = `https://delirius-apiofc.vercel.app/download/facebook?url=${encodeURIComponent(q)}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log("🔥 API RESPONSE:", data); // Debug log

        if (!data || !data.urls || !Array.isArray(data.urls)) {
            return reply("❌ Failed to fetch video data from API.");
        }

        const hdVideo = data.urls.find(x => x.hd)?.hd;
        const sdVideo = data.urls.find(x => x.sd)?.sd;
        const videoUrl = hdVideo || sdVideo;

        if (!videoUrl) return reply("❌ Video not available in HD or SD format.");

        const caption = `🎬 *Facebook Video*\n\n📄 *Title:* ${data.title || "No Title"}\n` +
                        `📥 *Quality:* ${hdVideo ? "HD" : "SD"}\n🔗 *Source:* ${q}`;

        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("❌ Facebook Downloader Error:", e.response?.data || e.message || e);
        const errorMsg = e.response?.data?.message || e.message || "Unknown error occurred.";
        reply(`⚠️ An error occurred while processing your request:\n${errorMsg}`);
    }
});