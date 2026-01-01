# 🤖 Telegram Bot Commands & Features

## User Commands

### `/start`
Shows welcome message with interactive buttons:
- 🎮 Play Games - Opens the web app
- 💰 Balance - Shows current balance
- 📊 Stats - Shows game statistics

### `/play`
Opens the gaming web app directly

### `/balance`
Shows detailed balance information:
- Current balance
- Games played
- Total wagered
- Total won/lost

### `/stats`
Shows comprehensive statistics:
- Games played
- Win rate percentage
- Financial stats
- Member since date

### `/deposit`
Shows instructions for depositing money

### `/withdraw`
Shows instructions for withdrawing money

### `/help`
Shows all available commands and how to use the bot

---

## How Users Interact with Your Bot

### First Time User:
1. User searches for your bot in Telegram
2. Clicks "Start"
3. Sees welcome message with buttons
4. Clicks "🎮 Play Games"
5. Web app opens inside Telegram
6. User can play games directly

### Returning User:
1. Opens bot chat
2. Can use commands or buttons
3. Check balance with `/balance`
4. View stats with `/stats`
5. Play games anytime

---

## Bot Features

✅ **Web App Integration** - Games open inside Telegram
✅ **Balance Checking** - Users can check balance via bot
✅ **Statistics** - View game history and win rates
✅ **Deposit/Withdrawal Info** - Clear instructions
✅ **Interactive Buttons** - Easy navigation
✅ **Command Menu** - All commands in bot menu

---

## Setting Up Bot Commands Menu

To add commands to your bot's menu (so users can see them):

1. Open Telegram and go to @BotFather
2. Send: `/mybots`
3. Select your bot
4. Click "Edit Bot"
5. Click "Edit Commands"
6. Paste this:

```
start - Start the bot and see main menu
play - Open game app
balance - Check your balance
stats - View your statistics
deposit - Deposit instructions
withdraw - Withdrawal instructions
help - Show help information
```

7. Send it to BotFather
8. Done! Users will now see these commands when they type `/`

---

## Customization

You can customize the bot by editing `backend/bot.py`:

### Change Welcome Message:
Look for the `start` function and edit the `welcome_text` variable

### Change Button Text:
Look for `InlineKeyboardButton` and change the text

### Add New Commands:
1. Create a new async function
2. Add it to the handlers in `main()` function

Example:
```python
async def my_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("My custom message!")

# In main():
application.add_handler(CommandHandler("mycommand", my_command))
```

---

## Testing Your Bot

### Local Testing:
1. Make sure backend is running: `python manage.py runserver`
2. Make sure bot is running: `python bot.py`
3. Make sure frontend is running: `npm run dev`
4. Open your bot in Telegram
5. Send `/start`
6. Click "Play Games"

### Check if Bot is Online:
- Send any command to your bot
- If it responds, it's working!
- If no response, check if `bot.py` is running

---

## Troubleshooting

### Bot doesn't respond:
- Check if `python bot.py` is running
- Check your token in `.env` file
- Make sure there are no errors in terminal

### "Play Games" button doesn't work:
- Make sure frontend is running
- Check `WEBAPP_URL` in `.env` matches your frontend URL
- For local: `http://localhost:5173`

### Balance command shows error:
- Make sure Django backend is running
- Check database connection
- User must play at least once to have a record

---

## Production Deployment

When deploying to production:

1. **Update .env file:**
```env
TELEGRAM_BOT_TOKEN=your_real_token
WEBAPP_URL=https://yourdomain.com
```

2. **Keep bot running 24/7:**
   - Use PM2: `pm2 start bot.py --interpreter python3 --name telegram-bot`
   - Or use systemd service
   - Or run in Docker container

3. **Monitor bot:**
   - Check logs regularly
   - Set up error notifications
   - Monitor uptime

---

## Security Tips

🔒 **Never share your bot token**
🔒 **Don't commit .env file to git**
🔒 **Use environment variables in production**
🔒 **Validate user input**
🔒 **Rate limit commands if needed**

---

## Need Help?

Common issues and solutions:

**Q: Bot is offline**
A: Make sure `python bot.py` is running

**Q: Commands don't work**
A: Check for errors in terminal where bot.py is running

**Q: Web app doesn't open**
A: Check WEBAPP_URL in .env and make sure frontend is running

**Q: Balance shows wrong amount**
A: Check if Django backend is running and database is accessible

---

🎉 Your bot is ready to use! Users can now play games directly from Telegram!
