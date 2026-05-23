'use strict'

const {

  generateWAMessageFromContent,

  prepareWAMessageMedia,

  downloadContentFromMessage,

  proto,

  delay

} = require('@whiskeysockets/baileys')

const axios = require('axios')

const fs = require('fs')

const fetch = require('node-fetch')

const FormData = require('form-data')

const moment = require('moment-timezone')

const path = require('path')

const util = require('util')

const { fromBuffer } = require('file-type')

const { exec, execSync } = require('child_process')

const {

  parseMention, formatDuration, getRandom, getBuffer, fetchJson,

  runtime, sleep, isUrl, clockString, getTime, formatp, getGroupAdmins,

  pickRandom, monospace, randomKarakter, randomNomor, toRupiah, toDolar,

  FileSize, resize, nebal, totalFitur, smsg,

  CatBox, pinterest, yt_search, tiktokSearchVideo,

  writeExif, imageToWebp, videoToWebp, writeExifImg, writeExifVid

} = require('../loyd')

module.exports = async (dolxie, m, chatUpdate, mek, store, setting) => {

  try {

    const chalk = require('chalk')

    if (!global.help) global.help = []

    global.handlers = []

    const {

      type

    } = m

    const {

      parseMention,

      formatDuration,

      getRandom,

      getBuffer,

      fetchJson,

      runtime,

      sleep,

      isUrl,

      clockString,

      getTime,

      formatp,

      getGroupAdmins,

      pickRandom,

      monospace,

      randomKarakter,

      randomNomor,

      toRupiah,

      toDolar,

      FileSize,

      resize,

      nebal,

      totalFitur,

      smsg

    } = require('../loyd')

    const {

      CatBox,

      pinterest,

      yt_search,

      tiktokSearchVideo

    } = require('../loyd')

    var body = m.body

    var budy = m.text

    var prefix

    if (setting.multiprefix) {

      prefix = body.match(/^[°zZ#@+,.?=''():√%!¢£¥€π¤ΠΦ&™©®Δ^βα¦|/\\©^]/)?.[0] || '.'

    } else {

      prefix = body.match(/^[#.?!]/)?.[0] || ''

    }

    const isCmd = body.startsWith(prefix)

    const command = isCmd ? body.slice(prefix.length).trim().split(' ')[0].toLowerCase() : ''

    const pushname = m.pushName || "No Name"

    const botNumber = await dolxie.decodeJid(dolxie.user.id)

    const bulan = moment.tz('Asia/Jakarta').format('DD/MMMM')

    const tahun = moment.tz('Asia/Jakarta').format('YYYY')

    const tanggal = moment().tz("Asia/Jakarta").format("dddd, d")

    const jam = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss')

    const wibTime = moment().tz('Asia/Jakarta').format('HH:mm:ss')

    const penghitung = moment().tz("Asia/Jakarta").format("dddd, D MMMM - YYYY")

    const args = body.trim().split(/ +/).slice(1)

    const full_args = body.replace(command, '').slice(1).trim()

        const q = args.join(" ")

    const text = q

    const quoted = m.quoted ? m.quoted : m

    const from = m.key.remoteJid

    const mime = (quoted.msg || quoted).mimetype || ''

    const isMedia = /image|video|sticker|audio/.test(mime)

    const isMediaa = /image|video/.test(mime)

    const isPc = from.endsWith('@s.whatsapp.net')

    const isGc = from.endsWith('@g.us')

    const more = String.fromCharCode(8206)

    const readmore = more.repeat(4001)

    const qmsg = (quoted.msg || quoted)

    const sender = m.key.fromMe ? (dolxie.user.id.split(':')[0] + '@s.whatsapp.net' || dolxie.user.id) : (m.key.participant || m.key.remoteJid)

    const groupMetadata = m.isGroup ? await dolxie.groupMetadata(m.chat) : ''

    const participants = m?.isGroup ? groupMetadata.participants?.map(p => {

            let admin = null;

            if (p.admin === 'superadmin') admin = 'superadmin';

            else if (p.admin === 'admin') admin = 'admin';

            return {

                id: p.id || null,

                jid: p.jid || null,

                lid: p.lid || null,

                admin,

                full: p

            };

        }) || []: [];

     const groupOwner = m?.isGroup ? participants.find(p => p.admin === 'superadmin')?.jid || '' : '';

    const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.jid || p.id);

        const isBotAdmins = m?.isGroup ? groupAdmins.includes(botNumber) : false;

        const isAdmins = m?.isGroup ? groupAdmins.includes(m.sender) : false;

        const isGroupOwner = m?.isGroup ? groupAdmins=== m.sender : false;

        const senderLid = (() => {

            const p = participants.find(p => p.jid === m.sender);

            return p?.lid || null;

        })();

    const groupMembers = m.isGroup ? groupMetadata.participants : ''

    const froms = m.quoted ? m.quoted.sender : text ? (text.replace(/[^0-9]/g, '') ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false) : false

    const tag = `${m.sender.split('@')[0]}`

    const tagg = `${m.sender.split('@')[0]}` + '@s.whatsapp.net'

    const isImage = (type == 'imageMessage')

    const isVideo = (type == 'videoMessage')

    const isAudio = (type == 'audioMessage')

    const isSticker = (type == 'stickerMessage')

        // تعريف قائمة الأونر والموزعين عشان ما يطلع خطأ

    let owner = global.owner || [];

    let own = [];

    let res = [];

    try { own = JSON.parse(fs.readFileSync('./database/owner.json')) } catch (e) { own = [] }

    try { res = JSON.parse(fs.readFileSync('./data/default-db/reseller.json')) } catch (e) { res = [] }

    const isOwner = [owner, ...own]

      .filter(v => typeof v === 'string' && v.trim() !== '')

      .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')

      .includes(m.sender)

    const isReseller = [owner, ...own, ...res]

      .filter(v => typeof v === 'string' && v.trim() !== '')

      .map(v => v.replace(/[^0-9]/g, '') + '@s.whatsapp.net')

      .includes(m.sender)

    if (!setting.public) {

      if (!isOwner && !m.key.fromMe) return

    }

    const contacts = JSON.parse(fs.readFileSync('./database/contacts.json'))

    const isContacts = contacts.includes(sender)

    if (wibTime < "23:59:59") {

      var ucapanWaktu = 'طابت ليلتك'

    }

    if (wibTime < "19:00:00") {

      var ucapanWaktu = 'طابت ليلتك'

    }

    if (wibTime < "18:00:00") {

      var ucapanWaktu = 'مساء النور'

    }

    if (wibTime < "14:59:59") {

      var ucapanWaktu = 'مساء الخير'

    }

    if (wibTime < "10:00:00") {

      var ucapanWaktu = 'صباح الخير'

    }

    if (wibTime < "06:00:00") {

      var ucapanWaktu = 'صباح الخير'

    }

    if (!setting.public) {

      if (!isOwner && !m.key.fromMe) return

    }

    const onlyAdmin = () => {

      m.reply('هذه الميزة للأدمن فقط')

    }

    const onlyOwn = () => {

      m.reply('هذه الميزة للمالك فقط')

    }

    const onlyBotAdmin = () => {

      m.reply('يجب أن يكون البوت أدمناً في المجموعة')

    }

    const onlyGrup = () => {

      m.reply('هذه الميزة للمجموعات فقط')

    }

    const onlyPrivat = () => {

      m.reply('هذه الميزة للمحادثات الخاصة فقط')

    }

    const onlyOr = () => {

      m.reply('هذه الميزة للموزعين فقط')

    }

    try {

      const currentTimee = Date.now()

      let isNumber = x => typeof x === 'number' && !isNaN(x)

      let user = global.db.data.users[m.sender]

      if (typeof user !== 'object') global.db.data.users[m.sender] = {}

      if (user) {

        if (!('daftar' in user)) user.daftar = false

        if (!('nama' in user)) user.nama = `${pushname}`

        if (!('banned' in user)) user.banned = false

      } else global.db.data.users[m.sender] = {

        daftar: false,

        nama: `${pushname}`,

        banned: false

      }

      let chats = global.db.data.chats[m.chat]

      if (typeof chats !== 'object') global.db.data.chats[m.chat] = {}

      if (chats) {

        if (!('antilink' in chats)) chats.antilink = false

        if (!('antilinkgc' in chats)) chats.antilinkgc = false

        if (!('welcome' in chats)) chats.welcome = false

        if (!('goodbye' in chats)) chats.goodbye = false

        if (!('warn' in chats)) chats.warn = {}

      } else global.db.data.chats[m.chat] = {

        antilink: false,

        antilinkgc: false,

        welcome: false,

        goodbye: false,

        warn: {}

      }

      fs.writeFileSync('./database/database.json', JSON.stringify(global.db, null, 2))

    } catch (err) {

      console.log(err)

    }

    const _p = prefix

    const n_cmd = command

    const p_c = prefix + command

    const reply = (teks) => {

      return dolxie.sendMessage(m.chat, {

        text: teks,

        mentions: dolxie.ments(teks)

      }, {

        quoted: m

      })

    }

    const ftext = {

      key: {

        participant: '0@s.whatsapp.net',

        ...(m.chat ? {

          remoteJid: `status@broadcast`

        } : {})

      },

      message: {

        extendedTextMessage: {

          text: `${command} ${text}`,

          thumbnailUrl: thumb

        }

      }

    }

    const ftoko = {

      key: {

        fromMe: false,

        participant: `0@s.whatsapp.net`,

        ...(m.chat ? {

          remoteJid: "status@broadcast"

        } : {})

      },

      message: {

        "productMessage": {

          "product": {

            "productImage": {

              "mimetype": "image/jpeg",

              "jpegThumbnail": "",

            },

            "title": `Payment ${ownername}`,

            "description": null,

            "currencyCode": "JPY",

            "priceAmount1000": "7750000",

            "retailerId": `Powered ${botname}`,

            "productImageCount": 1

          },

          "businessOwnerJid": `0@s.whatsapp.net`

        }

      }

    }

    const fconvert = {

      key: {

        fromMe: false,

        participant: m.sender,

        ...(m.chat ? {

          remoteJid: "0@s.whatsapp.net"

        } : {}),

      },

      message: {

        conversation: `*֎ ${isOwner ? 'ᴛʜᴇ ᴏᴡɴᴇʀ' : 'ɴᴏᴛʜɪɴɢ'}*\n*➥ ${db.data.users[m.sender].nama}*`,

      },

    }

    dolxie.newsletterFollow("120363402804601196@newsletter")

    const fchannel = {

      key: {

        fromMe: false,

        participant: m.sender,

        ...(m.chat ? {

          remoteJid: m.sender

        } : {})

      },

      message: {

        newsletterAdminInviteMessage: {

          newsletterJid: chjid + "@newsletter",

          newsletterName: `${wm}`,

          caption: prefix + command

        }

      }

    }

    const floc = {

      key: {

        participant: '0@s.whatsapp.net',

        ...(m.chat ? {

          remoteJid: `status@broadcast`

        } : {})

      },

      message: {

        locationMessage: {

          name: `Powered ${botname}`,

          jpegThumbnail: ""

        }

      }

    }

    let rn = ['recording']

    let jd = rn[Math.floor(Math.random() * rn.length)];

    if (m.message && global.help.includes(command)) {

      let time = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('HH:mm:ss z')

      dolxie.sendPresenceUpdate('available', m.chat)

      const getDtckMsg = `

${chalk.bold.magenta('📥 WHATSAPP MESSAGE')}

${chalk.cyan('⏰ Time     :')} ${chalk.yellow(time)}

${chalk.cyan('💬 Chat     :')} ${chalk.green(m.isGroup ? 'Group 👥' : 'Private 🔒')}

${chalk.cyan('🙋 Sender   :')} ${chalk.hex('#FFA500')(m.pushName || 'Unknown')}

${chalk.cyan('🧩 Command  :')} ${chalk.redBright(command)}

`

      console.log(getDtckMsg)

    }

    if (setting.autosholat) {

      dolxie.autosholat = dolxie.autosholat ? dolxie.autosholat : {}

      let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? dolxie.user.jid : m.sender

      let id = m.chat

      if (!(id in dolxie.autosholat)) {

        let jadwalSholat = {

          Fajr: "04:31",

          Dzuhur: "11:45",

          Ashar: "15:06",

          Magrib: "17:39",

          Isya: "19:09",

        }

        const date = new Date((new Date).toLocaleString("en-US", {

          timeZone: "Asia/Jakarta"

        }))

        const hours = date.getHours()

        const minutes = date.getMinutes()

        const timeNow = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`

        for (const [sholat, waktu] of Object.entries(jadwalSholat)) {

          if (timeNow === waktu) {

            if (sholat === "Fajr") {

              thumbislam = "https://telegra.ph/file/b666be3c20c68d9bd0139.jpg"

            } else if (sholat === "Dzuhur") {

              thumbislam = "https://telegra.ph/file/5295095dad53783b9cd64.jpg"

            } else if (sholat === "Ashar") {

              thumbislam = "https://telegra.ph/file/c0e1948ad75a2cba22845.jpg"

            } else if (sholat === "Magrib") {

              thumbislam = "https://telegra.ph/file/0082ad9c0e924323e08a6.jpg"

            } else if (sholat === "Isya") {

              thumbislam = "https://telegra.ph/file/fd141833a983afa0a8412.jpg"

            } else {

              thumbislam = "https://telegra.ph/file/687fd664f674e90ae1079.jpg"

            }

            dolxie.autosholat[id] = [

              dolxie.sendMessage(m.chat, {

                audio: {

                  url: "https://files.catbox.moe/fsw8se.mp3"

                },

                mimetype: 'audio/mpeg',

                contextInfo: {

                  externalAdReply: {

                    title: `حان وقت صلاة ${sholat}، توضأ وبادر بالصلاة 😇`,

                    body: 'منطقة الرياض وما حولها',

                    mediaType: 1,

                    previewType: 0,

                    renderLargerThumbnail: true,

                    thumbnailUrl: thumbislam,

                    sourceUrl: "-"

                  }

                }

              }, {

                quoted: m

              }),

              setTimeout(() => {

                delete dolxie.autosholat[id]

              }, 57000)

            ]

          }

        }

      }

    }

    if (budy.startsWith('=> ')) {

      if (!m.fromMe && !isOwner) return

      function Return(sul) {

        sat = JSON.stringify(sul, null, 2)

        bang = util.format(sat)

        if (sat == undefined) {

          bang = util.format(sul)

        }

        return m.reply(bang)

      }

      try {

        m.reply(util.format(eval(`(async () => { return ${budy.slice(3)} })()`)))

      } catch (e) {

        m.reply(util.format(e))

      }

    }

    if (budy.startsWith('> ')) {

      if (!m.fromMe && !isOwner) return

      try {

        let evaled = await eval(budy.slice(2))

        if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)

        await m.reply(evaled)

      } catch (err) {

        await m.reply(util.format(err))

      }

    }

    if (budy.startsWith('$ ')) {

      if (!m.fromMe && !isOwner) return

      exec(budy.slice(2), (err, stdout) => {

        if (err) return m.reply(`${err}`)

        if (stdout) return m.reply(stdout)

      })

    }

    if (db.data.chats[m.chat].warn && db.data.chats[m.chat].warn[m.sender]) {

      const warnings = db.data.chats[m.chat].warn[m.sender]

      if (warnings >= setting.warnCount) {

        if (!isBotAdmins || isAdmins || isOwner) return

        await dolxie.sendMessage(m.chat, {

          delete: {

            remoteJid: m.chat,

            fromMe: false,

            id: m.key.id,

            participant: m.sender

          }

        })

      }

    }

    if (db.data.chats[m.chat].antilink) {

      if (budy.match('chat.whatsapp|wa.me|whatsapp.com|t.me|http|www.')) {

        if (!(m.key.fromMe || isAdmins || isOwner || !isBotAdmins)) {

          await dolxie.sendMessage(m.chat, {

            delete: {

              remoteJid: m.chat,

              fromMe: false,

              id: m.key.id,

              participant: m.key.participant

            }

          })

          await dolxie.groupParticipantsUpdate(m.chat, [m.sender], 'delete')

        }

      }

    }

    if (db.data.chats[m.chat].antilinkgc) {

      if (budy.match('chat.whatsapp')) {

        if (!(m.key.fromMe || isAdmins || isOwner || !isBotAdmins)) {

          await dolxie.sendMessage(m.chat, {

            delete: {

              remoteJid: m.chat,

              fromMe: false,

              id: m.key.id,

              participant: m.key.participant

            }

          })

          await dolxie.groupParticipantsUpdate(m.chat, [m.sender], 'delete')

        }

      }

    }

    if (setting.autoread) {

      dolxie.readMessages([m.key])

    }

    if (global.help.includes(command) && setting.autotyping) {

      dolxie.sendPresenceUpdate('composing', from)

      setTimeout(() => {

        dolxie.sendPresenceUpdate('paused', from)

      }, 2000)

    }

    async function react() {

      dolxie.sendMessage(from, {

        react: {

          text: '⏱️',

          key: m.key

        }

      })

    }

// STORE      

const tujuanA = path.join(__dirname, 'database', 'products.json');

const tujuanB = path.join(__dirname, 'database', 'historyt.json');

const tujuanC = path.join(__dirname, 'database', 'discounts.json');   

      

function getDisczz() {

    if (!fs.existsSync(tujuanC)) {

        fs.writeFileSync(tujuanC, '[]', 'utf-8');

    }

    const discountData = fs.readFileSync(tujuanC, 'utf-8');

    return JSON.parse(discountData);

}

function addDisczz(productName, discountPrice, expirationDate) {

    const discounts = getDisczz();

    const newDiscount = {

        produk: productName,

        harga_diskon: discountPrice,

        kadaluarsa: expirationDate

    };

    discounts.push(newDiscount);

    simpenDisc(discounts);

}

function getprodukDariFile() {

    if (!fs.existsSync(tujuanA)) {

        fs.writeFileSync(tujuanA, '[]', 'utf-8');

    }

    const productData = fs.readFileSync(tujuanA, 'utf-8');

    return JSON.parse(productData);

}

function simpenProduknya(products) {

    fs.writeFileSync(tujuanA, JSON.stringify(products, null, 2), 'utf-8');

}

function getidProduk(products) {

    if (products.length === 0) {

        return 1;

    }

    const lastProduct = products[products.length - 1];

    return lastProduct.produk + 1;

}

function cekProduknye(productName) {

    const products = getprodukDariFile();

    return products.some(product => product.nama.toLowerCase() === productName.toLowerCase());

}

function addprodukzz(name, price, stock) {

    const products = getprodukDariFile();

    const newProduct = {

        produk: getidProduk(products),

        nama: name,

        harga: price,

        stok: stock

    };

    products.push(newProduct);

    simpenProduknya(products);

}

function delprodukzz(productName) {

    let products = getprodukDariFile();

    products = products.filter(product => product.nama.toLowerCase() !== productName.toLowerCase());

    simpenProduknya(products);

}

function updprodukzz(name, price, stock) {

    let products = getprodukDariFile();

    const productIndex = products.findIndex(product => product.nama.toLowerCase() === name.toLowerCase());

    if (productIndex !== -1) {

        products[productIndex].harga = price;

        products[productIndex].stok = stock;

        simpenProduknya(products);

    }

}

function getprodukdb() {

    return getprodukDariFile();

}

function simpenSmTr(transactions) {

    fs.writeFileSync(tujuanB, JSON.stringify(transactions, null, 2), 'utf-8');

}

function getSmTr() {

    if (!fs.existsSync(tujuanB)) return [];

    return JSON.parse(fs.readFileSync(tujuanB));

}

function getTrId(id) {

    const transactions = getSmTr();

    return transactions.find(t => t.id.trim() === id.trim());

}

function cIdTrnya() {

    const transactions = getSmTr();

    return `TRANS${transactions.length + 1}`;

}

function saveTrnye(transaction) {

    const transactions = getSmTr();

    transactions.push(transaction);

    simpenSmTr(transactions);

}

function simpenDisc(discounts) {

    fs.writeFileSync(tujuanC, JSON.stringify(discounts, null, 2), 'utf-8');

}

function persenDiskonnya(originalPrice, discountPrice) {

    return Math.round(((originalPrice - discountPrice) / originalPrice) * 100);

}

function ngerestokk(name, quantity) {

    const products = getprodukDariFile();

    const productIndex = products.findIndex(product => product.nama.toLowerCase() === name.toLowerCase());

    if (productIndex !== -1) {

        products[productIndex].stok += quantity;

        simpenProduknya(products);

        return products[productIndex];

    } else {

        return null

    }

} 

      

    switch (command) {

    case 'antilink': {

      if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      if (args[0] === "on") {

        if (db.data.chats[m.chat].antilink) return m.reply('مفعّل مسبقاً')

        db.data.chats[m.chat].antilink = true

        m.reply('✅ تم تفعيل مانع الروابط!')

      } else if (args[0] === "off") {

        if (!db.data.chats[m.chat].antilink) return m.reply('مُعطَّل مسبقاً')

        db.data.chats[m.chat].antilink = false

        m.reply('✅ تم تعطيل مانع الروابط!')

      } else {

        m.reply('أمر غير معروف. استخدم "on" للتفعيل أو "off" للتعطيل.')

      }

    }

    break

    case 'antilinkgc': {

      if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      if (args[0] === "on") {

        if (db.data.chats[m.chat].antilinkgc) return m.reply('مفعّل مسبقاً')

        db.data.chats[m.chat].antilinkgc = true

        m.reply('✅ تم تفعيل مانع روابط المجموعات!')

      } else if (args[0] === "off") {

        if (!db.data.chats[m.chat].antilinkgc) return m.reply('مُعطَّل مسبقاً')

        db.data.chats[m.chat].antilinkgc = false

        m.reply('✅ تم تعطيل مانع روابط المجموعات!')

      } else {

        m.reply('أمر غير معروف. استخدم "on" للتفعيل أو "off" للتعطيل.')

      }

    }

    break

    case 'welcome': {

      if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      if (args[0] === "on") {

        if (db.data.chats[m.chat].welcome) return m.reply('مفعّل مسبقاً')

        db.data.chats[m.chat].welcome = true

        m.reply('✅ تم تفعيل رسالة الترحيب!')

      } else if (args[0] === "off") {

        if (!db.data.chats[m.chat].welcome) return m.reply('مُعطَّل مسبقاً')

        db.data.chats[m.chat].welcome = false

        m.reply('✅ تم تعطيل رسالة الترحيب!')

      } else {

        m.reply('أمر غير معروف. استخدم "on" للتفعيل أو "off" للتعطيل.')

      }

    }

    break

    case 'goodbye': {

      if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      if (args[0] === "on") {

        if (db.data.chats[m.chat].goodbye) return m.reply('مفعّل مسبقاً')

        db.data.chats[m.chat].goodbye = true

        m.reply('✅ تم تفعيل رسالة الوداع!')

      } else if (args[0] === "off") {

        if (!db.data.chats[m.chat].goodbye) return m.reply('مُعطَّل مسبقاً')

        db.data.chats[m.chat].goodbye = false

        m.reply('✅ تم تعطيل رسالة الوداع!')

      } else {

        m.reply('أمر غير معروف. استخدم "on" للتفعيل أو "off" للتعطيل.')

      }

    }

    break

    case 'buatgc':

    case 'creategc': {

      if (!isOwner) return onlyOwn()

      if (!args.join(" ")) return m.reply(`Contoh: ${p_c} namagrup`)

      try {

        let cret = await dolxie.groupCreate(args.join(" "), [])

        let response = await dolxie.groupInviteCode(cret.id)

        let teks2 = `*BERHASIL MEMBUAT GRUP*

• Nama: ${cret.subject}

• Owner: @${cret.owner.split("@")[0]}

• Dibuat: ${moment(cret.creation * 1000).tz("Asia/Kolkata").format("DD/MM/YYYY HH:mm:ss")}

• ID: ${cret.id}

• Link: chat.whatsapp.com/${response}`

        m.reply(teks2)

      } catch {

        m.reply('حدث خطأ')

      }

    }

    break

    case 'kick': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      try {

        const participants = await dolxie.groupMetadata(m.chat)

        const ownerNumber = global.owner + '@s.whatsapp.net'

        if (users === ownerNumber || users === botNumber) {

          return m.reply('لا يمكن إخراج الأدمن الرئيسي أو البوت.')

        }

        if (!participants.participants.some(p => p.id === users)) {

          return m.reply('العضو المستهدف ليس في المجموعة.')

        }

        await dolxie.groupParticipantsUpdate(m.chat, [users], 'remove')

        m.reply('✅ تم طرد العضو.')

      } catch (err) {

        m.reply('حدث خطأ.')

      }

    }

    break

    case 'warning':

    case 'warn': {

      if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      let users = m.mentionedJid[0] ?

        m.mentionedJid[0] :

        m.quoted ?

        m.quoted.sender :

        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      if (!users) return m.reply(`Tag/Reply target yang mau di-${command}`)

      if (owner.includes(users)) return m.reply('لا يمكن تطبيق هذا على المالك')

      if (!db.data.chats[m.chat].warn) db.data.chats[m.chat].warn = {}

      db.data.chats[m.chat].warn[users] = (db.data.chats[m.chat].warn[users] || 0) + 1

      const total = db.data.chats[m.chat].warn[users]

      dolxie.sendTextWithMentions(m.chat, `⚠️ Sukses *${command}* @${users.split('@')[0]}\nTotal Warning: ${total}/${setting.warnCount}`, m)

      if (total >= setting.warnCount) {

        if (!isAdmins || !isBotAdmins) return

        await dolxie.sendMessage(m.chat, {

          text: `🚫 @${users.split('@')[0]} وصل لـ ${total}/${setting.warnCount} تحذير وسيتم طرده.`,

          mentions: [users]

        })

        await dolxie.groupParticipantsUpdate(m.chat, [users], 'remove')

        delete db.data.chats[m.chat].warn[users]

      }

    }

    break

    case 'unwarning':

    case 'unwarn': {     if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      let users = m.mentionedJid[0] ?

        m.mentionedJid[0] :

        m.quoted ?

        m.quoted.sender :

        text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      if (!users) return m.reply(`Tag/Reply target yang mau di-${command}`)

      if (owner.includes(users)) return m.reply('لا يمكن إزالة التحذير من المالك')

      if (!db.data.chats[m.chat].warn) db.data.chats[m.chat].warn = {}

      if (!db.data.chats[m.chat].warn[users] || db.data.chats[m.chat].warn[users] === 0) {

        return m.reply(`User tersebut belum memiliki warning.`)

      }

      db.data.chats[m.chat].warn[users] -= 1

      const sisa = db.data.chats[m.chat].warn[users]

      dolxie.sendTextWithMentions(m.chat, `✅ Sukses *${command}* @${users.split('@')[0]}\nSisa Warning: ${sisa}/${setting.warnCount}`, m)

      if (db.data.chats[m.chat].warn[users] === 0) {

        delete db.data.chats[m.chat].warn[m.sender];

      }

    }

    break

    case 'listwarn':

    case 'cekwarn': {

      if (!m.isGroup) return onlyGrup()

      if (!isAdmins) return onlyAdmin()

      let warnData = db.data.chats[m.chat].warn

      if (!warnData || Object.keys(warnData).length === 0) {

        return m.reply('لا يوجد أعضاء لديهم تحذيرات في هذه المجموعة.')

      }

      let teks = `⚠️ *Daftar Warning Member Grup:*\n\n`

      let no = 1

      for (let jid in warnData) {

        teks += `${no++}. @${jid.split('@')[0]} - ${warnData[jid]}/${setting.warnCount} warning\n`

      }

      await dolxie.sendTextWithMentions(m.chat, teks, m)

    }

    break

    case 'pm':

    case 'promote': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      await dolxie.groupParticipantsUpdate(m.chat, [users], 'promote').then((res) => m.reply('Sukses promote target')).catch((err) => m.reply('حدث خطأ'))

    }

    break

    case 'dm':

    case 'demote': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      let users = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '') + '@s.whatsapp.net'

      await dolxie.groupParticipantsUpdate(m.chat, [users], 'demote').then((res) => m.reply('Sukses demote target')).catch((err) => m.reply('حدث خطأ'))

    }

    break

    case 'h':

    case 'ht':

    case 'hidetag': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyOa()

      if (m.quoted) {

        await dolxie.sendMessage(m.chat, {

          forward: m.quoted.fakeObj,

          mentions: participants.map(a => a.id)

        })

      }

      if (!m.quoted) {

        await dolxie.sendMessage(m.chat, {

          text: q ? q : '',

          mentions: participants.map(a => a.id)

        }, {

          quoted: ftext

        })

      }

    }

    break

    case 'open':

    case 'bukagc':

    case 'buka': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      dolxie.groupSettingUpdate(m.chat, 'not_announcement')

      m.reply(`Sukses membuka grup`)

    }

    break

    case 'close':

    case 'tutupgc':

    case 'tutup': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      dolxie.groupSettingUpdate(m.chat, 'announcement')

      m.reply(`Sukses menutup grup`)

    }

    break

    case 'resetlink':

    case 'revoke': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyAdmin()

      if (!isBotAdmins) return onlyBotAdmin()

      await dolxie.groupRevokeInvite(m.chat)

        .then(res => {

          m.reply(`Sukses menyetel ulang link grup`)

        }).catch(() => m.reply('حدث خطأ'))

    }

    break

    case 'leave': {

      try {

        if (!isOwner) return onlyOwn()

        await dolxie.groupLeave(m.chat)

      } catch (err) {

        console.error(err)

        m.reply('حدث خطأ')

      }

    }

    break

    case 'tagall': {

      if (!m.isGroup) return onlyGrup()

      if (!isOwner && !isAdmins) return onlyOa()

      if (!isBotAdmins) return onlyBotAdmin()

      let teks = `*👥 منـشن جمـيع*

@${m.chat}

 

رساله: ${q ? q : 'لا يوجد'}`

      dolxie.sendMessage(m.chat, {

        text: teks,

        contextInfo: {

          mentionedJid: participants.map(a => a.id),

          groupMentions: [{

            groupJid: m.chat,

            groupSubject: "everyone"

          }]

        }

      }, {

        quoted: m

      })

    }

    break

    case 'cekidgc':

    case 'cekgcid':

    case 'groupid': {

      if (!m.isGroup) return onlyGrup();

      let admin = groupMetadata.participants.filter(p => p.admin);

      let creationDate = moment(groupMetadata.creation * 1000).format('DD/MM/YY HH:mm');

      let subject = groupMetadata.subject;

      let restrict = groupMetadata.restrict ? 'Hanya admin' : 'Semua peserta';

      let announce = groupMetadata.announce ? 'Hanya admin' : 'Semua peserta';

      let antiLink = db.data.chats[m.chat].antilink ? 'Aktif' : 'Nonaktif';

      let antiLinkgc = db.data.chats[m.chat].antilinkgc ? 'Aktif' : 'Nonaktif';

      let teks = `${monospace("CEK GROUP ID")}

Nama grup: ${subject}

Total member: ${groupMetadata.participants.length}

Tgl dibuat: ${creationDate}

ID: ${groupMetadata.id}`;

      m.reply(teks)

    }

    break

 

    case 'listuser': {

      if (!isOwner && !isReseller) return onlyOr()

      let page = args[0] ? args[0] : '1';

      let f = await fetch(domain + "api/application/users?page=" + page, {

        "method": "GET",

        "headers": {

          "Accept": "application/json",

          "Content-Type": "application/json",

          "Authorization": "Bearer " + apikey

        }

      });

      let res = await f.json();

      let users = res.data;

      let messageText = `List user\n\n`;

      for (let user of users) {

        let u = user.attributes;

        messageText += `ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Tidak aktif' : 'Aktif'}\n`;

        messageText += `${u.username}\n`;

        messageText += `${u.first_name} ${u.last_name}\n\n`;

      }

      messageText += `Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;

      messageText += `Total user: ${res.meta.pagination.count}`;

      await dolxie.sendMessage(m.chat, {

        text: messageText

      }, {

        quoted: m

      });

      if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {

        m.reply(`Contoh: ${p_c} ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya`);

      }

    }

    break

    case 'addadmin': {

      if (!isOwner) return onlyOwn()

      let t = text.replace(/^\S+\s+/, '').split(',');

      if (t.length < 3) return m.reply(`Contoh: ${p_c} email,username,name,nomor`);

      let email = t[0];

      let username = t[1];

      let name = t[2];

      let u = m.quoted ? m.quoted.sender : t[3] ? t[3].replace(/[^0-9]/g, '') + '@s.whatsapp.net' : m.mentionedJid[0];

      if (!u) return m.reply(`Contoh: ${p_c} email,username,name,nomor`);

      let d = (await dolxie.onWhatsApp(u.split`@` [0]))[0] || {};

      let password = username + "admin";

      let f = await fetch(domain + "api/application/users", {

        "method": "POST",

        "headers": {

          "Accept": "application/json",

          "Content-Type": "application/json",

          "Authorization": "Bearer " + apikey

        },

        "body": JSON.stringify({

          "email": email,

          "username": username,

          "first_name": name,

          "last_name": "Admin",

          "root_admin": true,

          "language": "en",

          "password": password.toString()

        })

      });

      let data = await f.json();

      if (data.errors) return m.reply(JSON.stringify(data.errors[0], null, 2));

      let user = data.attributes;

      m.reply(`${monospace("BERHASIL CADMIN!")}

• ID: ${user.id}

• UUID: ${user.uuid}

• Email: ${user.email}

Data lainnya sudah terkirim ke

privat chat...`);

      let teksnyo = `*BERIKUT DATA ADMIN PANEL ANDA* 

• ID: ${user.id}

• UUID: ${user.uuid}

• Email: ${user.email}

• Username: ${user.username}

• Password: ${password.toString()}

• Domain: ${domain}

Simpan data admin panel baik-baik`;

      dolxie.sendMessage(u, {

        text: teksnyo

      }, {

        quoted: ftext

      })

    }

    break

    case 'deladmin': {

      if (!isOwner) return onlyOwn()

      let adminId = args[0];

      if (!adminId) return m.reply(`Format: ${p_c} [admin-id]\nUntuk melihat ID admin ketik ${_p}listadmin`);

      let cek = await fetch(domain + "api/application/users?page=1", {

        "method": "GET",

        "headers": {

          "Accept": "application/json",

          "Content-Type": "application/json",

          "Authorization": "Bearer " + apikey

        }

      })

      let res2 = await cek.json();

      let users = res2.data;

      let getid = null

      let idadmin = null

      for (let e of users) {

        if (e.attributes.id == adminId && e.attributes.root_admin == true) {

          getid = e.attributes.username

          idadmin = e.attributes.id

          let delusr = await fetch(domain + `api/application/users/${idadmin}`, {

            "method": "DELETE",

            "headers": {

              "Accept": "application/json",

              "Content-Type": "application/json",

              "Authorization": "Bearer " + apikey

            }

          })

          let res = delusr.ok ? {

            errors: null

          } : await delusr.json()

        }

      }

      if (idadmin == null) return m.reply(`ID admin tidak ditemukan!`)

      m.reply(`Berhasil hapus admin panel *${getid}*`)

    }

    break

    case 'listadmin': {

      if (!isOwner) return onlyOwn()

      let page = args[0] ? args[0] : '1';

      let f = await fetch(domain + "api/application/users?page=" + page, {

        "method": "GET",

        "headers": {

          "Accept": "application/json",

          "Content-Type": "application/json",

          "Authorization": "Bearer " + apikey

        }

      });

      let res = await f.json();

      let users = res.data;

      let messageText = `Berikut List Admin:\n\n`;

      for (let user of users) {

        let u = user.attributes;

        if (u.root_admin) {

          messageText += `ID: ${u.id} - Status: ${u.attributes?.user?.server_limit === null ? 'Inactive' : 'Active'}\n`;

          messageText += `${u.username}\n`;

          messageText += `${u.first_name} ${u.last_name}\n\n`;

        }

      }

      messageText += `Halaman: ${res.meta.pagination.current_page}/${res.meta.pagination.total_pages}\n`;

      messageText += `Total: ${res.meta.pagination.count}`;

      await dolxie.sendMessage(m.chat, {

        text: messageText

      }, {

        quoted: m

      });

      if (res.meta.pagination.current_page < res.meta.pagination.total_pages) {

        m.reply(`Contoh: ${p_c} ${res.meta.pagination.current_page + 1} untuk melihat halaman selanjutnya`);

      }

    }

    break

    // PAYMENT   

    case 'payment': {

      m.reply(`Melakukan Transaksi?

Payment Yang Tersedia 

 *E-Wallet  :*

    • Gopay

    • OVO

    • Dana

    • Qris

Gunakan dengan cara ${_p}dana`)

    }

    break

    case 'qris': {

      try {

        await dolxie.sendMessage(m.chat, {

          image: {

            url: `${global.qris}`

          },

          caption: `*Qris all payment*\nSetelah Transfer Silahkan Kirim Bukti Pembayaran.`

        }, {

          quoted: m

        });

      } catch (error) {

        return m.reply('*Gagal Mengambil Qris*\nQris Tidak Tersedia/Tidak Valid..')

      }

    }

    break

    case 'dana': {

      let yow = `${monospace("PAYMENT")}

 DANA

- ${global.dana}

- ${global.adana}

© ${botname}`

      dolxie.sendMessage(m.chat, {

        text: yow

      }, {

        quoted: ftext

      })

    }

    break

    case 'gopay': {

      let yow = `${monospace("PAYMENT")}

 GOPAY

- ${global.gopay}

- ${global.agopay}

© ${botname}`

      dolxie.sendMessage(m.chat, {

        text: yow

      }, {

        quoted: ftext

      })

    }

    break

    case 'ovo': {

      let yow = `${monospace("PAYMENT")}

 OVO

- ${global.ovo}

- ${global.aovo}

© ${botname}`

      dolxie.sendMessage(m.chat, {

        text: yow

      }, {

        quoted: ftext

      })

    }

    break

    case 'done': {

      if (!isOwner) return onlyOwn();

      if (!m.quoted) return m.reply('رد على الطلب الذي تمت معالجته')

      let tek = m.quoted ? quoted.text : quoted.text.split(args[0])[1]

      let sukses = `「 *TRANSAKSI BERHASIL* 」\n\n\`\`\`📆 TANGGAL : @tanggal\n⌚ JAM : @jam\n✨ STATUS : Berhasil\`\`\`\n\nTerimakasih @user Next Order ya🙏`

      dolxie.sendTextWithMentions(m.chat, (sukses.replace('@pesanan', tek ? tek : '-').replace('@user', '@' + m.quoted.sender.split("@")[0]).replace('@jam', wibTime).replace('@tanggal', tanggal).replace('@user', '@' + m.quoted.sender.split("@")[0])), m)

    }

    break

 

// OWNER

    case 'addown':

    case 'addowner': {

      if (!isOwner) return onlyOwn();

      if (!args[0]) return m.reply(`Contoh: ${p_c} tag/kutip`);

      let users = m.mentionedJid[0] ?

        m.mentionedJid[0] :

        m.quoted ?

        m.quoted.sender :

        text.replace(/[^0-9]/g, '');

      let getusers = users.replace(/[^0-9]/g, '');

      if (own.includes(getusers)) return m.reply('المستخدم موجود بالفعل في قائمة المالكين!');

      own.push(getusers);

      fs.writeFileSync('./database/owner.json', JSON.stringify(own, null, 2));

      m.reply('✅ تمت إضافة المالك');

    }

    break

    case 'delown':

    case 'delowner': {

      if (!isOwner) return onlyOwn();

      if (!args[0]) return m.reply(`Contoh: ${p_c} tag/kutip`);

      let users = m.mentionedJid[0] ?

        m.mentionedJid[0] :

        m.quoted ?

        m.quoted.sender :

        q.split('|')[0].replace(/[^0-9]/g, '');

      const index = own.indexOf(users);

      if (index === -1) return m.reply('المستخدم غير موجود في قائمة المالكين!');

      own.splice(index, 1);

      fs.writeFileSync('./database/owner.json', JSON.stringify(own, null, 2));

      m.reply('✅ تم حذف المالك');

    }

    break

    case 'listown':

    case 'listowner': {

      if (!isOwner) return onlyOwn();

      let teks = `List owner\nTotal: ${own.length}\n\n`;

      for (let kon of own) {

        teks += `• ${kon}\n`;

      }

      m.reply(teks);

    }

    break

    case 'addreseller':

    case 'addres': {

      if (!isOwner) return onlyOwn()

      if (!args[0]) return m.reply(`Contoh: ${p_c} nomor`)

      bnnd = text.split("|")[0].replace(/[^0-9]/g, '')

      let cekseler = await dolxie.onWhatsApp(bnnd + `@s.whatsapp.net`)

      if (cekseler.length == 0) return m.reply(`Masukkan nomor yang aktif!`)

      res.push(bnnd)

      fs.writeFileSync('./data/default-db/reseller.json', JSON.stringify(res))

      m.reply(`Berhasil addreseller`)

    }

    break

    case 'delreseller':

    case 'delres': {

      if (!!isOwner) return onlyOwn()

      if (!args[0]) return m.reply(`Contoh: ${p_c} nomor`)

      yaki = text.split("|")[0].replace(/[^0-9]/g, '')

      unp = res.indexOf(yaki)

      res.splice(unp, 1)

      fs.writeFileSync('./data/default-db/reseller.json', JSON.stringify(res))

      m.reply(`Berhasil delreseller`)

    }

    break

    case 'listreseller':

    case 'listres': {

      if (!isOwner) return onlyOwn()

      tekso = `List reseller\nTotal: ${res.length}\n\n`

      for (let i of res) {

        tekso += `• ${i}\n`

      }

      m.reply(tekso.trim())

    }

    break

    case 'autoread': {

      if (!isOwner) return onlyOwn()

      if (args[0] === 'on') {

        if (setting.autoread) return m.reply('Sudah diaktifkan sebelumnya')

        setting.autoread = true

        fs.writeFileSync('./lib/settings.json', JSON.stringify(setting, null, 2))

        await m.reply('Sukses mengaktifkan autoread.')

      } else if (args[0] === 'off') {

        if (!setting.autoread) return m.reply('Sudah dinonaktifkan sebelumnya')

        setting.autoread = false

        fs.writeFileSync('./lib/settings.json', JSON.stringify(setting, null, 2))

        await m.reply('Sukses menonaktifkan autoread.')

      } else {

        m.reply('أمر غير معروف. استخدم "on" للتفعيل أو "off" للتعطيل.')

      }

    }

    break

    case 'autotyping': {

      if (!isOwner) return onlyOwn()

      if (args[0] === 'on') {

        if (setting.autotyping) return m.reply('Sudah diaktifkan sebelumnya')

        setting.autotyping = true

        fs.writeFileSync('./lib/settings.json', JSON.stringify(setting, null, 2))

        await m.reply('Sukses mengaktifkan autotyping.')

      } else if (args[0] === 'off') {

        if (!setting.autotyping) return m.reply('Sudah dinonaktifkan sebelumnya')

        setting.autotyping = false

        fs.writeFileSync('./lib/settings.json', JSON.stringify(setting, null, 2))

        await m.reply('Sukses menonaktifkan autotyping.')

      } else {

        m.reply('أمر غير معروف. استخدم "on" للتفعيل أو "off" للتعطيل.')

      }

    }

    break

    case 'backup': {

      if (!isOwner) return onlyOwn()

      try {

        const {

          execSync

        } = require("child_process");

        const ls = (await execSync("ls")).toString().split("\n").filter((pe) =>

          pe != "node_modules" &&

          pe != "session" &&

          pe != "package-lock.json" &&

          pe != "yarn.lock" &&

          pe != "");

        const exec = await execSync(`zip -r Backup.zip ${ls.join(" ")}`);

        await dolxie.sendMessage(m.isGroup ? owner + '@s.whatsapp.net' : from, {

          document: await fs.readFileSync('./Backup.zip'),

          mimetype: "application/zip",

          fileName: "Backup.zip",

        }, {

          quoted: m

        });

        await execSync("rm -rf Backup.zip");

      } catch (err) {

        m.reply('حدث خطأ')

      }

    }

    break

    case 'addcase': {

      if (!isOwner) return onlyOwn();

      if (!text) return m.reply(`Contoh: ${p_c} case nya`);

      const namaFile = path.join(__dirname, 'dolxie.js');

      const caseBaru = `${text}\n\n`;

      const tambahCase = (data, caseBaru) => {

        const posisiDefault = data.lastIndexOf("default:");

        if (posisiDefault !== -1) {

          const kodeBaruLengkap = data.slice(0, posisiDefault) + caseBaru + data.slice(posisiDefault);

          return {

            success: true,

            kodeBaruLengkap

          };

        } else {

          return {

            success: false,

            message: "Tidak dapat menemukan case default di dalam file!"

          };

        }

      };

      fs.readFile(namaFile, 'utf8', (err, data) => {

        if (err) {

          console.error('حدث خطأ saat membaca file:', err);

          return m.reply(`حدث خطأ saat membaca file: ${err.message}`);

        }

        const result = tambahCase(data, caseBaru);

        if (result.success) {

          fs.writeFile(namaFile, result.kodeBaruLengkap, 'utf8', (err) => {

            if (err) {

              console.error('حدث خطأ saat menulis file:', err);

              return m.reply(`حدث خطأ saat menulis file: ${err.message}`);

            } else {

              console.log('Sukses menambahkan case baru:');

              console.log(caseBaru);

              return m.reply('Sukses menambahkan case!');

            }

          });

        } else {

          console.error(result.message);

          return m.reply(result.message);

        }

      });

    }

    break

    case 'delcase': {

      if (!isOwner) return onlyOwn();

      if (!text) return m.reply(`Contoh: ${p_c} nama case`);

      const fs = require('fs').promises;

      async function dellCase(filePath, caseNameToRemove) {

        try {

          let data = await fs.readFile(filePath, 'utf8');

          const regex = new RegExp(`case\\s+'${caseNameToRemove}':[\\s\\S]*?break`, 'g');

          const modifiedData = data.replace(regex, '');

          if (data === modifiedData) {

            m.reply('Case tidak ditemukan atau sudah dihapus.');

            return;

          }

          await fs.writeFile(filePath, modifiedData, 'utf8');

          m.reply('Sukses menghapus case!');

        } catch (err) {

          m.reply(`حدث خطأ: ${err.message}`);

        }

      }

      dellCase('./dolxie.js', q);

    }

    break

    case 'getcase': {

      if (!isOwner) return onlyOwn()

      if (!text) return m.reply(`Contoh: ${p_c} caseName1 caseName2 caseName3 ...`)

      const caseNames = text.split(' ').map(name => name.trim()).filter(name => name)

      if (caseNames.length === 0) {

        return m.reply(`Masukkan minimal satu case name. Contoh: ${p_c} caseName1 caseName2`)

      }

      const getCase = async (caseName) => {

        try {

          const fileContent = await fs.promises.readFile('./dolxie.js', "utf-8")

          const caseRegex = new RegExp(`case '${caseName}'[\\s\\S]*?break`, 'g')

          const match = fileContent.match(caseRegex)

          if (!match) {

            return `Case '${caseName}' tidak ditemukan.`

          }

          return match[0]

        } catch (error) {

          return `حدث خطأ saat membaca file: ${error.message}`

        }

      }

      const getCases = async (caseNames) => {

        try {

          const casePromises = caseNames.map(caseName => getCase(caseName))

          const cases = await Promise.all(casePromises)

          return cases.join('\n\n')

        } catch (error) {

          return `حدث خطأ: ${error.message}`

        }

      }

      getCases(caseNames)

        .then(caseCode => m.reply(caseCode))

        .catch(error => m.reply(`حدث خطأ: ${error.message}`))

    }

    break

    case 'setppbot': {

      if (!isOwner) return onlyOwn()

      if (!quoted) return m.reply(`Kirim/kutip gambar dengan caption ${p_c}`)

      if (!/image/.test(mime)) return m.reply(`Kirim/kutip gambar dengan caption ${p_c}`)

      if (/webp/.test(mime)) return m.reply(`Kirim/kutip gambar dengan caption ${p_c}`)

      let media = await dolxie.downloadAndSaveMediaMessage(quoted)

      await dolxie.updateProfilePicture(botNumber, {

        url: media

      }).then(() => fs.unlinkSync(media)).catch((err) => fs.unlinkSync(media))

      m.reply('Sukses mengganti pp bot!')

    }

    break

    case 'delppbot': {

      if (!isOwner) return onlyOwn()

      await dolxie.removeProfilePicture(botNumber)

      await m.reply(`Sukses menghapus pp bot!`)

    }

    break

    case 'sampah':

    case 'delsampah': {

      if (!isOwner) return onlyOwn()

      const getFiles = (dir) => {

        return fs.readdirSync(dir).filter(v =>

          v.endsWith("gif") || v.endsWith("png") || v.endsWith("mp3") ||

          v.endsWith("mp4") || v.endsWith("jpg") || v.endsWith("jpeg") ||

          v.endsWith("webp") || v.endsWith("webm") ||

          v.endsWith("wav") || v.endsWith("aac") || v.endsWith("flac") ||

          v.endsWith("ogg") || v.endsWith("opus") || v.endsWith("m4a") ||

          v.endsWith("amr") || v.endsWith("3gp")

        ).map(v => `${dir}/${v}`)

      }

      let libFiles = getFiles('./x-system')

      let cacheFiles = fs.existsSync('./.cache') ? getFiles('./.cache') : []

      let rootFiles = getFiles('.').filter(v => !v.startsWith('./x-system') && !v.startsWith('./.cache'))

      let all = [...libFiles, ...cacheFiles, ...rootFiles]

      let jumlahSampah = all.length

      var teks = `${monospace("Jumlah Sampah")}\n\n`

      teks += `Total: ${jumlahSampah} sampah\n\n`

      teks += all.map(o => `${o}\n`).join("")

      if (jumlahSampah > 0) {

        edit3(teks, `Menghapus ${jumlahSampah} file sampah.`, `Sukses menghapus semua sampah.`)

        all.forEach(file => {

          fs.unlinkSync(file)

        })

      } else {

        edit2(teks, `Tidak ada file sampah untuk dihapus.`)

      }

    }

    break

    case 'clearsesi':

    case 'clearallsesi': {

      if (!isOwner) return onlyOwn()

      let directoryPath = path.join(`./${sessionName}`) //&& './x-system') //path.join();

      fs.readdir(directoryPath, async function (err, files) {

        if (err) {

          return m.reply('Tidak dapat memindai direktori: ' + err);

        }

        let filteredArray = await files.filter(item => item.startsWith("session") || item.startsWith("pre-key") || item.startsWith("sender-key"))

        var teks = `Menghapus ${filteredArray.length} file sampah...`

        if (filteredArray.length == 0) return m.reply(teks)

        /*filteredArray.map(function(e, i){

        teks += (i+1)+`. ${e}\n`

        })*/

        edit2(teks, 'Berhasil menghapus semua sampah')

        await filteredArray.forEach(function (file) {

          fs.unlinkSync(`./${sessionName}/${file}`)

        });

      });

    }

    break

    default:

      break

    }

  } catch (err) {

    console.log(err)

  }

}

