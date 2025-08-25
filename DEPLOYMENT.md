# Dreamhost Apps Deployment Guide 🚀

This guide will walk you through deploying the California Library Tracker to Dreamhost Apps for free hosting.

## Prerequisites

- A Dreamhost account
- A domain or subdomain
- Git repository (GitHub, GitLab, etc.)

## Step 1: Prepare Your Local Environment

1. **Install dependencies and populate database:**
   ```bash
   npm install
   node scripts/populate-libraries.js
   ```

2. **Test locally:**
   ```bash
   node server.js
   ```
   Visit `http://localhost:3000` to verify everything works.

3. **Commit your changes:**
   ```bash
   git add .
   git commit -m "Ready for Dreamhost deployment"
   git push origin main
   ```

## Step 2: Dreamhost Panel Setup

### 2.1 Add Domain/Subdomain
1. Log into your Dreamhost panel
2. Go to **Domains → Manage Domains**
3. Add your domain or subdomain (e.g., `librarytracker.yourdomain.com`)
4. Make sure it's set to **"Web Hosting"**

### 2.2 Create Dreamhost App
1. Go to **Domains → Dreamhost Apps**
2. Click **"Create App"**
3. Choose **"Node.js"** as the runtime
4. Select your domain from the dropdown
5. Set the **Source Directory** to your app folder name
6. Click **"Create App"**

### 2.3 Configure the App
1. In your app settings, set:
   - **Start Command:** `node server.js`
   - **Node.js Version:** `16.x` or higher
   - **Environment:** Production

2. **Connect your Git repository:**
   - Click **"Connect Repository"**
   - Choose your Git provider (GitHub, GitLab, etc.)
   - Select your repository
   - Set branch to `main`
   - Click **"Connect"**

## Step 3: Deploy

1. **Deploy the app:**
   - Click **"Deploy"** in your Dreamhost App
   - Wait for the deployment to complete (usually 2-5 minutes)

2. **Check deployment status:**
   - Look for green checkmark indicating successful deployment
   - Note any error messages if deployment fails

## Step 4: Post-Deployment Setup

### 4.1 SSH into your server (if needed)
```bash
ssh username@your-domain.com
cd /home/username/your-app-directory
```

### 4.2 Install dependencies and populate database
```bash
npm install
node scripts/populate-libraries.js
```

### 4.3 Restart the app
- Go back to Dreamhost Apps panel
- Click **"Restart"** on your app

## Step 5: Verify Deployment

1. **Visit your app:** `https://your-domain.com`
2. **Test features:**
   - Browse libraries
   - Search functionality
   - Add a library
   - Upload an image
   - Record a visit

## Troubleshooting

### Common Issues

**1. App won't start**
- Check the logs in Dreamhost Apps panel
- Verify `node server.js` is the correct start command
- Ensure Node.js version is 16+ 

**2. Database errors**
- SSH into server and run: `node scripts/populate-libraries.js`
- Check file permissions on `library.db`

**3. Image uploads not working**
- Verify `public/uploads` directory exists
- Check file permissions (should be 755)

**4. 404 errors**
- Ensure all static files are in the `public` directory
- Check that the domain is properly configured

### Logs and Debugging

1. **View app logs:**
   - In Dreamhost Apps panel, click on your app
   - Go to **"Logs"** tab
   - Check for error messages

2. **SSH debugging:**
   ```bash
   ssh username@your-domain.com
   cd /home/username/your-app-directory
   node server.js  # Test locally on server
   ```

## Performance Optimization

### For Free Tier
- The app is optimized for Dreamhost's free tier
- SQLite database is perfect for small to medium usage
- Images are automatically compressed and resized
- Static files are served efficiently

### Scaling Considerations
- Monitor database size as it grows
- Consider image cleanup for old uploads
- Add caching headers for better performance

## Security Notes

- The app includes security headers via Helmet.js
- File uploads are restricted to images only
- SQL injection protection via parameterized queries
- CORS is configured for web access

## Maintenance

### Regular Tasks
1. **Backup database:**
   ```bash
   cp library.db library-backup-$(date +%Y%m%d).db
   ```

2. **Update dependencies:**
   ```bash
   npm update
   git add package*.json
   git commit -m "Update dependencies"
   git push
   ```

3. **Monitor logs** for errors or issues

### Adding More Libraries
1. Edit `scripts/populate-libraries.js`
2. Add new library objects
3. Run: `node scripts/populate-libraries.js`
4. Restart the app

## Support

If you encounter issues:
1. Check the logs in Dreamhost Apps panel
2. Verify all steps in this guide
3. Test locally first
4. Contact Dreamhost support if needed

---

**🎉 Congratulations! Your California Library Tracker is now live on Dreamhost Apps!**

Visit your domain to start tracking libraries and sharing images with the community! 📚✨ 