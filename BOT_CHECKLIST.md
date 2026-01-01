# ✅ Telegram Bot Setup Checklist

Follow these steps in order. Check each box as you complete it!

## 📋 Pre-Setup

- [ ] Python is installed on your computer
- [ ] Project is downloaded and working
- [ ] Backend runs successfully (`python manage.py runserver`)
- [ ] Frontend runs successfully (`npm run dev`)

## 🤖 Create Bot (5 minutes)

- [ ] Open Telegram app
- [ ] Search for `@BotFather`
- [ ] Send `/newbot` command
- [ ] Enter bot name (e.g., "My Gaming Bot")
- [ ] Enter bot username (must end with 'bot', e.g., "MyGamingBot")
- [ ] Copy the token BotFather gives you
- [ ] Save token somewhere safe (you'll need it next)

## ⚙️ Configure Bot (3 minutes)

- [ ] Go to `backend` folder in your project
- [ ] Find the file `.env.example`
- [ ] Copy it and rename to `.env` (remove .example)
- [ ] Open `.env` file
- [ ] Paste your bot token after `TELEGRAM_BOT_TOKEN=`
- [ ] Set `WEBAPP_URL=http://localhost:5173`
- [ ] Save the file

Your `.env` should look like:
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHI...
WEBAPP_URL=http://localhost:5173
```

## 📦 Install Package (2 minutes)

- [ ] Open terminal/command prompt
- [ ] Navigate to `backend` folder: `cd backend`
- [ ] Run: `pip install python-telegram-bot`
- [ ] Wait for installation to complete
- [ ] No errors? Great! Move to next step

## 🚀 Start Everything (3 minutes)

You need 3 terminals open:

### Terminal 1 - Django Backend:
- [ ] Open terminal
- [ ] `cd backend`
- [ ] `python manage.py runserver`
- [ ] Should see: "Starting development server at http://127.0.0.1:8000/"

### Terminal 2 - Telegram Bot:
- [ ] Open NEW terminal
- [ ] `cd backend`
- [ ] `python bot.py`
- [ ] Should see: "Bot started!"

### Terminal 3 - Frontend:
- [ ] Open NEW terminal
- [ ] `cd frontend`
- [ ] `npm run dev`
- [ ] Should see: "Local: http://localhost:5173/"

## 🧪 Test Your Bot (2 minutes)

- [ ] Open Telegram
- [ ] Search for your bot username
- [ ] Click on your bot
- [ ] Click "START" button
- [ ] See welcome message? ✅
- [ ] See buttons (Play Games, Balance, Stats)? ✅
- [ ] Click "🎮 Play Games" button
- [ ] Web app opens inside Telegram? ✅
- [ ] Can you see the game lobby? ✅
- [ ] Try clicking a game
- [ ] Game loads and works? ✅

## 🎯 Test Commands (2 minutes)

Send these commands to your bot:

- [ ] `/start` - Shows welcome message
- [ ] `/play` - Opens game app
- [ ] `/help` - Shows help text
- [ ] `/balance` - Shows your balance
- [ ] `/stats` - Shows your statistics
- [ ] `/deposit` - Shows deposit info
- [ ] `/withdraw` - Shows withdrawal info

## 🎨 Optional: Set Up Bot Menu (2 minutes)

- [ ] Go to @BotFather in Telegram
- [ ] Send `/mybots`
- [ ] Select your bot
- [ ] Click "Edit Bot"
- [ ] Click "Edit Commands"
- [ ] Copy and paste this:
```
start - Start the bot and see main menu
play - Open game app
balance - Check your balance
stats - View your statistics
deposit - Deposit instructions
withdraw - Withdrawal instructions
help - Show help information
```
- [ ] Send it
- [ ] BotFather confirms? ✅

## ✅ Final Checks

- [ ] Bot responds to all commands
- [ ] "Play Games" button opens web app
- [ ] Games work inside Telegram
- [ ] Balance updates after playing
- [ ] No errors in any terminal

## 🎉 Success!

If all boxes are checked, your bot is fully working!

## 📝 Keep These Running

Remember to keep these 3 terminals running:
1. Django backend (`python manage.py runserver`)
2. Telegram bot (`python bot.py`)
3. Frontend (`npm run dev`)

If you close them, your bot will stop working!

## 🚨 Troubleshooting

### Bot doesn't respond:
- Check Terminal 2 - is `python bot.py` still running?
- Any errors in the terminal?
- Is your token correct in `.env`?

### "Play Games" doesn't work:
- Check Terminal 3 - is frontend running?
- Is `WEBAPP_URL` correct in `.env`?
- Try: `http://localhost:5173` (not https)

### Balance shows error:
- Check Terminal 1 - is Django running?
- Try playing a game first to create user record

### Can't install python-telegram-bot:
- Update pip: `pip install --upgrade pip`
- Try again: `pip install python-telegram-bot`

## 📚 Documentation Files

- `QUICK_START_BOT.md` - Quick start guide
- `TELEGRAM_BOT_SETUP.md` - Detailed setup instructions
- `BOT_COMMANDS.md` - All commands and features
- `BOT_CHECKLIST.md` - This file!

---

## 🎯 Next Steps After Setup

Once everything works:

1. **Customize your bot:**
   - Edit welcome message in `backend/bot.py`
   - Change button text
   - Add your own commands

2. **Add admin features:**
   - Add your Telegram ID to `.env`
   - Create admin commands
   - Manage users from bot

3. **Deploy to production:**
   - Get a domain name
   - Deploy frontend and backend
   - Update `WEBAPP_URL` in `.env`
   - Keep bot running 24/7

4. **Promote your bot:**
   - Share bot link with users
   - Add bot to groups
   - Create promotional materials

---

**Need help?** Check the other documentation files or review the error messages in your terminals!

🎊 **Congratulations on setting up your Telegram bot!** 🎊
