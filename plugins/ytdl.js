const config = require('../config');
const { cmd } = require('../command');
const { ytsearch, ytmp3, ytmp4 } = require('@dark-yasiya/yt-dl.js'); 

// video

cmd({ 
    pattern: "video", 
    alias: ["video", "video"], 
    react: "🎥", 
    desc: "Download Youtube song", 
    category: "main", 
    use: '.song < Yt url or Name >', 
    filename: __filename 
}, async (conn, mek, m, { from, prefix, quoted, q, reply }) => { 
    try { 
        if (!q) return await reply("Please provide a YouTube URL or song name.");
        
        const yt = await ytsearch(q);
        if (yt.results.length < 1) return reply("No results found!");
        
        let yts = yt.results[0];  
        let apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(yts.url)}`;
        
        let response = await fetch(apiUrl);
        let data = await response.json();
        
        if (data.status !== 200 || !data.success || !data.result.download_url) {
            return reply("Failed to fetch the video. Please try again later.");
        }
        
        let ytmsg = `*🎞️ SHABAN-MD YT VIDEO DOWNLOADER 🎞️*
        
╭━━❐━⪼
┇๏ *Title* -  ${yts.title}
┇๏ *Duration* - ${yts.timestamp}
┇๏ *Views* -  ${yts.views}
┇๏ *Author* -  ${yts.author.name}
╰━━❑━⪼`;

        // Send video details
        await conn.sendMessage(from, { image: { url: data.result.thumbnail || '' }, caption: ytmsg }, { quoted: mek });
        
        // Send video file
        await conn.sendMessage(from, { video: { url: data.result.download_url }, mimetype: "video/mp4" }, { quoted: mek });
        
        // Send document file (optional)
        await conn.sendMessage(from, { 
            document: { url: data.result.download_url }, 
            mimetype: "video/mp4", 
            fileName: `${data.result.title}.mp4`, 
            caption: `> *${yts.title}*\n> *© Pᴏᴡᴇʀᴇᴅ Bʏ Sʜᴀʙᴀɴ-Mᴅ ♡*`
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("An error occurred. Please try again later.");
    }
});  
       
// play

cmd({ 
     pattern: "play", 
     alias: ["play", "play"], 
     react: "🎶", 
     desc: "Download Youtube song",
     category: "main", 
     use: '.song < Yt url or Name >', 
     filename: __filename }, 
     async (conn, mek, m, { from, prefix, quoted, q, reply }) => 
     
     { try { if (!q) return await reply("Please provide a YouTube URL or song name.");

const yt = await ytsearch(q);
    if (yt.results.length < 1) return reply("No results found!");
    
    let yts = yt.results[0];  
    let apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(yts.url)}`;
    
    let response = await fetch(apiUrl);
    let data = await response.json();
    
    if (data.status !== 200 || !data.success || !data.result.downloadUrl) {
        return reply("Failed to fetch the audio. Please try again later.");
    }
    
    let ytmsg = `*🎧 SHABAN-MD YT MP3 DOWNLOADER 🎧*
    
╭━━❐━⪼
┇๏ *Tital* -  ${yts.title}
┇๏ *Duration* - ${yts.timestamp}
┇๏ *Views* -  ${yts.views}
┇๏ *Author* -  ${yts.author.name} 
╰━━❑━⪼
> *© Pᴏᴡᴇʀᴇᴅ Bʏ Sʜᴀʙᴀɴ-Mᴅ ♡*`;



// Send song details
    await conn.sendMessage(from, { image: { url: data.result.image || '' }, caption: ytmsg }, { quoted: mek });
    
    // Send audio file
    await conn.sendMessage(from, { audio: { url: data.result.downloadUrl }, mimetype: "audio/mpeg" }, { quoted: mek });
    
    // Send document file
    await conn.sendMessage(from, { 
        document: { url: data.result.downloadUrl }, 
        mimetype: "audio/mpeg", 
        fileName: `${data.result.title}.mp3`, 
        caption: `> *© Pᴏᴡᴇʀᴇᴅ Bʏ Sʜᴀʙᴀɴ-Mᴅ ♡*`
    }, { quoted: mek });

} catch (e) {
    console.log(e);
    reply("An error occurred. Please try again later.");
}

});

// Mp3 Url

