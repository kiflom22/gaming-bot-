# 🚀 Complete Deployment Guide

Deploy your gaming bot to production - step by step!

## 📋 What We'll Deploy:

1. **Backend (Django)** → Railway (Free tier)
2. **Frontend (React)** → Vercel (Free)
3. **Bot** → Runs on Railway with backend
4. **Database** → PostgreSQL on Railway (Free)

**Total Cost: $0/month** (with free tiers)

---

## Part 1: Deploy Backend to Railway (15 minutes)

### Step 1: Prepare Backend Files

First, let's add required files for deployment.

#### 1.1 Create `Procfile` in backend folder:
```bash
cd backend
```

Create file `Procfile` (no extension) with this content:
```
web: gunicorn config.wsgi --log-file -
bot: python bot.py
```

#### 1.2 Create `runtime.txt`:
```
python-3.11.0
```

#### 1.3 Update `requirements.txt`:
Add these lines if not present:
```
gunicorn==21.2.0
psycopg2-binary==2.9.9
whitenoise==6.6.0
dj-database-url==2.1.0
```

#### 1.4 Update `config/settings.py`:

Add at the top (after imports):
```python
import dj_database_url
import os

# Build paths
BASE_DIR = Path(__file__).resolve().parent.parent
```

Replace `DATABASES` section with:
```python
# Database
if os.getenv('DATABASE_URL'):
    DATABASES = {
        'default': dj_database_url.config(
            default=os.getenv('DATABASE_URL'),
            conn_max_age=600
        )
    }
else:
    DATABASES = {
        'default': {
            'ENGINE': 'django.db.backends.sqlite3',
            'NAME': BASE_DIR / 'db.sqlite3',
        }
    }
```

Update `ALLOWED_HOSTS`:
```python
ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS', 'localhost,127.0.0.1').split(',')
```

Add `STATIC_ROOT`:
```python
STATIC_URL = '/static/'
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
```

Add WhiteNoise to `MIDDLEWARE` (after SecurityMiddleware):
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware',  # Add this
    # ... rest of middleware
]
```

### Step 2: Deploy to Railway

#### 2.1 Create Railway Account:
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign up with GitHub

#### 2.2 Create New Project:
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Connect your GitHub account
4. Select your repository
5. Railway will detect Django automatically

#### 2.3 Add PostgreSQL:
1. In your project, click "New"
2. Select "Database"
3. Choose "PostgreSQL"
4. Railway creates database automatically

#### 2.4 Configure Environment Variables:
Click on your Django service → Variables → Add these:

```
SECRET_KEY=your-super-secret-key-change-this-in-production
DEBUG=False
ALLOWED_HOSTS=your-app.railway.app
DATABASE_URL=(automatically set by Railway)
TELEGRAM_BOT_TOKEN=your-bot-token-from-botfather
WEBAPP_URL=https://your-frontend.vercel.app
ADMIN_TELEGRAM_IDS=your-telegram-id
```

#### 2.5 Deploy:
1. Railway automatically deploys
2. Wait 2-3 minutes
3. Check logs for any errors
4. Your backend URL: `https://your-app.railway.app`

#### 2.6 Run Migrations:
In Railway dashboard:
1. Click your service
2. Go to "Settings"
3. Scroll to "Deploy"
4. Add custom start command:
```
python manage.py migrate && gunicorn config.wsgi
```

Or use Railway CLI:
```bash
railway run python manage.py migrate
railway run python manage.py createsuperuser
```

---

## Part 2: Deploy Frontend to Vercel (10 minutes)

### Step 1: Prepare Frontend

#### 1.1 Update `frontend/.env`:
```
VITE_API_URL=https://your-backend.railway.app
```

#### 1.2 Create `vercel.json` in frontend folder:
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Step 2: Deploy to Vercel

#### 2.1 Install Vercel CLI:
```bash
npm install -g vercel
```

#### 2.2 Login:
```bash
vercel login
```

#### 2.3 Deploy:
```bash
cd frontend
vercel
```

