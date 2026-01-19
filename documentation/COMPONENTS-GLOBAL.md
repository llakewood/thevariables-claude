# Global Component System
## Header & Footer Components with Mobile Navigation

**Date:** 2026-01-19
**Purpose:** Replace hardcoded navigation/footer with reusable JavaScript components
**Status:** Architecture Enhancement

---

## Overview

Instead of duplicating header/footer HTML across all pages, we'll create reusable components loaded via JavaScript. This approach:

✅ **Single source of truth** - Update navigation in one place
✅ **Mobile-friendly** - Hamburger menu with responsive breakpoints
✅ **Easy maintenance** - No need to edit 10+ HTML files for nav changes
✅ **Progressive enhancement** - Works with JavaScript, graceful fallback

---

## Architecture Decision

### Current Problem
Navigation is hardcoded in 10+ HTML files:
- `index.html`, `about.html`, `services.html`
- `work-*.html` (4 files)
- `404.html`, `thank-you.html`
- `archive/*.html` (3 new files)

**Issue:** Adding "Archive" link requires editing all files.

### Solution: JavaScript Components
Create reusable components that inject header/footer dynamically.

**File:** `js/components.js` (NEW)

---

## Component Architecture

### File Structure
```
/
├── js/
│   ├── components.js          ← NEW: Header/Footer components
│   ├── script.js              ← EXISTING: Page interactions
│   ├── archive.js             ← NEW: Archive page logic
│   └── config.js              ← GENERATED: Environment config
├── index.html                 ← UPDATED: Use components
├── about.html                 ← UPDATED: Use components
├── services.html              ← UPDATED: Use components
└── ...
```

### Loading Order
```html
<head>
    <!-- Fonts -->
    <link href="..." rel="stylesheet">
    <!-- Styles -->
    <link rel="stylesheet" href="css/styles.css">
    <!-- Load components FIRST -->
    <script src="js/components.js" defer></script>
    <!-- Then page scripts -->
    <script src="js/script.js" defer></script>
</head>
```

---

## 1. Header Component with Mobile Nav

### Component Specification

**File:** `js/components.js`

