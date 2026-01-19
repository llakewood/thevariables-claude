# Deployment Guide

## Project Structure

```
thevariables-website/
├── css/
│   ├── styles.css              # Main stylesheet
│   └── work-case-study.css     # Case study specific styles
├── js/
│   ├── config.js               # Generated config (from build)
│   └── script.js               # Main JavaScript
├── *.html                      # All HTML pages
├── .env                        # Environment variables (DO NOT DEPLOY)
├── .env.example                # Template for .env
├── .gitignore                  # Git ignore rules
├── build.js                    # Build script
├── config.template.js          # Config template
├── package.json                # NPM scripts
└── *.md                        # Documentation files
```

## Files to Deploy

**Deploy these to your web server:**
- ✅ All `.html` files (index.html, about.html, services.html, work-*.html)
- ✅ `css/` directory (all CSS files)
- ✅ `js/` directory (all JS files including config.js)

**DO NOT deploy these:**
- ❌ `.env` (contains your access key)
- ❌ `.env.example` (not needed on production)
- ❌ `.gitignore` (only for git)
- ❌ `build.js` (only for building)
- ❌ `config.template.js` (only for building)
- ❌ `package.json` (only for building)
- ❌ `node_modules/` (if you have it)
- ❌ Documentation files (*.md) - optional, won't hurt if deployed

## Pre-Deployment Checklist

1. **Run build script:**
   ```bash
   npm run build
   ```

2. **Verify config.js was generated:**
   ```bash
   cat js/config.js
   ```
   Should contain your actual Web3Forms access key.

3. **Test locally:**
   ```bash
   npm run serve
   ```
   Open http://localhost:8080 and test the contact form.

4. **Check all pages:**
   - [ ] Homepage (index.html)
   - [ ] About page (about.html)
   - [ ] Services page (services.html)
   - [ ] All 4 case studies
   - [ ] Contact form submission

## Deployment Methods

### Method 1: FTP/SFTP Upload

1. Connect to your web server via FTP/SFTP
2. Navigate to your public directory (public_html, www, htdocs, etc.)
3. Upload:
   - All `.html` files
   - `css/` folder
   - `js/` folder

### Method 2: cPanel File Manager

1. Log into cPanel
2. Open File Manager
3. Navigate to public_html
4. Upload files and folders
5. Set permissions if needed (typically 644 for files, 755 for directories)

### Method 3: Command Line (SCP)

```bash
# From your project directory
scp -r *.html css/ js/ user@yourserver.com:~/public_html/
```

### Method 4: Git Deployment

If your host supports git deployment:

```bash
# Make sure .gitignore is properly configured
git add .
git commit -m "Deploy website"
git push origin main

# Then pull on server
ssh user@yourserver.com
cd ~/public_html
git pull
```

## Post-Deployment

1. **Test the live site:**
   - Visit https://thevariables.com
   - Test all navigation links
   - Submit the contact form
   - Check your email for the form submission

2. **Configure Web3Forms dashboard:**
   - Go to https://web3forms.com
   - Add your domain to the whitelist
   - Configure email notifications if needed

3. **Monitor for issues:**
   - Check browser console for errors
   - Test on different devices/browsers
   - Monitor form submissions in Web3Forms dashboard

## Troubleshooting

**Form not working?**
- Check js/config.js has your actual access key
- Verify domain is whitelisted in Web3Forms dashboard
- Check browser console for errors

**Styles not loading?**
- Verify css/ folder was uploaded
- Check file paths in HTML files
- Clear browser cache

**Scripts not working?**
- Verify js/ folder was uploaded
- Check browser console for errors
- Ensure config.js exists and has valid content

## Updates

When making updates to the site:

1. Edit files locally
2. If .env changed, run `npm run build`
3. Re-upload changed files to server
4. Clear browser cache and test

## Security Notes

- ✅ Web3Forms access key is public by design (domain-restricted)
- ❌ Never deploy .env file
- ✅ Configure domain whitelist in Web3Forms dashboard
- ✅ Keep build scripts and config templates in your git repo (not on production server)