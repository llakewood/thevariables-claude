/**
 * Global Header & Footer Components
 * The Variables Co. - Reusable navigation and footer
 *
 * Provides single source of truth for header/footer across all pages
 * Includes mobile-friendly hamburger menu
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
            console.warn('Header container not found. Add <div id="header-container"></div> to your HTML.');
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

        // Toggle menu on button click
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

        // Close menu when clicking overlay
        nav.addEventListener('click', (e) => {
            if (e.target === nav && nav.classList.contains('menu-open')) {
                toggle.setAttribute('aria-expanded', 'false');
                navLinks.classList.remove('active');
                nav.classList.remove('menu-open');
                document.body.style.overflow = '';
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
                    <div class="footer-content">
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
            console.warn('Footer container not found. Add <div id="footer-container"></div> to your HTML.');
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
        logoLink: 'index.html'
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
