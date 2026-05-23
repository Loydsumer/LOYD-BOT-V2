
;(() => {
  const _log  = console.log.bind(console)
  const _err  = console.error.bind(console)
  const _warn = console.warn.bind(console)
  const SKIP = [
    'Bad MAC', 'Session error', 'Failed to decrypt',
    'Closing open session', 'Closing session:', '_chains',
    'registrationId', 'currentRatchet', 'ephemeralKeyPair',
    'indexInfo', 'baseKey', 'rootKey', 'privKey', 'pubKey',
    'previousCounter', 'remoteIdentityKey', 'SessionEntry',
    'rate-overlimit', 'rate overlimit', 'statusCode: 500',
    'isBoom', 'isServer', 'Internal Server Error',
    'pendingPreKey', 'preKeyId', 'signedKeyId',
    'baseKeyType', 'chainKey', 'chainType', 'messageKeys'
  ]
  const shouldSkip = (...a) => a.some(x => SKIP.some(s => String(x).includes(s)))
  console.log   = (...a) => { if (!shouldSkip(...a)) _log(...a) }
  console.error = (...a) => { if (!shouldSkip(...a)) _err(...a) }
  console.warn  = (...a) => { if (!shouldSkip(...a)) _warn(...a) }
})()

// ============================================================

'use strict'

// ─── DEPENDENCIES ────────────────────────────────────────────

const {

  default: makeWASocket,

  useMultiFileAuthState,

  DisconnectReason,

  makeInMemoryStore,

  fetchLatestWaWebVersion,

  Browsers,

  generateForwardMessageContent,

  generateWAMessageFromContent,

  downloadContentFromMessage,

  prepareWAMessageMedia,

  InteractiveMessage,

  jidDecode,

  proto,

  delay

} = require('@whiskeysockets/baileys')

const axios    = require('axios')

const chalk    = require('chalk')

const fs       = require('fs')

const path     = require('path')

const pino     = require('pino')

const moment   = require('moment-timezone')

const fetch    = require('node-fetch')

const FormData = require('form-data')

const ffmpeg   = require('fluent-ffmpeg')

const ffmpeg1  = require('fluent-ffmpeg')

const FileType = require('file-type')

const webp     = require('node-webpmux')

const PhoneNumber = require('awesome-phonenumber')

const { fromBuffer } = require('file-type')

const { exec, execSync, spawn } = require('child_process')

const { tmpdir } = require('os')

const { proto: protoWA, getContentType } = require('@whiskeysockets/baileys')

const util = require('util')

const pack = require('./package.json')

// ─── PRINT MESSAGE ───────────────────────────────────────────

function _getTime() {
  return new Date().toLocaleString('en-GB', {
    hour: '2-digit', minute: '2-digit', second: '2-digit',
    hour12: false, timeZone: 'Asia/Riyadh',
  })
}

