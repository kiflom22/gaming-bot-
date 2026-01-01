# 📋 Deployment Quick Reference

## 🔗 Important URLs

### Services:
- Railway: https://railway.app
- Vercel: https://vercel.com
- BotFather: https://t.me/BotFather

### Your Deployed App:
- Backend: `https://your-app.railway.app`
- Frontend: `https://your-app.vercel.app`
- Admin Panel: `https://your-app.railway.app/admin`
- Bot: `https://t.me/YourBotUsername`

---

## ⚙️ Environment Variables

### Railway (Backend):
```
SECRET_KEY=your-long-random-secret-key-here
DEBUG=False
ALLOWED_HOSTS=*.railway.app
DATABASE_URL=(auto-set by Railway)
TELEGRAM_BOT_TOKEN=your-bot-token
WEBAPP_URL=https://your-app.vercel.app
ADMIN_TELEGRAM_IDS=your-telegram-id
```

### Vercel (Frontend):
```
VITE_API_URL=https://your-backend.railway.app
```

---

## 🚀 Deployment Commands

### Deploy Frontend:
```bash
cd frontend
vercel --prod
```

### Check Railway Logs:
```bash
railway logs
```

### Run Migrations on Railway:
```bash
railway run python manage.py migrate
```

### Create Superuser on Railway:
```bash
railway run python manage.py createsuperuser
```

---

## 📁 Required Files

### Backend:
- ✅ `Procfile` - Tells Railway how to run app
- ✅ `runtime.txt` - Python version
- ✅ `requirements.txt` - Python packages
- ✅ `.env` - Environment variables (local only)

### Frontend:
- ✅ `vercel.json` - Vercel configuration
- ✅ `.env` - Environment variables (local only)

---

## 🔄 Update Workflow

### 1. Update Code Locally:
```bash
# Make changes
git add .
git commit -m "Your update message"
git push
```

### 2. Backend Auto-Deploys:
- Railway detects push
- Automatically deploys
- Check logs for errors

### 3. Frontend Deploy:
```bash
cd frontend
vercel --prod
```

---

## 🧪 Testing Checklist

After deployment, test:

- [ ] Backend admin panel loads
- [ ] Frontend loads
- [ ] Bot responds to `/start`
- [ ] "Play Games" button works
- [ ] Can play a game
- [ ] Balance updates
- [ ] All bot commands work
- [ ] Admin panel accessible
- [ ] Database saves data

---

## 🚨 Common Issues & Fixes

### Issue: "Application Error" on Railway
**Fix:** Check logs, verify environment variables

### Issue: Frontend can't reach backend
**Fix:** Update VITE_API_URL in Vercel, redeploy

### Issue: Bot doesn't respond
**Fix:** Check TELEGRAM_BOT_TOKEN, verify bot process running

### Issue: CORS errors
**Fix:** Check ALLOWED_HOSTS includes your domain

### Issue: Static files not loading
**Fix:** Run `python manage.py collectstatic` on Railway

---

## 📊 Monitoring

### Railway:
- Dashboard → Service → Logs (real-time)
- Dashboard → Service → Metrics (CPU/Memory)
- Dashboard → Database → Metrics

### Vercel:
- Dashboard → Project → Deployments
- Dashboard → Project → Analytics
- Dashboard → Project → Logs

---

## 💾 Backup

### Database Backup (Railway):
1. Dashboard → Database
2. Click "..." → "Backup"
3. Download backup file

### Code Backup:
- Already on GitHub ✅
- Vercel keeps deployment history ✅

---

## 🔐 Security

### Production Checklist:
- [ ] DEBUG=False
- [ ] Strong SECRET_KEY
- [ ] HTTPS only
- [ ] Strong admin password
- [ ] ALLOWED_HOSTS configured
- [ ] CORS properly configured
- [ ] Regular backups enabled

---

## 💰 Cost Tracking

### Railway Free Tier:
- $5 credit/month
- ~500 hours runtime
- 1GB RAM
- 1GB storage

### When to Upgrade:
- More than 500 hours/month
- Need more RAM
- Need more storage
- Want priority support

---

## 📞 Support Contacts

### Railway:
- Docs: https://docs.railway.app
- Discord: https://discord.gg/railway
- Status: https://status.railway.app

### Vercel:
- Docs: https://vercel.com/docs
- Support: support@vercel.com
- Status: https://vercel-status.com

---

## 🎯 Quick Commands

### View Railway Logs:
```bash
railway logs
```

### Deploy Frontend:
```bash
vercel --prod
```

### Check Railway Status:
```bash
railway status
```

### Link Railway Project:
```bash
railway link
```

---

## 📝 Notes

- Keep `.env` files secret (never commit to git)
- Railway auto-deploys on git push
- Vercel requires manual deploy
- Bot runs 24/7 on Railway
- Free tier is enough for starting
- Monitor usage to avoid overages

---

## 🎉 Success Indicators

Your deployment is successful when:

✅ Backend URL loads admin panel
✅ Frontend URL shows game lobby
✅ Bot responds in Telegram
✅ "Play Games" opens your app
✅ Games work and save data
✅ No errors in logs
✅ All commands work

---

**Keep this file handy for quick reference!**
