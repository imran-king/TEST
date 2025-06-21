const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');

cmd({
    pattern: "test",
    alias: ["testing"],
    desc: "Button Testing for Shaban-MD",
    category: "main",
    react: "📟",
    filename: __filename
},
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Get system info
        const platform = "Heroku Platform"; // Fixed deployment platform
        const release = os.release(); // OS version
        const cpuModel = os.cpus()[0].model; // CPU info
        const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2); // Total RAM in MB
        const usedMem = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2); // Used RAM in MB

        // Stylish and detailed system status message
        const status = `╭───❰ 𝑺𝑯𝑨𝑩𝑨-𝑴𝑫 ❱───➤
┃ ✨ 𝗨𝗽𝘁𝗶𝗺𝗲: *${runtime(process.uptime())}*
┃ 💾 𝗥𝗮𝗺 𝗨𝘀𝗮𝗴𝗲: *${usedMem}MB / ${totalMem}MB*
┃ 🧑‍💻 𝗗𝗲𝗽𝗹𝗼𝘆𝗲𝗱 𝗢𝗻: *${platform}*
┃ 🔧 𝗖𝗣𝗨: *${cpuModel}*
┃ 👨‍💻 𝗢𝘄𝗻𝗲𝗿: *𝗠𝗿 𝗦𝗵𝗮𝗯𝗮𝗻*
┃ 🧬 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: *𝟯.𝟬.𝟬 𝗕𝗘𝗧𝗔*
╰───────────────────────➤
💥 𝗣𝗼𝘄𝗲𝗿𝗲𝗗 𝗕𝗬: 𝗠𝗿 𝗦𝗵𝗮𝗯𝗮𝗻`;

        // Create buttons
        const buttons = [
            {buttonId: `${prefix}ping`, buttonText: {displayText: '🏓 Ping'}, type: 1},
            {buttonId: `${prefix}uptime`, buttonText: {displayText: '⏱ Uptime'}, type: 1}
        ];
        
        const buttonMessage = {
            text: status,
            footer: "Tap buttons below for more info",
            buttons: buttons,
            headerType: 1,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                externalAdReply: {
                    title: "SHABAN-MD Status",
                    body: "Powered by Mr Shaban",
                    thumbnail: await (await fetch('https://files.catbox.moe/tasodv.jpg')).buffer(),
                    mediaType: 1,
                    mediaUrl: '',
                    sourceUrl: 'https://github.com/MRSHABAN40/SHABAN-MD'
                }
            }
        };

        await conn.sendMessage(from, buttonMessage, { quoted: mek });

    } catch (e) {
        console.error("Error in alive command:", e);
        reply(`🚨 *An error occurred:* ${e.message}`);
    }
});
