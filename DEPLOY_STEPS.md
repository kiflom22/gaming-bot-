# 🚀 Simple Deployment Steps

Follow these steps exactly to deploy your app!

---

## ✅ Step 1: Deploy Backend (Railway) - 10 minutes

### 1. Create Railway Account
1. Go to https://railway.app
2. Click "Login" → Sign in with GitHub
3. Authorize Railway to access your repos

### 2. Create New Project
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your gaming bot repository
4. Railway will start deploying automatically

### 3. Add Database
1. In your project, click "+ New"
2. Select "Database"
3. Choose "Add PostgreSQL"
4. Database is created automatically!

### 4. Add Environment Variables
1. Click on your service (the one with your code)
2. Go to "Variables" tab
3. Click "Add Variable" and add these one by one:

```
SECRET_KEY = make-this-a-long-random-string-123456789
DEBUG = False
ALLOWED_HOSTS = *.railway.app
TELEGRAM_BOT_TOKEN = your-bot-token-from-botfather
WEBAPP_URL = https://your-app.vercel.app
```

**Note:** We'll update WEBAPP_URL after deploying frontend

### 5. Configure Start Command
1. Click "Settings" tab
2. Scroll to "Deploy"
3. Find "Custom Start Command"
4. Enter:
```
python manage.py migrate && gunicorn config.wsgi
```
5. Click "Deploy"

### 6. Get Your Backend URL
1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. Copy the URL (like: `https://your-app.railway.app`)
5. **Save this URL** - you'll need it for frontend!

### 7. Create Admin User
1. Click "Settings" → scroll to "Service"
2. Click "New Variable"
3. Add:
```
DJANGO_SUPERUSER_USERNAME = admin
DJANGO_SUPERUSER_PASSWORD = your-strong-password
DJANGO_SUPERUSER_EMAIL = admin@example.com
```
4. Redeploy

✅ **Backend is live!** Test it: `https://your-app.railway.app/admin`

---

## ✅ Step 2: Deploy Frontend (Vercel) - 5 minutes

### 1. Install Vercel CLI
Open terminal and run:
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```
Follow the prompts to login

### 3. Update Frontend Environment
1. Go to `frontend` folder
2. Create/update `.env` file:
```
VITE_API_URL=https://your-backend.railway.app
```
**Replace with your actual Railway URL from Step 1.6!**

### 4. Deploy Frontend
```bash
cd frontend
vercel
```

Answer the prompts:
- Set up and deploy? → **Y**
- Which scope? → Select your account
- Link to existing project? → **N**
- Project name? → **gaming-bot** (or any name)
- In which directory? → **./frontend** or **./** (if already in frontend)
- Override settings? → **N**

### 5. Deploy to Production
```bash
vercel --prod
```

### 6. Get Your Frontend URL
After deployment, Vercel shows your URL:
```
https://your-app.vercel.app
```
**Copy this URL!**

### 7. Add Environment Variable in Vercel
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to "Settings" → "Environment Variables"
4. Add:
   - Name: `VITE_API_URL`
   - Value: `https://your-backend.railway.app`
5. Click "Save"
6. Go to "Deployments" → Click "..." → "Redeploy"

✅ **Frontend is live!** Test it: `https://your-app.vercel.app`

---

## ✅ Step 3: Update Backend with Frontend URL - 2 minutes

### 1. Update Railway Variables
1. Go back to Railway dashboard
2. Click your service
3. Go to "Variables"
4. Update `WEBAPP_URL`:
```
WEBAPP_URL = https://your-app.vercel.app
```
**Use your actual Vercel URL!**

### 2. Redeploy
Railway will automatically redeploy with new variables

✅ **Backend and Frontend are connected!**

---

## ✅ Step 4: Configure Telegram Bot - 3 minutes

### 1. Set Menu Button
1. Open Telegram
2. Search for `@BotFather`
3. Send: `/setmenubutton`
4. Select your bot
5. Click "Edit menu button URL"
6. Send your Vercel URL: `https://your-app.vercel.app`

