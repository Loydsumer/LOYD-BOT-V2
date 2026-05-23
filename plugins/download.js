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
const ytsr = require('ytsr')
const yts = async function(query) {
  const res = await ytsr(query, { limit: 20 })
  const all = res.items.map(function(v) {
    return {
      type: v.type,
      title: v.title || v.name || '',
      name: v.name || v.title || '',
      url: v.url || '',
      thumbnail: (v.bestThumbnail && v.bestThumbnail.url) || '',
      image: (v.bestThumbnail && v.bestThumbnail.url) || '',
      timestamp: v.duration || '',
      ago: v.uploadedAt || '',
      views: v.views || 0,
      subCountLabel: v.subscriberCount || '',
      subCount: v.subscriberCount || '',
      videoCount: v.videoCount || ''
    }
  })
  return { all: all }
}
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
    const q = args.join(" "), text = q
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
    const owner = global.owner || ''
    const own = (() => { try { return JSON.parse(fs.readFileSync('./database/owner.json','utf8')) } catch(e) { return [] } })()
    const res = (() => { try { return JSON.parse(fs.readFileSync('./database/reseller.json','utf8')) } catch(e) { return [] } })()
    const isImage = (type == 'imageMessage')
    const isVideo = (type == 'videoMessage')
    const isAudio = (type == 'audioMessage')
    const isSticker = (type == 'stickerMessage')
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
    dolxie.newsletterFollow("120363402804601196@newsletter'")

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
case 'savekontakgcs': {
 if (!isOwner) return OnlyOwn()
 if (!isGc) return OnlyGrup()

 const groupMetadata = await dolxie.groupMetadata(from)
 const participants = groupMetadata.participants

 // AMBIL SEMUA MEMBER DAN NORMALISASI ID
 const memberList = participants.map(v => {
 let id = v.id

 // Jika ID tanpa domain
 if (!id.includes("@")) {
 id = id + "@s.whatsapp.net"
 }

 // Jika domain aneh → pakai format WA normal
 if (!id.endsWith("@s.whatsapp.net")) {
 id = id.split("@")[0] + "@s.whatsapp.net"
 }

 return id
 })

 if (memberList.length === 0) {
 return m.reply("لا توجد أرقام يمكن حفظها من هذه المجموعة.")
 }

 // Masukkan & hapus duplikat
 const uniqueContacts = [...new Set(memberList)]
 fs.writeFileSync("./database/contacts.json", JSON.stringify(uniqueContacts))

 m.reply(`تم بنجاح mengambil ${uniqueContacts.length} kontak.\nإرسال ملف vCard للمحادثة الخاصة...`)

 try {
 // Buat file VCF dengan penamaan Kontak1, Kontak2...
 let vcf = ""
 uniqueContacts.forEach((contact, index) => {
 const number = contact.split("@")[0]
 const name = `Kontak${index + 1}`

 vcf += [
 "BEGIN:VCARD",
 "VERSION:3.0",
 `FN:${name}`,
 `TEL;type=CELL;type=VOICE;waid=${number}:+${number}`,
 "END:VCARD",
 ""
 ].join("\n")
 })

 fs.writeFileSync("./database/contacts.vcf", vcf, "utf8")

 } catch (e) {
 return m.reply(String(e))
 } finally {
 await dolxie.sendMessage(
 sender,
 {
 document: fs.readFileSync("./database/contacts.vcf"),
 fileName: "contacts.vcf",
 caption: "اضغط على الملف لحفظ جهات الاتصال.",
 mimetype: "text/vcard"
 },
 { quoted: ftext }
 )

 fs.writeFileSync("./database/contacts.json", "[]")
 }
}
break

case "savekontakidgc": {
 try {
 if (!isOwner) return onlyOwn()
 if (!isGc) return onlyGrup()
 if (!text) return m.reply(`_*Contoh:*_\n${prefix + command} idgrup`)

 const groupID = text.trim()
 m.reply("⏳ جاري جلب بيانات المجموعة...")

 // ambil metadata group dari ID
 let groupMetadata
 try {
 groupMetadata = await dolxie.groupMetadata(groupID)
 } catch (err) {
 return m.reply("❌ *فشل جلب البيانات*\nمعرف المجموعة خاطئ أو البوت ليس في المجموعة.")
 }

 if (!groupMetadata.participants) {
 return m.reply("❌ تعذر جلب أعضاء المجموعة.")
 }

 const peserta = groupMetadata.participants.map(p => p.id)

 if (peserta.length === 0) return m.reply("⚠️ لا يوجد أعضاء.")

 m.reply(`📥 جاري جلب *${peserta.length}* جهة اتصال...`)

 // Generate VCF
 let vcf = ""
 peserta.forEach((id, i) => {
 const num = id.split("@")[0]
 vcf += `BEGIN:VCARD
VERSION:3.0
FN:Kontak ${i + 1}
TEL;type=CELL;type=VOICE;waid=${num}:+${num}
END:VCARD

`
 })

 // Simpan file
 fs.writeFileSync("./database/contacts.vcf", vcf, "utf8")

 // OWNER JID DARI GLOBAL
 const ownerJid = global.owner + "@s.whatsapp.net"

 // Kirim ke owner
 await dolxie.sendMessage(
 ownerJid,
 {
 document: fs.readFileSync("./database/contacts.vcf"),
 fileName: "contacts.vcf",
 mimetype: "text/vcard",
 caption: `📁 *Kontak dari Grup: ${groupMetadata.subject}*\nTotal: ${peserta.length}`
 }
 )

 m.reply("✅ *تم حفظ جهات الاتصال وإرسالها للمالك! ✅*")

 } catch (e) {
 m.reply("❌ ERROR:\n" + util.format(e))
 }
}
break

case "add": {
if (!isOwner) return onlyOwn()
if (!isGc) return onlyGrup()
if (!isBotAdmins) return onlyBotAdmin()
if (!text) return m.reply(`_*مثال على الاستخدام:*_\n\n${prefix + command} *_628xxx_*`)
let users = m.quoted ? m.quoted.sender : text.replace(/[^0-9]/g, '')+'@s.whatsapp.net'
await dolxie.groupParticipantsUpdate(from, [users], 'add')
m.reply(`تم بنجاح *_Add_* @${users} Kedalam Grup Ini`)
}
break