```javascript
/**
 * Global Header & Footer Components
 * Provides reusable navigation and footer across all pages
 */

class Header {
    constructor(options = {}) {
        this.currentPage = options.currentPage || '';
        this.basePath = options.basePath || '';
        this.logoLink = options.logoLink || 'index.html';
    }

    /**
     * Render header HTML
     */
    render() {
        return `
            <nav class="nav" id="main-nav">
                <div class="nav-container">
                    <a href="${this.basePath}${this.logoLink}" class="nav-logo">
                        <span class="logo-main">The Variables</span>
                        <span class="logo-suffix">Co.</span>
                    </a>

                    <!-- Mobile Menu Toggle -->
                    <button class="nav-toggle"
                            aria-label="Toggle navigation menu"
                            aria-expanded="false"
                            id="nav-toggle">
                        <span class="nav-toggle-icon"></span>
                    </button>

                    <!-- Navigation Links -->
                    <div class="nav-links" id="nav-links">
                        <a href="${this.basePath}about.html"
                           class="${this.currentPage === 'about' ? 'active' : ''}">
                            About
                        </a>
                        <a href="${this.basePath}services.html"
                           class="${this.currentPage === 'services' ? 'active' : ''}">
                            Services
                        </a>
                        <a href="${this.basePath}archive/index.html"
                           class="${this.currentPage === 'archive' ? 'active' : ''}">
                            Archive
                        </a>
                        <a href="${this.basePath}index.html#work"
                           class="${this.currentPage === 'work' ? 'active' : ''}">
                            Work
                        </a>
                        <a href="${this.basePath}index.html#contact"
                           class="nav-cta">
                            Start a Conversation
                        </a>
                    </div>
                </div>
            </nav>
        `;
    }

    /**
     * Initialize header and attach event listeners
     */
    init() {
        // Inject header into DOM
        const headerContainer = document.getElementById('header-container');
        if (!headerContainer) {
            console.warn('Header container not found');
            return;
        }

        headerContainer.innerHTML = this.render();

        // Setup mobile menu toggle
        this.setupMobileMenu();

        // Setup scroll behavior
        this.setupScrollBehavior();
    }

    /**
     * Setup mobile menu toggle functionality
     */
    setupMobileMenu() {
        const toggle = document.getElementById('nav-toggle');
        const navLinks = document.getElementById('nav-links');
        const nav = document.getElementById('main-nav');

        if (!toggle || !navLinks) return;

        toggle.addEventListener('click', () => {
            const isExpanded = toggle.getAttribute('aria-expanded') === 'true';

            // Toggle states
            toggle.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            nav.classList.toggle('menu-open');

            // Prevent body scroll when menu is open
            document.body.style.overflow = !isExpanded ? 'hidden' : '';
        });

        // Close menu when clicking nav link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                nav.classList.remove('menu-open');
                document.body.style.overflow = '';
            });
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                nav.classList.remove('menu-open');
                document.body.style.overflow = '';
                toggle.focus();
            }
        });
    }

    /**
     * Setup scroll behavior (shadow on scroll)
     */
    setupScrollBehavior() {
        const nav = document.getElementById('main-nav');
        if (!nav) return;

        let lastScroll = 0;

        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
            } else {
                nav.style.boxShadow = 'none';
            }

            lastScroll = currentScroll;
        });
    }
}

/**
 * Footer Component
 */
class Footer {
    constructor(options = {}) {
        this.basePath = options.basePath || '';
        this.year = new Date().getFullYear();
    }

    render() {
        return `
            <footer class="footer">
                <div class="footer-container">
                    <div class="footer-brand">
                        <div class="footer-logo">
                            <span class="logo-main">The Variables</span>
                            <span class="logo-suffix">Co.</span>
                        </div>
                        <p class="footer-tagline">
                            Award-winning business leadership combined with decades of technical excellence.
                        </p>
                    </div>

                    <div class="footer-links">
                        <div class="footer-section">
                            <h4>Company</h4>
                            <ul>
                                <li><a href="${this.basePath}about.html">About</a></li>
                                <li><a href="${this.basePath}services.html">Services</a></li>
                                <li><a href="${this.basePath}index.html#work">Work</a></li>
                                <li><a href="${this.basePath}archive/index.html">Archive</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h4>Archive</h4>
                            <ul>
                                <li><a href="${this.basePath}archive/index.html">Projects</a></li>
                                <li><a href="${this.basePath}archive/timeline.html">Timeline</a></li>
                                <li><a href="${this.basePath}archive/skills.html">Skills</a></li>
                            </ul>
                        </div>

                        <div class="footer-section">
                            <h4>Connect</h4>
                            <ul>
                                <li><a href="${this.basePath}index.html#contact">Contact</a></li>
                                <li><a href="https://www.linkedin.com/in/lakewood/" target="_blank" rel="noopener">LinkedIn</a></li>
                                <li><a href="https://github.com/llakewood" target="_blank" rel="noopener">GitHub</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <div class="footer-container">
                        <p class="footer-copyright">
                            &copy; ${this.year} The Variables Co. All rights reserved.
                        </p>
                        <p class="footer-location">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M8 0C5.243 0 3 2.243 3 5c0 4.5 5 11 5 11s5-6.5 5-11c0-2.757-2.243-5-5-5zm0 7.5c-1.381 0-2.5-1.119-2.5-2.5S6.619 2.5 8 2.5s2.5 1.119 2.5 2.5S9.381 7.5 8 7.5z" fill="currentColor"/>
                            </svg>
                            Fort Erie, Ontario
                        </p>
                    </div>
                </div>
            </footer>
        `;
    }

    init() {
        const footerContainer = document.getElementById('footer-container');
        if (!footerContainer) {
            console.warn('Footer container not found');
            return;
        }

        footerContainer.innerHTML = this.render();
    }
}

/**
 * Initialize components when DOM is ready
 */
function initComponents() {
    // Detect current page and base path from data attributes
    const bodyElement = document.body;
    const currentPage = bodyElement.dataset.page || '';
    const basePath = bodyElement.dataset.basePath || '';

    // Initialize header
    const header = new Header({
        currentPage,
        basePath,
        logoLink: basePath ? 'index.html' : 'index.html'
    });
    header.init();

    // Initialize footer
    const footer = new Footer({ basePath });
    footer.init();
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initComponents);
} else {
    initComponents();
}

// Export for manual initialization if needed
window.HeaderComponent = Header;
window.FooterComponent = Footer;
```

