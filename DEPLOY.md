# 🚀 ScriptureBot Deployment Guide

A complete guide for first-time deployment of your Messenger Bible Bot.

---

## Quick Start (Local Development)

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template and fill in your keys
cp .env.example .env

# 3. Run the server
npm start
```

---

## Step 1: Get Your API Keys

### API.bible Key (Free)
1. Go to [scripture.api.bible](https://scripture.api.bible/)
2. Click "Get API Key" and create an account
3. Create a new app to get your API key
4. Copy the key to your `.env` file as `API_BIBLE_KEY`

### Meta Developer Setup
1. Go to [developers.facebook.com](https://developers.facebook.com)
2. Click "My Apps" → "Create App"
3. Select **"Other"** → **"Business"** type
4. Add the **Messenger** product to your app

#### Get Page Access Token:
1. In Messenger settings, click "Add or Remove Pages"
2. Connect your Facebook Page (create one if needed)
3. Click "Generate Token" next to your page
4. Copy this token to `.env` as `PAGE_ACCESS_TOKEN`

#### Configure Webhook:
1. In Messenger settings, go to "Webhooks"
2. Click "Add Callback URL"
3. Enter your URL: `https://your-app.onrender.com/webhook`
4. Enter your verify token (any secret string you create)
5. Put the same string in `.env` as `VERIFY_TOKEN`
6. Subscribe to: `messages`, `messaging_postbacks`

---

## Step 2: Deploy to Render (Recommended - Free)

### Why Render?
- ✅ Free tier available
- ✅ Auto-deploys from GitHub
- ✅ Easy environment variable setup
- ✅ HTTPS included

### Deployment Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/scripture-bot.git
   git push -u origin main
   ```

2. **Create Render Account**
   - Go to [render.com](https://render.com)
   - Sign up with GitHub

3. **Deploy**
   - Click "New" → "Web Service"
   - Connect your GitHub repo
   - Settings:
     - **Name**: scripture-bot
     - **Environment**: Node
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Instance Type**: Free

4. **Add Environment Variables**
   - Go to "Environment" tab
   - Add these variables:
     ```
     API_BIBLE_KEY=your_key
     PAGE_ACCESS_TOKEN=your_token
     VERIFY_TOKEN=your_secret
     PORT=3000
     ```

5. **Update Meta Webhook**
   - Copy your Render URL (e.g., `https://scripture-bot.onrender.com`)
   - Go back to Meta Developer dashboard
   - Update webhook URL to: `https://scripture-bot.onrender.com/webhook`

---

## Other Free Hosting Options

| Platform | Link | Notes |
|----------|------|-------|
| **Railway** | [railway.app](https://railway.app) | $5 free credit/month, no sleep |
| **Zeabur** | [zeabur.com](https://zeabur.com) | Simple deploy, Asia-optimized |
| **Cyclic** | [cyclic.sh](https://cyclic.sh) | No cold starts on free tier |
| **Fly.io** | [fly.io](https://fly.io) | Global edge, needs credit card |

---

## Testing Your Bot

### Local Testing with ngrok:
```bash
# Terminal 1: Run your server
npm start

# Terminal 2: Start ngrok tunnel
ngrok http 3000
```
Copy the ngrok URL to Meta webhook settings.

### Test Commands:
In Messenger, send to your connected page:
- `/bible John 3:16` → Returns verse text
- `/bible Psalm 23` → Returns full chapter
- `/search love` → Searches for verses
- `/help` → Shows all commands

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| "Webhook verification failed" | Check `VERIFY_TOKEN` matches in both `.env` and Meta dashboard |
| "Could not find verse" | Check your `API_BIBLE_KEY` is valid |
| Bot doesn't respond | Verify `PAGE_ACCESS_TOKEN` and page is connected |
| Render sleeps | Upgrade to paid tier or use Cyclic.sh |

---

## Project Structure

```
scripture-bot/
├── src/
│   ├── index.js          # Express server, webhook routes
│   ├── handlers/
│   │   └── messageHandler.js  # Command routing
│   └── services/
│       ├── bible.js      # API.bible integration
│       └── messenger.js  # Meta API integration
├── .env                  # Your secrets (don't commit!)
├── .env.example          # Template for .env
├── .gitignore
└── package.json
```

---

🙏 **Your bot is ready!** Start sharing scripture in Messenger group chats.