function _formatSize(bytes) {
  if (!bytes || bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + (units[i] || 'B')
}

function _formatMtype(m) {
  if (!m.mtype) return 'Unknown'
  let type = m.mtype.replace(/message$/i, '').replace(/^./, v => v.toUpperCase())
  if (type === 'Audio' && m.msg?.ptt)                    type = 'PTT 🎙️'
  else if (type === 'Audio')                             type = 'Audio 🎵'
  else if (type === 'Image')                             type = 'Image 🖼️'
  else if (type === 'Video')                             type = 'Video 🎬'
  else if (type === 'Sticker')                           type = 'Sticker 🎴'
  else if (type === 'Document')                          type = 'Document 📄' + (m.msg?.fileName ? ` (${m.msg.fileName})` : '')
  else if (type === 'ExtendedText' || type === 'Conversation') type = 'Text 💬'
  return type
}

function _getChatInfo(m, chatName) {
  const jid = m.chat || ''
  if (jid.endsWith('@newsletter')) {
    const id = jid.replace('@newsletter', '')
    return { label: chalk.hex('#FF6B35')('📡 Channel'), detail: chalk.hex('#FF6B35')(chatName || 'Channel'), id: chalk.gray(`[${id}@newsletter]`) }
  } else if (jid.endsWith('@g.us')) {
    const id = jid.replace('@g.us', '')
    return { label: chalk.hex('#2ECC71')('👥 Group'),   detail: chalk.hex('#2ECC71')(chatName || 'Group'),   id: chalk.gray(`[${id}@g.us]`) }
  } else if (jid === 'status@broadcast') {
    return { label: chalk.hex('#9B59B6')('📢 Status'),  detail: chalk.hex('#9B59B6')('Status Broadcast'),    id: chalk.gray('[status@broadcast]') }
  } else {
    const id = jid.replace('@s.whatsapp.net', '')
    return { label: chalk.hex('#3498DB')('💬 Private'), detail: chalk.hex('#3498DB')(chatName || 'Private'), id: chalk.gray(`[+${id}]`) }
  }
}

async function printMessage(m, conn = { user: {} }) {
  try {
    if (m.key?.fromMe) return
    if (m.sender === conn.user?.jid) return

    const time = _getTime()

    let senderName = ''
    try { senderName = await conn.getName(m.sender) } catch {}
    const senderNum   = m.sender?.replace('@s.whatsapp.net', '') || ''
    const senderLabel = senderName ? `+${senderNum} ~${senderName}` : `+${senderNum}`

    let chatName = ''
    try { chatName = await conn.getName(m.chat) } catch {}
    const chatInfo = _getChatInfo(m, chatName)

    const rawSize = m.msg?.vcard?.length
      || m.msg?.fileLength?.low || m.msg?.fileLength
      || m.msg?.axolotlSenderKeyDistributionMessage?.length
      || m.text?.length || 0
    const size  = _formatSize(rawSize)
    const mtype = _formatMtype(m)

    const botNum  = conn.user?.jid?.replace('@s.whatsapp.net', '') || ''
    const botName = conn.user?.name || '𝐋𝐎𝐘𝐃'

    let userDb = null
    try { userDb = global.db?.data?.users?.[m.sender] } catch {}

    const line = chalk.hex('#9B59B6')('━'.repeat(48))

    let output = `\n${line}\n`
    output += `${chalk.bgHex('#9B59B6').white.bold(' 𝐋𝐎𝐘𝐃 𝐁𝐎𝐓 ')} ${chalk.gray(time)}  ${chalk.hex('#9B59B6')(`+${botNum} ~${botName}`)}\n\n`
    output += `${chalk.hex('#F1C40F')('👤 Sender   :')} ${chalk.white(senderLabel)}\n`
    output += `${chalk.hex('#F1C40F')('💬 Type     :')} ${chalk.white(mtype)}  ${chalk.gray(`[${size}]`)}\n`
    output += `${chalk.hex('#F1C40F')('📍 Chat     :')} ${chatInfo.label} ${chatInfo.detail}\n`
    output += `${chalk.hex('#F1C40F')('🔑 ID       :')} ${chatInfo.id}\n`

    if (userDb) {
      output += `${chalk.hex('#F1C40F')('📊 Level    :')} ${chalk.white(`Lv.${userDb.level || 0}  |  🪙 ${userDb.coin ?? 0}  |  ⭐ ${userDb.exp ?? 0} XP`)}\n`
    }

    if (typeof m.text === 'string' && m.text.trim()) {
      const isCmd   = m.isCommand
      const prefix2 = isCmd ? '⚡ Command  :' : '📝 Text     :'
      const colored = isCmd ? chalk.yellow.bold(m.text.trim()) : chalk.white(m.text.trim())
      output += `${chalk.hex('#F1C40F')(prefix2)} ${colored}\n`
    }

    if (m.messageStubType) {
      output += `${chalk.gray(`🔔 Event    : ${m.messageStubType}`)}\n`
    }

    if (m.messageStubParameters?.length) {
      for (const jid of m.messageStubParameters) {
        try {
          const decoded = conn.decodeJid(jid)
          const name    = await conn.getName(decoded).catch(() => '')
          const num     = decoded.replace('@s.whatsapp.net', '')
          output += chalk.gray(`   └ ${name ? `+${num} ~${name}` : `+${num}`}`) + '\n'
        } catch {}
      }
    }

    if (/audio/i.test(m.mtype) && m.msg?.seconds) {
      const d = m.msg.seconds
      output += chalk.gray(`⏱️  Duration : ${Math.floor(d/60).toString().padStart(2,'0')}:${(d%60).toString().padStart(2,'0')}`) + '\n'
    }

    if (/document/i.test(m.mtype)) {
      output += chalk.gray(`📎 File      : ${m.msg?.fileName || m.msg?.displayName || 'Document'}`) + '\n'
    }

    output += line
    console.log(output)
  } catch (e) {
    console.error(chalk.red('[printMessage error]'), e.message)
  }
}

// ─── PERFORMANCE CACHES ──────────────────────────────────────
const _pluginCache = new Map()        // file → { mtime, plugin }
let _ownerCache = null, _ownerCacheTime = 0
const _OWNER_CACHE_TTL = 10000        // 10 ثواني
let _waVersion = null                 // cache لـ WA version

// ─── SETTINGS (global) ───────────────────────────────────────

global.pairing      = false            // false = pairing code | true = scan QR

global.PaiCode      = "LOYDBOT1"

// ─── LOGIN SETTINGS ───────────────────────────────────────────
// اختر طريقة واحدة فقط للتسجيل — اترك الثانية فارغة
// Choose ONE method only — leave the other empty
//
// 🔑 Pairing Code: ضع رقمك مع كود الدولة بدون +
//    Put your number with country code (no +)
//    مثال / Example: "966501234567"
//
// 📷 QR Code: ضع رقمك أو أي قيمة مثل "true"
//    Put your number or any value like "true"
//    مثال / Example: "966501234567"  أو / or  "true"
//
global.codeNumber   = ""              // 🔑 Pairing Code
global.qrNumber     = ""              // 📷 QR Code

global.sessionName  = "loydsession"

global.botname      = "𝐋𝐎𝐘𝐃"

global.ownername    = "مطور البوت"

// OwnerCompat: يشتغل كـ string مع البلاغن القديمة وكـ array مع الجديدة
;(() => {
  const num  = "4917672339436"
  const name = global.ownername || "Owner"
  class OwnerCompat extends Array {
    constructor() { super(); this.push([num, name, true]); this._s = num }
    toString()                       { return this._s }
    valueOf()                        { return this._s }
    [Symbol.toPrimitive]()          { return this._s }
    replace(r, v)                    { return this._s.replace(r, v) }
    split(d)                         { return this._s.split(d) }
    includes(v)                      { return Array.prototype.includes.call(this, v) || this._s.includes(v) }
  }
  global.owner = new OwnerCompat()
})()

global.botNumber    = "4917672339436"

global.suittag      = "4917672339436"  // رقم المالك لاستقبال الاقتراحات والبلاغات

global.version      = pack.version

global.packname     = "𝐋 𝐎 𝐘 𝐃"

global.author       = "..."

global.wm           = "𝐋𝐎𝐘𝐃"

global.chjid        = "120363402804601196@newsletter"

global.gcjid        = "120363402804601196@newsletter"

global.idch         = "120363402804601196@newsletter"

global.saluranname  = "𝐋𝐎𝐘𝐃"

global.filename     = "🐦 حد جيعان مثلي؟"

global.sch          = "https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L"

global.sgc          = ""

global.thumb        = "https://files.catbox.moe/lgrhj3.jpg"

// قنوات النشر — كل رسائل البوت تجيء منها
global.newsletters = [
  { newsletterJid: '120363402804601196@newsletter', newsletterName: '𓏲ׄ 𝐋𝐎𝐘𝐃⏤͟͟͞͞🪻 ָ ۫𝐒𝐎𝐋𝐎 ࣪𖥔¹' },
  { newsletterJid: '120363377374711810@newsletter', newsletterName: '𓏲ׄ 𝐋𝐎𝐘𝐃⏤͟͟͞͞🪻 ָ ۫𝐒𝐎𝐋𝐎 ࣪𖥔²' }
]

global.comando = ''

// رسائل رفض الصلاحيات
global.dfail = async (type, m, conn) => {
  const decoration = `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~`
  const commandName = global.comando || 'هذا الأمر'
  const javierImg   = 'https://files.catbox.moe/lgrhj3.jpg'

  const data = {
    rowner:   { text: `👑 *وصـول مـقيد*\nالأمر [ *${commandName}* ] مـخصص فـقط لمالك البوت`,            media: 'https://files.catbox.moe/qd57lb.mp4' },
    owner:    { text: `🛡️ *لـلـمطورين فـقط*\nالأمر [ *${commandName}* ] متاح فقط لا اصحاب المطور`,       media: 'https://files.catbox.moe/qd57lb.mp4' },
    mods:     { text: `⚔️ *لـلـمراقبين فـقط*\nالأمر [ *${commandName}* ] مـخصص لـلمراقبين الـمفوضين.`,             media: 'https://files.catbox.moe/qd57lb.mp4' },
    premium:  { text: `💎 *نـظام بـريميوم*\nيـجب أن تـكون مـشتركاً بـريميوم لـاستخدام [ *${commandName}* ].`,      media: 'https://files.catbox.moe/qd57lb.mp4' },
    group:    { text: `🏰 *لـلـمجموعات فـقط*\nالأمر [ *${commandName}* ] يـعمل حـصرياً داخـل مـجموعات الـشات.`,   media: 'https://files.catbox.moe/qd57lb.mp4' },
    private:  { text: `👤 *لـلـدردشة الـخاصة فـقط*\nاسـتخدم [ *${commandName}* ] فـي الـخاص لـضمان الـسرية.`,    media: 'https://files.catbox.moe/qd57lb.mp4' },
    admin:    { text: `🎖️ *لـلـمـشـرفـين فـقـط*\nيـجب أن تـكون مـشرفاً لـتنفيذ [ *${commandName}* ].`,            media: 'https://files.catbox.moe/qd57lb.mp4' },
    botAdmin: { text: `🤖 *بـوت أدمن مـطلوب*\nيـجب تـرقية الـبوت لـمـشرف لـتنفيذ [ *${commandName}* ].`,         media: 'https://files.catbox.moe/qd57lb.mp4' },
    restrict: { text: `🚫 *مـيزة مـعطلة*\nهـذه الـميزة مـغلقة حـالياً مـن قـبل الإدارة الـعليا.`,                 media: 'https://files.catbox.moe/qd57lb.mp4' }
  }[type]

  if (!data) return

  const nl = global.newsletters[Math.floor(Math.random() * global.newsletters.length)]
  const finalMsg = `${decoration}\n\n${data.text}\n\nبـواسطة: *𝐋𝐎𝐘𝐃 𝐁𝐎𝐓*\n${decoration}`

  const messageOptions = {
    caption: finalMsg,
    gifPlayback: data.media.endsWith('.mp4'),
    contextInfo: {
      forwardingScore: 999, isForwarded: true,
      forwardedNewsletterMessageInfo: { newsletterJid: nl.newsletterJid, newsletterName: nl.newsletterName, serverMessageId: Math.floor(Math.random() * 9999) + 1 },
      externalAdReply: {
        showAdAttribution: true,
        title: `𝐋𝐎𝐘𝐃 𝐁𝐎𝐓 : تـنبيه الـصلاحيات ⚠️`,
        body: `تـم حـظر الـإجراء بـواسطة 𝐋𝐎𝐘𝐃`,
        thumbnailUrl: javierImg,
        sourceUrl: 'https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L'
      }
    }
  }

  if (data.media.endsWith('.mp4')) {
    messageOptions.video = { url: data.media }
  } else {
    messageOptions.image = { url: data.media }
  }

  await conn.sendMessage(m.chat, messageOptions, { quoted: m }).catch(() => {})
  await m.react('✖️').catch(() => {})
}

global.delayPushkontak = 3000

global.chtesti      = "120363402804601196@newsletter"


// ─── LIB/SETTINGS.JSON ───────────────────────────────────────

// مكان settings.json الاصلي كان في lib/ — الحين نقرأها من نفس المجلد

let libSettings = { public: true }

// ─── MYFUNC ──────────────────────────────────────────────────

function randomNomor(min, max = null) {

  if (max !== null) {

    min = Math.ceil(min); max = Math.floor(max)

    return Math.floor(Math.random() * (max - min + 1)) + min

  } else { return Math.floor(Math.random() * min) + 1 }

}

function toRupiah(angka) {

  var saldo = '', angkarev = angka.toString().split('').reverse().join('')

  for (var i = 0; i < angkarev.length; i++)

    if (i % 3 == 0) saldo += angkarev.substr(i, 3) + '.'

  return '' + saldo.split('', saldo.length - 1).reverse().join('')

}

function toDolar(rupiah) {

  var kurs = 15000, dolar = rupiah / kurs, saldo = dolar.toFixed(2)

  var parts = saldo.split('.')

  var integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  return '$' + integerPart + '.' + parts[1]

}

function formatDuration(ms) {

  const seconds = Math.floor(ms / 1000) % 60

  const minutes = Math.floor(ms / (1000 * 60)) % 60

  const hours   = Math.floor(ms / (1000 * 60 * 60)) % 24

  const days    = Math.floor(ms / (1000 * 60 * 60 * 24)) % 30

  const months  = Math.floor(ms / (1000 * 60 * 60 * 24 * 30)) % 12

  const years   = Math.floor(ms / (1000 * 60 * 60 * 24 * 365))

  return [

    years   ? `${years} tahun`   : '',

    months  ? `${months} bulan`  : '',

    days    ? `${days} hari`     : '',

    hours   ? `${hours} jam`     : '',

    minutes ? `${minutes} menit` : '',

    seconds ? `${seconds} detik` : '',

  ].filter(v => v).join(', ')

}

const FileSize = (number) => {

  var SI_POSTFIXES = ["B"," KB"," MB"," GB"," TB"," PB"," EB"]

  var tier = Math.log10(Math.abs(number)) / 3 | 0

  if(tier == 0) return number

  var postfix = SI_POSTFIXES[tier], scale = Math.pow(10, tier * 3)

  var scaled = number / scale, formatted = scaled.toFixed(1) + ''

  if (/\.0$/.test(formatted)) formatted = formatted.substr(0, formatted.length - 2)

  return formatted + postfix

}

async function resize(imageUrl, width, height) {

  return new Promise(async (resolve, reject) => {

    try {

      const inputPath  = path.join(__dirname, `input_${Date.now()}.jpeg`)

      const outputPath = path.join(__dirname, `output_${Date.now()}.jpeg`)

      if (Buffer.isBuffer(imageUrl)) { fs.writeFileSync(inputPath, imageUrl) }

      else { const { data } = await axios.get(imageUrl, { responseType: 'arraybuffer' }); fs.writeFileSync(inputPath, data) }

      exec(`ffmpeg -i ${inputPath} -vf scale=${width}:${height} ${outputPath}`, (err) => {

        fs.unlinkSync(inputPath)

        if (err) return reject(err)

        try { const buffer = fs.readFileSync(outputPath); fs.unlinkSync(outputPath); resolve(buffer) }

        catch(e) { reject(e) }

      })

    } catch(e) { reject(e) }

  })

}

const nebal = (angka) => Math.floor(angka)

const parseMention = (text = '') => [...text.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net')

const getRandom = (ext) => `${Math.floor(Math.random() * 10000)}${ext}`

const getBuffer = async (url, options) => {

  try {

    options ? options : {}

    const res = await axios({ method: "get", url, headers: { 'DNT': 1, 'Upgrade-Insecure-Request': 1 }, ...options, responseType: 'arraybuffer' })

    return res.data

  } catch(err) { return err }

}

const fetchJson = async (url, options) => {

  try {

    options ? options : {}

    const res = await axios({ method: 'GET', url, headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }, ...options })

    return res.data

  } catch(err) { return err }

}

const runtime = function(seconds) {

  seconds = Number(seconds)

  var d = Math.floor(seconds / (3600*24)), h = Math.floor(seconds % (3600*24) / 3600)

  var m = Math.floor(seconds % 3600 / 60), s = Math.floor(seconds % 60)

  var dDisplay = d > 0 ? d + (d == 1 ? " Day, " : " day, ") : ""

  var hDisplay = h > 0 ? h + (h == 1 ? " Hour, " : " hour, ") : ""

  var mDisplay = m > 0 ? m + (m == 1 ? " Minute, " : " minute, ") : ""

  var sDisplay = s > 0 ? s + (s == 1 ? " Second" : " second") : ""

  return dDisplay + hDisplay + mDisplay + sDisplay

}

const clockString = (ms) => {

  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)

  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60

  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60

  return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')

}

