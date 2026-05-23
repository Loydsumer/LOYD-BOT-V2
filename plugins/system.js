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
    case 'public': {
      if (!isOwner) return onlyOwn()
      setting.public = true
      fs.writeFileSync('./settingsjson', JSON.stringify(setting, null, 2))
      m.reply('تم التبديل إلى الوضع العام ✅')
    }
    break

    case 'self': {
      if (!isOwner) return onlyOwn()
      setting.public = false
      fs.writeFileSync('./settingsjson', JSON.stringify(setting, null, 2))
      m.reply('تم التبديل إلى الوضع الخاص ✅')
    }
    break

    // Push
    case 'jpm': {
      if (!isOwner) return onlyOwn()
      if (!isPc) return onlyPrivat()
      react()
      if (!text) m.reply(`مثال: ${p_c} teks`)
      let getGroups = await dolxie.groupFetchAllParticipating()
      let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
      let anu = groups.map(v => v.id)
      for (let i of anu) {
        await sleep(1500)
        let metadat72 = await dolxie.groupMetadata(i)
        let participanh = await metadat72.participants
        let msg = generateWAMessageFromContent(i, {
          viewOnceMessage: {
            message: {
              "messageContextInfo": {
                "deviceListMetadata": {},
                "deviceListMetadataVersion": 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                contextInfo: {
                  mentionedJid: null,
                  forwardingScore: 99999999999,
                  isForwarded: false,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: chjid + '@newsletter',
                    newsletterName: `${wm}`,
                    serverMessageId: 145
                  },
                  businessMessageForwardInfo: {
                    businessOwnerJid: dolxie.decodeJid(dolxie.user.id)
                  },
                },
                body: proto.Message.InteractiveMessage.Body.create({
                  text: text
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: ``
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "",
                  subtitle: "",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: [{
                    text: '-'
                  }],
                })
              })
            }
          }
        }, {})
        await dolxie.relayMessage(i, msg.message, {
          messageId: msg.key.id
        })
      }
      m.reply(`✅ تم إرسال الرسالة المخفية لـ ${anu.length} مجموعة!`)
    }
    break

    case 'jpmhidetag': {
      if (!isOwner) return onlyOwn()
      if (!isPc) return onlyPrivat()
      react()
      if (!text) m.reply(`مثال: ${p_c} teks`)
      let getGroups = await dolxie.groupFetchAllParticipating()
      let groups = Object.entries(getGroups).slice(0).map(entry => entry[1])
      let anu = groups.map(v => v.id)
      for (let i of anu) {
        await sleep(1500)
        let metadat72 = await dolxie.groupMetadata(i)
        let participanh = await metadat72.participants
        let msg = generateWAMessageFromContent(i, {
          viewOnceMessage: {
            message: {
              "messageContextInfo": {
                "deviceListMetadata": {},
                "deviceListMetadataVersion": 2
              },
              interactiveMessage: proto.Message.InteractiveMessage.create({
                contextInfo: {
                  mentionedJid: participanh.map(a => a.id),
                  forwardingScore: 99999999999,
                  isForwarded: false,
                  forwardedNewsletterMessageInfo: {
                    newsletterJid: chjid + '@newsletter',
                    newsletterName: `${wm}`,
                    serverMessageId: 145
                  },
                  businessMessageForwardInfo: {
                    businessOwnerJid: dolxie.decodeJid(dolxie.user.id)
                  },
                },
                body: proto.Message.InteractiveMessage.Body.create({
                  text: text
                }),
                footer: proto.Message.InteractiveMessage.Footer.create({
                  text: ``
                }),
                header: proto.Message.InteractiveMessage.Header.create({
                  title: "",
                  subtitle: "",
                  hasMediaAttachment: false
                }),
                nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.create({
                  buttons: [{
                    text: '-'
                  }],
                })
              })
            }
          }
        }, {})
        await dolxie.relayMessage(i, msg.message, {
          messageId: msg.key.id
        })
      }
      m.reply(`✅ تم إرسال الرسالة المخفية لـ ${anu.length} مجموعة!`)
    }
    break

    case 'jpmfoto': {
      if (!isOwner) return onlyOwn()
      if (!isPc) return onlyPrivat()
      if (!isMediaa) return m.reply('يجب أن يكون صورة أو فيديو!')
      if (!text) return m.reply(`مثال: ${p_c} teks`)
      react()
      let getGroups = await dolxie.groupFetchAllParticipating()
      let groups = Object.entries(getGroups).slice(0).map((entry) => entry[1])
      let anu = groups.map((v) => v.id)

      for (let xnxx of anu) {
        let metadat72 = await dolxie.groupMetadata(xnxx)
        let participanh = await metadat72.participants

        if (/image/.test(mime)) {
          let media = await dolxie.downloadAndSaveMediaMessage(quoted)
          let mem = await CatBox(media)
          await dolxie.sendMessage(xnxx, {
            image: {
              url: mem
            },
            caption: `${kapital(text)}`,
            contextInfo: {
              mentionedJid: participanh.map(a => a.id)
            }
          }, {
            quoted: m
          })
          await sleep(2000)
        } else if (/video/.test(mime)) {
          let media1 = await dolxie.downloadAndSaveMediaMessage(quoted)
          let mem1 = await CatBox(media1)
          await dolxie.sendMessage(xnxx, {
            video: {
              url: mem1
            },
            caption: `${kapital(text)}`,
            contextInfo: {
              mentionedJid: participanh.map(a => a.id)
            }
          }, {
            quoted: m
          })
          await sleep(2000)
        } else {
          await dolxie.sendMessage(xnxx, {
            text: `${kapital(text)}`,
            contextInfo: {
              mentionedJid: participanh.map(a => a.id)
            }
          }, {
            quoted: m
          })
          await sleep(2000)
        }
      }
      m.reply(`✅ تم إرسال البث لـ ${anu.length} مجموعة!`)
    }
    break

    case 'addch':
    case 'addchannel': {
      if (!isOwner) return onlyOwn();
      if (!args[0]) return m.reply(`مثال: ${p_c} https://whatsapp.com/channel/123abc`);

      const filePath = './database/channelid.json';
      const ch = JSON.parse(fs.readFileSync(filePath).toString());

      if (!isUrl(args[0]) || !args[0].includes('whatsapp.com/channel/'))
        return m.reply(`رابط غير صحيح، يجب أن يكون رابط قناة واتساب`);

      let result = args[0].split('https://whatsapp.com/channel/')[1].replace('/', '').trim();
      let data = await dolxie.newsletterMetadata("invite", result);

      if (!data || !data.id) return m.reply('فشل جلب بيانات القناة.');
      if (ch.includes(data.id)) return m.reply('القناة موجودة بالفعل في القائمة!');

      ch.push(data.id);
      fs.writeFileSync(filePath, JSON.stringify(ch, null, 2));
      m.reply(`تمت إضافة القناة: ✅\n• ID: ${data.id}\n• الاسم: ${data.name || 'بدون اسم'}`);
    }
    break

    case 'delch':
    case 'delchannel': {
      if (!isOwner) return onlyOwn();
      if (!args[0]) return m.reply(`مثال: ${p_c} 1\nGunakan .listch untuk melihat nomor channel.`);

      const filePath = './database/channelid.json';
      let ch = JSON.parse(fs.readFileSync(filePath).toString());

      if (ch.length === 0) return m.reply('📂 لا توجد قنوات محفوظة.');

      let index = parseInt(args[0]) - 1;
      if (isNaN(index) || index < 0 || index >= ch.length)
        return m.reply(`❌ رقم غير صحيح. استخدم بين 1 و ${ch.length}`);

      let removed = ch.splice(index, 1)[0];
      fs.writeFileSync(filePath, JSON.stringify(ch, null, 2));

      m.reply(`✅ تم حذف القناة رقم ✅ ${args[0]}:\nID: ${removed}`);
    }
    break

    case 'listch':
    case 'listchannel': {
      if (!isOwner) return onlyOwn()

      const filePath = './database/channelid.json'
      const ch = JSON.parse(fs.readFileSync(filePath).toString())

      if (ch.length === 0) return m.reply('📂 لا توجد قنوات محفوظة.')

      let teks = `📋 *Daftar Channel yang Tersimpan:*\n\n`

      for (let i = 0; i < ch.length; i++) {
        try {
          let data = await dolxie.newsletterMetadata("jid", ch[i])
          teks += `${i + 1}. ${data.name || 'بدون اسم'}\n   ID: ${ch[i]}\n\n`
        } catch (err) {
          teks += `${i + 1}. [فشل جلب البيانات]\n   ID: ${ch[i]}\n\n`
        }
      }

      teks += `استخدم الأمر *${p_c} [1]* لحذف القناة رقم 1.`

      m.reply(teks.trim())
    }
    break

    case 'jpmch':
    case 'jpmchannel': {
      if (!isOwner) return onlyOwn()
      if (!text) return m.reply(`مثال: ${p_c} مرحبا هذه رسالة بث لجميع القنوات`)

      const filePath = './database/channelid.json'
      const ch = JSON.parse(fs.readFileSync(filePath).toString())

      if (ch.length == 0) return m.reply('لم تُضف أي قناة بعد.')

      let sukses = 0,
        gagal = 0

      for (let id of ch) {
        try {
          await dolxie.sendTextWithMentions(id, text, null)
          sukses++
          await delay(2000)
        } catch (e) {
          gagal++
          console.log(`فشل الإرسال إلى ${id}: ${e.message}`)
        }
      }

      m.reply(`✅ انتهى البث.\n🟢 نجح: ${sukses}\n🔴 فشل: ${gagal}`)
    }
    break