case "jpmtesti": {
 if (!isOwner) return onlyOwn()
 if (!isGc) return onlyGrup()
 if (!text) return m.reply(`_*مثال على الاستخدام:*_\n\n${prefix + command} foto+caption`)
 if (!/image/.test(mime)) return m.reply(`_*يجب الرد على صورة مع كابشن!*_`)

 if (!global.chtesti) return m.reply("❌ *global.chtesti belum diset.*\nContoh:\n`global.chtesti = \"1203630xxxxx@newsletter\"`")

 const tujuan = global.chtesti // ← langsung kirim ke sini

 const teks = text
 const jid = m.chat
 const rest = await dolxie.downloadAndSaveMediaMessage(quoted)

 await m.reply(`🔄 جاري إرسال التقييم للقناة:\n👉 *${global.chtesti}*`)

 try {
 await dolxie.sendMessage(
 tujuan,
 {
 image: fs.readFileSync(rest),
 caption: teks,
 contextInfo: {
 isForwarded: true,
 forwardingScore: 9999,
 mentionedJid: [m.sender],
 businessMessageForwardInfo: {
 businessOwnerJid: global.owner + "@s.whatsapp.net"
 },
 forwardedNewsletterMessageInfo: {
 newsletterName: global.namaSaluran,
 newsletterJid: global.idSaluran
 }
 }
 },
 { quoted: ftext }
 )
 } catch (err) {
 return m.reply("❌ *فشل الإرسال للقناة!*\n" + util.format(err))
 }

 fs.unlinkSync(rest)

 dolxie.sendMessage(
 m.chat,
 {
 text: `✅ *_JPM Testimoni Selesai._*\nDikirim ke Channel:\n👉 ${tujuan}`,
 mentions: [m.sender],
 contextInfo: {
 isForwarded: true,
 forwardingScore: 9999,
 businessMessageForwardInfo: {
 businessOwnerJid: global.owner + "@s.whatsapp.net"
 },
 forwardedNewsletterMessageInfo: {
 newsletterName: global.namaSaluran,
 newsletterJid: global.idSaluran
 },
 externalAdReply: {
 title: `- Anaya Official`,
 body: `Dolxie Store`,
 thumbnail: global.thumb,
 sourceUrl: "",
 }
 }
 },
 { quoted: ftext }
 )
}
break

case "listgc": case "listgrup": {
if (!isOwner) return onlyOwn()
let teks = `\n *乂 List all group chat*\n`
let a = await dolxie.groupFetchAllParticipating()
let gc = Object.values(a)
teks += `\n* *Total group :* ${gc.length}\n`
for (const u of gc) {
teks += `\n* *ID :* ${u.id}
* *Nama :* ${u.subject}
* *Member :* ${u.participants.length}
* *Status :* ${u.announce == false ? "Terbuka": "Hanya Admin"}
* *Pembuat :* ${u?.subjectOwner ? u?.subjectOwner.split("@")[0] : "Sudah Keluar"}\n`
}
let interactiveButtons = [];
for (const copy of gc) {
interactiveButtons.push({
name: "cta_copy",
buttonParamsJson: JSON.stringify({
display_text: `${copy.subject}`,
id: `${copy.id}`,
copy_code: `${copy.id}`

})

});
}

const interactiveMessage = {
text: ``,
title: `${teks}`,
footer: `Klik Tombol di bawah untuk copy id grupnya`,
interactiveButtons
};

await dolxie.sendMessage(m.chat, interactiveMessage, { quoted: ftext })
}
break;

case "sc": case "script": {
 const nomorbot = (await dolxie.decodeJid(dolxie.user.id)).replace(/@.*/, "");
 const tks = `*سـكـربـت بـوت لـويـد مـواصـفـاتـه خـفـيـف جـيـد للـجـروبـات او خـاص تـقـدر تـنـزل الـعـاب تـتـكـلـم مـع ذكـاء الأصـطـنـاعـي الـبـوت مـجـانـي 100%*

*مـلاحـظـة❗️*
*انا غـيـر مسـؤول عـن أي اسـتـخـدام مـخـالـف للـبـوت*

*سـكـربـت تـنـزيـل الـبـوت*
https://github.com/Loydsumer/LOYD-BOT-V2

*قـنـاة الـبـوت عـشـان أي تـحـديـث جـديـد*
https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L


*قـنـاة الـبـوت ثـانـيـة عـشـان أي تـحـديـث جـديـد*
https://whatsapp.com/channel/0029VaugXE6J93wQZ0CFeH3Y
`
 dolxie.sendMessage(m.chat, {text: tks, mentions: [m.sender], 
contextInfo:{
mentionedJid:[m.sender],
isForwarded: false, 
forwardedNewsletterMessageInfo: {
newsletterJid: null,
newsletterName: ``,
serverId: 200
}, 
externalAdReply: {
title: global.botname, 
thumbnailUrl: global.thumb, 
renderLargerThumbnail: false, 
mediaType: 1, 
previewType: 1, 
sourceUrl: "", 
}}
}, {quoted: fconvert })
}
break

