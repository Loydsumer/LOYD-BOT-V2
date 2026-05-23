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

case 'addproduk': {

if (!text.includes(',')) return reply(`مثال: ${isCmd} اسم_المنتج, السعر, الكمية`)
const [productName, price, stock] = args.join(' ').split(',').map(item => item.trim())
const harga = parseInt(price, 10)
const jumlahStok = parseInt(stock, 10)
if (!productName || isNaN(harga) || isNaN(jumlahStok)) {
reply('صيغة غير صحيحة. أدخل اسم المنتج والسعر والكمية.')
} else {
const productExists = cekProduknye(productName)
if (productExists) {
reply(`Produk dengan nama "${productName}" sudah ada.`)
} else {
addprodukzz(productName, harga, jumlahStok)
reply(`Produk "${productName}" telah ditambahkan dengan harga ${toRupiah(harga)} dan stok sebanyak ${jumlahStok} unit.`)
}}}
break

case 'delproduk': {

if (!text) return reply(`مثال: ${cmd} اسم_المنتج`)
const productName = text.trim()
if (!productName) {
reply('اسم المنتج غير صحيح.')
} else {
const productExists = cekProduknye(productName)
if (productExists) {
delprodukzz(productName)
reply(`Produk "${productName}" telah dihapus.`)
} else {
reply(`Produk "${productName}" غير موجود.`)
}}}
break

case 'updateproduk': {

if (!text.includes(',')) return reply(`مثال: ${isCmd} اسم_المنتج, السعر, الكمية`)
const [productName, price, stock] = args.join(' ').split(',').map(item => item.trim())
const harga = parseInt(price, 10)
const jumlahStok = parseInt(stock, 10)
if (!productName || isNaN(harga) || isNaN(jumlahStok)) {
reply('صيغة غير صحيحة. أدخل اسم المنتج والسعر والكمية.')
} else {
const productExists = cekProduknye(productName)
if (productExists) {
updprodukzz(productName, harga, jumlahStok)
reply(`Produk "${productName}" telah diperbarui dengan harga ${toRupiah(harga)} dan stok sebanyak ${jumlahStok} unit.`)
} else {
reply(`Produk "${productName}" غير موجود.`)
}}}
break

case 'listproduk': {

const products = getprodukdb()
const discounts = getDisczz()
if (products.length === 0) {
reply('لا توجد منتجات متاحة حالياً.')
} else {
let listText = `List produk yg tersedia:\nTotal: ${products.length}\n\n`
products.forEach(product => {
const discount = discounts.find(d => d.produk.toLowerCase() === product.nama.toLowerCase())
if (discount) {
const discountPercentage = persenDiskonnya(product.harga, discount.harga_diskon)
listText += `• ${product.nama}\n Harga: ~Rp${toRupiah(product.harga)}~ > Rp${toRupiah(discount.harga_diskon)} (${discountPercentage}%)\n Stok: ${product.stok} unit\n\n`
} else {
listText += `• ${product.nama}\n Harga: Rp${toRupiah(product.harga)}\n Stok: ${product.stok} unit\n\n`
}})
reply(listText)
}}
break

case 'diskon': {

if (!text.includes(',')) return reply(`مثال: ${isCmd} اسم_المنتج, سعر_الخصم, تاريخ-الانتهاء`)
const [productName, discountPriceStr, expirationDate] = args.join(' ').split(',').map(item => item.trim())
const discountPrice = parseInt(discountPriceStr, 10)
if (!productName || isNaN(discountPrice) || !expirationDate) {
reply('صيغة غير صحيحة. أدخل اسم المنتج وسعر الخصم وتاريخ الانتهاء.')
} else {
const products = getprodukDariFile()
const product = products.find(p => p.nama.toLowerCase() === productName.toLowerCase())
if (!product) {
reply(`Produk "${productName}" غير موجود.`)
} else {
addDisczz(productName, discountPrice, expirationDate)
const discountPercentage = persenDiskonnya(product.harga, discountPrice)
reply(`Diskon untuk produk "${productName}" berhasil ditambahkan.\nHarga diskon: Rp${discountPrice}, Berlaku hingga: ${expirationDate} (${discountPercentage}%)`)
}}}
break