cmd({ 
  pattern: "mp3", 
  alias: ["mp3"], 
  react: "🎙️", 
  desc: "Download YouTube song",
  category: "main", 
  use: '.play <Yt url or song name>', 
  filename: __filename 
}, 
async (conn, mek, m, { from, prefix, quoted, q, reply }) => {

  try {
    if (!q) return await reply("Please provide a YouTube URL or song name.");

    const yt = await ytsearch(q);
    if (yt.results.length < 1) return reply("No results found!");

    let yts = yt.results[0];
    let apiUrl = `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(yts.url)}`;

    let response = await fetch(apiUrl);
    let res = await response.json();

    if (!res.status || !res.result.success) {
      return reply("Failed to fetch audio. Try again later.");
    }

    const song = res.result.data;

    let ytmsg = `*🎧 SHABAN-MD YT MP3 DOWNLOADER 🎧*
    
╭━━❐━⪼
┇๏ *Title* - ${song.title}
┇๏ *Duration* - ${song.duration} sec
┇๏ *Format* - ${song.format}
┇๏ *Quality* - ${song.quality}kbps
╰━━❑━⪼

_Reply with:_  
*1* to receive as 🎵 *Audio*  
*2* to receive as 📄 *Document*

> *© Pᴏᴡᴇʀᴇᴅ Bʏ Sʜᴀʙᴀɴ-Mᴅ ♡*`;

    // Send thumbnail & prompt for reply
    await conn.sendMessage(from, {
      image: { url: song.thumbnail },
      caption: ytmsg
    }, { quoted: mek });

    // Await user response
    const replyFilter = (msg) =>
      msg.key.fromMe === false &&
      msg.message &&
      (msg.message.conversation === '1' || msg.message.conversation === '2');

    const collected = await conn.awaitMessages(from, replyFilter, {
      max: 1,
      time: 60_000,
      errors: ['timeout']
    }).catch(() => {});

    if (!collected || collected.length === 0) return reply("No response received. Cancelling...");

    const userReply = collected[0].message.conversation.trim();

    if (userReply === '1') {
      await conn.sendMessage(from, {
        audio: { url: song.downloadUrl },
        mimetype: "audio/mpeg"
      }, { quoted: mek });

    } else if (userReply === '2') {
      await conn.sendMessage(from, {
        document: { url: song.downloadUrl },
        mimetype: "audio/mpeg",
        fileName: `${song.title}.mp3`,
        caption: `> *© Pᴏᴡᴇʀᴇᴅ Bʏ Sʜᴀʙᴀɴ-Mᴅ ♡*`
      }, { quoted: mek });

    } else {
      reply("Invalid choice. Please reply with 1 or 2.");
    }

  } catch (e) {
    console.log(e);
    reply("An error occurred. Please try again later.");
  }

});

// Mp4 url

cmd({ 
    pattern: "mp4", 
    alias: ["mp4"], 
    react: "🎞️", 
    desc: "Download YouTube video", 
    category: "main", 
    use: '.video <YouTube url or name>', 
    filename: __filename 
}, 
async (conn, mek, m, { from, q, reply }) => { 
    try { 
        if (!q) return reply("📽️ Please provide a YouTube URL or video name.");

        // Step 1: Search YouTube if a name is provided
        const yt = await ytsearch(q);
        if (!yt.results || yt.results.length < 1) return reply("❌ No results found!");

        let video = yt.results[0];
        let videoUrl = video.url;

        // Step 2: Call new video downloader API
        let apiUrl = `https://api-aswin-sparky.koyeb.app/api/downloader/ytv?url=${encodeURIComponent(videoUrl)}`;
        let response = await fetch(apiUrl);
        let json = await response.json();

        if (!json.status || !json.data || !json.data.downloadURL) {
            return reply("❌ Failed to fetch the video. Please try again.");
        }

        // Step 3: Prepare caption
        let caption = `*📽️ SHABAN-MD YT VIDEO DOWNLOADER 📽️*

╭━━❐━⪼
┇๏ *Title* - ${video.title}
┇๏ *Duration* - ${video.timestamp}
┇๏ *Views* - ${video.views}
┇๏ *Author* - ${video.author.name}
╰━━❑━⪼`;

        // Step 4: Send details thumbnail
        await conn.sendMessage(from, {
            image: { url: video.thumbnail },
            caption
        }, { quoted: mek });

        // Step 5: Send playable video
        await conn.sendMessage(from, {
            video: { url: json.data.downloadURL },
            mimetype: "video/mp4"
        }, { quoted: mek });

        // Step 6: Send downloadable video document
        await conn.sendMessage(from, {
            document: { url: json.data.downloadURL },
            mimetype: "video/mp4",
            fileName: `${json.data.title || video.title}.mp4`,
            caption: `> *${video.title}*\n> *© Powered By Shaban-MD ♡*`
        }, { quoted: mek });

    } catch (e) {
        console.error(e);
        reply("⚠️ An unexpected error occurred. Please try again.");
    }
});