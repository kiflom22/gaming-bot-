# 🤖 Telegram Bot Setup Guide

This guide will help you create and integrate a Telegram bot with your gaming platform - **no coding knowledge required!**

## Step 1: Create Your Telegram Bot

1. **Open Telegram** on your phone or computer

2. **Search for BotFather** - Type `@BotFather` in the search bar and open the chat

3. **Create a new bot**:
   - Send the command: `/newbot`
   - BotFather will ask for a name - Enter: `Gaming Bot` (or any name you like)
   - BotFather will ask for a username - Enter something like: `YourNameGamingBot` (must end with 'bot')

4. **Save your bot token** - BotFather will give you a token that looks like:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
   **⚠️ IMPORTANT: Keep this token secret! Don't share it with anyone!**

5. **Copy the token** - You'll need it in the next step

## Step 2: Configure Your Bot

1. **Open the file** `backend/.env.example` in your project

2. **Create a new file** called `backend/.env` (remove the .example)

3. **Add your bot token** to the `.env` file:
   ```
   TELEGRAM_BOT_TOKEN=paste_your_token_here
   WEBAPP_URL=http://localhost:5173
   ```

4. **Replace** `paste_your_token_here` with the actual token from BotFather

Example `.env` file:
```
TELEGRAM_BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
WEBAPP_URL=http://localhost:5173
```

## Step 3: Install Required Packages

Open your terminal in the `backend` folder and run:

```bash
pip install python-telegram-bot
```

## Step 4: Start Your Bot

In the terminal (in the `backend` folder), run:

```bash
python bot.py
```

You should see: `Bot started!`

## Step 5: Test Your Bot

1. **Open Telegram** and search for your bot (the username you created)

2. **Click Start** or send `/start`

3. **You should see** a welcome message with buttons:
   - 🎮 Play Games
   - 💰 Balance
   - 📊 Stats

4. **Click "Play Games"** - It should open your web app!

## Available Bot Commands

Your bot supports these commands:

- `/start` - Welcome message and main menu
- `/play` - Open the game app
- `/help` - Show help information
- `/deposit` - Show deposit instructions
- `/withdraw` - Show withdrawal instructions

## Step 6: Set Up Bot Menu (Optional)

To add a menu to your bot:

1. **Go to BotFather** in Telegram
2. Send: `/mybots`
3. Select your bot
4. Click **Edit Bot**
5. Click **Edit Commands**
6. Send this text:
```
start - Start the bot and see main menu
play - Open game app
help - Show help information
deposit - Deposit instructions
withdraw - Withdrawal instructions
```

## Troubleshooting

### Bot doesn't respond
- Make sure `bot.py` is running (you should see "Bot started!")
- Check that your token is correct in the `.env` file
- Make sure there are no spaces before or after the token

### "Play Games" button doesn't work
- Make sure your frontend is running (`npm run dev` in frontend folder)
- Check that `WEBAPP_URL` in `.env` matches your frontend URL
- For local testing, use: `http://localhost:5173`

### Can't install python-telegram-bot
- Make sure Python is installed: `python --version`
- Try: `pip install --upgrade pip` first
- Then try installing again

## Production Deployment

When you deploy your app to production:

1. **Update WEBAPP_URL** in `.env` to your actual domain:
   ```
   WEBAPP_URL=https://yourdomain.com
   ```

2. **Keep bot.py running** - Use a process manager like:
   - PM2: `pm2 start bot.py --interpreter python3`
   - systemd service
   - Docker container

3. **Secure your token** - Never commit `.env` file to git!

## Next Steps

✅ Bot is created and running
✅ Users can open your web app from Telegram
✅ Commands are working

Now you can:
- Customize the welcome message in `backend/bot.py`
- Add more commands
- Set up payment notifications
- Add admin commands

## Need Help?

Common issues:
- **Token error**: Double-check your token in `.env` file
- **Import error**: Run `pip install python-telegram-bot`
- **Bot offline**: Make sure `python bot.py` is running
- **Web app not opening**: Check frontend is running on correct port

---

🎉 **Congratulations!** Your Telegram bot is now integrated with your gaming platform!
