import fs from 'fs'
import path from 'path';

const exec = promisify(_exec).bind(cp);
const basePath = 'plugins';

let displayFileContent = async (filename) => {
    let filePath = path.join(basePath, filename);
    try {
        await fs.promises.access(filePath, fs.constants.F_OK);
        return await fs.promises.readFile(filePath, 'utf8');
    } catch (err) {
        throw new Error(`الملف ${filename} غير موجود أو فشلت قراءته.`);
    }
};

const listFilesInDirectory = async () => {
    try {
        const files = await fs.promises.readdir(basePath);
        return files.filter((file) => file.endsWith('.js'));
    } catch (err) {
        throw new Error('فشل في قراءة مجلد plugins.');
    }
};

const handler = async (m, { conn, text }) => {
    // التحقق من أن المرسل أونر من القائمة العالمية
    const isOwner = global.owner.some(o => o[0] === m.sender.split('@')[0]);
    if (!isOwner) {
        return m.reply('ماذا حلمت أيضاً يا عبد🐦');
    }

    // إعداد الـ Fake Status للقناة
    const fakeStatus = {
        key: { fromMe: false, participant: '0@s.whatsapp.net', remoteJid: 'status@broadcast' },
        message: {
            extendedTextMessage: {
                text: "📁 نظام عرض الملفات والبرمجة",
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

    try {
        const files = await listFilesInDirectory();

        if (!text) {
            if (files.length === 0) return m.reply('📂 المجلد plugins فارغ.');

            let fileList = files.map((file, index) => `> *❑┊•≫ ${index + 1} .* ${file}`).join('\n');
            
            let listMsg = `*╭─⬣「 📂 قـائـمـة الـمـلـفـات 」⬣─╮*\n\n${fileList}\n\n` +
                          `~*『✦▬▬▬✦┇• 🪻 •┇✦▬▬▬✦』*~\n` +
                          `> *_اكتب رقم الملف أو اسمه لعرضه يحب🐦_*`;
            
            return conn.sendMessage(m.chat, { text: listMsg }, { quoted: fakeStatus });
        }

        let filename;
        const index = parseInt(text.trim()) - 1;
        if (!isNaN(index) && index >= 0 && index < files.length) {
            filename = files[index];
        } else {
            const inputName = text.trim().toLowerCase();
            const targetName = inputName.endsWith('.js') ? inputName : `${inputName}.js`;
            filename = files.find((file) => file.toLowerCase() === targetName);
        }

        if (!filename) return m.reply('❌ الملف غير موجود. تأكد من الرقم أو الاسم.');

        const fileContent = await displayFileContent(filename);

        // إرسال الكود مع كابشن مزخرف
        await conn.sendMessage(m.chat, { 
            text: fileContent,
            contextInfo: {
                externalAdReply: {
                    title: `📄 FILE: ${filename}`,
                    body: `Nagumo Bot - Plugin Viewer`,
                    mediaType: 1,
                    thumbnailUrl: 'https://files.catbox.moe/5396la.jpg',
                    sourceUrl: 'https://whatsapp.com/channel/0029VbBLy5aAzNbuMD4Y7E1C'
                }
            }
        }, { quoted: fakeStatus });

    } catch (e) {
        m.reply(`❌ حدث خطأ: ${e.message}`);
    }
};

handler.help = ['أوامر المالك مثال .getplugin']
handler.tags = ['owner'];
handler.command = /^(getplugin|عرض-كود|gp|باتش-عرض)$/i;
handler.rowner = true; // للمطورين فقط

export default handler;