const sleep = async (ms) => new Promise(resolve => setTimeout(resolve, ms))

const isUrl = (url) => url.match(new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/, 'gi'))

const getTime = (format, date) => {

  if (date) return moment(date).locale('id').format(format)

  else return moment.tz('Asia/Jakarta').locale('id').format(format)

}

const formatp = (bytes) => {

  const units = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']

  let i = 0

  while (bytes >= 1024 && i < units.length - 1) { bytes /= 1024; i++ }

  return `${bytes.toFixed(1)} ${units[i]}`

}

const getGroupAdmins = async(participants) => {

  let admins = []

  for (let i of participants) {

    i.admin === "superadmin" ? admins.push(i.id) : i.admin === "admin" ? admins.push(i.id) : ''

  }

  return admins || []

}

function pickRandom(list) { return list[Math.floor(Math.random() * list.length)] }

function monospace(string) { return '*`' + string + '`*' }

function randomKarakter(jumlah) {

  const huruf = 'abcdefghijklmnopqrstuvwxyz'

  let hasil = ''

  for (let i = 0; i < jumlah; i++) {

    const indexAcak = Math.floor(Math.random() * huruf.length)

    let hurufAcak = huruf[indexAcak]

    hurufAcak = Math.random() < 0.5 ? hurufAcak.toUpperCase() : hurufAcak

    hasil += hurufAcak

  }

  return hasil

}

const totalFitur = () => {

  try {

    let total = 0

    const pluginDir = './plugins'

    if (fs.existsSync(pluginDir)) {

      const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'))

      for (const file of files) {

        const src = fs.readFileSync(path.join(pluginDir, file)).toString()

        // عد أوامر switch/case (الأسلوب القديم)
        total += (src.match(/case '/g) || []).length

        // عد أوامر handler.command (الأسلوب الجديد)
        const handlerMatches = src.match(/handler\.command\s*=\s*\[([^\]]*)\]/g) || []
        for (const match of handlerMatches) {
          total += (match.match(/'/g) || []).length / 2
        }

      }

    }

    return total

  } catch(e) { return 0 }

}

function getTypeMessage(message) {

  const type = Object.keys(message)

  var restype = (!['senderKeyDistributionMessage','messageContextInfo'].includes(type[0]) && type[0]) ||

    (type.length >= 3 && type[1] !== 'messageContextInfo' && type[1]) ||

    type[type.length - 1] || Object.keys(message)[0]

  return restype

}

const smsg = (VranCe, m, store) => {

  if (!m) return m

  let M = proto.WebMessageInfo

  var m = M.fromObject(m)

  if (m.key) {

    m.id = m.key.id

    m.isBaileys = (m.id.endsWith("WBSF")) ||

      (m.id.startsWith('AKIRA')) || (m.id.startsWith("VRDN")) ||

      (m.id.startsWith('B1EY') && m.id.length === 20) ||

      (m.id.startsWith('BAE5') && m.id.length === 16) ||

      (m.id.startsWith('3EB0') && (m.id.length === 22 || m.id.length === 40)) ||

      (m.id.startsWith('C4DF') && m.id.length === 18)

    m.chat    = m.key.remoteJid

    m.fromMe  = m.key.fromMe

    m.isGroup = m.chat.endsWith('@g.us')

    m.sender  = VranCe.decodeJid(m.fromMe && VranCe.user.id || m.participant || m.key.participant || m.chat || '')

    if (m.isGroup) m.participant = VranCe.decodeJid(m.key.participant) || ''

  }

  if (m.message) {

    m.mtype = getTypeMessage(m.message)

    m.msg   = (m.mtype == 'viewOnceMessage' ? m.message[m.mtype].message[getTypeMessage(m.message[m.mtype].message)] : m.message[m.mtype])

    m.body  = (m.mtype === 'interactiveResponseMessage')

      ? JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson)?.id

      : m.message?.conversation ||

        m.message?.imageMessage?.caption ||

        m.message?.videoMessage?.caption ||

        m.message?.extendedTextMessage?.text ||

        m.message?.buttonsResponseMessage?.selectedButtonId ||

        m.message?.listResponseMessage?.singleSelectReply?.selectedRowId ||

        m.message?.templateButtonReplyMessage?.selectedId || ''

    m.text  = m.quoted

      ? m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.title || ''

      : m.body

    m.fileName    = (m.mtype === 'documentMessage' && m.msg.fileName) || null

    m.mentionedJid = m.msg.contextInfo ? m.msg.contextInfo.mentionedJid : []

    if (m.mtype == "viewOnceMessageV2" || m.msg.url) m.download = () => VranCe.downloadMediaMessage(m)

    m.copy = () => smsg(VranCe, M.fromObject(M.toObject(m)))

    m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => VranCe.copyNForward(jid, m, forceForward, options)

    m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text)

      ? VranCe.sendMedia(chatId, text, 'file', '', m, { ...options })

      : VranCe.sendText(chatId, text, m, { ...options })

    let quoted = m.quoted = m.msg.contextInfo ? m.msg.contextInfo.quotedMessage : null

    if (m.quoted) {

      let type = Object.keys(quoted)[0]

      m.quoted = m.quoted[type]

      if (['productMessage'].includes(type)) { type = getContentType(m.quoted); m.quoted = m.quoted[type] }

      if (typeof m.quoted === 'string') m.quoted = { text: m.quoted }

      m.quoted.mtype  = type

      m.quoted.id     = m.msg.contextInfo.stanzaId

      m.quoted.chat   = m.msg.contextInfo.remoteJid || m.chat

      m.quoted.sender = VranCe.decodeJid(m.msg.contextInfo.participant)

      m.quoted.fromMe = m.quoted.sender === (VranCe.user && VranCe.user.jid)

      m.quoted.text   = m.quoted.text || m.quoted.caption || m.quoted.conversation || m.quoted.contentText || m.quoted.title || ""

      m.quoted.fileName = (m.quoted.mtype === 'documentMessage' && m.quoted.fileName) || null

      m.quoted.mentionedJid = m.quoted.contextInfo ? m.quoted.contextInfo.mentionedJid : []

      m.quoted.download = () => VranCe.downloadMediaMessage(m.quoted)

      m.quoted.copyNForward = (jid, forceForward = false, options = {}) => VranCe.copyNForward(jid, vM, forceForward, options)

      m.getQuotedObj = m.getQuotedMessage = async () => {

        if (!m.quoted.id) return false

        let q = await store.loadMessage(m.chat, m.quoted.id, VranCe)

        return smsg(VranCe, q, store)

      }

      let vM = m.quoted.fakeObj = M.fromObject({

        key: { remoteJid: m.quoted.chat, fromMe: m.quoted.fromMe, id: m.quoted.id },

        message: quoted,

        ...(m.isGroup ? { participant: m.quoted.sender } : {})

      })

    }

  }

  m.name = VranCe.getName(m.sender)

  if (m.msg && m.msg.url) m.download = () => VranCe.downloadMediaMessage(m.msg)

  m.reply = (text, chatId = m.chat, options = {}) => Buffer.isBuffer(text)

    ? VranCe.sendMedia(chatId, text, 'file', '', m, { ...options })

    : VranCe.sendText(chatId, text, m, { ...options })

  m.react = (emoji) => VranCe.sendMessage(m.chat, { react: { text: emoji, key: m.key } })

  m.copyNForward = (jid = m.chat, forceForward = false, options = {}) => VranCe.copyNForward(jid, m, forceForward, options)

  return m

}

// ─── EXIF / STICKER ──────────────────────────────────────────

async function writeExif(media, metadata) {

  let wMedia = /webp/.test(media.mimetype) ? media.data

    : /image/.test(media.mimetype) ? await imageToWebp(media.data)

    : /video/.test(media.mimetype) ? await videoToWebp(media.data) : ""

  const tmpFileIn  = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  const tmpFileOut = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  fs.writeFileSync(tmpFileIn, wMedia)

  if (metadata.packname || metadata.author) {

    const img = new webp.Image()

    const json = { "sticker-pack-id": `https://github.com/Loydsumer`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }

    const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00])

    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")

    const exif = Buffer.concat([exifAttr, jsonBuff])

    exif.writeUIntLE(jsonBuff.length, 14, 4)

    await img.load(tmpFileIn); fs.unlinkSync(tmpFileIn)

    img.exif = exif; await img.save(tmpFileOut)

    return tmpFileOut

  }

}