case "fb":
case "fbdl":
case "fbdownload": {
 if (!text.startsWith("https://")) return reply("Masukkan URL Facebook!");

 try {
 await dolxie.sendMessage(m.chat, { react: { text: "🕖", key: m.key } });

 const res = await fetch(`https://api-faa.my.id/faa/fbdownload?url=${encodeURIComponent(text)}`)
 const json = await res.json();

 if (!json.status) return reply("فشل جلب البيانات!");

 const info = json.result.info;
 const media = json.result.media;

 // ==================================================
 // IMAGE MODE (SLIDE)
 // ==================================================
 if (!media.video_hd && !media.video_sd) {
 let imgArray = [];

 // image yg tersedia
 let images = [];
 if (media.photo_image) images.push(media.photo_image);
 else images.push(media.thumbnail);

 let idx = 0;

 for (let img of images) {
 let prep = await prepareWAMessageMedia({
 image: { url: img }
 }, { upload: dolxie.waUploadToServer });

 imgArray.push({
 header: proto.Message.InteractiveMessage.Header.fromObject({
 title: `Foto Slide Ke *${idx += 1}*`,
 hasMediaAttachment: true,
 ...prep
 }),
 nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
 buttons: [
 {
 name: "cta_url",
 buttonParamsJson: `{"display_text":"Buka Foto","url":"${img}","merchant_url":"https://www.google.com"}`
 }
 ]
 })
 });
 }

 const slideMsg = await generateWAMessageFromContent(m.chat, {
 viewOnceMessageV2Extension: {
 message: {
 messageContextInfo: {
 deviceListMetadata: {},
 deviceListMetadataVersion: 2
 },
 interactiveMessage: proto.Message.InteractiveMessage.fromObject({
 body: proto.Message.InteractiveMessage.Body.fromObject({
 text: "*FACEBOOK - IMAGE DOWNLOAD*"
 }),
 carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
 cards: imgArray
 })
 })
 }
 }
 }, {
 userJid: m.sender,
 quoted: fakeQuoted
 });

 await dolxie.relayMessage(m.chat, slideMsg.message, {
 messageId: slideMsg.key.id
 });

 await dolxie.sendMessage(m.chat, { react: { text: "✅", key: m.key } });
 return;
 }

 // ==================================================
 // VIDEO MODE
 // ==================================================
 const vid = media.video_hd || media.video_sd;
 if (!vid) return reply("الفيديو غير موجود!");

 await dolxie.sendMessage(m.chat, {
 video: { url: vid },
 caption: `*FACEBOOK - VIDEO DOWNLOADER*\n\n${info.title || ""}`,
 viewOnce: true
 }, { quoted: fakeQuoted });

 await dolxie.sendMessage(m.chat, { react: { text: "✅", key: m.key } });

 } catch (e) {
 console.log(e)
 reply("حدث خطأ!");
 }
}
break;
case "ig": 
case "igdl":
case "Instagram": {
async function igee_deel(url) {
 try {
 const endpoint = 'https://igram.website/content.php?url=' + encodeURIComponent(url)

 const { data } = await axios.post(endpoint, '', {
 headers: {
 authority: 'igram.website',
 accept: '*/*',
 'accept-language': 'id-ID,id;q=0.9',
 'content-type': 'application/x-www-form-urlencoded',
 cookie: '',
 referer: 'https://igram.website/',
 'sec-ch-ua': '"Chromium";v="139", "Not;A=Brand";v="99"',
 'sec-ch-ua-mobile': '?1',
 'sec-ch-ua-platform': '"Android"',
 'user-agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
 }
 })

 return data
 } catch (e) {
 return { error: e.message }
 }
}

function parse(html) {
 const clean = html.replace(/\n|\t/g, '')

 const videoMatch = [...clean.matchAll(/<source src="([^"]+)/g)].map(x => x[1])
 let imageMatch = [...clean.matchAll(/<img src="([^"]+)/g)].map(x => x[1])

 if (imageMatch.length > 0) imageMatch = imageMatch.slice(1)

 const captionRaw = clean.match(/<p class="text-sm"[^>]*>(.*?)<\/p>/)
 const caption = captionRaw ? captionRaw[1].replace(/<br ?\/?>/g, '\n') : ''

 const likes = clean.match(/far fa-heart"[^>]*><\/i>\s*([^<]+)/)
 const comments = clean.match(/far fa-comment"[^>]*><\/i>\s*([^<]+)/)
 const time = clean.match(/far fa-clock"[^>]*><\/i>\s*([^<]+)/)

 return {
 is_video: videoMatch.length > 0,
 videos: videoMatch,
 images: imageMatch,
 caption,
 likes: likes ? likes[1] : null,
 comments: comments ? comments[1] : null,
 time: time ? time[1] : null
 }
}

function detectContentType(url) {
 if (url.includes('/reel/')) return 'Reel'
 if (url.includes('/stories/')) return 'Story'
 if (url.includes('/p/')) return 'Post'
 return 'Unknown'
}

async function instagram(url) {
 try {
 if (!url || typeof url !== 'string') {
 throw new Error('URL tidak valid')
 }

 const contentType = detectContentType(url)
 const raw = await igee_deel(url)
 
 if (!raw || raw.error) {
 throw new Error(raw.error || 'فشل mengambil data dari Instagram')
 }

 if (!raw.html) {
 throw new Error('Response tidak memiliki HTML')
 }

 const parsed = parse(raw.html)

 const result = {
 success: true,
 status: raw.status || 'success',
 username: raw.username || null,
 contentType: contentType,
 type: parsed.is_video ? 'video' : 'image',
 caption: parsed.caption || '',
 likes: parsed.likes || null,
 comments: parsed.comments || null,
 time: parsed.time || null,
 media: []
 }

 if (parsed.is_video && parsed.videos.length > 0) {
 result.media = parsed.videos.map((url, idx) => ({
 type: 'video',
 url: url,
 index: idx + 1
 }))
 } else if (parsed.images.length > 0) {
 result.media = parsed.images.map((url, idx) => ({
 type: 'image',
 url: url,
 index: idx + 1
 }))
 }

 if (result.media.length === 0) {
 throw new Error('Tidak ada media yang ditemukan')
 }

 return result

 } catch (error) {
 throw error
 }
}
 try {
 if (!args[0]) {
 return m.reply(`❌ *Masukkan URL Instagram!*\n\n*Contoh:*\n${cmd} https://www.instagram.com/p/xxx\n\n*Support:*\n• Post (Image/Video)\n• Reels\n• Stories\n• Multiple Images`)
 }

 const url = args[0]

 if (!url.match(/instagram\.com|instagr\.am/i)) {
 return m.reply('❌ الرابط ليس من إنستغرام!')
 }

 await m.reply('⏳ *جاري تحميل الوسائط من إنستغرام...*\n_يرجى الانتظار_')

 const result = await instagram(url)

 let captionText = `✅ *Instagram Downloader*\n\n`
 if (result.username) captionText += `👤 *Username:* @${result.username}\n`
 if (result.contentType) captionText += `📌 *Type:* ${result.contentType}\n`
 if (result.likes) captionText += `❤️ *Likes:* ${result.likes}\n`
 if (result.comments) captionText += `💬 *Comments:* ${result.comments}\n`
 if (result.time) captionText += `⏰ *Posted:* ${result.time}\n`
 captionText += `🎬 *Total Media:* ${result.media.length}\n`
 if (result.caption) {
 const shortCaption = result.caption.length > 200 
 ? result.caption.substring(0, 200) + '...' 
 : result.caption
 captionText += `\n📝 *Caption:*\n${shortCaption}`
 }
 
 for (const [index, media] of result.media.entries()) {
 try {
 const mediaCaption = result.media.length > 1 
 ? `${captionText}\n\n📊 *Media ${media.index}/${result.media.length}*`
 : captionText

 if (media.type === 'video') {
 await dolxie.sendMessage(m.chat, {
 video: { url: media.url },
 caption: mediaCaption,
 mimetype: 'video/mp4'
 }, { quoted: m })
 } else {
 await dolxie.sendMessage(m.chat, {
 image: { url: media.url },
 caption: mediaCaption
 }, { quoted: m })
 }
 
 if (result.media.length > 1 && index < result.media.length - 1) {
 await new Promise(resolve => setTimeout(resolve, 1500))
 }
 } catch (err) {
 console.error(`Error sending media ${media.index}:`, err)
 await m.reply(`❌ فشل إرسال الوسائط ${media.index}`)
 }
 }

 } catch (error) {
 console.error('Error in Instagram handler:', error)
 await m.reply(`❌ *حدث خطأ!*\n\n${error.message || 'فشل تحميل الوسائط'}`)
 }
 }
 break

case 'gddl':
 case 'gdrive': {

try {
 if (!text) return m.reply(`مثال: ${cmd} الرابط`)
 
 let hao = await fetchJson(`https://api.siputzx.my.id/api/d/gdrive?url=${text}`)
 let fileName = hao.data.name
 return await dolxie.sendMessage(m.chat, {
 document: {
 url: hao.data.download
 },
 mimetype: 'application/zip',
 fileName: fileName
 }, {
 quoted: fakeQuoted
 })
 } catch (err) {
 console.error('Kesalahan pada API:', err)
 m.reply('حدث خطأ')
 }
 }
 break
case 'mediafire': 
case 'mediafiredl': 
case 'mfdl': {
 if (!text) return m.reply(`❌ Masukkan link Mediafire!\n\n📌 Contoh:\n${prefix + command} https://www.mediafire.com/file/xxxxxx`)
 if (!isUrl(text) || !text.includes('mediafire.com')) return m.reply('❌ رابط غير صحيح! تأكد أنه رابط Mediafire.')

 m.reply('⏳ جاري معالجة رابط Mediafire...')

 try {
 const data = await mediafire(text)
 if (!data || !data.downloadUrl) return m.reply('❌ فشل جلب البيانات من Mediafire.')

 let caption = `📦 *MEDIAFIRE DOWNLOADER*\n\n`
 caption += `🗂️ Nama File: ${data.fileName}\n`
 caption += `📁 Ukuran: ${data.fileSize}\n`
 caption += `📅 Upload: ${data.uploadDate}\n`
 caption += `📄 Mime: ${data.mimeType || 'Tidak diketahui'}\n`
 caption += `\n🔗 *Link Download:* ${data.downloadUrl}`

 // Kirim info file terlebih dahulu
 await dolxie.sendMessage(m.chat, { text: caption }, { quoted: fakeQuoted })

 // Coba kirim file langsung (jika ukuran memungkinkan)
 if (data.downloadUrl && data.fileSize && !data.fileSize.includes('GB')) {
 await dolxie.sendMessage(
 m.chat,
 {
 document: { url: data.downloadUrl },
 mimetype: data.mimeType || 'application/octet-stream',
 fileName: data.fileName
 },
 { quoted: fakeQuoted }
 )
 } else {
 m.reply('⚠️ File terlalu besar untuk dikirim langsung.\nSilakan unduh manual melalui link di atas.')
 }

 } catch (e) {
 console.error(e)
 m.reply('❌ حدث خطأ أثناء معالجة رابط Mediafire.')
 }
}
break
case 'douyin':
case 'capcut':
case 'threads':
case 'kuaishou':
case 'qq':
case 'espn':
case 'pinterest':
case 'imdb':
case 'imgur':
case 'ifunny':
case 'izlesene':
case 'reddit':
case 'youtube':
case 'twitter':
case 'vimeo':
case 'snapchat':
case 'bilibili':
case 'dailymotion':
case 'sharechat':
case 'likee':
case 'linkedin':
case 'tumblr':
case 'hipi':
case 'telegram':
case 'getstickerpack':
case 'bitchute':
case 'febspot':
case '9gag':
case 'oke.ru':
case 'rumble':
case 'streamable':
case 'ted':
case 'sohutv':
case 'pornbox':
case 'xvideos':
case 'xnxx':
case 'kuaishou':
case 'xiaohongshu':
case 'ixigua':
case 'weibo':
case 'miaopai':
case 'meipai':
case 'xiaoying':
case 'national video':
case 'yingke':
case 'sina':
case 'bluesky':
case 'soundcloud':
case 'mixcloud':
case 'spotify':
case 'zingmp3':
case 'bandcamp':
case 'download':
case "aio": {
 if (!q) return reply('أرسل رابط السوشيال ميديا؟')
 try {
 async function fetchInitialPage(initialUrl) {
 try {
 const axios = require('axios')
 const cheerio = require('cheerio')
 const headers = {
 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.60 Mobile Safari/537.36',
 'Referer': initialUrl,
 }
 const response = await axios.get(initialUrl, { headers })
 const $ = cheerio.load(response.data)
 const csrfToken = $('meta[name="csrf-token"]').attr('content')
 if (!csrfToken) throw new Error('فشل nemu token keamanan, coba lagi!')
 let cookies = ''
 if (response.headers['set-cookie']) {
 cookies = response.headers['set-cookie'].join('; ')
 }
 return { csrfToken, cookies }
 } catch (error) {
 throw new Error(`فشل ambil halaman awal: ${error.message}`)
 }
 }
 async function postDownloadRequest(downloadUrl, userUrl, csrfToken, cookies) {
 try {
 const axios = require('axios')
 const headers = {
 'User-Agent': 'Mozilla/5.0 (Linux; Android 10; RMX2185 Build/QP1A.190711.020) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.7103.60 Mobile Safari/537.36',
 'Referer': 'https://on4t.com/online-video-downloader',
 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
 'Accept': '*/*',
 'X-Requested-With': 'XMLHttpRequest',
 'Cookie': cookies
 }
 const postData = new URLSearchParams()
 postData.append('_token', csrfToken)
 postData.append('link[]', userUrl)
 const response = await axios.post(downloadUrl, postData.toString(), { headers })
 if (response.data?.result?.length) {
 return response.data.result.map(item => ({
 title: item.title,
 thumb: item.image,
 url: item.video_file_url || item.videoimg_file_url
 }))
 } else {
 throw new Error('Respons dari server gak sesuai harapan, coba link lain!')
 }
 } catch (error) {
 throw new Error(`فشل proses permintaan download: ${error.message}`)
 }
 }
 async function sendMediaAutoType(url, title) {
 try {
 const axios = require('axios')
 const { fromBuffer } = require('file-type') 
 const res = await axios.get(url, { responseType: 'arraybuffer' })
 const buff = Buffer.from(res.data)
 const fileInfo = await fromBuffer(buff)
 if (!fileInfo) return reply(`فشل deteksi tipe file: ${title}`)
 let mime = fileInfo.mime
 let ext = fileInfo.ext
 if (mime.startsWith('video/')) {
 await dolxie.sendMessage(m.chat, { video: buff, caption: title }, { quoted: m })
 } else if (mime.startsWith('audio/')) {
 await dolxie.sendMessage(m.chat, { audio: buff, mimetype: mime }, { quoted: m })
 } else if (mime.startsWith('image/')) {
 await dolxie.sendMessage(m.chat, { image: buff, caption: title }, { quoted: m })
 } else {
 await dolxie.sendMessage(m.chat, {
 document: buff,
 fileName: `${title}.${ext}`,
 mimetype: mime
 }, { quoted: m })
 }
 } catch (err) {
 reply(`فشل kirim media: ${err.message}`)
 }
 }
 const initialUrl = 'https://on4t.com/online-video-downloader'
 const downloadUrl = 'https://on4t.com/all-video-download'
 const { csrfToken, cookies } = await fetchInitialPage(initialUrl)
 const results = await postDownloadRequest(downloadUrl, q, csrfToken, cookies)
 for (let i = 0; i < results.length; i++) {
 await sendMediaAutoType(results[i].url, results[i].title)
 }
 await dolxie.sendMessage(m.chat, { react: { text: '💕', key: m.key } })
 } catch (err) {
 await dolxie.sendMessage(m.chat, { react: { text: '😳', key: m.key } }) 
 reply(err.message)
 }
break;
}
case "snackvideo":
 case "sv":
 {
 
 if (!text) {
 return reply(`mana link-nya? مثال: ${cmd} https://url/reel/xxx/?igsh=xxx`);
 React()
 }
 let memek = await snck(text);
 let respon = memek.data;
 if (respon && respon.length > 0) {
 let uniqueUrls = new Set(respon.map(item => item.url));
 try {
 for (let mediaUrl of uniqueUrls) {
 const headResponse = await axios.head(mediaUrl);
 const mimeType = headResponse.headers["content-type"];
 const isImage = /image\/.*/.test(mimeType);
 const isVideo = /video\/.*/.test(mimeType);
 if (isImage) {
 await dolxie.sendMessage(m.chat, {
 image: {
 url: mediaUrl
 },
 caption: "berhasil mendownload gambar dari URL.",
 contextInfo: {
isForwarded: false, 
forwardingScore: 1, 
businessMessageForwardInfo: { businessOwnerJid: "0@newsletter" }, forwardedNewsletterMessageInfo: { newsletterName: `© ${namaBot}`, newsletterJid: "0@newsletter" }, 
externalAdReply: {
title: name,
body: `version • ${version}`,
thumbnailUrl: thumbnail2,
sourceUrl: `https://Uptime • ${runtime(process.uptime())}`,
mediaType: 1,
renderLargerThumbnail: false,
}}
 }, {
 quoted: fakeQuoted
 });
 } else if (isVideo || mimeType === "application/octet-stream") {
 await dolxie.sendMessage(m.chat, {
 video: {
 url: mediaUrl
 },
 caption: " "
 }, {
 quoted: fakeQuoted
 });
 } else {
 await dolxie.sendMessage(m.chat, {
 text: `tipe media tidak didukung: ${mimeType}`
 }, {
 quoted: fakeQuoted
 });
 }
 }
 } catch (error) {
 console.error("Error fetching media type:", error);
 reply(error);
 }
 } else {
 await dolxie.sendMessage(m.chat, {
 text: "لم يُعثر على وسائط أو حدث خطأ أثناء الجلب."
 }, {
 quoted: fakeQuoted
 });
 }
 }
 break;
case "tiktok":
 case "tt":
 {
 
 let momok = "`𝗧 𝗜 𝗞 𝗧 𝗢 𝗞 - 𝗗 𝗢 𝗪 𝗡 𝗟 𝗢 𝗔 𝗗`";
 if (!text.startsWith("https://")) {
 return reply("url");
 }
 await tiktokDl(q).then(async result => {
 await dolxie.sendMessage(m.chat, {
 react: {
 text: "🕖",
 key: m.key
 }
 });
 if (!result.status) {
 return reply("Error!");
 }
 if (result.durations == 0 && result.duration == "0 Seconds") {
 let araara = new Array();
 let urutan = 0;
 for (let a of result.data) {
 let imgsc = await prepareWAMessageMedia({
 image: {
 url: `${a.url}`
 }
 }, {
 upload: dolxie.waUploadToServer
 });
 await araara.push({
 header: proto.Message.InteractiveMessage.Header.fromObject({
 title: `Foto Slide Ke *${urutan += 1}*`,
 hasMediaAttachment: true,
 ...imgsc
 }),
 nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
 buttons: [{
 name: "cta_url",
 buttonParamsJson: `{\"display_text\":\"Link Tautan Foto\",\"url\":\"${a.url}\",\"merchant_url\":\"https://www.google.com\"}`
 }]
 })
 });
 }
 const msgii = await generateWAMessageFromContent(m.chat, {
 viewOnceMessageV2Extension: {
 message: {
 messageContextInfo: {
 deviceListMetadata: {},
 deviceListMetadataVersion: 2
 },
 interactiveMessage: proto.Message.InteractiveMessage.fromObject({
 body: proto.Message.InteractiveMessage.Body.fromObject({
 text: "*TIKTOK - DOWNLOADER*"
 }),
 carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
 cards: araara
 })
 })
 }
 }
 }, {
 userJid: m.sender,
 quoted: fakeQuoted
 });
 await dolxie.relayMessage(m.chat, msgii.message, {
 messageId: msgii.key.id
 });
 } else {
 let urlVid = await result.data.find(e => e.type == "nowatermark_hd" || e.type == "nowatermark");
 await dolxie.sendMessage(m.chat, {
 video: {
 url: urlVid.url
 },
 caption: momok,
 footer: `\n${namaBot}`,
 buttons: [{
 buttonId: `.ttaudio ${text}`,
 buttonText: {
 displayText: "ᴀᴍʙɪʟ ᴍᴜsɪᴋɴʏᴀ"
 }
 }],
 viewOnce: true
 }, {
 quoted: fakeQuoted
 });
 }
 }).catch(e => console.log(e));
 await dolxie.sendMessage(m.chat, {
 react: {
 text: "✅",
 key: m.key
 }
 });
 }
 break;
 // Funcc
 
 //
 case 'audiotiktok':
 case 'tiktokaudio':
 case 'audiott':
 case 'ttaudio': {

try {
 if (!text) return m.reply(`مثال: ${cmd} الرابط`)
 if (!text.includes('tiktok.com')) return m.reply('يجب أن يكون رابط تيك توك!')
 
 let jir = await tiktokDl(text)
 if (jir.status && jir.data.length > 0) {
 const nowmVideo = jir.data.find(item => item.type === 'nowatermark')
 if (nowmVideo) {
 let audioq = nowmVideo.url
 return await
 dolxie.sendMessage(m.chat, {
 audio: {
 url: audioq
 },
 mimetype: 'audio/mpeg',
 contextInfo: {
isForwarded: false, 
forwardingScore: 1, 
businessMessageForwardInfo: { businessOwnerJid: "0@newsletter" }, forwardedNewsletterMessageInfo: { newsletterName: `© ${namaBot}`, newsletterJid: "0@newsletter" }, 
externalAdReply: {
title: name,
body: `version • ${version}`,
thumbnailUrl: thumbnail2,
sourceUrl: `https://Uptime • ${runtime(process.uptime())}`,
mediaType: 1,
renderLargerThumbnail: false,
}}
 }, {
 quoted: fakeQuoted
 })

 }
 }
 throw new Error('حدث خطأ')
 } catch (err) {
 console.error('حدث خطأ: ', err)
 m.reply('حدث خطأ')
 }
 }
 break