case 'restok': {

if (!text.includes(',')) return reply(`مثال: ${isCmd} اسم_المنتج, الكمية`)
const [productName, stockStr] = args.join(' ').split(',').map(item => item.trim())
const jumlahStok = parseInt(stockStr, 10)
if (!productName || isNaN(jumlahStok) || jumlahStok <= 0) {
reply('صيغة غير صحيحة. أدخل اسم المنتج والكمية.')
} else {
const restockedProduct = ngerestokk(productName, jumlahStok)
if (restockedProduct) {
reply(`✅ تمت إضافة مخزون المنتج "${restockedProduct.nama}". المخزون الحالي: ${restockedProduct.stok} وحدة.`)
} else {
reply(`Produk "${productName}" غير موجود.`)
}}}
break

case 'beliproduk': {

if (!text.includes(',')) return reply(`مثال: ${isCmd} اسم_المنتج, الكمية`)
const [productName, quantity] = args.join(' ').split(',').map(item => item.trim())
const jumlah = parseInt(quantity, 10)
if (!productName || isNaN(jumlah) || jumlah <= 0) {
return reply('صيغة غير صحيحة. أدخل اسم المنتج والكمية.')
}
const products = getprodukDariFile();
const product = products.find(p => p.nama.toLowerCase() === productName.toLowerCase())

if (!product) {
return reply(`Produk "${productName}" غير موجود.`)}
if (product.stok < jumlah) {
return reply(`Stok untuk produk "${productName}" tidak mencukupi. Tersisa ${product.stok} unit.`)}
const discounts = getDisczz()
const discount = discounts.find(d => d.produk.toLowerCase() === product.nama.toLowerCase())
const totalHarga = discount ? discount.harga_diskon * jumlah : product.harga * jumlah
const transactionId = cIdTrnya()
reply(`
لقد اشتريت ${jumlah} من المنتج "${productName}"
إجمالي السعر: ${toRupiah(totalHarga)}

الرجاء التحويل أولاً ثم
اكتب .payment لمعرفة طرق الدفع المتاحة

اكتب أحد هذه الأوامر:
.confirm ${transactionId}
.cancel ${transactionId}
`)
saveTrnye({
id: transactionId,
productName,
jumlah,
totalHarga,
status: 'process',
buyer: m.sender
})
product.stok -= jumlah
simpenProduknya(products)
}
break

case 'confirm': {

const transactionId = text.trim().split(' ')[0]
if (!transactionId) return reply(`مثال: ${isCmd} معرف_المعاملة`)
const transaction = getTrId(transactionId)
if (!transaction) {
return reply(`Transaksi dengan ID "${transactionId}" غير موجود.`)
 }
if (transaction.status !== 'process') {
return reply('معرف المعاملة غير صحيح أو ليس في انتظار إثبات التحويل.')
}
transaction.status = 'success'
simpenSmTr(getSmTr().map(t => t.id === transactionId ? transaction : t))
reply(`Transaksi dengan ID "${transactionId}" telah berhasil dikonfirmasi.`)
}
break

case 'kensel': {

const transactionId = text.trim().split(' ')[0]
if (!transactionId) return reply(`مثال: ${isCmd} معرف_المعاملة`)
const transaction = getTrId(transactionId)
if (!transaction) {
return reply(`Transaksi dengan ID "${transactionId}" غير موجود`)
}
if (transaction.status !== 'process') {
return reply('معرف المعاملة غير صحيح أو ليس في انتظار الإثبات')
}

const products = getprodukDariFile()
const product = products.find(p => p.nama.toLowerCase() === transaction.productName.toLowerCase())
if (product) {
product.stok += transaction.jumlah
simpenProduknya(products)
}
transaction.status = 'canceled'
simpenSmTr(getSmTr().map(t => t.id === transactionId ? transaction : t))
reply(`Transaksi dengan ID "${transactionId}" telah dibatalkan`)
}
break
            
