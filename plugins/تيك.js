import axios from 'axios'

const {
  proto,
  generateWAMessageFromContent,
  generateWAMessageContent
} = (await import('@whiskeysockets/baileys')).default

const handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    return conn.reply(m.chat, `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n\n⚠️ *يـا بـاحث، جـافـيـير يـحتاج لـرابط تـيك تـوك أو كـلمة بـحث.*\n📍 *مـثال:* ${usedPrefix + command} One Piece\n\n~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~`, m)
  }

  const isUrl = /(?:https?:\/\/)?(?:www\.|vm\.|vt\.|t\.)?tiktok\.com\/[^\s&]+/i.test(text)

  async function createVideoMessage(url) {
    const { videoMessage } = await generateWAMessageContent(
      { video: { url } },
      { upload: conn.waUploadToServer }
    )
    return videoMessage
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
  }

  try {
    await m.react('🔍')

    // الحالة الأولى: إذا كان المدخل رابطاً (تحميل مباشر)
    if (isUrl) {
      const res = await axios.get(`https://www.tikwm.com/api/?url=${encodeURIComponent(text)}&hd=1`)
      const data = res.data?.data
      
      if (!data?.play && !data?.images) {
        await m.react('❌')
        return conn.reply(m.chat, '❌ *الـرابط غـير صـالح أو لا يـحتوي عـلى مـحتوى قـابل لـلتحميل.*', m)
      }

      const { title, duration, author, created_at, type, images, music, play } = data
      const caption = `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n       📥 *تـحـمـيل 𝐓𝐢𝐤𝐓𝐨𝐤 : 𝐉𝐀𝐕𝐈𝐄𝐑*\n~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n\n📝 *الـعنوان:* ${title || 'بـدون عـنوان'}\n👤 *الـمؤلف:* ${author?.nickname || 'غـير مـحدد'}\n⏳ *الـمدة:* ${duration ?? '0'} ثـانية\n\nبـواسطة: *𝐉𝐀𝐕𝐈𝐄𝐑 𝐁𝐎𝐓*\nالـمطور: *𝐋𝐎𝐘𝐃* 🫡\n~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~`

      // إذا كان المنشور عبارة عن صور (Slideshow)
      if (type === 'image' && Array.isArray(images) && images.length) {
        for (let i = 0; i < Math.min(images.length, 10); i++) {
          await conn.sendMessage(m.chat, { image: { url: images[i] }, caption: i === 0 ? caption : undefined }, { quoted: m })
        }
        if (music) {
          await conn.sendMessage(m.chat, { audio: { url: music }, mimetype: 'audio/mp4', fileName: 'tiktok_audio.mp4' }, { quoted: m })
        }
        await m.react('✅')
        return
      }

      // إذا كان فيديو عادي
      if (play) {
        await conn.sendMessage(m.chat, { video: { url: play }, caption }, { quoted: m })
        await m.react('✅')
        return
      }
    }

    // الحالة الثانية: البحث (عبر الكلمات المفتاحية)
    await conn.reply(m.chat, `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n\n📡 *جـاري تـفتيش مـستودعات TikTok... تـحت إشـراف 𝐋𝐎𝐘𝐃.*\n\n~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~`, m)

    const form = new URLSearchParams()
    form.append('keywords', text)
    form.append('count', '20')
    form.append('cursor', '0')
    form.append('HD', '1')

    const res = await axios({
      method: 'POST',
      url: 'https://tikwm.com/api/feed/search',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'Cookie': 'current_language=en',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Mobile Safari/537.36'
      },
      data: form.toString()
    })

    let results = res.data?.data?.videos?.filter(v => v.play) || []
    if (results.length < 2) {
      await m.react('❌')
      return conn.reply(m.chat, '❌ *لـم يـتم الـعثور عـلى نـتائج كـافـية لـهذا الـبحث.*', m)
    }

    shuffleArray(results)
    const topResults = results.slice(0, 7)

    const cards = []
    for (const v of topResults) {
      cards.push({
        body: proto.Message.InteractiveMessage.Body.fromObject({
          text: `📝 *الـعنوان:* ${v.title || 'فـيديو تـيك تـوك'}\n👤 *الـمؤلف:* ${v.author?.nickname || 'مـجهول'}\n⏳ *الـمدة:* ${v.duration} ثـانية`
        }),
        footer: proto.Message.InteractiveMessage.Footer.fromObject({
          text: '𝐉𝐀𝐕𝐈𝐄𝐑 𝐁𝐎𝐓 — نـظام الـبحث'
        }),
        header: proto.Message.InteractiveMessage.Header.fromObject({
          title: `𝐓𝐢𝐤𝐓𝐨𝐤 𝐑𝐞𝐬𝐮𝐥𝐭`,
          hasMediaAttachment: true,
          videoMessage: await createVideoMessage(v.play)
        }),
        nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
          buttons: []
        })
      })
    }

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n       🎬 *رادار الـتـيك تـوك : 𝐉𝐀𝐕𝐈𝐄𝐑*\n~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n\n✅ *نـتائج الـبحث عـن:* [ ${text} ]\n\nبـواسطة: *𝐉𝐀𝐕𝐈𝐄𝐑 𝐁𝐎𝐓*\nالـمطور: *𝐋𝐎𝐘𝐃* 🫡`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: 'اسـحب لـلـيمين لـرؤية الـفـيديوهات ⮕'
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards
              }),
              contextInfo: {
                externalAdReply: {
                  showAdAttribution: true,
                  title: `𝐉𝐀𝐕𝐈𝐄𝐑 𝐁𝐎𝐓 : TikTok Search 📡`,
                  body: `𝐏𝐨𝐰𝐞𝐫𝐞𝐝 𝐛𝐲 𝐋𝐎𝐘𝐃`,
                  thumbnailUrl: 'https://files.catbox.moe/04oxwn.jpg',
                  sourceUrl: 'https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L'
                }
              }
            })
          }
        }
      },
      { quoted: m }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })
    await m.react('✅')

  } catch (e) {
    console.error(e)
    await m.react('❌')
    await conn.reply(m.chat, `⚠️ *حـدث خـطأ أثـناء الـتواصل مـع رادار الـتيك تـوك.*`, m)
  }
}

handler.help = ['tiktoks <بحث|رابط>']
handler.tags = ['search']
handler.command = ['tiktoks', 'tiktoksearch', 'ttss','تيكتوك']
handler.group = true

export default handler