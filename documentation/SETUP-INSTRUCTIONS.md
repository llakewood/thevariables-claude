# Setup Instructions for The Variables Co. Website

## Prerequisites

### Install Node.js (if not already installed)

1. **Check if Node.js is installed:**
   ```bash
   node --version
   ```
   If you see a version number (e.g., v18.x.x), Node is installed. Skip to "Add Node to PATH" if needed.

2. **Install Node.js** (if not installed):
   - **macOS**:
     - Download from https://nodejs.org (LTS version recommended)
     - Or use Homebrew: `brew install node`
   - **Windows**: Download installer from https://nodejs.org
   - **Linux**: Use your package manager (e.g., `sudo apt install nodejs npm`)

### Add Node to PATH (macOS/Linux)

If you get "command not found" when running `node`, you need to add it to your PATH:

1. **Find where Node is installed:**
   ```bash
   which node
   # Common locations:
   # /usr/local/bin/node (Homebrew)
   # /opt/homebrew/bin/node (Apple Silicon Homebrew)
   # ~/.nvm/versions/node/vX.X.X/bin/node (nvm)
   ```

2. **Add to your shell profile:**

   **For Bash (default on macOS < Catalina):**
   ```bash
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.bash_profile
   source ~/.bash_profile
   ```

   **For Zsh (default on macOS Catalina+):**
   ```bash
   echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   **For Apple Silicon Macs with Homebrew:**
   ```bash
   echo 'export PATH="/opt/homebrew/bin:$PATH"' >> ~/.zshrc
   source ~/.zshrc
   ```

   **If using nvm (Node Version Manager):**
   ```bash
   # Already configured by nvm, just reload:
   source ~/.zshrc  # or ~/.bash_profile
   ```

3. **Verify Node is in PATH:**
   ```bash
   node --version
   npm --version
   ```
   You should see version numbers for both commands.

---

## Contact Form Setup (Web3Forms)

The contact form is configured to use Web3Forms, a free service that handles form submissions without requiring backend code.

### Steps to Activate the Contact Form:

1. **Sign up for Web3Forms** (Free, takes 30 seconds)
   - Go to https://web3forms.com
   - Click "Get Started" or "Create Access Key"
   - Enter your email address: `info@thevariables.com` (or whatever email you want to receive submissions)
   - You'll receive an access key immediately

2. **Configure Environment Variables**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Edit `.env` and add your Web3Forms access key:
     ```
     WEB3FORMS_ACCESS_KEY=your_actual_key_here
     ```

3. **Build the Website**
   ```bash
   npm run build
   ```
   This generates `config.js` with your environment variables

   **Troubleshooting:**
   - If you get "command not found: npm", see "Add Node to PATH" section above
   - If you get "Cannot find module", run `npm install` first (though this project has no dependencies)

3. **Optional: Create a Thank You Page**
   - The form is configured to redirect to `https://thevariables.com/thank-you` after submission
   - If you want this feature, create a thank-you page
   - Or remove/modify the redirect line in `index.html`:
     ```html
     <input type="hidden" name="redirect" value="https://thevariables.com/thank-you">
     ```

4. **Test the Form**
   - Fill out the contact form on your website
   - Submit it
   - Check your email for the submission
   - You should receive an email with all the form data

### Features Included:

- ✅ Spam protection (honeypot field)
- ✅ Email notifications to your inbox
- ✅ Success/error messages
- ✅ Form validation
- ✅ Custom subject line: "New Contact Form Submission from thevariables.com"
- ✅ Loading states and user feedback

### Troubleshooting:

**Form not sending?**
- Make sure you replaced `YOUR_ACCESS_KEY_HERE` with your actual key
- Check browser console for errors
- Verify your email address is correct in Web3Forms dashboard

**Not receiving emails?**
- Check spam folder
- Verify email address in Web3Forms dashboard
- Log into Web3Forms to see submission history

**Want to customize?**
- Web3Forms dashboard allows you to:
  - Change recipient email
  - Add CC/BCC recipients
  - Customize email templates
  - Add Google Sheets integration
  - Enable reCAPTCHA for extra protection

### Cost:
**FREE FOREVER** - No limits on submissions, no credit card required.

---

## Color Palette Reference

The website uses a modern, WCAG 2.1 AA compliant color palette. All colors are defined in `styles.css`:

```css
--color-navy: #0F172A          /* Primary dark */
--color-slate: #1E293B         /* Secondary dark */
--color-accent-primary: #2f6364 /* Primary accent */
--color-accent-secondary: #593b3f /* Secondary accent */
--color-gray: #7b8473          /* Text gray (7:1 contrast) */
```

To change colors, edit these variables in `styles.css`.

---

## File Structure

```
/
├── index.html              # Homepage
├── about.html              # About Us page
├── services.html           # Services page
├── work-little-red-coffee.html
├── work-john-howard.html
├── work-circular-materials.html
├── work-gocactus.html
├── styles.css              # Main stylesheet
├── work-case-study.css     # Case study specific styles
├── script.js               # JavaScript functionality
└── README.md               # General documentation
```

---

## Deployment

This is a static website - no server-side processing required (except for the contact form which uses Web3Forms).

Can be hosted on:
- Traditional web hosting (cPanel, shared hosting)
- GitHub Pages
- Netlify
- Vercel
- Any static hosting service

Just upload all files to your web server's public directory.

---

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

## Need Help?

Contact Les Lakewood at info@thevariables.com