case "tiktoksearch":
case "ttsearch":
case "tts": {
 if (!text) return m.reply(`⚠️ Eits, kakak lupa kasih kata kunci! 😗 Coba ketik kayak gini ya: *.${command} jj epep* biar Mora bisa bantu cari yang kakak mau! 🔍💬`);
 try {
 let search = await tiktokSearchVideo(text);
 let teks = `🎥 *${search.videos[0].title}*\n\n` +
 `*ᴠɪᴅᴇᴏɪ ɪᴅ* : ${search.videos[0].video_id}\n` +
 `*ᴜsᴇʀɴᴀᴍᴇ* : ${search.videos[0].author.unique_id}\n` +
 `*ɴɪᴄᴋɴᴀᴍᴇ* : ${search.videos[0].author.nickname}\n` +
 `*ᴅᴜʀᴀᴛɪᴏɴ* : ${search.videos[0].duration} detik\n` +
 `*ʟɪᴋᴇ* : ${search.videos[0].digg_count}\n` +
 `*ᴄᴏᴍᴍᴇɴᴛ* : ${search.videos[0].comment_count}\n` +
 `*sʜᴀʀᴇ* : ${search.videos[0].share_count}\n\n` +
 `*ʟɪɴᴋ*: https://www.tiktok.com/@${search.videos[0].author.unique_id}/video/${search.videos[0].video_id}`;

 let list = '';
 let no = 1;
 for (let i of search.videos) {
 list += `\n${no++}. 🎵 *${i.title}*\n` +
 `ᴅᴜʀᴀsɪ: ${i.duration} ᴅᴇᴛɪᴋ\n` +
 `ʟɪᴋᴇ: ${i.digg_count}\n` +
 `ᴄᴏᴍᴍᴇɴᴛs: ${i.comment_count}\n` +
 `sʜᴀʀᴇs: ${i.share_count}\n` +
 ` ʟɪɴᴋ: https://www.tiktok.com/@${i.author.unique_id}/video/${i.video_id}\n`;
 }

 await dolxie.sendMessage(
 m.chat, {
 video: {
 url: `https://tikwm.com${search.videos[0].play}`
 },
 mimetype: 'video/mp4',
 seconds: 31622400000,
 fileLength: 99999999999999
 }, {
 quoted: fakeQuoted
 }
 );

 if (search.videos.length > 1) {
 await dolxie.sendMessage(
 m.chat, {
 text: `📚 *ᴅᴀғᴛᴀʀ ᴠɪᴅᴇᴏ ʟᴀɪɴɴʏᴀ:*\n${list}`
 }, {
 quoted: fakeQuoted
 }
 );
 }
 } catch (error) {
 console.log(error);
 }
 }
 break
 case "ytmp4": {

if (!text) return reply(`*استخدام خاطئ!*\nمثال: ${cmd} (link)`)
if (!text.startsWith("https://")) return m.reply("Link Tautan Tidak Valid")
await dolxie.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})
var anu = await ytdl.ytmp4(`${text}`)

