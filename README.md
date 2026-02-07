# 📖 ScriptureBot - Messenger Bible Bot

A Facebook Messenger chatbot that delivers Bible verses on demand. Built with Node.js and powered by [API.bible](https://scripture.api.bible/).

> Created by [@EE2506](https://github.com/EE2506) — an aspiring student exploring Messenger bots to share daily scripture with friends and communities. 🙏

---

## ✨ Features

- `/bible John 3:16` — Get any Bible verse
- `/bible Psalm 23` — Get entire chapters
- `/search love` — Search verses by keyword
- `/help` — Show available commands

---

## 🚀 Quick Start

### 1. Clone the repo
```bash
git clone https://github.com/EE2506/Scripture-Bot.git
cd Scripture-Bot
npm install
```

### 2. Get your API keys
- **API.bible**: Free at [scripture.api.bible](https://scripture.api.bible/)
- **Meta Developer**: Create app at [developers.facebook.com](https://developers.facebook.com)

### 3. Configure environment
```bash
cp .env.example .env
```
Fill in your keys in `.env`

### 4. Run locally
```bash
npm start
```

---

## 🌐 Deploy (Free Options)

| Platform | Link |
|----------|------|
| **Render** | [render.com](https://render.com) |
| **Railway** | [railway.app](https://railway.app) |
| **Zeabur** | [zeabur.com](https://zeabur.com) |

See [DEPLOY.md](DEPLOY.md) for detailed instructions.

---

## 📁 Project Structure

```
├── src/
│   ├── index.js           # Express server
│   ├── handlers/          # Command handlers
│   └── services/          # API integrations
├── .env.example           # Environment template
└── DEPLOY.md              # Deployment guide
```

---

## 📜 License

MIT — Feel free to fork and build your own Bible bot!

---

*"Your word is a lamp for my feet, a light on my path." — Psalm 119:105*