### 2. Set Commands
Send to @BotFather:
```
/setcommands
```
Select your bot, then send:
```
start - Start the bot and see main menu
play - Open game app
balance - Check your balance
stats - View your statistics
deposit - Deposit instructions
withdraw - Withdrawal instructions
help - Show help information
```

✅ **Bot is configured!**

---

## ✅ Step 5: Test Everything! - 5 minutes

### Test Backend:
1. Visit: `https://your-backend.railway.app/admin`
2. Login with admin credentials
3. Should see Django admin panel ✅

### Test Frontend:
1. Visit: `https://your-app.vercel.app`
2. Should see game lobby ✅
3. Try clicking a game ✅

### Test Bot:
1. Open Telegram
2. Search for your bot
3. Send `/start`
4. Should see welcome message ✅
5. Click "🎮 Play Games"
6. Should open your Vercel app ✅
7. Try playing a game ✅
8. Check balance updates ✅

---

## 🎉 You're Live!

Your app is now deployed and accessible worldwide!

### Your URLs:
- **Backend:** `https://your-app.railway.app`
- **Frontend:** `https://your-app.vercel.app`
- **Bot:** `https://t.me/YourBotUsername`
- **Admin:** `https://your-app.railway.app/admin`

### Share Your Bot:
Send this link to users:
```
https://t.me/YourBotUsername?start=play
```

---

## 🔧 Troubleshooting

### Backend Issues:

**"Application Error"**
- Check Railway logs: Dashboard → Service → Logs
- Make sure all environment variables are set
- Check if migrations ran successfully

**"Database Error"**
- Make sure PostgreSQL is added
- Check DATABASE_URL is automatically set
- Try redeploying

**"Static files not loading"**
- Railway should handle this automatically with WhiteNoise
- Check logs for errors

### Frontend Issues:

**"Can't connect to backend"**
- Check VITE_API_URL in Vercel environment variables
- Make sure it's your Railway URL
- Redeploy after changing variables

**"404 on refresh"**
- Make sure `vercel.json` exists in frontend folder
- Redeploy

### Bot Issues:

**"Bot doesn't respond"**
- Check Railway logs - bot process should be running
- Make sure TELEGRAM_BOT_TOKEN is correct
- Check Procfile has both web and bot processes

**"Play Games button doesn't work"**
- Check WEBAPP_URL in Railway matches your Vercel URL
- Update menu button in BotFather
- Make sure URL is HTTPS

---

## 📊 Monitoring

### Railway Dashboard:
- View logs in real-time
- Monitor CPU and memory usage
- Check deployment history
- View database metrics

### Vercel Dashboard:
- View deployment logs
- Check build status
- Monitor bandwidth usage
- View analytics

---

## 🔄 Updating Your App

### Update Backend:
1. Make changes to code
2. Commit and push to GitHub:
```bash
git add .
git commit -m "Update backend"
git push
```
3. Railway auto-deploys!

### Update Frontend:
1. Make changes to code
2. Deploy:
```bash
cd frontend
vercel --prod
```

### Update Bot:
1. Edit `backend/bot.py`
2. Push to GitHub
3. Railway auto-deploys!

---

## 💰 Costs

### Free Tier (Good for starting):
- **Railway:** $5 credit/month (free)
- **Vercel:** Free forever
- **Total:** $0/month

### When You Grow:
- **Railway:** $5-20/month (pay as you go)
- **Vercel:** Free or $20/month (Pro features)

---

## 🎯 Next Steps

Now that you're deployed:

1. **Test thoroughly** - Try all features
2. **Share your bot** - Get users!
3. **Monitor logs** - Watch for errors
4. **Backup database** - Railway has automatic backups
5. **Add features** - Keep improving!

---

## 📞 Need Help?

### Railway Support:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway

### Vercel Support:
- Docs: https://vercel.com/docs
- Support: support@vercel.com

### Check Logs:
- Railway: Dashboard → Service → Logs
- Vercel: Dashboard → Project → Deployments → View Logs

---

🎊 **Congratulations! Your gaming bot is now live!** 🎊

Share it with the world: `https://t.me/YourBotUsername`
