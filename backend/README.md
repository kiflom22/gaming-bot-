# Gaming Bot Backend

Django backend for Telegram gaming bot with admin-controlled points system.

## Features

- ✅ Telegram authentication
- ✅ 6 games (Crash, Plinko, Slots, Wheel, Cards, Mining)
- ✅ Admin-controlled deposits
- ✅ Withdrawal system (min 500 points)
- ✅ User management
- ✅ Game history tracking
- ✅ Ban/unban users

## Setup

1. **Install dependencies**
```bash
pip install -r requirements.txt
```

2. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your settings
```

3. **Run migrations**
```bash
python manage.py makemigrations
python manage.py migrate
```

4. **Create superuser**
```bash
python manage.py createsuperuser
```

5. **Run server**
```bash
python manage.py runserver
```

6. **Run Telegram bot** (in separate terminal)
```bash
python bot.py
```

## Admin Panel

Access at: `http://localhost:8000/admin`

### Admin Features:

**User Management:**
- View all users
- Add/remove points
- Ban/unban users
- View user statistics

**Deposit Management:**
- Approve/reject deposit requests
- Add points to user balance
- Track payment proofs

**Withdrawal Management:**
- Approve/reject withdrawals
- Mark as paid
- Refund rejected withdrawals

**Game Sessions:**
- View all game history
- Filter by game type
- Track wins/losses

## API Endpoints

### Authentication
- `POST /api/user/auth/` - Telegram login

### User
- `GET /api/user/<telegram_id>/balance/` - Get balance
- `GET /api/user/<telegram_id>/stats/` - Get statistics

### Deposits
- `POST /api/user/deposit/` - Request deposit
- `GET /api/user/<telegram_id>/deposits/` - Get deposit history

### Withdrawals
- `POST /api/user/withdrawal/` - Request withdrawal (min 500 points)
- `GET /api/user/<telegram_id>/withdrawals/` - Get withdrawal history

### Games
- `POST /games/api/play/` - Play game
- `GET /games/api/history/<telegram_id>/` - Get game history

## Telegram Bot Commands

- `/start` - Start bot and show menu
- `/play` - Open game web app
- `/balance` - Check balance
- `/deposit` - Deposit instructions
- `/withdraw` - Withdrawal instructions
- `/help` - Show help

## Workflow

1. **User Registration:**
   - User starts bot on Telegram
   - Clicks "Play Games" button
   - Frontend authenticates via Telegram WebApp
   - User account created automatically

2. **Deposit:**
   - User pays externally
   - User requests deposit via bot/admin
   - Admin approves in admin panel
   - Points added to user balance

3. **Playing:**
   - User selects game
   - Places bet
   - Game result calculated
   - Balance updated automatically

4. **Withdrawal:**
   - User requests withdrawal (min 500 points)
   - Points deducted immediately
   - Admin processes payment externally
   - Admin marks as paid in panel

## Security Notes

- Change SECRET_KEY in production
- Set DEBUG=False in production
- Use HTTPS for WEBAPP_URL
- Validate Telegram WebApp data
- Use PostgreSQL in production