case "menu": {
let teks = `
> ╮━━━━━━━━━━━━━━╭
        ┃    【 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 】    ┃
> ╯━━━━━━━━━━━━━━╰
> *┊ مرحبا يا ${pushname}*
> *┊الـبـوت لـديـه الـكـثـيـر مـن الأوامـر الـحـلـوة اضغط عـلـى الـفـئـة يـلـي تـبـغـاهـا يـمـز*
> *┊ Name Bot : ${global.botname}*
> *┊ Version : ${global.version}*`
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

case "groupmenu": {
let teks = `> ╮━━━━━━━━━━━━━━╭
        ┃    【 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 】    ┃
> ╯━━━━━━━━━━━━━━╰
> *┊ مرحبا يا ${pushname}*
> *┊الـبـوت لـديـه الـكـثـيـر مـن الأوامـر الـحـلـوة اضغط عـلـى الـفـئـة يـلـي تـبـغـاهـا يـمـز*
> *┊ Name Bot : ${global.botname}*
> *┊ Version : ${global.version}*
~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~

- antilink
- antilinkgc
- welcome
- goodbye
- promote
- demote
- hidetag
- tagall
- warn
- unwarn
- listwarn
- close
- open
- resetlink
- cekidgc
- creategc
- leave
- kick
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


case "ownmenu": {
let teks = `> ╮━━━━━━━━━━━━━━╭
        ┃    【 𝑾𝑬𝑳𝑪𝑶𝑴𝑬 】    ┃
> ╯━━━━━━━━━━━━━━╰
> *┊ مرحبا يا ${pushname}*
> *┊الـبـوت لـديـه الـكـثـيـر مـن الأوامـر الـحـلـوة اضغط عـلـى الـفـئـة يـلـي تـبـغـاهـا يـمـز*
> *┊ Name Bot : ${global.botname}*
> *┊ Version : ${global.version}*

~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~

- addreseller
- delreseller
- listreseller
- addowner
- delowner
- listowner
- autotyping
- autoread
- self
- public
- setppbot
- delppbot

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
 title: 'LIST MENU',
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

case "pushkontak": {
 if (!isOwner) return onlyOwn()
 if (!isGc) return onlyGrup()
 if (!text) return m.reply(`مثال على الاستخدام:\n${prefix + command} teks`)

 const teks = text
 const jidawal = m.chat
 const data = await dolxie.groupMetadata(m.chat)

 // AMBIL SEMUA MEMBER
 const halls = data.participants
 .filter(v => v?.id) 
 .map(v => v.id)

 m.reply(`إرسال رسالة لـ ${halls.length} عضو في المجموعة ${data.subject}...`)

 for (let mem of halls) {
 await dolxie.sendMessage(
 mem,
 { 
 text: teks,
 mentions: [m.sender],
 contextInfo: {
 isForwarded: true
 }
 }
 )
 await sleep(global.delayPushkontak)
 }

 await dolxie.sendMessage(
 jidawal,
 {
 text: `Pushkontak selesai.\nTotal terkirim: ${halls.length}`,
 mentions: [m.sender]
 }
 )
}
break

case "savekontakgc": {
 if (!isOwner) return onlyOwn()
 if (!isGc) return onlyGrup()

 const groupMetadata = await dolxie.groupMetadata(from)
 const participants = groupMetadata.participants

 // Ambil semua member grup
 const memberList = participants
 .filter(v => v?.id && v.id.endsWith("@s.whatsapp.net"))
 .map(v => v.id)

 if (memberList.length === 0) {
 return m.reply("لا توجد أرقام يمكن حفظها من هذه المجموعة.")
 }

 // Masukkan semua member ke array contacts
 for (let id of memberList) {
 contacts.push(id)
 }

 // Hapus duplikat
 const uniqueContacts = [...new Set(contacts)]

 // Simpan ke JSON
 fs.writeFileSync("./database/contacts.json", JSON.stringify(uniqueContacts))

 m.reply(`تم بنجاح menyimpan ${uniqueContacts.length} kontak.\nإرسال ملف vCard للمحادثة الخاصة...`)

 try {
 // Buat VCF dengan nama Kontak1, Kontak2, ...
 let vcf = ""
 uniqueContacts.forEach((contact, index) => {
 const number = contact.split("@")[0]
 const name = `Kontak${index + 1}` // ← penamaan otomatis

 const vcard = [
 "BEGIN:VCARD",
 "VERSION:3.0",
 `FN:${name}`,
 `TEL;type=CELL;type=VOICE;waid=${number}:+${number}`,
 "END:VCARD",
 ""
 ].join("\n")

 vcf += vcard
 })

 fs.writeFileSync("./database/contacts.vcf", vcf, "utf8")

 } catch (err) {
 return m.reply(util.format(err))
 } finally {
 // Kirim file VCF
 await dolxie.sendMessage(
 sender,
 {
 document: fs.readFileSync("./database/contacts.vcf"),
 fileName: "contacts.vcf",
 caption: "اضغط على الملف لحفظ جميع جهات الاتصال.",
 mimetype: "text/vcard"
 },
 { quoted: ftext }
 )

 // Bersihkan database setelah selesai
 contacts.splice(0, contacts.length)
 fs.writeFileSync("./database/contacts.json", JSON.stringify([]))
 }
}
break

case 'savekontakgcs': {
      break
    }
    default:
      break
    }
  } catch (err) {
    console.log(err)
  }
}
