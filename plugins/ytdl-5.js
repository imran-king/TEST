const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 
const converter = require('../data/play-converter');
const fetch = require('node-fetch');



cmd({
    pattern: "play5",
    alias: ["yta5", "play5"],
    react: "🎵",
    desc: "Download high quality YouTube audio",
    category: "media",
    use: "<song name>",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("Please provide a song name\nExample: .play2 Tum Hi Ho");

        // Step 1: Search YouTube
        await conn.sendMessage(from, { text: "🔍 Searching for your song..." }, { quoted: mek });
        const yt = await ytsearch(q);
        if (!yt?.results?.length) return reply("❌ No results found. Try a different search term.");

        const vid = yt.results[0];

        const caption =
`*YT AUDIO DOWNLOADER*
╭━━❐━⪼
┇๏ *Title*    –  ${vid.title}
┇๏ *Duration* –  ${vid.timestamp}
┇๏ *Views*    –  ${vid.views}
┇๏ *Author*   –  ${vid.author.name}
╰━━❑━⪼
> *Downloading Audio File ♡*`;

        // Step 2: Send video info with thumbnail
        await conn.sendMessage(from, {
            image: { url: vid.thumbnail },
            caption
        }, { quoted: mek });

        // Step 3: Fetch audio URL
        const apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/song?search=${encodeURIComponent(vid.url)}`;
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (!data?.status || !data?.data?.downloadURL) {
            return reply("❌ Failed to fetch audio. Try again later.");
        }

        // Step 4: Download audio buffer
        const audioRes = await fetch(data.data.downloadURL);
        const audioBuffer = await audioRes.buffer();

        // Step 5: Convert to MP3 using toAudio
        let convertedAudio;
        try {
            convertedAudio = await converter.toAudio(audioBuffer, 'mp4');
        } catch (err) {
            console.error('Audio conversion failed:', err);
            return reply("❌ Audio conversion failed. Please try another song.");
        }

        // Step 6: Send converted audio
        await conn.sendMessage(from, {
            audio: convertedAudio,
            mimetype: 'audio/mpeg',
            ptt: false,
            fileName: `${vid.title}.mp3`.replace(/[^\w\s.-]/gi, '')
        }, { quoted: mek });

        // Step 7: React success
        await conn.sendMessage(from, { react: { text: "✅", key: mek.key } });

    } catch (error) {
        console.error('Play2 command error:', error);
        reply("⚠️ An unexpected error occurred. Please try again.");
        await conn.sendMessage(from, { react: { text: "❌", key: mek.key } });
    }
});