if (anu.status) {
let urlMp3 = anu.download.url
await dolxie.sendMessage(m.chat, {video: {url: urlMp3}, mimetype: "video/mp4"}, {quoted: fakeQuoted})
} else {
return m.reply("Error! Result Not Found")
}
await dolxie.sendMessage(m.chat, {react: {text: '', key: m.key}})
}
break
case "ytmp3": {

if (!text) return reply(`*استخدام خاطئ!*\nمثال: .ytmp3 (link)`)
if (!text.startsWith("https://")) return m.reply("Link Tautan Tidak Valid")
await dolxie.sendMessage(m.chat, {react: {text: '🕖', key: m.key}})

var anu = await ytdl.ytmp3(`${text}`)

if (anu.status) {
let urlMp3 = anu.download.url
await dolxie.sendMessage(m.chat, {audio: {url: urlMp3}, mimetype: "audio/mpeg"}, {quoted: fakeQuoted})
} else {
return m.reply("Error! Result Not Found")
}
await dolxie.sendMessage(m.chat, {react: {text: '', key: m.key}})
}
break
case 'yts': case 'ytsearch': {

if (!text) return reply(`Example : ${cmd} story wa anime`)
 let [l, r] = text.split`|`
 if (!l) l = ''
 if (!r) r = ''
 const more = String.fromCharCode(8206)
 const readMore = more.repeat(4001)
 let redmo = l + readMore + r
 let anu = (await yts(text)).all
 let video = anu.filter(v => v.type === 'video') 
let channel = anu.filter(v => v.type === 'channel') 
let teks = `*${monospa('Hasil Pencarian YouTube 👇')}*\n${redmo}${channel.map(v => `*${v.name}* (${v.url})\n_${v.subCountLabel} (${v.subCount}) Subscriber_\n${v.videoCount} video\n========================`.trim()

).join("\n")}`+`${video.map(v => `*${v.title}* (${v.url})\nDuration: ${v.timestamp}\nUploaded ${v.ago}
\n${v.views} views\n========================`.trim() ).join("\n")}`
let image = channel.length ? channel[0].image : video.length ? video[0].image : urlmenu.main

let sections = [{
                title: global.namebot2, 
                highlight_label: 'start chats', 
                rows: [{
                        header: global.namebot2, 
        title: "Menu",
        description: `kembali ke menu !`, 
        id: '.menu'
        },
        {
                header: global.namebot2, 
                title: "Owner Bot", 
                description: "Owner bot, pemilik bot", 
                id: '.owner'
        }]
}]

video.forEach(async(data) => {
sections.push({
        title: data.title, 
        rows: [{
                title: "Get Video", 
                description: `Get video from "${data.title}"`, 
                id: `.ytmp4 ${data.url}`
                }, 
                {
                title: "Get Audio", 
                description: `Get audio from "${data.title}"`, 
                id: `.ytmp3 ${data.url}`
                }]
        }) 
}) 
let listMessage = {
    title: 'Download Media!!', 
    sections
};

let msg = generateWAMessageFromContent(m.chat, {
 viewOnceMessage: {
 message: {
 "messageContextInfo": {
 "deviceListMetadata": {},
 "deviceListMetadataVersion": 2
 },
 interactiveMessage: proto.Message.InteractiveMessage.create({
 body: proto.Message.InteractiveMessage.Body.create({
 text: teks
 }),
 footer: proto.Message.InteractiveMessage.Footer.create({
 text: global.namebot2
 }),
 header: proto.Message.InteractiveMessage.Header.create({
 subtitle: global.namebot2,
 hasMediaAttachment: true,...(await prepareWAMessageMedia({ image: { url: image }}, { upload: dolxie.waUploadToServer })) 
 }),
 nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
 buttons: [
 {
 "name": "single_select",
 "buttonParamsJson": JSON.stringify(listMessage) 
 }, 
 ],
 })
 })
 }
 }
}, {})

