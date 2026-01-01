# 🚀 Quick Start - Get Your Bot Running in 5 Minutes!

## What You Need to Do:

### 1️⃣ Create Your Bot (2 minutes)

1. Open Telegram
2. Search for: `@BotFather`
3. Send: `/newbot`
4. Give it a name: `My Gaming Bot`
5. Give it a username: `YourNameGamingBot` (must end with 'bot')
6. **Copy the token** BotFather gives you (looks like: `1234567890:ABC...`)

### 2️⃣ Configure Your Bot (1 minute)

1. In your project, go to `backend` folder
2. Copy the file `.env.example` and rename it to `.env`
3. Open `.env` and paste your token:

```env
TELEGRAM_BOT_TOKEN=1234567890:ABC-paste-your-token-here
WEBAPP_URL=http://localhost:5173
```

### 3️⃣ Install Package (1 minute)

Open terminal in `backend` folder and run:

```bash
pip install python-telegram-bot
```

### 4️⃣ Start Everything (1 minute)

**Terminal 1** (Backend):
```bash
cd backend
python manage.py runserver
```

**Terminal 2** (Bot):
```bash
cd backend
python bot.py
```

**Terminal 3** (Frontend):
```bash
cd frontend
npm run dev
```

### 5️⃣ Test Your Bot!

1. Open Telegram
2. Search for your bot username
3. Click **Start**
4. Click **🎮 Play Games**
5. Your game should open! 🎉

---

## That's It! 

Your bot is now live and users can:
- Start the bot with `/start`
- Open your games with the "Play Games" button
- Check balance, stats, and more

## Commands Your Bot Understands:

- `/start` - Main menu
- `/play` - Open games
- `/help` - Help info
- `/deposit` - How to add money
- `/withdraw` - How to withdraw

---

## ⚠️ Important Notes:

- Keep your bot token **SECRET** - never share it!
- The `.env` file should **NOT** be uploaded to GitHub
- Keep all 3 terminals running (backend, bot, frontend)

## 🎯 Next Steps:

Once your bot is working:
1. Customize the welcome message in `backend/bot.py`
2. Add your admin Telegram ID to `.env`
3. Deploy to production when ready

Need help? Check `TELEGRAM_BOT_SETUP.md` for detailed instructions!
