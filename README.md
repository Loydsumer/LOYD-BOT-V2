# 𝐋𝐎𝐘𝐃 — WhatsApp Bot

<div align="center">
  <img src="https://files.catbox.moe/lgrhj3.jpg" alt="LOYD BOT" width="500"/>

  [![GitHub](https://img.shields.io/badge/GitHub-Loydsumer-blue?style=for-the-badge&logo=github)](https://github.com/Loydsumer)
  [![WhatsApp](https://img.shields.io/badge/WhatsApp-Owner-green?style=for-the-badge&logo=whatsapp)](https://wa.me/966XXXXXXXXX)
  [![WhatsApp](https://img.shields.io/badge/WhatsApp-Channel-orange?style=for-the-badge&logo=whatsapp)](https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L)

  **بوت واتساب خفيف وسريع مبني على [Baileys](https://github.com/Loydsumer/baileys-speed)**

  [التثبيت](#-التثبيت) • [المميزات](#-المميزات) • [الاستضافة](#-الاستضافة) • [الدعم](#-الدعم)
</div>

---

## 🌹 المميزات

- ✅ بوت خفيف وسريع
- ✅ يدعم الأزرار التفاعلية
- ✅ يدعم التحميل من منصات متعددة
- ✅ نظام متجر متكامل
- ✅ نظام مجموعات متقدم
- ✅ نظام ترحيب ووداع
- ✅ سهل التعديل والتخصيص
- ✅ صيانة مستمرة وتحديثات دورية

---

## 🚀 التثبيت

### Termux (Android)

```bash
termux-setup-storage
pkg update -y && pkg upgrade -y
pkg install git nodejs ffmpeg -y
git clone https://github.com/Loydsumer/LOYD-BOT-V2.git
cd LOYD-BOT-V2
npm install
npm start
```

### Linux / VPS

```bash
apt update -y && apt upgrade -y
apt install git nodejs ffmpeg -y
git clone https://github.com/Loydsumer/LOYD-BOT-V2.git
cd LOYD-BOT-V2
npm install
npm start
```

---

## ⚙️ الإعداد

بعد التثبيت افتح ملف `loyd.js` وعدّل هذه القيم:

```js
global.botname   = "𝐋𝐎𝐘𝐃"          // اسم البوت
global.ownername = "مطور البوت"       // اسمك
global.owner     = "966XXXXXXXXX"    // رقمك بدون +
global.PaiCode   = "LOYDBOT1"        // كود الإقران
```

---

## 📦 المتطلبات

| المكتبة | الإصدار |
|---------|---------|
| Node.js | v18+ |
| @whiskeysockets/baileys | github:Loydsumer/baileys-speed |
| axios | ^1.6.0 |
| ffmpeg | مثبت على النظام |
| yt-search | ^2.13.1 |

---

## 🌐 الاستضافة

### Katabump / Pterodactyl

1. أنشئ سيرفر Node.js
2. ارفع ملفات البوت
3. ضع `node loyd.js` كأمر التشغيل
4. شغّل وانسخ كود الإقران

### Replit

```bash
git clone https://github.com/Loydsumer/LOYD-BOT-V2.git
```
ثم شغّل `npm install && npm start`

---

## 📋 الأوامر

### 📥 التحميل
| الأمر | الوصف |
|-------|-------|
| `.download` / `.aio` | تحميل من أي منصة |
| `.ytmp4` | فيديو يوتيوب |
| `.ytmp3` | صوت يوتيوب |
| `.yts` | بحث يوتيوب |
| `.tiktok` / `.tt` | تحميل تيك توك |
| `.ig` / `.igdl` | تحميل إنستغرام |
| `.fb` / `.fbdl` | تحميل فيسبوك |
| `.pin` | بحث بينتيريست |

### 👥 المجموعات
| الأمر | الوصف |
|-------|-------|
| `.antilink` | تفعيل/تعطيل مكافحة الروابط |
| `.warn` | تحذير عضو |
| `.kick` | طرد عضو |
| `.add` | إضافة عضو |
| `.promote` | ترقية عضو لأدمن |
| `.demote` | تنزيل أدمن |

### 🛒 المتجر
| الأمر | الوصف |
|-------|-------|
| `.addproduk` | إضافة منتج |
| `.delproduk` | حذف منتج |
| `.listproduk` | عرض المنتجات |
| `.beliproduk` | شراء منتج |
| `.confirm` | تأكيد طلب |

### ⚙️ النظام
| الأمر | الوصف |
|-------|-------|
| `.menu` | القائمة الرئيسية |
| `.sc` | معلومات البوت |
| `.public` | تفعيل الوضع العام |
| `.self` | تفعيل وضع المالك |

---

## 👤 الدعم

- **المالك:** [تواصل معي](https://wa.me/966XXXXXXXXX)
- **القناة:** [انضم هنا](https://whatsapp.com/channel/0029Vb6kG3s0AgW2lYD8ad1L)
- **القناة الثانية:** [انضم هنا](https://whatsapp.com/channel/0029VaugXE6J93wQZ0CFeH3Y)

---

<div align="center">

**صُنع بـ ❤️ بواسطة [Loydsumer](https://github.com/Loydsumer)**

**© 2026 𝐋𝐎𝐘𝐃 — جميع الحقوق محفوظة**

</div>