await dolxie.relayMessage(msg.key.remoteJid, msg.message, {
 messageId: msg.key.id
})
}
break 
case 'play':
case 'song': {

if (!text) return reply(`*استخدام خاطئ!*\nمثال: ${cmd} Night change`)
React()
let ytsSearchh = await yts(text)
const rees = await ytsSearchh.all[0]
var anu = await ytdl.ytmp3(`${rees.url}`)
let urlMp3 = anu.download.url
 await dolxie.sendMessage(m.chat, {
 audio: {
 url: urlMp3
 },
 mimetype: 'audio/mpeg',
 fileLength: 99999999999999,
 contextInfo: {
isForwarded: false, 
forwardingScore: 9999, 
businessMessageForwardInfo: { businessOwnerJid: "120363423889841112@g.us" }, forwardedNewsletterMessageInfo: { newsletterName: `${namaBot}`, newsletterJid: global.idSaluran }, 
externalAdReply: {
title: `${rees.title}`, 
thumbnailUrl: rees.thumbnail, 
renderLargerThumbnail: true, 
mediaType: 1, 
previewType: 1, 
sourceUrl: "", 
}}}, {quoted: qkontak })
 }
if (anu.status) {

} else {
return m.reply("Error! Result Not Found")
}
break
//
//
 case 'pin':
 case 'pinterest': {

 if (!text) return reply(`Format salah, مثال: \n${ command} Anime`)
 if (budy.match(`tobrut|susu|seksi|sexy`)) return reply('هذا المحتوى غير مسموح به!');
 await dolxie.sendMessage(m.chat, {
 react: {
 text: '⏳',
 key: m.key
 }
 })

 let anutrest = await pinterest(text) // Ambil hasil pencarian
 if (!anutrest || anutrest.length === 0) return reply("Error, Foto Tidak Ditemukan")

 // جلب بحد أقصى 10 صور
 let selectedImages = anutrest.slice(0, 10);
 let anu = []

 for (let i = 0; i < selectedImages.length; i++) {
 let imgsc = await prepareWAMessageMedia({
 image: {
 url: selectedImages[i].image
 }
 }, {
 upload: dolxie.waUploadToServer
 })

 anu.push({
 header: proto.Message.InteractiveMessage.Header.fromObject({
 title: `Gambar ke *${i + 1}*`,
 hasMediaAttachment: true,
 ...imgsc
 }),
 nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({
 buttons: [{
 name: "cta_url",
 buttonParamsJson: JSON.stringify({
 display_text: "Lihat di Pinterest",
 url: selectedImages[i].source || selectedImages[i].image
 })
 }]
 }),
 footer: proto.Message.InteractiveMessage.Footer.create({
 text: namaBot
 })
 })
 }

 // Buat format `carouselMessage`
 const msg = await generateWAMessageFromContent(m.chat, {
 viewOnceMessage: {
 message: {
 messageContextInfo: {
 deviceListMetadata: {},
 deviceListMetadataVersion: 2
 },
 interactiveMessage: proto.Message.InteractiveMessage.fromObject({
 body: proto.Message.InteractiveMessage.Body.fromObject({
 text: `🔎 Berikut hasil pencarian gambar untuk *${text}*`
 }),
 carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
 cards: anu
 })
 })
 }
 }
 }, {
 userJid: sender,
 quoted: ftext
 })

 dolxie.relayMessage(m.chat, msg.message, {
 messageId: msg.key.id
 })
 }
 
 break

