# 🚀 START HERE - Telegram Bot Setup

**Never set up a Telegram bot before? No problem! Follow these simple steps.**

---

## Step 1: Create Your Bot (2 minutes)

1. Open **Telegram** on your phone or computer
2. In the search bar, type: **@BotFather**
3. Click on the official BotFather (it has a blue checkmark)
4. Click **START** or send `/start`
5. Send this message: `/newbot`
6. BotFather asks "Alright, a new bot. How are we going to call it?"
   - Type any name you want, like: **Gaming Bot**
7. BotFather asks "Now let's choose a username for your bot"
   - Type a username ending in 'bot', like: **MyGamingBot**
8. **SUCCESS!** BotFather gives you a token that looks like:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz-1234567
   ```
9. **COPY THIS TOKEN** - You'll need it in the next step!

---

## Step 2: Add Token to Your Project (1 minute)

1. Open your project folder
2. Go to the **backend** folder
3. Find the file called **`.env.example`**
4. **Copy** this file
5. **Rename** the copy to **`.env`** (remove the .example part)
6. **Open** the `.env` file with any text editor (Notepad, VS Code, etc.)
7. Find the line that says: `TELEGRAM_BOT_TOKEN=your-bot-token-here`
8. **Replace** `your-bot-token-here` with your actual token
9. Make sure `WEBAPP_URL=http://localhost:5173` is there
10. **Save** the file

Example of what your `.env` should look like:
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz-1234567
WEBAPP_URL=http://localhost:5173
```

---

## Step 3: Install Bot Package (1 minute)

1. Open **Terminal** (Mac/Linux) or **Command Prompt** (Windows)
2. Navigate to your backend folder:
   ```bash
   cd backend
   ```
3. Install the required package:
   ```bash
   pip install python-telegram-bot
   ```
4. Wait for it to finish (you'll see "Successfully installed...")

---

## Step 4: Start Everything (2 minutes)

You need to open **3 separate terminals/command prompts**:

### Terminal 1 - Start Django:
```bash
cd backend
python manage.py runserver
```
✅ You should see: "Starting development server at http://127.0.0.1:8000/"

### Terminal 2 - Start Bot:
```bash
cd backend
python bot.py
```
✅ You should see: "Bot started!"

### Terminal 3 - Start Frontend:
```bash
cd frontend
npm run dev
```
✅ You should see: "Local: http://localhost:5173/"

**Keep all 3 terminals open and running!**

---

## Step 5: Test Your Bot! (1 minute)

1. Open **Telegram**
2. Search for your bot (the username you created, like @MyGamingBot)
3. Click on it
4. Click **START**
5. You should see a welcome message with buttons!
6. Click the **🎮 Play Games** button
7. **Your game should open inside Telegram!** 🎉

---

## ✅ That's It!

Your bot is now working! Users can:
- Open your bot in Telegram
- Click "Play Games" to play
- Check their balance
- View statistics
- And more!

---

## 🎯 What to Do Next?

### Test all commands:
Send these to your bot:
- `/start` - Main menu
- `/play` - Open games
- `/balance` - Check balance
- `/stats` - View stats
- `/help` - Get help

### Share your bot:
- Send the bot link to friends: `https://t.me/YourBotUsername`
- They can start playing immediately!

### Customize:
- Edit `backend/bot.py` to change messages
- Add your own features
- Make it yours!

---

## 🚨 Problems?

### Bot doesn't respond?
- Make sure Terminal 2 is running (`python bot.py`)
- Check your token in the `.env` file
- Make sure you copied the entire token

### "Play Games" button doesn't work?
- Make sure Terminal 3 is running (frontend)
- Check that `WEBAPP_URL=http://localhost:5173` in `.env`
- Make sure it's `http://` not `https://`

### Can't install python-telegram-bot?
- Make sure Python is installed: `python --version`
- Update pip first: `pip install --upgrade pip`
- Try again: `pip install python-telegram-bot`

---

## 📚 More Help

Check these files for more details:
- **BOT_CHECKLIST.md** - Step-by-step checklist
- **QUICK_START_BOT.md** - Quick reference
- **TELEGRAM_BOT_SETUP.md** - Detailed guide
- **BOT_COMMANDS.md** - All bot commands

---

## 🎊 Congratulations!

You've successfully created and integrated a Telegram bot with your gaming platform!

**Your bot is live and ready for users!** 🚀

---

**Questions?** Review the error messages in your terminals - they usually tell you what's wrong!

**Working?** Great! Now you can customize it and add more features!
