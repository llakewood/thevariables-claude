# Security Considerations

## Web3Forms Access Keys

### Important: These Keys Are PUBLIC by Design

Unlike traditional API keys, Web3Forms access keys are **meant to be exposed** in client-side code. Here's why this is secure:

1. **Domain Whitelisting**: You configure allowed domains in your Web3Forms dashboard. Submissions from other domains are rejected.

2. **No Sensitive Data Access**: The access key only allows form submissions - it cannot read your data, access your account, or modify settings.

3. **Rate Limiting**: Web3Forms implements rate limiting to prevent abuse.

4. **Spam Protection**: Built-in honeypot fields and optional reCAPTCHA.

### Why Use .env Then?

Even though Web3Forms keys are public, using `.env` is still best practice for:

- **Repository Management**: Don't commit API keys to version control
- **Environment Switching**: Easy dev/staging/production configs
- **Template Usage**: This website can be a template for other projects
- **Professional Standards**: Follows industry best practices

## Build Process

1. **Development**:
   ```bash
   npm run build
   ```
   This generates `config.js` from your `.env` file

2. **Deployment**:
   - Deploy ALL files including `config.js`
   - The access key will be visible in the browser (this is OK!)
   - Configure domain whitelist in Web3Forms dashboard

## What to Keep Private

❌ **Never commit to Git:**
- `.env` (your actual environment file)
- Any server-side API keys (if you add them later)
- Database credentials
- Email passwords

✅ **Safe to commit:**
- `.env.example` (template without real values)
- `config.js` (generated, but can be committed if you want)
- All other website files

## Alternative: Server-Side Processing

If you want to keep the access key truly private, you would need:

1. A PHP/Node.js backend endpoint
2. Server-side form processing
3. Server-side API calls to Web3Forms

**Trade-off**: More complexity, requires server-side hosting, more maintenance.

For a simple contact form, the current client-side approach is recommended by Web3Forms and is secure when properly configured.

## Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Add your Web3Forms access key to `.env`
- [ ] Run `npm run build` to generate `config.js`
- [ ] Add `.env` to `.gitignore` (already done)
- [ ] Configure domain whitelist in Web3Forms dashboard
- [ ] Test form submissions
- [ ] Deploy all files to your web server