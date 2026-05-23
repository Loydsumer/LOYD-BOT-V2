'use strict'

const fetch = require('node-fetch')

let handler = async (m, { text, usedPrefix, command }) => {

  if (!text) {
    return m.reply(`❗ اكتب سؤالك بعد الأمر\n📌 مثال:\n*${usedPrefix + command} كيفك؟*`)
  }

  try {

    let url = `https://www.emam-api.web.id/home/sections/Ai/api/Ai/CustomPrompt?q=${encodeURIComponent(text)}`

    let res = await fetch(url)

    let json = await res.json()

    if (!json.status || !json.data) {
      return m.reply('❌ الذكاء الاصطناعي ما رجّع رد.')
    }

    await m.reply(`${json.data}`)

  } catch (e) {

    m.reply(`❌ صار خطأ:\n${e.message}`)

  }

}

handler.help = ['أوامر الذكاء الاصطناعي مثال .بوت']
handler.tags = ['ai']
handler.command = ['بوت', 'ai', 'ذكاء', 'gpt']
handler.limit = true

module.exports = handler