Follow prompts:
- Set up and deploy? **Y**
- Which scope? **Your account**
- Link to existing project? **N**
- Project name? **gaming-bot** (or any name)
- Directory? **./frontend** or **./** (if already in frontend)
- Override settings? **N**

#### 2.4 Production Deploy:
```bash
vercel --prod
```

Your frontend URL: `https://your-app.vercel.app`

### Step 3: Update Environment Variables

#### 3.1 In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add:
```
VITE_API_URL=https://your-backend.railway.app
```

#### 3.2 Redeploy:
```bash
vercel --prod
```

---

## Part 3: Configure Telegram Bot (5 minutes)

### Step 1: Update Bot Token

Go back to Railway → Your Django service → Variables:

Update:
```
WEBAPP_URL=https://your-frontend.vercel.app
```

### Step 2: Set Bot Menu Button

1. Open Telegram
2. Go to @BotFather
3. Send: `/setmenubutton`
4. Select your bot
5. Send your frontend URL: `https://your-frontend.vercel.app`

### Step 3: Test Bot

1. Open your bot in Telegram
2. Send `/start`
3. Click "🎮 Play Games"
4. Should open your deployed app!

---

## Part 4: Final Configuration (5 minutes)

### Step 1: Update CORS in Backend

In Railway, update `settings.py` or add to environment variables:

```python
CORS_ALLOWED_ORIGINS = [
    'https://your-frontend.vercel.app',
]
```

### Step 2: Create Admin User

Using Railway CLI:
```bash
railway run python manage.py createsuperuser
```

Or in Railway dashboard → Service → Settings → Add this to start command:
```bash
python manage.py migrate && python manage.py createsuperuser --noinput && gunicorn config.wsgi
```

### Step 3: Test Everything

1. ✅ Open bot in Telegram
2. ✅ Click "Play Games"
3. ✅ Try playing a game
4. ✅ Check balance updates
5. ✅ Test admin panel: `https://your-backend.railway.app/admin`

---

## 🎯 Quick Deployment Checklist

### Backend (Railway):
- [ ] Create Railway account
- [ ] Deploy from GitHub
- [ ] Add PostgreSQL database
- [ ] Set environment variables
- [ ] Run migrations
- [ ] Create superuser
- [ ] Test admin panel

### Frontend (Vercel):
- [ ] Install Vercel CLI
- [ ] Update .env with backend URL
- [ ] Deploy with `vercel --prod`
- [ ] Set environment variables
- [ ] Test frontend loads

### Bot:
- [ ] Update WEBAPP_URL in Railway
- [ ] Set menu button in BotFather
- [ ] Test bot opens web app
- [ ] Test all commands work

---

## 🔧 Alternative Deployment Options

### Option 2: Render (Backend) + Netlify (Frontend)

**Backend on Render:**
1. Go to https://render.com
2. New → Web Service
3. Connect GitHub repo
4. Build Command: `pip install -r requirements.txt`
5. Start Command: `gunicorn config.wsgi:application`
6. Add PostgreSQL database
7. Set environment variables

**Frontend on Netlify:**
1. Go to https://netlify.com
2. New site from Git
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Set environment variables

### Option 3: Heroku (All-in-One)

**Deploy Everything to Heroku:**
```bash
# Install Heroku CLI
heroku login
heroku create your-app-name

# Add PostgreSQL
heroku addons:create heroku-postgresql:mini

# Set environment variables
heroku config:set SECRET_KEY=your-secret-key
heroku config:set TELEGRAM_BOT_TOKEN=your-token
heroku config:set WEBAPP_URL=https://your-app.herokuapp.com

# Deploy
git push heroku main

# Run migrations
heroku run python manage.py migrate
heroku run python manage.py createsuperuser
```

### Option 4: VPS (DigitalOcean, Linode, etc.)

For advanced users who want full control:
1. Rent a VPS ($5-10/month)
2. Install Nginx + Gunicorn
3. Set up PostgreSQL
4. Configure domain
5. Set up SSL with Let's Encrypt
6. Use systemd to run bot 24/7

---

## 🚨 Common Deployment Issues

### Issue 1: Static files not loading
**Solution:** Run `python manage.py collectstatic` in Railway

### Issue 2: Database connection error
**Solution:** Check DATABASE_URL is set in Railway

### Issue 3: CORS errors
**Solution:** Add your frontend URL to CORS_ALLOWED_ORIGINS

### Issue 4: Bot not responding
**Solution:** Check bot process is running in Railway (should have 2 processes: web + bot)

### Issue 5: Frontend can't reach backend
**Solution:** Check VITE_API_URL in Vercel environment variables

---

## 📊 Monitoring Your App

### Railway Dashboard:
- View logs
- Monitor CPU/Memory
- Check database size
- View deployments

### Vercel Dashboard:
- View deployments
- Check build logs
- Monitor bandwidth
- View analytics

### Telegram Bot:
- Check if bot is online
- Monitor user count
- Check error messages

---

## 🔒 Security Checklist

- [ ] Change SECRET_KEY to random string
- [ ] Set DEBUG=False in production
- [ ] Use HTTPS for all URLs
- [ ] Enable CSRF protection
- [ ] Set strong admin password
- [ ] Backup database regularly
- [ ] Monitor logs for errors
- [ ] Rate limit API endpoints
- [ ] Validate all user input

---

## 💰 Cost Breakdown

### Free Tier (Recommended for Starting):
- **Railway:** Free ($5 credit/month)
- **Vercel:** Free (100GB bandwidth)
- **PostgreSQL:** Free (Railway included)
- **Total:** $0/month

### Paid Tier (For Growth):
- **Railway:** $5-20/month
- **Vercel:** Free or $20/month (Pro)
- **Database:** Included
- **Total:** $5-40/month

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

**Share your bot:**
- Bot link: `https://t.me/YourBotUsername`
- Direct link: `https://t.me/YourBotUsername?start=play`

**Monitor and maintain:**
- Check logs daily
- Monitor user feedback
- Update regularly
- Backup database weekly

---

## 📞 Need Help?

**Railway Issues:**
- Check Railway docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway

**Vercel Issues:**
- Check Vercel docs: https://vercel.com/docs
- Vercel support: support@vercel.com

**General Issues:**
- Check application logs
- Review error messages
- Test locally first

---

## 🔄 Updating Your App

### Update Backend:
```bash
git push origin main
# Railway auto-deploys
```

### Update Frontend:
```bash
cd frontend
vercel --prod
```

### Update Bot:
- Edit bot.py
- Push to GitHub
- Railway auto-deploys

---

🎊 **Congratulations! Your gaming bot is now live and accessible to users worldwide!** 🎊
