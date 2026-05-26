# ⚡ XHTTP Config Generator

یک وب‌اپلیکیشن ساده برای تولید کانفیگ **VLESS + XHTTP (SplitHTTP)** برای Xray-core.
قابل دپلوی روی **Wasmer.io** با استفاده از Node.js WASM runtime.

---

## ✨ قابلیت‌ها

- ✅ تولید کانفیگ **کلاینت** و **سرور** به صورت همزمان
- ✅ ساخت **UUID** و **Path** تصادفی
- ✅ پشتیبانی از TLS / بدون TLS
- ✅ تنظیمات پیشرفته XHTTP: `scMaxConcurrentPosts`, `xPaddingBytes`, ...
- ✅ خروجی **لینک اشتراک‌گذاری** (vless://...) برای import مستقیم
- ✅ دانلود فایل JSON
- ✅ رابط کاربری فارسی و RTL

---

## 🚀 دپلوی روی Wasmer.io

### پیش‌نیازها
- [Wasmer CLI](https://docs.wasmer.io/install) نصب شده
- حساب کاربری در [wasmer.io](https://wasmer.io)
- [Git](https://git-scm.com) نصب شده

### مراحل

```bash
# 1. لاگین به wasmer
wasmer login

# 2. کلون پروژه
git clone https://github.com/YOUR_USERNAME/xhttp-config-generator.git
cd xhttp-config-generator

# 3. دپلوی
wasmer deploy
```

بعد از دپلوی، Wasmer یک URL مثل `https://xhttp-config-generator-USERNAME.wasmer.app` می‌ده.

---

## 💻 اجرای لوکال

```bash
# نیازی به npm install نیست - بدون dependency
node src/server.js

# یا با watch mode
node --watch src/server.js
```

آدرس: `http://localhost:8080`

---

## 📡 API

### `POST /api/generate`
**Body (JSON):**
```json
{
  "mode": "both",
  "address": "your-server.com",
  "port": 443,
  "uuid": "optional-uuid",
  "path": "/xhttp/abc123",
  "tls": true,
  "sni": "your-server.com",
  "allowInsecure": false,
  "scMaxConcurrentPosts": 4,
  "scMaxBufferedPosts": 8,
  "scMinPostsIntervalMs": 30,
  "xPaddingBytes": "100-1000",
  "noGRPCHeader": false
}
```

**Response:**
```json
{
  "success": true,
  "config": {
    "uuid": "...",
    "path": "...",
    "shareLink": "vless://...",
    "client": { ... },
    "server": { ... }
  }
}
```

### `GET /api/health`
```json
{ "status": "ok", "runtime": "wasmer", "time": "..." }
```

---

## 📁 ساختار پروژه

```
xhttp-config-generator/
├── src/
│   ├── server.js           # HTTP server اصلی
│   ├── config-generator.js # منطق تولید کانفیگ XHTTP
│   └── static.js           # رابط کاربری HTML
├── wasmer.yaml             # تنظیمات دپلوی Wasmer
├── package.json
└── README.md
```

---

## 🔧 درباره XHTTP (SplitHTTP)

XHTTP یا SplitHTTP یک پروتکل مدرن در Xray است که:
- ترافیک را به شکل HTTP POST (آپلود) و GET (دانلود) تقسیم می‌کند
- از CDN مثل Cloudflare عبور می‌کند
- با TLS 1.3 سازگار است
- جایگزین مدرن‌تری برای WebSocket محسوب می‌شود

**مستندات:** [Xray XHTTP Docs](https://xtls.github.io/config/transports/xhttp.html)

---

## ⚠️ نکته

این ابزار صرفاً برای اهداف آموزشی و آشنایی با Xray است.