---

## 2. Mobile Navigation CSS

### CSS Specifications

**File:** `css/styles.css` (ADD TO EXISTING)

```css
/* ============================================
   MOBILE NAVIGATION
   ============================================ */

/* Mobile Menu Toggle Button */
.nav-toggle {
    display: none; /* Hidden by default, shown on mobile */
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    z-index: 1001;
    position: relative;
}

.nav-toggle-icon {
    display: block;
    width: 24px;
    height: 2px;
    background: var(--color-navy);
    position: relative;
    transition: var(--transition-fast);
}

.nav-toggle-icon::before,
.nav-toggle-icon::after {
    content: '';
    position: absolute;
    width: 24px;
    height: 2px;
    background: var(--color-navy);
    transition: var(--transition-fast);
}

.nav-toggle-icon::before {
    top: -8px;
}

.nav-toggle-icon::after {
    top: 8px;
}

/* Animated hamburger to X */
.nav-toggle[aria-expanded="true"] .nav-toggle-icon {
    background: transparent;
}

.nav-toggle[aria-expanded="true"] .nav-toggle-icon::before {
    top: 0;
    transform: rotate(45deg);
}

.nav-toggle[aria-expanded="true"] .nav-toggle-icon::after {
    top: 0;
    transform: rotate(-45deg);
}

/* Mobile Navigation Styles */
@media (max-width: 768px) {
    .nav-toggle {
        display: block;
    }

    .nav-links {
        position: fixed;
        top: 0;
        right: -100%;
        width: 280px;
        height: 100vh;
        background: var(--color-white);
        flex-direction: column;
        align-items: flex-start;
        gap: 0;
        padding: 6rem 2rem 2rem;
        box-shadow: -4px 0 20px rgba(0, 0, 0, 0.1);
        transition: right 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        z-index: 1000;
        overflow-y: auto;
    }

    .nav-links.active {
        right: 0;
    }

    .nav-links a {
        width: 100%;
        padding: 1rem 0;
        border-bottom: 1px solid var(--color-light-gray);
        font-size: 1.1rem;
    }

    .nav-links a:not(.nav-cta)::after {
        display: none; /* Remove underline animation on mobile */
    }

    .nav-cta {
        margin-top: 1rem;
        width: 100%;
        text-align: center;
        border-bottom: none;
    }

    /* Overlay when menu is open */
    .nav.menu-open::before {
        content: '';
        position: fixed;
        inset: 0;
        background: rgba(15, 23, 42, 0.7);
        backdrop-filter: blur(2px);
        z-index: 999;
    }
}

/* Tablet breakpoint adjustments */
@media (min-width: 769px) and (max-width: 1024px) {
    .nav-links {
        gap: 1.5rem;
    }

    .nav-links a {
        font-size: 0.9rem;
    }
}
```

---

## 3. Footer CSS

**File:** `css/styles.css` (ADD TO EXISTING)

