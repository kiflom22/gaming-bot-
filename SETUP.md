# Gaming Bot Setup Guide

Complete setup guide for the Telegram gaming bot with Django backend.

## 📋 Prerequisites

- Python 3.8+
- Node.js 16+
- Telegram Bot Token (from @BotFather)

## 🚀 Backend Setup

### 1. Navigate to backend folder
```bash
cd backend
```

### 2. Create virtual environment
```bash
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure environment
```bash
copy .env.example .env
```

Edit `.env` file:
```env
SECRET_KEY=your-random-secret-key-here
DEBUG=True
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
TELEGRAM_BOT_USERNAME=your_bot_username
WEBAPP_URL=https://your-deployed-frontend-url.com
```

### 5. Run migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### 6. Create admin user
```bash
python manage.py createsuperuser
```

### 7. Start Django server
```bash
python manage.py runserver
```

### 8. Start Telegram bot (new terminal)
```bash
cd backend
python bot.py
```

## 🎨 Frontend Setup

### 1. Navigate to frontend folder
```bash
cd frontend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment
```bash
copy .env.example .env
```

Edit `.env` file:
```env
VITE_API_URL=http://localhost:8000
```

### 4. Start development server
```bash
npm run dev
```

## 🤖 Telegram Bot Setup

### 1. Create bot with @BotFather
1. Open Telegram and search for @BotFather
2. Send `/newbot`
3. Follow instructions to create your bot
4. Copy the bot token

### 2. Set bot commands
Send to @BotFather:
```
/setcommands

start - Start the bot
play - Open game menu
balance - Check balance
deposit - Deposit instructions
withdraw - Withdrawal instructions
stats - View statistics
help - Show help
```

### 3. Enable inline mode (optional)
```
/setinline
```

### 4. Set menu button
```
/setmenubutton
```
Then provide your web app URL

## 🌐 Deployment

### Backend (Django)

**Option 1: Railway**
1. Create account on railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy

**Option 2: Heroku**
1. Create Heroku app
2. Add PostgreSQL addon
3. Set environment variables
4. Deploy via Git

**Option 3: VPS**
1. Use Gunicorn + Nginx
2. Setup PostgreSQL
3. Configure domain
4. Use systemd for bot

### Frontend (React)

**Option 1: Vercel**
```bash
npm install -g vercel
vercel
```

**Option 2: Netlify**
```bash
npm run build
# Upload dist folder to Netlify
```

**Option 3: GitHub Pages**
```bash
npm run build
# Deploy dist folder
```

## 🔧 Admin Panel Usage

Access: `http://localhost:8000/admin`

### Managing Users
1. Go to Users section
2. View user details
3. Add/remove points manually
4. Ban/unban users

### Approving Deposits
1. Go to Deposits section
2. Select pending deposits
3. Click "Approve selected deposits"
4. Points automatically added

### Processing Withdrawals
1. Go to Withdrawals section
2. Select pending withdrawals
3. Click "Approve selected withdrawals"
4. Process payment externally
5. Mark as "Paid"

## 📱 User Workflow

### 1. Registration
- User starts bot: `/start`
- Clicks "Play Games" button
- Automatically registered

### 2. Deposit
- User contacts admin
- Makes external payment
- Admin approves in panel
- Points added to balance

### 3. Playing
- User opens web app
- Selects game
- Places bet
- Wins/loses points

### 4. Withdrawal
- User goes to Transactions
- Enters amount (min 500)
- Provides payment details
- Admin processes externally

## 🔒 Security Checklist

- [ ] Change SECRET_KEY in production
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS for WEBAPP_URL
- [ ] Enable CSRF protection
- [ ] Use PostgreSQL in production
- [ ] Set up proper CORS
- [ ] Validate Telegram WebApp data
- [ ] Rate limit API endpoints
- [ ] Backup database regularly

## 🐛 Troubleshooting

### Bot not responding
- Check TELEGRAM_BOT_TOKEN
- Ensure bot.py is running
- Check bot logs

### Frontend can't connect
- Verify VITE_API_URL
- Check CORS settings
- Ensure backend is running

### Games not working
- Check browser console
- Verify API endpoints
- Check user balance

### Database errors
- Run migrations again
- Check database connection
- Verify models

## 📞 Support

For issues:
1. Check logs
2. Review configuration
3. Test API endpoints
4. Check Telegram bot status

## 🎮 Testing

### Test without Telegram
Frontend has fallback for testing:
- Opens without Telegram
- Uses test user ID: 12345
- Starting balance: 1000 points

### Test games
1. Open each game
2. Place minimum bet
3. Verify balance updates
4. Check admin panel logs

## 📊 Monitoring

### Check statistics
- User registrations
- Games played
- Total wagered
- Win/loss ratios
- Pending withdrawals

### Database queries
```sql
-- Total users
SELECT COUNT(*) FROM users;

-- Total games today
SELECT COUNT(*) FROM game_sessions WHERE DATE(created_at) = CURRENT_DATE;

-- Pending withdrawals
SELECT COUNT(*) FROM withdrawals WHERE status = 'pending';
```

## 🔄 Updates

To update:
```bash
# Backend
cd backend
git pull
pip install -r requirements.txt
python manage.py migrate

# Frontend
cd frontend
git pull
npm install
npm run build
```

## ✅ Launch Checklist

- [ ] Backend deployed and running
- [ ] Frontend deployed and accessible
- [ ] Telegram bot running
- [ ] Admin panel accessible
- [ ] Test all games
- [ ] Test deposit flow
- [ ] Test withdrawal flow
- [ ] Set up monitoring
- [ ] Backup strategy in place
- [ ] Support contact ready

Good luck with your gaming bot! 🎮🚀