case "animemenu": {
let teks = `أهلاً ${pushname} 🎉,
أنا 𝐋𝐎𝐘𝐃 بوت مساعدك الشخصي للمجموعات والمتجر والتحميل

يرجى عدم الإرسال المتكرر، اترك 5 ثوان بين كل أمر!

- akiyama
- ana
- art
- asuna
- ayuzawa
- boruto
- bts
- cartoon
- chiho
- chitoge
- cosplay
- cosplayloli
- cosplaysagiri
- cyber
- deidara
- doraemon
- elaina
- emilia
- erza
- exo
- gamewallpaper
- gremory
- hacker
- hestia
- hinata
- husbu
- inori
- islamic
- isuzu
- itachi
- itori
- jennie
- jiso
- justina
- kaga
- kagura
- kakasih
- kaori
- keneki
- kotori
- kurumi
- lisa
- madara
- megumin
- mikasa
- mikey
- miku
- minato
- mountain
- naruto
- neko2
- nekonime
- nezuko
- onepiece
- pentol
- pokemon
- programming
- randomnime
- randomnime2
- rize
- rose
- sagiri
- sakura
- sasuke
- satanic
- shina
- shinka
- shinomiya
- shizuka
- shota
- shortquote
- space
- technology
- tejina
- toukachan
- tsunade
- yotsuba
- yuki
- yulibocil
- yumeko

اضغط الأزرار أدناه لمعرفة الميزات المتاحة`
await dolxie.sendMessage(m.chat, {
 footer: `${global.botname}`,
 buttons: [
 {
 buttonId: `.sc`,
 buttonText: { displayText: 'معلومات البوت' },
 type: 1
 },
 {
 buttonId: 'action',
 buttonText: { displayText: 'معلومات البوت' },
 type: 4,
 nativeFlowInfo: {
 name: 'single_select',
 paramsJson: JSON.stringify({
 title: 'DolxieMD V1',
 sections: [
 {
 title: 'LIST MENU',
 highlight_label: 'Paling banyak dipakai',
 rows: [
 {
 title: 'ALL MENU',
 id: '.allmenu'
 },
 {
 title: 'CPANEL MENU',
 id: '.cpanelmenu'
 },
 {
 title: 'DOWNLOAD MENU',
 id: '.downmenu'
 },
{
 title: 'ANIME MENU',
 id: '.animemenu'
 },
 {
 title: 'GROUP MENU',
 id: '.groupmenu'
 },
 {
 title: 'OWNER MENU',
 id: '.ownmenu'
 },
 {
 title: 'PAYMENT MENU',
 id: '.paymenu'
 },
 {
 title: 'STORE MENU',
 id: '.storemenu'
 }
 ]
 }
 ]
 })
 }
 }
 ],
 headerType: 1,
 viewOnce: true,
 document: fs.readFileSync("./package.json"),
 fileName: `${global.filename}`,
 mimetype: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
 fileLength: 9,
 caption: teks,
 contextInfo: {
 isForwarded: true, 
 mentionedJid: [m.sender, global.owner+"@s.whatsapp.net"], 
 forwardedNewsletterMessageInfo: {
 newsletterJid: global.idch,
 newsletterName: global.saluranname
 }, 
 externalAdReply: {
 title: `${global.botname}`,
 thumbnailUrl: global.thumb,
 sourceUrl: "",
 mediaType: 1,
 renderLargerThumbnail: true,
 },
 },
})
}
break