```css
/* ============================================
   FOOTER
   ============================================ */

.footer {
    background: var(--color-slate);
    color: var(--color-white);
    padding: 4rem 0 0;
    margin-top: 8rem;
}

.footer-container {
    max-width: var(--container-width);
    margin: 0 auto;
    padding: 0 var(--container-padding);
}

.footer-container:first-child {
    display: grid;
    grid-template-columns: 1.5fr 2fr;
    gap: 4rem;
    padding-bottom: 3rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-brand {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.footer-logo {
    font-family: var(--font-display);
    font-size: 1.5rem;
    font-weight: 700;
}

.footer-logo .logo-main {
    color: var(--color-white);
}

.footer-logo .logo-suffix {
    color: var(--color-accent-secondary);
    font-style: italic;
}

.footer-tagline {
    color: rgba(255, 255, 255, 0.7);
    line-height: 1.6;
    max-width: 400px;
}

.footer-links {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 2rem;
}

.footer-section h4 {
    font-family: var(--font-body);
    font-size: 0.875rem;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--color-accent-secondary);
    margin-bottom: 1rem;
    font-weight: 600;
}

.footer-section ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.footer-section a {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    transition: var(--transition-fast);
    font-size: 0.95rem;
}

.footer-section a:hover {
    color: var(--color-white);
    padding-left: 0.5rem;
}

.footer-bottom {
    background: var(--color-navy);
}

.footer-bottom .footer-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 1.5rem;
    padding-bottom: 1.5rem;
}

.footer-copyright {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
}

.footer-location {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
}

/* Footer Responsive */
@media (max-width: 768px) {
    .footer {
        margin-top: 4rem;
        padding-top: 3rem;
    }

    .footer-container:first-child {
        grid-template-columns: 1fr;
        gap: 3rem;
    }

    .footer-links {
        grid-template-columns: 1fr;
        gap: 2rem;
    }

    .footer-bottom .footer-container {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
}
```

---

## 4. HTML Page Template

### Updated Page Structure

**All pages follow this pattern:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Title - The Variables Co.</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="css/styles.css">

    <!-- Components (loads header/footer) -->
    <script src="js/components.js" defer></script>
    <script src="js/script.js" defer></script>
</head>
<body data-page="about" data-base-path="">

    <!-- Header Container (injected by components.js) -->
    <div id="header-container"></div>

    <!-- Page Content -->
    <main>
        <section class="hero">
            <!-- Page-specific content -->
        </section>
    </main>

    <!-- Footer Container (injected by components.js) -->
    <div id="footer-container"></div>

</body>
</html>
```

### Archive Pages Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Archive - The Variables Co.</title>

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">

    <!-- Styles -->
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/archive.css">

    <!-- Components (loads header/footer) -->
    <script src="../js/components.js" defer></script>
    <script src="../js/archive.js" defer></script>
</head>
<body data-page="archive" data-base-path="../">

    <!-- Header Container (injected by components.js) -->
    <div id="header-container"></div>

    <!-- Page Content -->
    <main>
        <section class="archive-hero">
            <!-- Archive-specific content -->
        </section>
    </main>

    <!-- Footer Container (injected by components.js) -->
    <div id="footer-container"></div>

</body>
</html>
```

**Key Points:**
- `data-page` attribute: Sets active nav state
- `data-base-path` attribute: For relative paths in archive (`../`)
- `#header-container` and `#footer-container`: Injection points

---

## 5. Migration Strategy

### Phase 1: Create Components
- [ ] Create `js/components.js` with Header and Footer classes
- [ ] Add mobile navigation CSS to `css/styles.css`
- [ ] Add footer CSS to `css/styles.css`
- [ ] Test component rendering in isolation

### Phase 2: Update Homepage First
- [ ] Update `index.html` to use component system
- [ ] Test mobile menu functionality
- [ ] Test desktop navigation
- [ ] Verify footer renders correctly

### Phase 3: Migrate Remaining Pages
- [ ] Update `about.html`
- [ ] Update `services.html`
- [ ] Update `work-*.html` (4 files)
- [ ] Update `404.html`
- [ ] Update `thank-you.html`

### Phase 4: Create Archive Pages
- [ ] Create `archive/index.html` with components
- [ ] Create `archive/timeline.html` with components
- [ ] Create `archive/skills.html` with components
- [ ] Test archive navigation with `data-base-path="../"`

