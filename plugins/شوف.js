import fs from 'fs';
import path from 'path';

const handler = async (m, { conn, text, usedPrefix, command }) => {
  // التحقق من أن المرسل أونر من القائمة العالمية
  const isOwner = global.owner.some(o => o[0] === m.sender.split('@')[0]);
  if (!isOwner) return m.reply('ماذا حلمت أيضاً يا عبد🐦');

  if (!text) {
    return m.reply(`*⚠️ يرجى إدخال الكلمة المطلوبة للبحث عنها.*\n\n*مثال:* ${usedPrefix + command} tr`);
  }

  // إعداد الـ Fake Status للقناة
  const fakeStatus = {
    key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
    message: {
        extendedTextMessage: {
            text: "🔍 نظام الكشف والبحث البرمجي",
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

  await conn.sendMessage(m.chat, { text: '🔍 جاري فحص ملفات الـ plugins يحب🐦...' }, { quoted: fakeStatus });

  const basePath = 'plugins';
  const files = fs.readdirSync(basePath).filter(file => file.endsWith('.js'));
  const matchedResults = [];
  let fileReadErrors = [];

  // أنماط النصوص المسموح بها مع تطابق دقيق (لتقليل النتائج العشوائية)
  const validPatterns = [
    /^handler\.command\s*=\s*\/\^(.*)\$\/i/, 
    /^const\s+audioCommands\s*=\s*\[.*\]/, 
    /handler\.help\s*=\s*\[.*\]/, 
    /handler\.command\s*=\s*\/\^.*\$/i, 
    /=\s*\[.*\]/, 
  ];

  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    const filePath = path.join(basePath, fileName);

    try {
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const fileLines = fileContent.split('\n');

      fileLines.forEach((line, index) => {
        if (line.includes(text)) {
          // التحقق من الأنماط (يمكنك إلغاء هذا الشرط إذا أردت البحث في كل شيء حرفياً)
          if (validPatterns.some(pattern => pattern.test(line.trim()))) {
            matchedResults.push({
              fileIndex: i + 1,
              fileName,
              lineNumber: index + 1,
              lineContent: line.trim(),
            });
          }
        }
      });
    } catch (error) {
      fileReadErrors.push({ fileName, error: error.message });
    }
  }

  if (matchedResults.length > 0) {
    let report = `*╭─⬣「 ✅ نـتـائـج الـكـشـف 」⬣─╮*\n\n`;
    report += `> *🔎 الكلمة:* ${text}\n\n`;

    matchedResults.forEach(({ fileIndex, fileName, lineNumber, lineContent }) => {
      report += `> *❑┊•≫ 📂 الكود:* [ ${fileIndex} ]\n`;
      report += `> *❑┊•≫ 📄 الملف:* ${fileName}\n`;
      report += `> *❑┊•≫ 🔢 السطر:* ${lineNumber}\n`;
      report += `> *❑┊•≫ ➡️ المحتوى:* \`${lineContent}\`\n*│*\n`;
    });

    report += `\n~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n`;
    report += `> *_تم العثور على ${matchedResults.length} نتيجة يحب🐦_*`;

    await conn.sendMessage(m.chat, { text: report }, { quoted: fakeStatus });
  } else {
    let errorMsg = `*╭─⬣「 ❌ لـم يـتـم الـعـثـور 」⬣─╮*\n\n`;
    errorMsg += `> لم أجد الكلمة "${text}" مطابقة للأنماط البرمجية في مجلد الـ plugins.\n\n`;
    
    if (fileReadErrors.length > 0) {
      errorMsg += `⚠️ *أخطاء القراءة:* ${fileReadErrors.length} ملف.`;
    }

    await conn.sendMessage(m.chat, { text: errorMsg }, { quoted: fakeStatus });
  }
};

handler.help = ['أوامر المالك مثال .كشف']
handler.tags = ['owner'];
handler.command = /^(شوف)$/i;
handler.rowner = true;

export default handler;