async function imageToWebp(media) {

  const tmpFileOut = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  const tmpFileIn  = path.join(tmpdir(), randomNomor(1000,9999)+'.jpg')

  fs.writeFileSync(tmpFileIn, media)

  await new Promise((resolve, reject) => {

    ffmpeg1(tmpFileIn).on("error", reject).on("end", () => resolve(true))

      .addOutputOptions(["-vcodec","libwebp","-vf","scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse"])

      .toFormat('webp').save(tmpFileOut)

  })

  const buff = fs.readFileSync(tmpFileOut)

  fs.unlinkSync(tmpFileOut); fs.unlinkSync(tmpFileIn)

  return buff

}

async function imageToWebp3(media) {

  const tmpFileOut = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  const tmpFileIn  = path.join(tmpdir(), randomNomor(1000,9999)+'.jpg')

  fs.writeFileSync(tmpFileIn, media)

  await new Promise((resolve, reject) => {

    ffmpeg1(tmpFileIn).on("error", reject).on("end", () => resolve(true))

      .addOutputOptions(["-vcodec","libwebp","-vf","scale='iw':'ih',fps=15"])

      .toFormat('webp').save(tmpFileOut)

  })

  const buff = fs.readFileSync(tmpFileOut)

  fs.unlinkSync(tmpFileOut); fs.unlinkSync(tmpFileIn)

  return buff

}

async function videoToWebp(media) {

  const tmpFileOut = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  const tmpFileIn  = path.join(tmpdir(), randomNomor(1000,9999)+'.mp4')

  fs.writeFileSync(tmpFileIn, media)

  await new Promise((resolve, reject) => {

    ffmpeg1(tmpFileIn).on("error", reject).on("end", () => resolve(true))

      .addOutputOptions(["-vcodec","libwebp","-vf","scale='min(320,iw)':min'(320,ih)':force_original_aspect_ratio=decrease,fps=15, pad=320:320:-1:-1:color=white@0.0, split [a][b]; [a] palettegen=reserve_transparent=on:transparency_color=ffffff [p]; [b][p] paletteuse","-loop","0","-ss","00:00:00","-t","00:00:05","-preset","default","-an","-vsync","0"])

      .toFormat('webp').save(tmpFileOut)

  })

  const buff = fs.readFileSync(tmpFileOut)

  fs.unlinkSync(tmpFileOut); fs.unlinkSync(tmpFileIn)

  return buff

}

async function writeExifImg(media, metadata) {

  let wMedia = await imageToWebp(media)

  const tmpFileIn  = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  const tmpFileOut = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  fs.writeFileSync(tmpFileIn, wMedia)

  if (metadata.packname || metadata.author) {

    const img = new webp.Image()

    const json = { "sticker-pack-id": `https://github.com/Loydsumer`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }

    const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00])

    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")

    const exif = Buffer.concat([exifAttr, jsonBuff])

    exif.writeUIntLE(jsonBuff.length, 14, 4)

    await img.load(tmpFileIn); fs.unlinkSync(tmpFileIn)

    img.exif = exif; await img.save(tmpFileOut)

    return tmpFileOut

  }

}

async function writeExifImgAV(media, metadata) { return writeExifImg(media, metadata) }

async function writeExifVid(media, metadata) {

  let wMedia = await videoToWebp(media)

  const tmpFileIn  = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  const tmpFileOut = path.join(tmpdir(), randomNomor(1000,9999)+'.webp')

  fs.writeFileSync(tmpFileIn, wMedia)

  if (metadata.packname || metadata.author) {

    const img = new webp.Image()

    const json = { "sticker-pack-id": `https://github.com/Loydsumer`, "sticker-pack-name": metadata.packname, "sticker-pack-publisher": metadata.author, "emojis": metadata.categories ? metadata.categories : [""] }

    const exifAttr = Buffer.from([0x49,0x49,0x2A,0x00,0x08,0x00,0x00,0x00,0x01,0x00,0x41,0x57,0x07,0x00,0x00,0x00,0x00,0x00,0x16,0x00,0x00,0x00])

    const jsonBuff = Buffer.from(JSON.stringify(json), "utf-8")

    const exif = Buffer.concat([exifAttr, jsonBuff])

    exif.writeUIntLE(jsonBuff.length, 14, 4)

    await img.load(tmpFileIn); fs.unlinkSync(tmpFileIn)

    img.exif = exif; await img.save(tmpFileOut)

    return tmpFileOut

  }

}

// ─── SCRAPE ──────────────────────────────────────────────────

const api_scrape = axios.create({ baseURL: 'https://api4g.iloveimg.com' })

const CatBox = async (mediaBuffer, mimeType) => {

  const formData = new FormData()

  formData.append('reqtype', 'fileupload')

  formData.append('fileToUpload', mediaBuffer, { filename: `file.${mimeType.split('/')[1]}`, contentType: mimeType })

  try {

    const { data } = await axios.post('https://catbox.moe/user/api.php', formData, { headers: formData.getHeaders() })

    return data

  } catch(err) { throw err }

}

const pinterest = async (query) => {

  try {

    const { data } = await axios.get(`https://www.pinterest.com/resource/BaseSearchResource/get/?source_url=/search/pins/?q=${encodeURIComponent(query)}&data={"options":{"query":"${query}","scope":"pins","fields":"id,description,images"}}&_=${Date.now()}`)

    return data.resource_response.data.results.map(p => p.images?.orig?.url).filter(Boolean)

  } catch(err) { return [] }

}

const yt_search = async (query) => {

  try {

    const { data } = await axios.get(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`)

    const ids = [...data.matchAll(/\/watch\?v=([a-zA-Z0-9_-]{11})/g)].map(m => m[1])

    return [...new Set(ids)].slice(0, 10).map(id => ({ id, url: `https://www.youtube.com/watch?v=${id}` }))

  } catch(err) { return [] }

}

const tiktokSearchVideo = async (query) => {

  try {

    const { data } = await axios.get(`https://www.tiktok.com/api/search/general/full/?keyword=${encodeURIComponent(query)}&type=1`, {

      headers: { 'User-Agent': 'Mozilla/5.0' }

    })

    return data

  } catch(err) { return null }

}

// ─── WELCOME ──────────────────────────────────────────────────

async function welcomeHandler(iswel, isleft, loyd, anu) {

  try {

    const metadata   = await loyd.groupMetadata(anu.id)

    const participants = anu.participants

    const num        = participants[0]

    const groupName  = metadata.subject

    const groupDesc  = metadata.desc

    const memeg      = metadata.participants.length

    const mentionedJid = [`${num}@s.whatsapp.net`]

    let avatarUrl, ppgroup

    try { avatarUrl = await loyd.profilePictureUrl(num, 'image') }

    catch { avatarUrl = 'https://files.catbox.moe/lgrhj3.jpg' }

    try { ppgroup = await loyd.profilePictureUrl(anu.id, 'image') }

    catch { ppgroup = 'https://files.catbox.moe/lgrhj3.jpg' }

    if (anu.action == 'add' && (iswel || global.db.data.chats[anu.id]?.welcome)) {

      let full_pesan

      if (global.db.data.chats[anu.id]?.text_welcome) {

        let teks = global.db.data.chats[anu.id].text_welcome

        full_pesan = teks.replace(/@user/gi, `@${num.split('@')[0]}`).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc || '')

      } else { full_pesan = `أهلاً @${num.split('@')[0]}\nفي المجموعة: ${groupName}` }

      await loyd.sendMessage(anu.id, {

        text: full_pesan,

        contextInfo: {

          mentionedJid,

          externalAdReply: { title: `🎉 أهلاً وسهلاً!`, body: `${botname}`, thumbnailUrl: ppgroup, sourceUrl: global.sch, mediaType: 1, renderLargerThumbnail: true }

        }

      })

    }

    if (anu.action == 'remove' && (isleft || global.db.data.chats[anu.id]?.goodbye)) {

      let full_pesan

      if (global.db.data.chats[anu.id]?.text_left) {

        let teks = global.db.data.chats[anu.id].text_left

        full_pesan = teks.replace(/@user/gi, `@${num.split('@')[0]}`).replace(/@group/gi, groupName).replace(/@desc/gi, groupDesc || '')

      } else { full_pesan = `وداعاً @${num.split('@')[0]}\nمن المجموعة: ${groupName}` }

      await loyd.sendMessage(anu.id, {

        text: full_pesan,

        contextInfo: {

          mentionedJid,

          externalAdReply: { title: `👋 مع السلامة!`, body: `${botname}`, thumbnailUrl: ppgroup, sourceUrl: global.sch, mediaType: 1, renderLargerThumbnail: true }

        }

      })

    }

  } catch(err) { console.error('Error welcome handler:', err) }

}

// ─── HANDLER (bot functions attached to socket) ───────────────