### Phase 5: Verification
- [ ] Test all pages on mobile (320px - 768px)
- [ ] Test all pages on tablet (768px - 1024px)
- [ ] Test all pages on desktop (1024px+)
- [ ] Test hamburger menu open/close
- [ ] Test keyboard navigation (Tab, Escape)
- [ ] Test screen reader compatibility
- [ ] Verify active page highlighting
- [ ] Test all footer links

---

## 6. Benefits

### Before (Current)
❌ Navigation duplicated in 10+ files
❌ Adding "Archive" link = edit 10+ files
❌ No mobile menu
❌ Inconsistent footer across pages
❌ High maintenance overhead

### After (With Components)
✅ Single source of truth for nav/footer
✅ Adding links = edit 1 file (`components.js`)
✅ Mobile-friendly hamburger menu
✅ Consistent header/footer everywhere
✅ Minimal maintenance overhead
✅ Progressive enhancement (works without JS in fallback state)

---

## 7. Accessibility Features

**Keyboard Navigation:**
- Tab through nav links
- Enter to activate links
- Escape to close mobile menu

**ARIA Labels:**
- `aria-label` on toggle button
- `aria-expanded` state tracking
- `aria-modal` for overlay behavior

**Screen Readers:**
- Semantic HTML (`<nav>`, `<footer>`)
- Clear link text
- Focus management

**Touch Targets:**
- 44×44px minimum (mobile)
- Adequate spacing between links

---

## 8. Progressive Enhancement

**JavaScript Enabled (Default):**
- Header/footer injected dynamically
- Mobile menu works
- Active page highlighting
- Smooth interactions

**JavaScript Disabled (Fallback):**
- Empty containers (`#header-container`, `#footer-container`)
- **Solution:** Add minimal inline header/footer in `<noscript>` tags
- Or: Server-side rendering (future enhancement)

**Fallback Example:**
```html
<noscript>
    <nav class="nav">
        <div class="nav-container">
            <!-- Static navigation for no-JS users -->
        </div>
    </nav>
</noscript>
<div id="header-container"></div>
```

---

## 9. Testing Checklist

### Functional Tests
- [ ] Header renders on all pages
- [ ] Footer renders on all pages
- [ ] Mobile menu opens/closes
- [ ] Mobile menu overlay works
- [ ] Body scroll locks when menu open
- [ ] Active page highlighted correctly
- [ ] All links work (root and archive pages)

### Responsive Tests
- [ ] Mobile (320px): Menu stacks, toggle visible
- [ ] Mobile (480px): Layout adapts
- [ ] Tablet (768px): Desktop nav appears
- [ ] Desktop (1024px): Full layout
- [ ] Large (1440px+): Max-width container

### Accessibility Tests
- [ ] Keyboard navigation works
- [ ] Escape closes mobile menu
- [ ] Focus returns to toggle after close
- [ ] Screen reader announces menu state
- [ ] Color contrast meets WCAG AA

---

## 10. Performance Considerations

**File Size:**
- `components.js`: ~10KB (unminified)
- Mobile CSS: ~2KB additional

**Load Impact:**
- Deferred script loading (non-blocking)
- CSS in existing `styles.css` (no extra request)
- Components render before DOMContentLoaded

**Optimization:**
- Minify for production
- Combine with existing scripts if needed
- Cache-friendly (components change rarely)

---

## Success Criteria

✅ **Maintainability:**
- Update navigation in 1 place
- Add new pages without editing existing files

✅ **Mobile-Friendly:**
- Hamburger menu on mobile
- Touch-friendly targets
- Responsive layouts

✅ **Accessible:**
- WCAG 2.1 AA compliant
- Keyboard navigable
- Screen reader compatible

✅ **Performance:**
- No visual delay on component render
- Smooth animations
- Fast page loads

---

*This component system replaces hardcoded navigation and adds professional mobile support while maintaining the existing visual design.*
