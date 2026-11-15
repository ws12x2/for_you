# Render.com Deploy & 24/7 Keep-Alive Guide

Loyiha Render.com da bepul (`Free Web Service`) sifatida deploy qilinganda **hech qachon uxlab qolmasligi** va **doimiy 24/7 ishlab turishi** uchun to'liq tayyorlandi.

---

## 🚀 1. Render.com ga Deploy qilish (Oddiy qadamlar)

1. Loyihani o'z GitHub yoki GitLab akkauntingizga push qiling (`git push origin main`).
2. [Render.com](https://render.com) ga kiring va **New +** -> **Web Service** ni tanlang.
3. GitHub repozitoriyangizni ulang.
4. Render sozlamalarini quyidagicha belgilang:
   - **Name**: `ascii-rose` (yoki xohlagan nom)
   - **Language / Runtime**: `Node` (yoki `Python`)
   - **Build Command**: `npm install` (yoki bo'sh qoldiring)
   - **Start Command**: `node server.js` (agar Python tanlasangiz: `python server.py`)
   - **Plan**: **Free**
5. **Advanced Settings** bo'limida:
   - **Health Check Path**: `/health`
6. **Create Web Service** tugmasini bosing!

---

## 🛡️ 2. Qo'shilgan Endpointlar ("Sohta sayt" va Health Check)

Serverda Render va monitoring xizmatlari uchun maxsus yo'llar mavjud:

1. **`https://your-app.onrender.com/`**
   - Asosiy sahifa: 3D nurli, musiqali ochiluvchi atirgul konverti.

2. **`https://your-app.onrender.com/health`** (yoki `/healthz`, `/ping`)
   - Render va monitoring tizimlari uchun JSON formatidagi rasmiy health check javobi:
   ```json
   {
     "status": "ok",
     "service": "ascii-rose-envelope",
     "uptimeSeconds": 1820,
     "uptimeHuman": "30m 20s",
     "timestamp": "2026-11-15T18:30:00Z",
     "message": "Service is healthy and active"
   }
   ```

3. **`https://your-app.onrender.com/status`** (yoki `/monitor`)
   - **"Sohta sayt" / Status Dashboard**:
   - Chiroyli, zamonaviy monitoring paneli (System Status: 🟢 Operational, Uptime, Memory, Health Check).

---

## ⚡ 3. Sayt 24/7 Uxlab Qolmasdan Doimiy Ishlashi Uchun

Render bepul tarifida 15 daqiqa davomida so'rov kelmasa, serverni uxlab qolish (`spin down`) rejimiga o'tkazadi. Buni butunlay oldini olishning **2 ta kafolatlangan usuli** mavjud:

### Usul A: Avtomatik O'zini-O'zi Ping Qilish (O'rnatilgan)
Render avtomatik ravishda `RENDER_EXTERNAL_URL` muhit o'zgaruvchisini beradi. Serverimiz bu o'zgaruvchini avtomatik tanib oladi va **har 10 daqiqada o'zining `/health` manziliga ping yuborib turadi**.
*(Shunday qilib, hech qanday qo'shimcha sozlamasiz ham o'zini uyg'oq ushlab turadi).*

### Usul B: UptimeRobot (100% Tashqi Kafolat)
Agar tashqi mustaqil monitoring orqali doimiy 100% uyg'oq ushlab turishni xohlasangiz:
1. [UptimeRobot.com](https://uptimerobot.com) ga kiring (bepul).
2. **Add New Monitor** tugmasini bosing:
   - **Monitor Type**: `HTTP(s)`
   - **Friendly Name**: `ASCII Rose`
   - **URL (or IP)**: `https://your-app.onrender.com/health`
   - **Monitoring Interval**: `5 minutes` (yoki `10 minutes`)
3. **Create Monitor** ni bosing.
Endi UptimeRobot har 5 daqiqada saytingizga signal yuborib turadi va saytingiz **oyiga 30 kun, kuniga 24 soat uzluksiz** ishlaydi!
