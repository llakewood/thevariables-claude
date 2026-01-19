# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a static website for The Variables Co., a digital consultancy. It's a pure frontend project with no backend—contact form submissions are handled via Web3Forms API.

**Key characteristics:**
- Static HTML/CSS/JavaScript site (no framework)
- Uses Web3Forms for contact form (client-side API integration)
- Build script injects environment variables into `js/config.js`
- Editorial-inspired design with scroll animations and parallax effects

## Build & Development Commands

### Essential Commands
```bash
# Build the site (generates js/config.js from .env)
npm run build

# Build archive pages (injects project data into archive/*.html)
npm run build:archive

# Build everything (site + archive)
npm run build:all

# Build and serve locally on port 8080
npm run dev

# Serve without rebuilding
npm run serve
```

### First-Time Setup
1. Copy `.env.example` to `.env`
2. Add Web3Forms access key to `.env`
3. Run `npm run build`

## Architecture

### Build System

**Main Site Build:**
- **build.js**: Node script that reads `.env` and processes `config.template.js`
- **config.template.js**: Template with `{{PLACEHOLDER}}` syntax for environment variables
- **js/config.js**: Generated file (gitignored) that exposes `window.siteConfig` globally

The build script replaces placeholders like `{{WEB3FORMS_ACCESS_KEY}}` with actual values from `.env`.

**Archive Build:**

- **build-archive.js**: Validates JSON data and generates archive-data.json
- **data/portfolio-projects.json**: Project data source
- **data/skills-extracted.json**: Skills data source
- **data/archive-data.json**: Generated file (gitignored) loaded by archive pages via fetch()

### Form Handling Flow
1. `build.js` generates `js/config.js` with Web3Forms access key
2. `index.html` loads `js/config.js` before `js/script.js`
3. `js/script.js` reads `window.siteConfig.web3formsAccessKey` and injects it into the form's hidden input field
4. Form submits directly to `https://api.web3forms.com/submit`
5. On success, redirects to `thank-you.html`

**Important:** Web3Forms access keys are safe to expose client-side (domain-whitelisted).

### Page Structure

**Main Site:**

- **index.html**: Homepage with hero, services preview, approach/stats, portfolio, archive CTA, and contact form
- **about.html**: Company mission, values, leadership
- **services.html**: Detailed service pages with anchor links (#strategy, #development, #support)
- **work-*.html**: Four case study pages for real projects
- **404.html**, **thank-you.html**: Utility pages

**Career Archive:**

- **archive/index.html**: Project grid with filters (search, technology, year)
- **archive/timeline.html**: Chronological timeline visualization
- **archive/skills.html**: Skills showcase grouped by category

### JavaScript Architecture

**Main Site (`js/script.js`):**

- IntersectionObserver for scroll-triggered animations
- Form submission handling with loading states
- Parallax effects on hero section
- Counter animations for statistics
- Smooth scroll for anchor links
- Hover effects on work items and contact methods

**Archive Pages (`js/archive.js`):**

- Loads data/archive-data.json via fetch()
- Project filtering (search, technology, year)
- Modal for project details
- Timeline and skills visualization
- Reusable header/footer via js/components.js

### CSS Organization

- **css/styles.css**: Main stylesheet with CSS custom properties for colors
- **css/work-case-study.css**: Case study specific styles
- **css/archive.css**: Archive pages styles (grid, filters, modal, timeline, skills)
- **css/icons.css**: Icon system documentation

Color palette uses CSS custom properties:
```css
--color-navy: #0F172A
--color-slate: #1E293B
--color-accent-primary: #2f6364
--color-accent-secondary: #593b3f
--color-gray: #7b8473
```

## Configuration Files

### Environment Variables (.env)
```
WEB3FORMS_ACCESS_KEY=your_key_here
FORM_REDIRECT_URL=thank-you.html
CONTACT_EMAIL=info@thevariables.com
SITE_URL=https://thevariables.com
```

### What Gets Committed vs Ignored

**Gitignored (generated files):**

- `.env` - Environment variables (never commit)
- `js/config.js` - Generated from config.template.js
- `data/archive-data.json` - Generated from portfolio-projects.json + skills-extracted.json

**Committed (source files):**

- `.env.example` - Template
- `config.template.js` - Source template
- `data/portfolio-projects.json` - Project data source
- `data/skills-extracted.json` - Skills data source

## Deployment

This is a static site—just upload HTML, CSS, and JS files to any web host.

**Files to deploy:**
- All `.html` files
- `css/` directory
- `js/` directory (including the generated `config.js`)

**DO NOT deploy:**
- `.env` file
- `build.js`, `config.template.js`, `package.json`
- `node_modules/`

**Pre-deployment:**

1. Run `npm run build:all` to generate `js/config.js` and `data/archive-data.json`
2. Test form submission locally
3. Configure domain whitelist in Web3Forms dashboard

**Important:** Archive pages require a web server to function (cannot use `file://` protocol due to fetch() CORS restrictions). Always use `npm run serve` or similar when testing locally.

See `documentation/DEPLOYMENT.md` for complete deployment guide.

## Common Development Patterns

### Adding New Pages
1. Create HTML file in root directory
2. Copy navigation structure from existing page
3. Link to `css/styles.css` and `js/script.js`
4. For case studies, also link to `css/work-case-study.css`

### Modifying Form Behavior
Form logic is in `js/script.js` lines 81-160. The form:
- Uses `window.siteConfig` for access key injection
- Posts to Web3Forms API
- Shows loading states during submission
- Redirects to thank-you page on success
- Displays inline error messages on failure

### Adding Animations
The site uses IntersectionObserver pattern (lines 34-78 in `js/script.js`):
1. Set initial state (opacity: 0, transform)
2. Add transition CSS
3. Register with observer
4. Observer adds final state when element enters viewport

### Modifying Colors
Edit CSS custom properties in `css/styles.css` `:root` block. All colors reference these variables.

## Important Notes

### Security Considerations
- Web3Forms access keys are **intentionally public** (domain-restricted, read-only)
- Never commit `.env` file
- Form submissions go directly to Web3Forms API (no backend)
- See `documentation/SECURITY.md` for details

### Build Script Behavior
- Fails if `.env` doesn't exist
- Warns if `WEB3FORMS_ACCESS_KEY` is not set or still has placeholder value
- Creates `js/` directory if it doesn't exist
- Automatically adds `<script src="js/config.js"></script>` to index.html if missing

### Case Study Content
All four case studies (Little Red Coffee, John Howard Society, Circular Materials, GOCACTUS) use real project details from The Variables Co. portfolio. When editing, maintain factual accuracy.
