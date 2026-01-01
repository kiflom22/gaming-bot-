import os
import asyncio
import django
from telegram import Update, WebAppInfo, InlineKeyboardButton, InlineKeyboardMarkup
from telegram.ext import Application, CommandHandler, CallbackQueryHandler, ContextTypes

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from users.models import User

# Get settings
TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN', '')
WEBAPP_URL = os.getenv('WEBAPP_URL', 'http://localhost:5173')

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send welcome message with web app button"""
    user = update.effective_user
    
    keyboard = [
        [InlineKeyboardButton("🎮 Play Games", web_app=WebAppInfo(url=WEBAPP_URL))],
        [InlineKeyboardButton("💰 Balance", callback_data="balance")],
        [InlineKeyboardButton("📊 Stats", callback_data="stats")],
    ]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    welcome_text = f"""
🎮 Welcome to Gaming Bot, {user.first_name}!

Play exciting games and win points!

🎯 Available Games:
• 🎯 Plinko - Drop the ball
• 🎰 Slots - Classic slots
• 🎡 Wheel - Spin to win
• 🃏 Cards - Find the Joker
• ⛏️ Mining - Avoid the mines

💰 Currency: Ethiopian Birr (Br)
💱 Rate: 1 Birr = 1 Point
💸 Minimum withdrawal: Br 500

Click "Play Games" to start!
"""
    
    await update.message.reply_text(welcome_text, reply_markup=reply_markup)

async def help_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Send help message"""
    help_text = """
🎮 Gaming Bot Help

Commands:
/start - Start the bot
/play - Open game menu
/balance - Check your balance
/deposit - Request deposit
/withdraw - Request withdrawal
/stats - View your statistics
/help - Show this help message

💡 How to play:
1. Click "Play Games" button
2. Choose a game
3. Place your bet
4. Win points!

💰 Deposits & Withdrawals:
- Contact admin to deposit money
- Admin will add points to your account
- Minimum withdrawal: 500 points
- Withdrawals are processed manually

Need help? Contact @admin
"""
    await update.message.reply_text(help_text)

async def play_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Open web app"""
    keyboard = [[InlineKeyboardButton("🎮 Play Now", web_app=WebAppInfo(url=WEBAPP_URL))]]
    reply_markup = InlineKeyboardMarkup(keyboard)
    
    await update.message.reply_text(
        "Click the button below to start playing!",
        reply_markup=reply_markup
    )

async def deposit_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show deposit instructions"""
    deposit_text = """
💰 Deposit Instructions

To add points to your account:

1. Contact the admin
2. Make payment in Ethiopian Birr
3. Send payment proof
4. Admin will approve and add points

Conversion Rate: 1 Birr = 1 Point

Contact: @admin
"""
    await update.message.reply_text(deposit_text)

async def withdraw_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show withdrawal instructions"""
    withdraw_text = """
💸 Withdrawal Instructions

Minimum withdrawal: 500 points

To withdraw:
1. Open the game app
2. Go to withdrawal section
3. Enter amount (min 500 points)
4. Provide payment details
5. Wait for admin approval

Processing time: 24-48 hours
"""
    await update.message.reply_text(withdraw_text)

async def balance_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Check user balance"""
    telegram_id = update.effective_user.id
    
    try:
        user = User.objects.get(telegram_id=telegram_id)
        balance_text = f"""
💰 Your Balance

Current Balance: {user.balance:.2f} points

📊 Statistics:
• Games Played: {user.games_played}
• Total Wagered: {user.total_wagered:.2f}
• Total Won: {user.total_won:.2f}
• Total Lost: {user.total_lost:.2f}

Use /play to start gaming!
"""
        await update.message.reply_text(balance_text)
    except User.DoesNotExist:
        await update.message.reply_text(
            "You haven't started playing yet! Use /play to begin."
        )

async def stats_command(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Show user statistics"""
    telegram_id = update.effective_user.id
    
    try:
        user = User.objects.get(telegram_id=telegram_id)
        
        win_rate = 0
        if user.games_played > 0:
            wins = user.game_sessions.filter(result='win').count()
            win_rate = (wins / user.games_played) * 100
        
        stats_text = f"""
📊 Your Statistics

🎮 Games Played: {user.games_played}
🏆 Win Rate: {win_rate:.1f}%

💰 Financial Stats:
• Current Balance: {user.balance:.2f} pts
• Total Wagered: {user.total_wagered:.2f} pts
• Total Won: {user.total_won:.2f} pts
• Total Lost: {user.total_lost:.2f} pts
• Net Profit: {(user.total_won - user.total_lost):.2f} pts

📅 Member since: {user.created_at.strftime('%Y-%m-%d')}

Keep playing to improve your stats!
"""
        await update.message.reply_text(stats_text)
    except User.DoesNotExist:
        await update.message.reply_text(
            "You haven't started playing yet! Use /play to begin."
        )

async def button_callback(update: Update, context: ContextTypes.DEFAULT_TYPE):
    """Handle button callbacks"""
    query = update.callback_query
    await query.answer()
    
    if query.data == "balance":
        telegram_id = query.from_user.id
        try:
            user = User.objects.get(telegram_id=telegram_id)
            await query.message.reply_text(
                f"💰 Your current balance: {user.balance:.2f} points"
            )
        except User.DoesNotExist:
            await query.message.reply_text(
                "You haven't started playing yet! Use /play to begin."
            )
    
    elif query.data == "stats":
        telegram_id = query.from_user.id
        try:
            user = User.objects.get(telegram_id=telegram_id)
            await query.message.reply_text(
                f"📊 Games Played: {user.games_played}\n"
                f"💰 Balance: {user.balance:.2f} pts\n"
                f"🎯 Total Won: {user.total_won:.2f} pts"
            )
        except User.DoesNotExist:
            await query.message.reply_text(
                "You haven't started playing yet! Use /play to begin."
            )

def main():
    """Start the bot"""
    if not TELEGRAM_BOT_TOKEN:
        print("Error: TELEGRAM_BOT_TOKEN not set!")
        return
    
    # Create application
    application = Application.builder().token(TELEGRAM_BOT_TOKEN).build()
    
    # Add handlers
    application.add_handler(CommandHandler("start", start))
    application.add_handler(CommandHandler("help", help_command))
    application.add_handler(CommandHandler("play", play_command))
    application.add_handler(CommandHandler("balance", balance_command))
    application.add_handler(CommandHandler("stats", stats_command))
    application.add_handler(CommandHandler("deposit", deposit_command))
    application.add_handler(CommandHandler("withdraw", withdraw_command))
    application.add_handler(CallbackQueryHandler(button_callback))
    
    # Start bot
    print("Bot started!")
    application.run_polling(allowed_updates=Update.ALL_TYPES)

if __name__ == '__main__':
    main()