async function setupHandler(loyd, store) {

  loyd.decodeJid = (jid) => {

    if (!jid) return jid

    if (/:\d+@/gi.test(jid)) {

      let decode = jidDecode(jid) || {}

      return decode.user && decode.server && decode.user + '@' + decode.server || jid

    } else return jid

  }

  loyd.ev.on('contacts.update', update => {

    for (let contact of update) {

      let id = loyd.decodeJid(contact.id)

      if (store && store.contacts) store.contacts[id] = { id, name: contact.notify }

    }

  })

  loyd.getName = (jid, withoutContact = false) => {

    let id = loyd.decodeJid(jid)

    withoutContact = loyd.withoutContact || withoutContact

    let v

    if (id.endsWith("@g.us")) return new Promise(async (resolve) => {

      v = store.contacts[id] || {}

      if (!(v.name || v.subject)) v = loyd.groupMetadata(id) || {}

      resolve(v.name || v.subject || PhoneNumber('+' + id.replace('@s.whatsapp.net', '')).getNumber('international'))

    })

    else v = id === '0@s.whatsapp.net' ? { id, name: 'WhatsApp' }

      : id === loyd.decodeJid(loyd.user.id) ? loyd.user

      : (store.contacts[id] || {})

    return (withoutContact ? '' : v.name) || v.subject || v.verifiedName || PhoneNumber('+' + jid.replace('@s.whatsapp.net', '')).getNumber('international')

  }

  loyd.setStatus = (status) => {

    loyd.query({ tag: 'iq', attrs: { to: '@s.whatsapp.net', type: 'set', xmlns: 'status' }, content: [{ tag: 'status', attrs: {}, content: Buffer.from(status, 'utf-8') }] })

    return status

  }

  loyd.public = true

  loyd.serializeM = (m) => smsg(loyd, m, store)

  // ── Newsletter injection — كل رسائل البوت تجيء من القناة ──
  const _origSend = loyd.sendMessage.bind(loyd)
  loyd.sendMessage = async (jid, content, options = {}) => {
    if (content && typeof content === 'object' && !content.react) {
      const nl = (global.newsletters || [])[Math.floor(Math.random() * (global.newsletters || [{ newsletterJid: '120363402804601196@newsletter', newsletterName: 'LOYD' }]).length)]
      const existing = content.contextInfo || {}
      if (!existing.forwardedNewsletterMessageInfo) {
        content.contextInfo = {
          ...existing,
          forwardingScore: existing.forwardingScore || 999,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: nl.newsletterJid,
            newsletterName: nl.newsletterName,
            serverMessageId: Math.floor(Math.random() * 9999) + 1
          }
        }
      }
    }
    return _origSend(jid, content, options)
  }

  loyd.getFile = async (PATH, returnAsFilename) => {

    let res, filename

    let data = Buffer.isBuffer(PATH) ? PATH

      : /^data:.*?\/.*?;base64,/i.test(PATH) ? Buffer.from(PATH.split`,`[1], 'base64')

      : /^https?:\/\//.test(PATH) ? await (res = await fetch(PATH)).buffer()

      : fs.existsSync(PATH) ? (filename = PATH, fs.readFileSync(PATH))

      : typeof PATH === 'string' ? PATH : Buffer.alloc(0)

    if (!Buffer.isBuffer(data)) throw new TypeError('Result is not a buffer')

    let type = await FileType.fromBuffer(data) || { mime: 'application/octet-stream', ext: '.bin' }

    if (data && returnAsFilename && !filename)

      (filename = path.join(__dirname, './' + new Date * 1 + '.' + type.ext), await fs.promises.writeFile(filename, data))

    return { res, filename, ...type, data }

  }

  const ments = (teks) => teks.match('@') ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : null

  loyd.sendFile = async (jid, path, filename = '', caption = '', quoted, ptt = false, options = {}) => {

    let type = await loyd.getFile(path, true)

    let { res, data: file, filename: pathFile } = type

    if (res && res.status !== 200 || file.length <= 65536) {

      try { throw { json: JSON.parse(file.toString()) } } catch(e) { if (e.json) throw e.json }

    }

    let opt = { filename }

    if (quoted) opt.quoted = quoted

    if (!type) options.asDocument = true

    let mtype = '', mimetype = type.mime, convert

    if (/webp/.test(type.mime) || (/image/.test(type.mime) && options.asSticker)) mtype = 'sticker'

    else if (/image/.test(type.mime) || (/webp/.test(type.mime) && options.asImage)) mtype = 'image'

    else if (/video/.test(type.mime)) mtype = 'video'

    else if (/audio/.test(type.mime)) mtype = 'audio'

    else mtype = 'document'

    if (options.asDocument) mtype = 'document'

    delete options.asSticker; delete options.asLocation; delete options.asVideo; delete options.asDocument; delete options.asImage

    let message = { ...options, caption, ptt, [mtype]: { url: pathFile }, mimetype, fileName: filename || pathFile.split('/').pop() }

    let m

    try { m = await loyd.sendMessage(jid, message, { ...opt, ...options }) } catch(e) { m = null }

    finally {

      if (!m) m = await loyd.sendMessage(jid, { ...message, [mtype]: file }, { ...opt, ...options })

      file = null; return m

    }

  }

  loyd.sendFileUrl = async (jid, url, caption, quoted, options = {}) => {

    let res = await axios.head(url), mime = res.headers['content-type']

    if (mime.split("/")[1] === "gif") return loyd.sendMessage(jid, { video: await getBuffer(url), caption, gifPlayback: true, ...options }, { quoted, ...options })

    if (mime === "application/pdf") return loyd.sendMessage(jid, { document: await getBuffer(url), mimetype: 'application/pdf', caption, ...options }, { quoted, ...options })

    if (mime.split("/")[0] === "image") return loyd.sendMessage(jid, { image: await getBuffer(url), caption, ...options }, { quoted, ...options })

    if (mime.split("/")[0] === "video") return loyd.sendMessage(jid, { video: await getBuffer(url), caption, mimetype: 'video/mp4', ...options }, { quoted, ...options })

    if (mime.split("/")[0] === "audio") return loyd.sendMessage(jid, { audio: await getBuffer(url), caption, mimetype: 'audio/mpeg', ...options }, { quoted, ...options })

  }

  loyd.sendTextWithMentions = async (jid, text, quoted, options = {}) =>

    loyd.sendMessage(jid, { text, mentions: [...text.matchAll(/@(\d{0,16})/g)].map(v => v[1] + '@s.whatsapp.net'), ...options }, { quoted })

  loyd.sendImage = async (jid, path, caption = '', quoted = '', options) => {

    let buffer = Buffer.isBuffer(path) ? path

      : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')

      : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer()

      : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)

    return await loyd.sendMessage(jid, { image: buffer, caption, ...options }, { quoted })

  }

  loyd.downloadAndSaveMediaMessage = async (message, filename, attachExtension = true) => {

    let quoted = message.msg ? message.msg : message

    let mime = (message.msg || message).mimetype || ''

    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]

    const stream = await downloadContentFromMessage(quoted, messageType)

    let buffer = Buffer.from([])

    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

    let type = await FileType.fromBuffer(buffer)

    let trueFileName = attachExtension ? ('./cache/' + filename + '.' + type.ext) : './cache/' + filename

    await fs.writeFileSync(trueFileName, buffer)

    return trueFileName

  }

  loyd.downloadMediaMessage = async (message) => {

    let mime = (message.msg || message).mimetype || ''

    let messageType = message.mtype ? message.mtype.replace(/Message/gi, '') : mime.split('/')[0]

    const stream = await downloadContentFromMessage(message, messageType)

    let buffer = Buffer.from([])

    for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk])

    return buffer

  }

  loyd.sendAudio = async (jid, path, quoted = '', ptt = false, options) => {

    let buffer = Buffer.isBuffer(path) ? path

      : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')

      : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer()

      : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)

    return await loyd.sendMessage(jid, { audio: buffer, ptt, ...options }, { quoted })

  }

  loyd.sendVideo = async (jid, path, gif = false, caption = '', quoted = '', options) => {

    let buffer = Buffer.isBuffer(path) ? path

      : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')

      : /^https?:\/\//.test(path) ? await (await fetch(path)).buffer()

      : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)

    return await loyd.sendMessage(jid, { video: buffer, caption, gifPlayback: gif, ...options }, { quoted })

  }

  loyd.sendImageAsSticker = async (jid, path, quoted, options = {}) => {

    let buff = Buffer.isBuffer(path) ? path

      : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')

      : /^https?:\/\//.test(path) ? await getBuffer(path)

      : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)

    let buffer

    if (options && (options.packname || options.author)) buffer = await writeExifImg(buff, options)

    else buffer = await imageToWebp(buff)

    await loyd.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })

    return buffer

  }

  loyd.sendVideoAsSticker = async (jid, path, quoted, options = {}) => {

    let buff = Buffer.isBuffer(path) ? path

      : /^data:.*?\/.*?;base64,/i.test(path) ? Buffer.from(path.split`,`[1], 'base64')

      : /^https?:\/\//.test(path) ? await getBuffer(path)

      : fs.existsSync(path) ? fs.readFileSync(path) : Buffer.alloc(0)

    let buffer

    if (options && (options.packname || options.author)) buffer = await writeExifVid(buff, options)

    else buffer = await videoToWebp(buff)

    await loyd.sendMessage(jid, { sticker: { url: buffer }, ...options }, { quoted })

    return buffer

  }

  loyd.copyNForward = async (jid, message, forceForward = false, options = {}) => {

    let vtype

    if (options.readViewOnce) {

      message.message = message.message && message.message.ephemeralMessage && message.message.ephemeralMessage.message ? message.message.ephemeralMessage.message : (message.message || undefined)

      vtype = Object.keys(message.message.viewOnceMessage.message)[0]

      delete(message.message && message.message.ignore ? message.message.ignore : (message.message || undefined))

      delete message.message.viewOnceMessage.message[vtype].viewOnce

      message.message = { ...message.message.viewOnceMessage.message }

    }

    let mtype = Object.keys(message.message)[0]

    let content = await generateForwardMessageContent(message, forceForward)

    let ctype = Object.keys(content)[0]

    let context = {}

    if (mtype != "conversation") context = message.message[mtype].contextInfo

    content[ctype].contextInfo = { ...context, ...content[ctype].contextInfo }

    const waMessage = await generateWAMessageFromContent(jid, content, options ? {

      ...content[ctype], ...options,

      ...(options.contextInfo ? { contextInfo: { ...content[ctype].contextInfo, ...options.contextInfo } } : {})

    } : {})

    await loyd.relayMessage(jid, waMessage.message, { messageId: waMessage.key.id })

    return waMessage

  }

  loyd.sendText = (jid, text, quoted = '', options) =>

    loyd.sendMessage(jid, { text, ...options }, { quoted, ...options })

  // conn.reply(jid, text, quoted) — أسلوب Shadow bot
  loyd.reply = (jid, text, quoted = '', options = {}) =>
    loyd.sendMessage(jid, { text, ...options }, { quoted, ...options })

  loyd.cMod = (jid, copy, text = '', sender = loyd.user.id, options = {}) => {

    let mtype = Object.keys(copy.message)[0]

    let isEphemeral = mtype === 'ephemeralMessage'

    if (isEphemeral) mtype = Object.keys(copy.message.ephemeralMessage.message)[0]

    let msg = isEphemeral ? copy.message.ephemeralMessage.message : copy.message

    let content = msg[mtype]

    if (typeof content === 'string') msg[mtype] = text || content

    else if (content.caption) content.caption = text || content.caption

    else if (content.text) content.text = text || content.text

    if (typeof content !== 'string') msg[mtype] = { ...content, ...options }

    if (copy.key.participant) sender = copy.key.participant = sender || copy.key.participant

    if (copy.key.remoteJid.includes('@s.whatsapp.net')) sender = sender || copy.key.remoteJid

    else if (copy.key.remoteJid.includes('@broadcast')) sender = sender || copy.key.remoteJid

    copy.key.remoteJid = jid

    copy.key.fromMe = sender === loyd.user.id

    return proto.WebMessageInfo.fromObject(copy)

  }

  loyd.sendButtonImage = async (chat, judul, teks, buffer, button, wmnye = `${wm}`, q) => {

    const uploadFile = { upload: loyd.waUploadToServer }

    var imageMessage = await prepareWAMessageMedia({ image: buffer }, uploadFile)

    let msg = generateWAMessageFromContent(chat, {

      viewOnceMessage: {

        message: {

          "messageContextInfo": { "deviceListMetadata": {}, "deviceListMetadataVersion": 2 },

          interactiveMessage: proto.Message.InteractiveMessage.create({

            contextInfo: {

              mentionedJid: ments(teks),

              forwardingScore: 9999999,

              isForwarded: true,

              forwardedNewsletterMessageInfo: { newsletterJid: chjid + "@newsletter", newsletterName: `${wm}`, serverMessageId: -1 },

              businessMessageForwardInfo: { businessOwnerJid: loyd.decodeJid(loyd.user.id) },

            },

            body: proto.Message.InteractiveMessage.Body.create({ text: teks }),

            footer: proto.Message.InteractiveMessage.Footer.create({ text: wmnye }),

            header: proto.Message.InteractiveMessage.Header.create({ title: judul, subtitle: `${wm}`, imageMessage: imageMessage.imageMessage, hasMediaAttachment: true }),

            nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({ buttons: button })

          })

        }

      }

    }, { quoted: q })

    loyd.relayMessage(msg.key.remoteJid, msg.message, { messageId: msg.key.id })

  }

  loyd.ments = (teks = '') =>

    teks.match('@') ? [...teks.matchAll(/@([0-9]{5,16}|0)/g)].map(v => v[1] + '@s.whatsapp.net') : []

  loyd.sendContact = async (jid, kon, quoted = '', opts = {}) => {

    let list = []

    for (let i of kon) {

      list.push({

        displayName: await loyd.getName(i + '@s.whatsapp.net'),

        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:${await loyd.getName(i + '@s.whatsapp.net')}\nFN:${await loyd.getName(i + '@s.whatsapp.net')}\nitem1.TEL;waid=${i}:${i}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`

      })

    }

    loyd.sendMessage(jid, { contacts: { displayName: `${list.length} Kontak`, contacts: list }, ...opts }, { quoted })

  }

  loyd.imgToSticker = loyd.sendImageAsSticker

  loyd.vidToSticker = loyd.sendVideoAsSticker

  return loyd

}

// ─── ESM → CJS محوّل خفيف ────────────────────────────────────

function _esmToCjs(src) {
  // جمع الـ named exports قبل الحذف
  const namedExportFns = []
  src.replace(/^export\s+(?:async\s+)?function\s+(\w+)/gm, (_, n) => { namedExportFns.push(n) })
  src.replace(/^export\s+(?:const|let|var)\s+(\w+)\s*=/gm, (_, n) => { namedExportFns.push(n) })

  let out = src
    // (await import('X')).default  →  require('X')
    .replace(/\(\s*await\s+import\s*\(\s*['"]([^'"]+)['"]\s*\)\s*\)\.default/g, "require('$1')")
    // (await import('X'))  →  require('X')
    .replace(/await\s+import\s*\(\s*['"]([^'"]+)['"]\s*\)/g, "require('$1')")
    // import X, { A, B } from 'Y'  →  mixed default + named
    .replace(/^import\s+(\w+)\s*,\s*\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]\s*;?/gm,
      (_, def, named, mod) => `const ${def} = require('${mod}');\nconst {${named}} = ${def};`)
    // import X from 'Y'
    .replace(/^import\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/gm, "const $1 = require('$2');")
    // import { A, B } from 'Y'
    .replace(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]\s*;?/gm, "const {$1} = require('$2');")
    // import * as X from 'Y'
    .replace(/^import\s+\*\s+as\s+(\w+)\s+from\s+['"]([^'"]+)['"]\s*;?/gm, "const $1 = require('$2');")
    // export async function X / export function X  →  حذف export
    .replace(/^export\s+(async\s+function|function)\s+(\w+)/gm, '$1 $2')
    // export const/let/var X =  →  const/let/var X =
    .replace(/^export\s+(const|let|var)\s+/gm, '$1 ')
    // export default handler
    .replace(/^export\s+default\s+(\w+)\s*;?/m, 'module.exports = $1;')

  // أضف named exports لـ module.exports (يشتغل حتى لو module.exports = handler)
  if (namedExportFns.length > 0) {
    out += '\n;(function(){ var _me = module.exports; ' +
      namedExportFns.map(n => `if(typeof ${n}!=='undefined') _me.${n}=${n};`).join(' ') +
      ' })()'
  }

  return out
}

function _loadPlugin(pluginPath) {
  const src = fs.readFileSync(pluginPath, 'utf8')
  const isESM = /^\s*(import\s|export\s+default)/m.test(src)

  if (!isESM) {
    delete require.cache[require.resolve(pluginPath)]
    return require(pluginPath)
  }

  // حوّل ESM → CJS واحفظ في ملف مؤقت
  const tmpPath = pluginPath + '.__cjs__.js'
  fs.writeFileSync(tmpPath, _esmToCjs(src), 'utf8')
  try {
    delete require.cache[require.resolve(tmpPath)]
    return require(tmpPath)
  } finally {
    try { fs.unlinkSync(tmpPath) } catch(_) {}
  }
}

// ─── PLUGIN LOADER ───────────────────────────────────────────

async function loadPlugins(loyd, m, chatUpdate, mek, store, setting) {

  const pluginDir = path.join(__dirname, 'plugins')

  if (!fs.existsSync(pluginDir)) return

  const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js') && !f.includes('.__cjs__.')).sort()

  // تحميل كل البلاغن مع cache (تجنّب إعادة القراءة من الديسك في كل رسالة)
  const plugins = []
  for (const file of files) {
    try {
      const pluginPath = path.join(pluginDir, file)
      const mtime = fs.statSync(pluginPath).mtimeMs
      const cached = _pluginCache.get(file)
      let plugin
      if (cached && cached.mtime === mtime) {
        plugin = cached.plugin
      } else {
        plugin = _loadPlugin(pluginPath)
        // pre-compute command Set لتسريع المطابقة
        if (plugin && Array.isArray(plugin.command)) {
          plugin._commandSet = new Set(plugin.command.map(c => String(c).toLowerCase()))
        }
        _pluginCache.set(file, { mtime, plugin })
      }
      plugins.push({ file, plugin })
    } catch(err) {
      console.error(`[Plugin Load Error] ${file}:`, err.message)
    }
  }
  // حذف plugins محذوفة من الـ cache
  for (const [k] of _pluginCache) {
    if (!files.includes(k)) _pluginCache.delete(k)
  }

  // ── حساب صلاحيات المستخدم (مع cache لـ owner.json) ─────────
  const _now = Date.now()
  if (!_ownerCache || _now - _ownerCacheTime > _OWNER_CACHE_TTL) {
    try { _ownerCache = JSON.parse(fs.readFileSync('./database/owner.json', 'utf8')) } catch (e) { _ownerCache = [] }
    _ownerCacheTime = _now
  }
  const own = _ownerCache
  const ownerNums = [String(global.owner || ''), ...own]
    .filter(v => typeof v === 'string' && v.trim() !== '')
    .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')
  const isROwner = ownerNums.includes(m.sender) || !!m.key.fromMe
  const isOwner  = isROwner

  let groupMetadata  = null
  let participants   = []
  let isAdmin        = false
  let isMods         = false

  if (m.isGroup) {
    try {
      groupMetadata = await loyd.groupMetadata(m.chat)
      participants  = groupMetadata.participants || []
      const adminList = participants.filter(p => p.admin).map(p => p.id)
      isAdmin = adminList.includes(m.sender)
      isMods  = isAdmin
    } catch(e) {}
  }

  // ── تهيئة سجل المستخدم والشات في قاعدة البيانات ─────────
  if (global.db?.data) {
    if (!global.db.data.users[m.sender]) {
      global.db.data.users[m.sender] = {
        exp: 0, coin: 0, health: 100, afk: -1,
        ban: false, warn: 0, lastcofre: 0,
        registered: false, name: m.pushName || ''
      }
    }
    if (!global.db.data.chats[m.chat]) {
      global.db.data.chats[m.chat] = {
        isBanned: false, welcome: false, detect: false,
        antiLink: false, modoadmin: false, nsfw: false,
        economy: false, gacha: false, primaryBot: ''
      }
    }
  }

  const ctx = {
    conn: loyd,
    isOwner, isROwner, isMods, isAdmin,
    participants, groupMetadata
  }

  // ── تشغيل before() exports أولاً ─────────────────────────
  let blocked = false
  for (const { file, plugin } of plugins) {
    if (typeof plugin.before === 'function') {
      try {
        const result = await Promise.resolve(plugin.before(m, ctx))
        if (result === true) { blocked = true; break }
      } catch(e) {
        console.error(`[Before Error] ${file}:`, e.message)
      }
    }
  }

  if (blocked) return

  // ── تشغيل command handlers ────────────────────────────────
  for (const { file, plugin } of plugins) {

    try {

      // ── أسلوب handler.command (array أو regex) ─────────────
      if (typeof plugin === 'function' && plugin.command != null) {

        const body = m.body || ''

        // دعم customPrefix (مثل $ في $.js)
        let prefix, usedCommand, usedCommandLow

        if (plugin.customPrefix instanceof RegExp) {
          const cpMatch = body.match(plugin.customPrefix)
          if (!cpMatch) continue
          prefix = cpMatch[0]
          usedCommand    = body.slice(prefix.length).trim().split(' ')[0]
          usedCommandLow = usedCommand.toLowerCase()
        } else {
          prefix = setting.multiprefix
            ? body.match(/^[°zZ#@+,.?=''():√%!¢£¥€π¤ΠΦ&™©®Δ^βα¦|/\\©^]/)?.[0] || '.'
            : body.match(/^[#.?!]/)?.[0] || ''

          if (!body.startsWith(prefix) || prefix === '') continue

          usedCommand    = body.slice(prefix.length).trim().split(' ')[0]
          usedCommandLow = usedCommand.toLowerCase()
        }

        // تحقق command match — regex فارغة تعني "أي أمر"
        let matched = false
        if (plugin.command instanceof RegExp) {
          matched = plugin.command.source === '(?:)' || plugin.command.source === '' || plugin.command.source === '(?:)'
            ? true
            : plugin.command.test(usedCommandLow)
        } else if (Array.isArray(plugin.command)) {
          matched = plugin._commandSet
            ? plugin._commandSet.has(usedCommandLow)
            : plugin.command.map(c => String(c).toLowerCase()).includes(usedCommandLow)
        }

        if (!matched) continue

        // تحقق الصلاحيات مع إرسال رسالة الرفض
        global.comando = usedCommand
        if (plugin.rowner && !isROwner) { global.dfail('rowner', m, loyd); continue }
        if (plugin.owner  && !isOwner)  { global.dfail('owner',  m, loyd); continue }
        if (plugin.group  && !m.isGroup){ global.dfail('group',  m, loyd); continue }
        if (plugin.admin  && !isAdmin)  { global.dfail('admin',  m, loyd); continue }
        if (!setting.public && !isOwner && !m.key.fromMe) continue

        const args = body.trim().split(/ +/).slice(1)
        const text = args.join(' ')

        Promise.resolve(
          plugin(m, { ...ctx, text, usedPrefix: prefix, command: usedCommand, args })
        ).catch(e => console.error(`[Handler Error] ${file}:`, e.message))

      // ── أسلوب module.exports القديم ────────────────────────
      } else if (typeof plugin === 'function') {

        plugin(loyd, m, chatUpdate, mek, store, setting)

      }

    } catch(err) {

      console.error(`[Plugin Error] ${file}:`, err.message)

    }

  }

}

// ─── MAIN BOT ENTRY ──────────────────────────────────────────

const rainbowColors = ['#FF0000','#FF7F00','#FFFF00','#00FF00','#0000FF','#4B0082','#9400D3']

const rainbowText = [

  `🤖 BOT INFORMATION`, ``,

  `👤 Owner Name : ${global.ownername}`,

  `⚙️  Bot Type   : LOYD (CJS)`,

  `📦 Version     : ${global.version}`,

  `🖥️  Node.js     : ${process.version}`

]

function printRainbow(text, colors) {

  let idx = 0

  return text.split('').map(c => { const col = colors[idx++ % colors.length]; return chalk.hex(col)(c) }).join('')

}

let authNotify = true

async function getNumber(prompt) {

  process.stdout.write(prompt)

  return new Promise((resolve, reject) => {

    process.stdin.once('data', (data) => {

      const input = data.toString().trim()

      if (input) resolve(input)

      else reject(new Error('مدخل غير صحيح'))

    })

  })

}

async function startBot() {

  // Ensure folders

  const dirs = ['./database', './media', './plugins']

  for (const d of dirs) if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true })

  // Database

  try {

    global.db = JSON.parse(fs.readFileSync('./database/database.json'))

    if (global.db) global.db.data = { users: {}, chats: {}, others: {}, settings: {}, ...(global.db.data || {}) }

  } catch(err) {

    global.db = { data: { users: {}, chats: {}, others: {}, settings: {} } }

    fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2))

    console.log('[DB] Created new database.json')

  }

  // حفظ تلقائي لقاعدة البيانات كل 30 ثانية
  setInterval(() => {
    try {
      fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2))
    } catch(e) {}
  }, 30000)

  // Session setup

  let session = `${sessionName}`

  let sesiPath = './' + session

  if (!fs.existsSync(sesiPath)) fs.mkdirSync(sesiPath, { recursive: true })

  const storeFilePath = path.join(sesiPath, 'store.json')

  if (!fs.existsSync(storeFilePath)) {

    fs.writeFileSync(storeFilePath, JSON.stringify({ chats: [], contacts: {}, messages: {}, presences: {} }, null, 4))

  }

  const debounceWrite = (() => {

    let timeout

    return (callback) => { clearTimeout(timeout); timeout = setTimeout(() => callback(), 3000) }

  })()

  const store = makeInMemoryStore({ logger: pino().child({ level: 'silent', stream: 'store' }) })

  try {

    const initialData = JSON.parse(fs.readFileSync(storeFilePath, 'utf-8'))

    store.chats    = initialData.chats    || []

    store.contacts = initialData.contacts || {}

    store.messages = initialData.messages || {}

    store.presences = initialData.presences || {}

    setInterval(() => {

      debounceWrite(() => {

        const formattedData = JSON.stringify({ chats: store.chats || [], contacts: store.contacts || {}, messages: store.messages || {}, presences: store.presences || {} }, null, 4)

        fs.writeFileSync(storeFilePath, formattedData)

      })

    }, 30000)

  } catch(err) { console.log('Error loading store: ' + err) }

  rainbowText.forEach(line => console.log(printRainbow(line, rainbowColors)))

  // Settings file (from lib/settings.json compat)

  let setting = libSettings

  const settingPath = './database/settings.json'

  if (fs.existsSync(settingPath)) {

    try { setting = { ...libSettings, ...JSON.parse(fs.readFileSync(settingPath)) } } catch(_) {}

  } else {

    fs.writeFileSync(settingPath, JSON.stringify({ public: true, multiprefix: false, autoread: false, autotyping: false, warnCount: 3 }, null, 2))

    setting = { public: true, multiprefix: false, autoread: false, autotyping: false, warnCount: 3 }

  }

  const { state, saveCreds } = await useMultiFileAuthState(sesiPath)

  if (!_waVersion) { try { const r = await fetchLatestWaWebVersion(); _waVersion = r.version } catch(_) { _waVersion = [2,3000,1015901307] } }
  const version = _waVersion

  // ─── Login Menu (first time only) ────────────────────────
  let _loginMethod = 'code'   // default
  let _loginPhone  = null

  if (!state.creds.registered) {
    const _div  = chalk.hex('#9B59B6')('━'.repeat(48))
    const _code = global.codeNumber ? global.codeNumber.toString().trim().replace(/[^0-9]/g, '') : ''
    const _qr   = global.qrNumber   ? global.qrNumber.toString().trim() : ''

    if (!_code && !_qr) {
      // ─── كلاهما فارغان ← شرح ووقف ───────────────────────────
      console.log(
        `\n${_div}\n` +
        `${chalk.bgRed.white.bold(' 𝐋𝐎𝐘𝐃 𝐁𝐎𝐓 ')} ${chalk.red('⚠️  إعداد مطلوب / Setup Required')}\n\n` +
        `${chalk.yellow('افتح loyd.js وضع رقمك في أحد هذين الخيارين:')}\n` +
        `${chalk.yellow('Open loyd.js and put your number in one of these:')}\n\n` +
        `  ${chalk.cyan('global.codeNumber')} ${chalk.white('= "49176****"')}  ${chalk.gray('← 🔑 Pairing Code (موصى به / recommended)')}\n` +
        `  ${chalk.cyan('global.qrNumber')}   ${chalk.white('= "49176****"')}  ${chalk.gray('← 📷 QR Code')}\n\n` +
        `${chalk.gray('⚠️  اترك الآخر فارغاً — لا تملأ الاثنين معاً')}\n` +
        `${chalk.gray('⚠️  Leave the other empty — do not fill both at once')}\n` +
        `${_div}\n`
      )
      process.exit(1)
    } else if (_code) {
      // ─── Pairing Code (تلقائي) ────────────────────────────────
      _loginMethod = 'code'
      _loginPhone  = _code
      console.log(
        `\n${_div}\n` +
        `${chalk.bgHex('#9B59B6').white.bold(' 𝐋𝐎𝐘𝐃 𝐁𝐎𝐓 ')} ${chalk.gray('First-time Login')}\n\n` +
        `${chalk.hex('#2ECC71')('🔑 وضع Pairing Code — سيظهر الكود بعد الاتصال')}\n` +
        `${chalk.hex('#2ECC71')('🔑 Pairing Code mode — code will appear after connecting')}\n\n` +
        `${chalk.hex('#F1C40F')('📱 الرقم / Number: ')}${chalk.white(`+${_loginPhone}`)}\n` +
        `${_div}\n`
      )
    } else {
      // ─── QR Code (تلقائي) ─────────────────────────────────────
      _loginMethod = 'qr'
      console.log(
        `\n${_div}\n` +
        `${chalk.bgHex('#9B59B6').white.bold(' 𝐋𝐎𝐘𝐃 𝐁𝐎𝐓 ')} ${chalk.gray('First-time Login')}\n\n` +
        `${chalk.hex('#3498DB')('📷 وضع QR Code — امسح الكود بالواتساب')}\n` +
        `${chalk.hex('#3498DB')('📷 QR Code mode — scan the code below with WhatsApp')}\n` +
        `${_div}\n`
      )
    }
  }

  const clientData = {

    logger: pino({ level: "silent" }),

    auth: state,

    version: version,

    browser: Browsers.ubuntu("Firefox"),

    connectTimeoutMs: 30000,

    keepAliveIntervalMs: 10000,

    retryRequestDelayMs: 250,

    generateHighQualityLinkPreview: false,

    syncFullHistory: false,

    markOnlineOnConnect: false,

    emitOwnEvents: false,

    printQRInTerminal: _loginMethod === 'qr'

  }

  const loyd = makeWASocket(clientData)

  global.conn = loyd

  loyd.ev.on('creds.update', saveCreds)

  // ─── Pairing Code Handler ─────────────────────────────────
  if (!state.creds.registered && _loginMethod === 'code' && _loginPhone) {
    let _pairingDone = false
    loyd.ev.on('connection.update', async (update) => {
      if (_pairingDone) return
      const { qr } = update
      if (qr) {
        _pairingDone = true
        try {
          await new Promise(r => setTimeout(r, 600))
          const code = await loyd.requestPairingCode(_loginPhone)
          const _div = chalk.hex('#9B59B6')('━'.repeat(48))
          console.log(
            `\n${_div}\n` +
            `${chalk.bgHex('#9B59B6').white.bold(' 𝐋𝐎𝐘𝐃 𝐁𝐎𝐓 ')} ${chalk.gray('Pairing Code')}\n\n` +
            `  ${chalk.hex('#F1C40F')('📱 Phone  :')} ${chalk.white(`+${_loginPhone}`)}\n` +
            `  ${chalk.hex('#F1C40F')('🔑 Code   :')} ${chalk.green.bold(code)}\n\n` +
            `  ${chalk.gray('Open WhatsApp → Linked Devices → Link a Device → enter this code')}\n` +
            `${_div}\n`
          )
        } catch(err) {
          console.log(chalk.red(`\n❌ Failed to get pairing code: ${err.message}\n`))
          _pairingDone = false
        }
      }
    })
  }

  store.bind(loyd.ev)

  await setupHandler(loyd, store)

  const processedMessages = new Set()

  // O(1) lookup للشاتات المعروفة بدل .some() الخطي
  const knownChats = new Set(store.chats.map(c => c.id))

  if (!(store.messages instanceof Map)) {

    const oldMessages = store.messages || {}

    store.messages = new Map(Object.entries(oldMessages))

  }

  // ─── Message Handler ─────────────────────────────────────

  loyd.ev.on('messages.upsert', async (chatUpdate) => {

    try {

      const mek = chatUpdate.messages[0]

      if (!mek || !mek.message) return

      if (processedMessages.has(mek.key.id)) return

      processedMessages.add(mek.key.id)
      // منع تراكم الـ Set في الذاكرة — احتفظ بآخر 1000 فقط
      if (processedMessages.size > 1500) {
        const iter = processedMessages.values()
        for (let _i = 0; _i < 500; _i++) processedMessages.delete(iter.next().value)
      }

      mek.message = (Object.keys(mek.message)[0] === 'ephemeralMessage')

        ? mek.message.ephemeralMessage.message : mek.message

      if (mek.key?.remoteJid === 'status@broadcast') {

        await loyd.readMessages([mek.key]); return

      }

      // Store management

      try {

        const remoteJid   = mek.key.remoteJid

        const userId      = mek.key.fromMe ? botNumber : mek.key.participant

        const MAX_STORE   = 100

        if (!store.presences) store.presences = {}

        store.presences[userId] = { lastOnline: Date.now() }

        if (!store.messages[remoteJid]) store.messages[remoteJid] = []

        const simplified = { key: mek.key, messageTimestamp: mek.messageTimestamp, pushName: mek.pushName || null, message: mek.message }

        store.messages[remoteJid].push(simplified)

        if (!knownChats.has(remoteJid)) {
          knownChats.add(remoteJid)
          store.chats.push({ id: remoteJid, conversationTimestamp: mek.messageTimestamp || Date.now() })
        }

        if (store.chats.length > MAX_STORE) store.chats.splice(0, store.chats.length - MAX_STORE)

        if (store.messages[remoteJid].length > MAX_STORE) store.messages[remoteJid].splice(0, store.messages[remoteJid].length - MAX_STORE)

      } catch(err) { console.error('Store error: ' + err); return }

      const m = smsg(loyd, mek, store)

      // ─── Log رسالة واردة ─────────────────────────────────
      printMessage(m, loyd).catch(() => {})

      // Load plugins

      loadPlugins(loyd, m, chatUpdate, mek, store, setting).catch(e => console.error('[loadPlugins]', e.message))

    } catch(err) { console.error(err) }

  })

  // ─── Group Events ────────────────────────────────────────

  loyd.ev.on('group-participants.update', async (anu) => {

    const iswel  = global.db.data.chats[anu.id]?.welcome || false

    const isLeft = global.db.data.chats[anu.id]?.goodbye || false

    await welcomeHandler(iswel, isLeft, loyd, anu)

  })

  // ─── Connection ──────────────────────────────────────────

  loyd.ev.on("connection.update", async (update) => {

    const { connection, lastDisconnect, qr } = update

    const jam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm')

    if (connection === "close") {

      let reason = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode

      if (reason === DisconnectReason.badSession) { console.log(`[${jam}] Session error`); startBot() }

      else if (reason === DisconnectReason.connectionClosed) { console.log(`[${jam}] Connection closed, reconnecting...`); startBot() }

      else if (reason === DisconnectReason.connectionLost) { console.log(`[${jam}] Connection lost, reconnecting...`); startBot() }

      else if (reason === DisconnectReason.connectionReplaced) { console.log(`[${jam}] Session replaced`); startBot() }

      else if (reason === DisconnectReason.loggedOut) { console.error(`[${jam}] Logged out`); process.exit() }

      else if (reason === DisconnectReason.restartRequired) { console.log(`[${jam}] Restart required`); startBot() }

      else if (reason === DisconnectReason.timedOut) { console.log(`[${jam}] Timed out, reconnecting...`); startBot() }

      else { console.log(`[${jam}] Unknown reason: ${reason}`); startBot() }

    } else if (connection === "open") {

      console.log(chalk.blue.bold(`[${moment(Date.now()).tz('Asia/Jakarta').format('HH:mm')}] Bot WhatsApp Connected!`))

      loyd.newsletterFollow(`${global.idch}`).catch(() => {})

    }

  })

  return loyd

}

// ─── EXPORTS (for plugins compatibility) ─────────────────────

// Plugins يمكنهم يعمل require('../loyd') عشان يأخذون الدوال

module.exports = {

  smsg, getBuffer, fetchJson, sleep, isUrl, pickRandom, monospace,

  randomKarakter, randomNomor, toRupiah, toDolar, FileSize, resize,

  nebal, totalFitur, parseMention, getRandom, formatDuration, runtime,

  clockString, getTime, formatp, getGroupAdmins,

  writeExif, imageToWebp, imageToWebp3, videoToWebp, writeExifImg, writeExifImgAV, writeExifVid,

  CatBox, pinterest, yt_search, tiktokSearchVideo

}

startBot()

let file = require.resolve(__filename)

fs.watchFile(file, () => {

  fs.unwatchFile(file)

  console.log(`Update ${__filename}`)

  delete require.cache[file]

  require(file)

})

// ─── HTTP keepalive للـ Replit ────────────────────────────────
const http = require('http')
const PORT = process.env.PORT || 8080
const _keepalive = http.createServer((req, res) => {
  res.writeHead(200)
  res.end('Bot is running ✅')
})
_keepalive.on('error', (e) => {
  if (e.code === 'EADDRINUSE') console.log(`[HTTP] Port ${PORT} already in use, skipping keepalive`)
  else console.error('[HTTP]', e.message)
})
_keepalive.listen(PORT, () => {
  console.log(`[HTTP] Keepalive server on port ${PORT}`)
})

