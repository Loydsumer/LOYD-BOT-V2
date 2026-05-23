import yts from 'yt-search'
import pkg from '@whiskeysockets/baileys'
const { generateWAMessageFromContent, proto, prepareWAMessageMedia } = pkg

let handler = async (m, { conn, text }) => {
  if (!text) return conn.sendMessage(
    m.chat,
    { text: '❌ اكتب كلمة للبحث عن فيديوهات يوتيوب.\nمثال:\n.يوتيوب اغاني حماس' },
    { quoted: m }
  )

  try {
    let search = await yts(text)
    if (!search || !search.videos || !search.videos.length)
      return conn.sendMessage(m.chat, { text: "❌ لم أجد أي نتائج." }, { quoted: m })

    let results = search.videos.slice(0, 10) // أول 10 نتائج

    // تكوين عناصر القائمة
    let rows = results.map((v, i) => ({
      header: `❀⃘⃛͜ ${i + 1}. ${v.title.substring(0, 40)}`,
      title: v.author.name,
      description: `⏱ ${v.timestamp} | 👁 ${v.views.toLocaleString()}`,
      id: `.تفاصيل ${v.url}`
    }))

    // تجهيز غلاف أول نتيجة
    const media = await prepareWAMessageMedia(
      { image: { url: results[0].thumbnail } },
      { upload: conn.waUploadToServer }
    )

    const msg = generateWAMessageFromContent(
      m.chat,
      {
        viewOnceMessage: {
          message: {
            interactiveMessage: proto.Message.InteractiveMessage.create({
              body: proto.Message.InteractiveMessage.Body.create({
                text: `❀⃘⃛͜ ۪۪۪݃𓉘᳟ี ⃞̸͢𑁃 ̚𓉝᳟ี  
🔍 نتائج البحث لـ: *${text}*\nاختر فيديو من القائمة 👇`
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({ text: "🎬 YouTube Search" }),
              header: proto.Message.InteractiveMessage.Header.create({
                title: "❀⃘⃛͜ نتائج البحث",
                hasMediaAttachment: true,
                ...(media.imageMessage ? { imageMessage: media.imageMessage } : {})
              }),
              nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                buttons: [
                  {
                    name: "single_select",
                    buttonParamsJson: JSON.stringify({
                      title: "📂 عرض النتائج",
                      sections: [
                        {
                          title: "🎬 نتائج البحث",
                          rows
                        }
                      ]
                    })
                  }
                ]
              })
            })
          }
        }
      },
      { userJid: m.sender }
    )

    await conn.relayMessage(m.chat, msg.message, { messageId: msg.key.id })

  } catch (e) {
    console.error(e)
    conn.sendMessage(m.chat, { text: "❌ حصل خطأ أثناء البحث." }, { quoted: m })
  }
}

handler.command = /^يوتيوب$/i
export default handler