case "glitchtext":
 case "writetext":
 case "advancedglow":
 case "typographytext":
 case "pixelglitch":
 case "neonglitch":
 case "flagtext":
 case "flag3dtext":
 case "deletingtext":
 case "blackpinkstyle":
 case "glowingtext":
 case "underwatertext":
 case "logomaker":
 case "cartoonstyle":
 case "papercutstyle":
 case "watercolortext":
 case "effectclouds":
 case "blackpinklogo":
 case "gradienttext":
 case "summerbeach":
 case "luxurygold":
 case "multicoloyellowneon":
 case "sandsummer":
 case "galaxywallpaper":
 case "1917style":
 case "makingneon":
 case "royaltext":
 case "freecreate":
 case "galaxystyle":
 case "lighteffects":
 {
 
 if (!q) {
 return reply(`Contoh : ${cmd} sock Assistent`);
 }
 let link;
 if (/glitchtext/.test(command)) {
 link = "https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html";
 }
 if (/writetext/.test(command)) {
 link = "https://en.ephoto360.com/write-text-on-wet-glass-online-589.html";
 }
 if (/advancedglow/.test(command)) {
 link = "https://en.ephoto360.com/advanced-glow-effects-74.html";
 }
 if (/typographytext/.test(command)) {
 link = "https://en.ephoto360.com/create-typography-text-effect-on-pavement-online-774.html";
 }
 if (/pixelglitch/.test(command)) {
 link = "https://en.ephoto360.com/create-pixel-glitch-text-effect-online-769.html";
 }
 if (/neonglitch/.test(command)) {
 link = "https://en.ephoto360.com/create-impressive-neon-glitch-text-effects-online-768.html";
 }
 if (/flagtext/.test(command)) {
 link = "https://en.ephoto360.com/nigeria-3d-flag-text-effect-online-free-753.html";
 }
 if (/flag3dtext/.test(command)) {
 link = "https://en.ephoto360.com/free-online-american-flag-3d-text-effect-generator-725.html";
 }
 if (/deletingtext/.test(command)) {
 link = "https://en.ephoto360.com/create-eraser-deleting-text-effect-online-717.html";
 }
 if (/blackpinkstyle/.test(command)) {
 link = "https://en.ephoto360.com/online-blackpink-style-logo-maker-effect-711.html";
 }
 if (/glowingtext/.test(command)) {
 link = "https://en.ephoto360.com/create-glowing-text-effects-online-706.html";
 }
 if (/underwatertext/.test(command)) {
 link = "https://en.ephoto360.com/3d-underwater-text-effect-online-682.html";
 }
 if (/logomaker/.test(command)) {
 link = "https://en.ephoto360.com/free-bear-logo-maker-online-673.html";
 }
 if (/cartoonstyle/.test(command)) {
 link = "https://en.ephoto360.com/create-a-cartoon-style-graffiti-text-effect-online-668.html";
 }
 if (/papercutstyle/.test(command)) {
 link = "https://en.ephoto360.com/multicolor-3d-paper-cut-style-text-effect-658.html";
 }
 if (/watercolortext/.test(command)) {
 link = "https://en.ephoto360.com/create-a-watercolor-text-effect-online-655.html";
 }
 if (/effectclouds/.test(command)) {
 link = "https://en.ephoto360.com/write-text-effect-clouds-in-the-sky-online-619.html";
 }
 if (/blackpinklogo/.test(command)) {
 link = "https://en.ephoto360.com/create-blackpink-logo-online-free-607.html";
 }
 if (/gradienttext/.test(command)) {
 link = "https://en.ephoto360.com/create-3d-gradient-text-effect-online-600.html";
 }
 if (/summerbeach/.test(command)) {
 link = "https://en.ephoto360.com/write-in-sand-summer-beach-online-free-595.html";
 }
 if (/luxurygold/.test(command)) {
 link = "https://en.ephoto360.com/create-a-luxury-gold-text-effect-online-594.html";
 }
 if (/multicoloyellowneon/.test(command)) {
 link = "https://en.ephoto360.com/create-multicoloyellow-neon-light-signatures-591.html";
 }
 if (/sandsummer/.test(command)) {
 link = "https://en.ephoto360.com/write-in-sand-summer-beach-online-576.html";
 }
 if (/galaxywallpaper/.test(command)) {
 link = "https://en.ephoto360.com/create-galaxy-wallpaper-mobile-online-528.html";
 }
 if (/1917style/.test(command)) {
 link = "https://en.ephoto360.com/1917-style-text-effect-523.html";
 }
 if (/makingneon/.test(command)) {
 link = "https://en.ephoto360.com/making-neon-light-text-effect-with-galaxy-style-521.html";
 }
 if (/royaltext/.test(command)) {
 link = "https://en.ephoto360.com/royal-text-effect-online-free-471.html";
 }
 if (/freecreate/.test(command)) {
 link = "https://en.ephoto360.com/free-create-a-3d-hologram-text-effect-441.html";
 }
 if (/galaxystyle/.test(command)) {
 link = "https://en.ephoto360.com/create-galaxy-style-free-name-logo-438.html";
 }
 if (/lighteffects/.test(command)) {
 link = "https://en.ephoto360.com/create-light-effects-green-neon-online-429.html";
 }
 let haldwhd = await ephoto(link, q);
 dolxie.sendMessage(m.chat, {
 image: {
 url: haldwhd
 },
 caption: `${global.botname}`
 }, {
 quoted: ftext
 });
 }
 break;