case 'akiyama':
 case 'ana':
 case 'art':
 case 'asuna':
 case 'ayuzawa':
 case 'boruto':
 case 'bts':
 case 'cartoon':
 case 'chiho':
 case 'chitoge':
 case 'cosplay':
 case 'cosplayloli':
 case 'cosplaysagiri':
 case 'cyber':
 case 'deidara':
 case 'doraemon':
 case 'elaina':
 case 'emilia':
 case 'erza':
 case 'exo':
 case 'gamewallpaper':
 case 'gremory':
 case 'hacker':
 case 'hestia':
 case 'hinata':
 case 'husbu':
 case 'inori':
 case 'islamic':
 case 'isuzu':
 case 'itachi':
 case 'itori':
 case 'jennie':
 case 'jiso':
 case 'justina':
 case 'kaga':
 case 'kagura':
 case 'kakasih':
 case 'kaori':
 case 'keneki':
 case 'kotori':
 case 'kurumi':
 case 'lisa':
 case 'madara':
 case 'megumin':
 case 'mikasa':
 case 'mikey':
 case 'miku':
 case 'minato':
 case 'mountain':
 case 'naruto':
 case 'neko2':
 case 'nekonime':
 case 'nezuko':
 case 'onepiece':
 case 'pentol':
 case 'pokemon':
 case 'programming':
 case 'randomnime':
 case 'randomnime2':
 case 'rize':
 case 'rose':
 case 'sagiri':
 case 'sakura':
 case 'sasuke':
 case 'satanic':
 case 'shina':
 case 'shinka':
 case 'shinomiya':
 case 'shizuka':
 case 'shota':
 case 'shortquote':
 case 'space':
 case 'technology':
 case 'tejina':
 case 'toukachan':
 case 'tsunade':
 case 'yotsuba':
 case 'yuki':
 case 'yulibocil':
 case 'yumeko': {

m.reply("جاري التحميل 🔁")
 let heyy
 if (/akiyama/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/akiyama.json')
 if (/ana/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/ana.json')
 if (/art/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/art.json')
 if (/asuna/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/asuna.json')
 if (/ayuzawa/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/ayuzawa.json')
 if (/boneka/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/boneka.json')
 if (/boruto/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/boruto.json')
 if (/bts/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/bts.json')
 if (/cecan/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cecan.json')
 if (/chiho/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/chiho.json')
 if (/chitoge/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/chitoge.json')
 if (/cogan/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cogan.json')
 if (/cosplay/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cosplay.json')
 if (/cosplayloli/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cosplayloli.json')
 if (/cosplaysagiri/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cosplaysagiri.json')
 if (/cyber/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/cyber.json')
 if (/deidara/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/deidara.json')
 if (/doraemon/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/doraemon.json')
 if (/eba/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/eba.json')
 if (/elaina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/elaina.json')
 if (/emilia/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/emilia.json')
 if (/erza/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/erza.json')
 if (/exo/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/exo.json')
 if (/femdom/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/femdom.json')
 if (/freefire/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/freefire.json')
 if (/gamewallpaper/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/gamewallpaper.json')
 if (/glasses/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/glasses.json')
 if (/gremory/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/gremory.json')
 if (/hacker/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/hekel.json')
 if (/hestia/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/hestia.json')
 if (/husbu/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/husbu.json')
 if (/inori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/inori.json')
 if (/islamic/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/islamic.json')
 if (/isuzu/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/isuzu.json')
 if (/itachi/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/itachi.json')
 if (/itori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/itori.json')
 if (/jennie/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/jeni.json')
 if (/jiso/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/jiso.json')
 if (/justina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/justina.json')
 if (/kaga/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kaga.json')
 if (/kagura/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kagura.json')
 if (/kakasih/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kakasih.json')
 if (/kaori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kaori.json')
 if (/cartoon/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kartun.json')
 if (/shortquote/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/katakata.json')
 if (/keneki/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/keneki.json')
 if (/kotori/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kotori.json')
 if (/kpop/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kpop.json')
 if (/kucing/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kucing.json')
 if (/kurumi/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/kurumi.json')
 if (/lisa/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/lisa.json')
 if (/loli/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/loli.json')
 if (/madara/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/madara.json')
 if (/megumin/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/megumin.json')
 if (/mikasa/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mikasa.json')
 if (/mikey/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mikey.json')
 if (/miku/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/miku.json')
 if (/minato/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/minato.json')
 if (/mobile/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mobil.json')
 if (/motor/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/motor.json')
 if (/mountain/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/mountain.json')
 if (/naruto/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/naruto.json')
 if (/neko/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/neko.json')
 if (/neko2/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/neko2.json')
 if (/nekonime/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/nekonime.json')
 if (/nezuko/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/nezuko.json')
 if (/onepiece/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/onepiece.json')
 if (/pentol/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/pentol.json')
 if (/pokemon/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/pokemon.json')
 if (/profil/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/profil.json')
 if (/progamming/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/programming.json')
 if (/pubg/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/pubg.json')
 if (/randblackpink/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/randblackpink.json')
 if (/randomnime/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/randomnime.json')
 if (/randomnime2/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/randomnime2.json')
 if (/rize/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/rize.json')
 if (/rose/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/rose.json')
 if (/ryujin/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/ryujin.json')
 if (/sagiri/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/sagiri.json')
 if (/sakura/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/sakura.json')
 if (/sasuke/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/sasuke.json')
 if (/satanic/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/satanic.json')
 if (/shina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shina.json')
 if (/shinka/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shinka.json')
 if (/shinomiya/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shinomiya.json')
 if (/shizuka/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shizuka.json')
 if (/shota/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/shota.json')
 if (/space/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/tatasurya.json')
 if (/technology/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/technology.json')
 if (/tejina/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/tejina.json')
 if (/toukachan/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/toukachan.json')
 if (/tsunade/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/tsunade.json')
 if (/waifu/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/waifu.json')
 if (/wallhp/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/wallhp.json')
 if (/wallml/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/wallml.json')
 if (/wallmlnime/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/wallnime.json')
 if (/yotsuba/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yotsuba.json')
 if (/yuki/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yuki.json')
 if (/yulibocil/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yulibocil.json')
 if (/yumeko/.test(command)) heyy = await fetchJson('https://raw.githubusercontent.com/Leoo7z/Image-Source/main/image/yumeko.json')
 let yeha = heyy[Math.floor(Math.random() * heyy.length)]
 dolxie.sendMessage(m.chat, {
 image: {
 url: yeha
 },
 caption: "",
 viewOnce: true,
 contextInfo: {
isForwarded: false, 
forwardingScore: 9999, 
 },
 }, {
 quoted: ftext
 })
 }
 break
    default:
      break
    }
  } catch (err) {
    console.log(err)
  }
}
