import fs from 'fs';
import pathModule from 'path';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // التحقق من أن المرسل أونر من القائمة العالمية
  const isOwner = global.owner.some(o => o[0] === m.sender.split('@')[0]);
  if (!isOwner) return m.reply('ماذا حلمت أيضاً يا عبد🐦');

  if (!text) return m.reply(`*⚠️ يرجى إدخال اسم الملف بعد الأمر*\n\n*مثال:* ${usedPrefix + command} test`);

  // إعداد الـ Fake Status للقناة
  const fakeStatus = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
        extendedTextMessage: {
            text: "📂 نظام إدارة الملفات البرمجي",
            contextInfo: {
                isForwarded: true,
                forwardingScore: 999,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363402804601196@newsletter',
                    newsletterName: '𓏲ׄ 𝐋𝐎𝐘𝐃⏤͟͟͞͞🪻 ָ ۫𝐒𝐎𝐋𝐎 ࣪𖥔',
                    serverMessageId: 127
                }
            }
        }
    }
  };

  const q = m.quoted || m;
  const mime = (q.msg || q).mimetype || '';
  const isTextMessage = q.text || "";

  const pluginsDir = 'plugins';
  if (!fs.existsSync(pluginsDir)) fs.mkdirSync(pluginsDir, { recursive: true });

  const filePath = pathModule.join(pluginsDir, `${text}.js`);
  let isAdd = false;
  let isDel = false;

  try {
    switch (command) {
      case 'احفظ':
        if (!q || (!isTextMessage && !mime)) {
          throw `يرجى الرد على رسالة نصية أو ملف JS ليتم حفظه`;
        }

        if (isTextMessage) {
          const content = isTextMessage.trim();
          if (!content) throw `النص المستلم فارغ.`;
          fs.writeFileSync(filePath, content, 'utf8');
          isAdd = true;
        } else if (q.download) {
          const buffer = await q.download();
          const content = buffer.toString('utf8');
          if (!content.trim()) throw `الملف المرفق فارغ.`;
          fs.writeFileSync(filePath, content, 'utf8');
          isAdd = true;
        }
        break;

      case 'امسح':
        if (!fs.existsSync(filePath)) {
          throw `الملف "${text}.js" غير موجود أصلاً لحذفه`;
        }
        fs.unlinkSync(filePath);
        isDel = true;
        break;
    }

    if (isAdd) {
      let addMsg = `*╭─⬣「 ✅ تـم الـحـفـظ 」⬣─╮*\n\n` +
                   `> *❑┊•≫ 📂 الملف:* ${text}.js\n` +
                   `> *❑┊•≫ 📍 المسار:* plugins/\n\n` +
                   `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n` +
                   `> *تم حفظ الكود بنجاح يحب🐦*`;
      await conn.sendMessage(m.chat, { text: addMsg }, { quoted: fakeStatus });
    } else if (isDel) {
      let delMsg = `*╭─⬣「 ✅ تـم الـحـذف 」⬣─╮*\n\n` +
                   `> *❑┊•≫ 📂 الملف:* ${text}.js\n` +
                   `> *❑┊•≫ 📍 الحالة:* تم الإزالة\n\n` +
                   `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n` +
                   `> *تم حذف الملف من السيرفر بنجاح يحب🐦*`;
      await conn.sendMessage(m.chat, { text: delMsg }, { quoted: fakeStatus });
    }

  } catch (error) {
    m.reply(`❌ *حدث خطأ:* ${error.message || error}`);
  }
};

handler.help = ['أوامر المالك مثال .احفظ']
handler.tags = ['owner'];
handler.command = /^(احفظ|امسح)$/i;
handler.rowner = true;

export default handler;