case "ephotomenu": {
let teks = `> ╮━━━━━━━━━━━━━━╭
        ┃    【 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 】    ┃
> ╯━━━━━━━━━━━━━━╰
> *┊ مرحبا يا ${pushname}*
> *┊الـبـوت لـديـه الـكـثـيـر مـن الأوامـر الـحـلـوة اضغط عـلـى الـفـئـة يـلـي تـبـغـاهـا يـمـز*
> *┊ Name Bot : ${global.botname}*
> *┊ Version : ${global.version}*
~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~

- glitchtext
- writetext
- advancedglow
- typographytext
- pixelglitch
- neonglitch
- flagtext
- flag3dtext
- deletingtext
- blackpinkstyle
- glowingtext
- underwatertext
- logomaker
- cartoonstyle
- papercutstyle
- watercolortext
- effectclouds
- blackpinklogo
- gradienttext
- summerbeach
- luxurygold
- multicoloyellowneon
- sandsummer
- galaxywallpaper
- 1917style
- makingneon
- royaltext
- freecreate
- galaxystyle
- lighteffects

~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~`
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
 title: '𝐋𝐎𝐘𝐃',
 sections: [
 {
 title: '┊أقـسـام الـبـوت┊',
 highlight_label: 'فـئـة مـمـيـزة هـمـمـم كـفـو🐦',
 rows: [
 {
 title: '┊جـمـيـع الأوامـر┊',
 id: '.allmenu'
 },
 {
 title: '┊قـائـمـة تـنـزيـل┊',
 id: '.downmenu'
 },
{
 title: '┊قـائـمـة الأنـمـي┊',
 id: '.animemenu'
 },
 {
 title: '┊قـائـمـة الـجـروبـات┊',
 id: '.groupmenu'
 },
 {
 title: '┊قـائـمـة الـمـطـور┊',
 id: '.ownmenu'
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

default:
      break
    }
  } catch (err) {
    console.log(err)
  }
}
