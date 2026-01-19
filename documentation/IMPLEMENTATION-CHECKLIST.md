# Implementation Checklist
## Career Archive Integration for The Variables Co.

**Created:** 2026-01-19
**Reference Docs:**
- [ARCHITECTURE-PLAN.md](ARCHITECTURE-PLAN.md) - Complete technical plan
- [COMPONENT-SPEC.md](COMPONENT-SPEC.md) - Detailed component specifications

---

## Pre-Implementation Review

### ✅ Planning Complete
- [x] Codebase review complete
- [x] Build system evaluation complete
- [x] Data integration strategy defined
- [x] Brand styleguide documented
- [x] Component library designed
- [x] Career view pages specified
- [x] Architecture plan finalized

### 📋 Ready for Implementation
- [ ] Architecture plan reviewed by stakeholders
- [ ] Open questions answered (see ARCHITECTURE-PLAN.md Section 10)
- [ ] Git branch created for archive work
- [ ] Backup of current site created

---

## Phase 1: Foundation (Week 1)

### Directory Structure Setup

#### Task 1.1: Create Data Directory
```bash
mkdir -p data
```

- [ ] Create `/data/` directory
- [ ] Move `documentation/portfolio-projects.json` → `data/portfolio-projects.json`
- [ ] Move `documentation/project-summary.json` → `data/project-summary.json`
- [ ] Move `documentation/skills-extracted.json` → `data/skills-extracted.json`
- [ ] Create `data/README.md` documenting data structure
- [ ] Update `.gitignore` to ensure data files are tracked

**Verification:**
```bash
ls -la data/
# Should show: portfolio-projects.json, project-summary.json, skills-extracted.json, README.md
```

#### Task 1.2: Create Archive Directory
```bash
mkdir -p archive
```

- [ ] Create `/archive/` directory
- [ ] Create placeholder `archive/index.html` (empty with TODO comment)
- [ ] Create placeholder `archive/timeline.html`
- [ ] Create placeholder `archive/skills.html`

#### Task 1.3: Create Asset Directories
```bash
touch css/archive.css
touch js/archive.js
```

- [ ] Create `css/archive.css` with header comment + TODOs
- [ ] Create `js/archive.js` with header comment + TODOs

### Navigation Updates

#### Task 1.4: Add Archive Link to Navigation

**Files to Update:**
- `index.html`
- `about.html`
- `services.html`
- `work-little-red-coffee.html`
- `work-john-howard.html`
- `work-circular-materials.html`
- `work-gocactus.html`
- `thank-you.html`
- `404.html`

**Change Pattern:**
```html
<!-- BEFORE -->
<div class="nav-links">
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="#approach">Approach</a>
    <a href="#work">Work</a>
    <a href="#contact" class="nav-cta">Start a Conversation</a>
</div>

<!-- AFTER -->
<div class="nav-links">
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="archive/index.html">Archive</a>
    <a href="#work">Work</a>
    <a href="#contact" class="nav-cta">Start a Conversation</a>
</div>
```

**Checklist:**
- [ ] Update `index.html` navigation
- [ ] Update `about.html` navigation
- [ ] Update `services.html` navigation
- [ ] Update `work-little-red-coffee.html` navigation
- [ ] Update `work-john-howard.html` navigation
- [ ] Update `work-circular-materials.html` navigation
- [ ] Update `work-gocactus.html` navigation
- [ ] Update `thank-you.html` navigation
- [ ] Update `404.html` navigation

**Note:** Archive pages will have different navigation with relative paths (`../index.html`)

### Build Script Enhancement

#### Task 1.5: Create Archive Build Script

**File:** `build-archive.js` (NEW)

```javascript
#!/usr/bin/env node
/**
 * Archive build validation script
 * Validates JSON structure and generates metadata
 */

const fs = require('fs');
const path = require('path');

function validateArchiveData() {
    console.log('🔍 Validating archive data...\n');

    // Check portfolio-projects.json
    const projectsPath = path.join(__dirname, 'data/portfolio-projects.json');
    if (!fs.existsSync(projectsPath)) {
        console.error('❌ Missing: data/portfolio-projects.json');
        process.exit(1);
    }

    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    console.log(`✅ Found ${projects.length} projects`);

    // Validate structure
    projects.forEach(p => {
        if (!p.id || !p.title || !p.timeline) {
            console.error(`❌ Invalid project structure: ${p.title || 'Unknown'}`);
            process.exit(1);
        }
    });

    console.log('✅ All projects valid\n');
}

validateArchiveData();
```

- [ ] Create `build-archive.js`
- [ ] Make executable: `chmod +x build-archive.js`
- [ ] Update `package.json` with new script:
  ```json
  "scripts": {
    "build": "node build.js",
    "build:archive": "node build-archive.js",
    "build:all": "node build.js && node build-archive.js",
    "dev": "npm run build:all && npx http-server -p 8080 -o"
  }
  ```
- [ ] Test: `npm run build:archive`

### Phase 1 Verification

- [ ] Run `npm run build:all` successfully
- [ ] All navigation links work (no 404s)
- [ ] No visual changes to existing pages
- [ ] Git commit: "Phase 1: Foundation - directory structure and navigation"

---

## Phase 2: Archive Landing Page (Week 2)

### Task 2.1: Create Archive Landing HTML

**File:** `archive/index.html`

**Template:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Project Archive - The Variables Co.</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=Outfit:wght@300;400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/styles.css">
    <link rel="stylesheet" href="../css/archive.css">
</head>
<body>
    <!-- Navigation (with relative paths) -->
    <nav class="nav">
        <div class="nav-container">
            <a href="../index.html" class="nav-logo">
                <span class="logo-main">The Variables</span>
                <span class="logo-suffix">Co.</span>
            </a>
            <div class="nav-links">
                <a href="../about.html">About</a>
                <a href="../services.html">Services</a>
                <a href="index.html" class="active">Archive</a>
                <a href="../index.html#work">Work</a>
                <a href="../index.html#contact" class="nav-cta">Start a Conversation</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="archive-hero">
        <div class="archive-hero-container">
            <a href="../index.html#work" class="back-link">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
                Back to Featured Work
            </a>

            <div class="section-header">
                <span class="section-number">00</span>
                <h1 class="section-title">Project Archive</h1>
            </div>

            <p class="archive-intro">
                20 years of building digital products across web development,
                WordPress, and modern JavaScript frameworks.
            </p>

            <div class="archive-stats">
                <div class="stat-item">
                    <span class="stat-value" id="project-count">7</span>
                    <span class="stat-label">Projects</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">18</span>
                    <span class="stat-label">Technologies</span>
                </div>
                <div class="stat-item">
                    <span class="stat-value">2009–2026</span>
                    <span class="stat-label">Years Active</span>
                </div>
            </div>
        </div>
    </section>

    <!-- Filters Section -->
    <section class="archive-content">
        <div class="archive-container">
            <!-- Filters component (from COMPONENT-SPEC.md) -->
            <div class="archive-filters">
                <!-- TODO: Implement filter controls -->
            </div>

            <!-- View toggles -->
            <div class="archive-views">
                <a href="timeline.html" class="view-link">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <!-- Timeline icon -->
                    </svg>
                    Timeline View
                </a>
                <a href="skills.html" class="view-link">
                    <svg width="20" height="20" viewBox="0 0 20 20">
                        <!-- Skills icon -->
                    </svg>
                    Skills View
                </a>
            </div>

            <!-- Projects Grid -->
            <div class="archive-projects-grid" id="projects-grid">
                <!-- Populated by JavaScript -->
            </div>
        </div>
    </section>

    <!-- Inline data -->
    <script>
        // Load project data inline for fast initial render
        window.archiveData = {
            projects: [], // Will be populated from data/portfolio-projects.json
            featured: [],
            archive: []
        };
    </script>

    <!-- Archive JavaScript -->
    <script src="../js/archive.js"></script>
    <script src="../js/script.js"></script>
</body>
</html>
```

**Checklist:**
- [ ] Create `archive/index.html` with structure above
- [ ] Add breadcrumb/back navigation
- [ ] Add hero section with stats
- [ ] Add view toggle links (timeline, skills)
- [ ] Add empty projects-grid container

### Task 2.2: Implement Archive CSS

**File:** `css/archive.css`

- [ ] Copy component styles from `COMPONENT-SPEC.md`
- [ ] Implement `.archive-hero` styles
- [ ] Implement `.archive-projects-grid` layout
- [ ] Implement `.archive-project-card` component
- [ ] Implement `.archive-filters` component
- [ ] Implement `.archive-project-detail` modal
- [ ] Add responsive breakpoints
- [ ] Add animations with IntersectionObserver

**Verification:**
- [ ] Archive page loads without errors
- [ ] Styles match existing brand (colors, fonts, spacing)
- [ ] Page is responsive on mobile/tablet/desktop

### Task 2.3: Implement Archive JavaScript

**File:** `js/archive.js`

**Core Functions:**
```javascript
// 1. Load and parse project data
async function loadProjects() { }

// 2. Render project cards
function renderProjects(projects) { }

// 3. Create single project card
function createProjectCard(project) { }

// 4. Filter projects by criteria
function filterProjects(criteria) { }

// 5. Toggle project detail panel
function toggleProjectDetail(projectId) { }

// 6. Initialize page
function init() { }
```

**Checklist:**
- [ ] Implement data loading (inline JSON)
- [ ] Implement `createProjectCard()` from COMPONENT-SPEC.md
- [ ] Implement grid rendering
- [ ] Implement filter controls
- [ ] Implement detail panel expansion
- [ ] Add IntersectionObserver for scroll animations
- [ ] Add keyboard navigation support
- [ ] Add search functionality

### Task 2.4: Populate Inline Data

**In `archive/index.html`:**
- [ ] Read `data/portfolio-projects.json`
- [ ] Inline the JSON in `<script>window.archiveData = {...}</script>`
- [ ] Separate featured vs. archive projects

**Script to generate inline data block:**
```javascript
// build-archive.js enhancement
function generateInlineData() {
    const projects = JSON.parse(fs.readFileSync('data/portfolio-projects.json', 'utf8'));
    const featured = projects.filter(p => p.status === 'portfolio');
    const archive = projects.filter(p => p.status === 'archive');

    return `
    <script>
        window.archiveData = {
            projects: ${JSON.stringify(projects, null, 2)},
            featured: ${JSON.stringify(featured, null, 2)},
            archive: ${JSON.stringify(archive, null, 2)}
        };
    </script>
    `;
}
```

### Phase 2 Verification

- [ ] Archive page displays all 7 projects
- [ ] Project cards render correctly
- [ ] Filter controls work (tech, year)
- [ ] Search works
- [ ] Detail panels expand/collapse
- [ ] Animations trigger on scroll
- [ ] Responsive on all devices
- [ ] Accessible (keyboard nav, ARIA labels)
- [ ] Git commit: "Phase 2: Archive landing page complete"

---

## Phase 3: Timeline View (Week 3)

### Task 3.1: Create Timeline HTML

**File:** `archive/timeline.html`

- [ ] Copy structure from `archive/index.html`
- [ ] Update title: "Career Timeline"
- [ ] Replace content section with timeline container
- [ ] Add navigation to Archive/Skills views

### Task 3.2: Implement Timeline CSS

**In `css/archive.css`:**
- [ ] Add `.career-timeline` styles from COMPONENT-SPEC.md
- [ ] Implement vertical line with CSS `::before`
- [ ] Implement `.timeline-era` groupings
- [ ] Implement `.timeline-year` markers
- [ ] Implement `.timeline-event` cards
- [ ] Add alternating left/right layout
- [ ] Make responsive (single column on mobile)

### Task 3.3: Implement Timeline JavaScript

**In `js/archive.js`:**
- [ ] Add `renderTimeline()` function
- [ ] Group projects by year
- [ ] Create era labels (WordPress, Modern JS, Current)
- [ ] Plot events on timeline
- [ ] Add IntersectionObserver for reveal animations
- [ ] Link to project detail panels

### Phase 3 Verification

- [ ] Timeline displays all projects chronologically
- [ ] Era labels show technology transitions
- [ ] Events alternate left/right
- [ ] Clicking event opens detail panel
- [ ] Responsive on mobile (single column)
- [ ] Git commit: "Phase 3: Timeline view complete"

---

## Phase 4: Skills View (Week 3-4)

### Task 4.1: Create Skills HTML

**File:** `archive/skills.html`

- [ ] Copy structure from `archive/index.html`
- [ ] Update title: "Skills & Technologies"
- [ ] Replace content section with skills container
- [ ] Add navigation to Archive/Timeline views

### Task 4.2: Implement Skills CSS

**In `css/archive.css`:**
- [ ] Add `.skills-container` styles from COMPONENT-SPEC.md
- [ ] Implement `.skills-category` sections
- [ ] Implement `.skills-grid` layout
- [ ] Implement `.skill-card` component
- [ ] Add proficiency bars with CSS animations
- [ ] Make responsive (adjust grid columns)

### Task 4.3: Implement Skills JavaScript

**In `js/archive.js`:**
- [ ] Load `data/skills-extracted.json`
- [ ] Add `renderSkills()` function
- [ ] Group skills by category
- [ ] Create skill cards with proficiency indicators
- [ ] Link skills to projects
- [ ] Add IntersectionObserver for animations

### Phase 4 Verification

- [ ] Skills page displays all 18 skills
- [ ] Grouped by 4 categories (CMS, Languages, Platforms, Practices)
- [ ] Proficiency bars animate on scroll
- [ ] Clicking skill shows related projects
- [ ] Responsive on all devices
- [ ] Git commit: "Phase 4: Skills view complete"

---

## Phase 5: Integration & Polish (Week 4)

### Task 5.1: Homepage Integration

**File:** `index.html`

**Add "View Full Archive" CTA after work grid:**
```html
<!-- After work-grid -->
<div class="archive-cta">
    <a href="archive/index.html" class="btn-archive">
        View Full Project Archive
        <svg width="20" height="20" viewBox="0 0 20 20">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
    </a>
    <p class="archive-cta-description">
        Explore 20 years of projects spanning WordPress, modern JavaScript, and full-stack development
    </p>
</div>
```

**CSS for CTA:**
```css
.archive-cta {
    text-align: center;
    margin-top: 4rem;
    padding: 3rem 2rem;
    background: var(--color-cream);
    border-radius: 16px;
}

.btn-archive {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--color-accent-primary);
    color: var(--color-white);
    padding: 1rem 2rem;
    border-radius: 12px;
    text-decoration: none;
    font-weight: 600;
    font-size: 1.1rem;
    transition: var(--transition-fast);
}

.btn-archive:hover {
    background: var(--color-accent-secondary);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(47, 99, 100, 0.3);
}

.archive-cta-description {
    margin-top: 1rem;
    color: var(--color-gray);
    font-size: 0.95rem;
}
```

**Checklist:**
- [ ] Add archive CTA to homepage
- [ ] Style matches existing design
- [ ] Links to `/archive/index.html`
- [ ] Test on mobile/tablet/desktop

### Task 5.2: Accessibility Audit

**Tools:**
- [ ] Use Lighthouse (Chrome DevTools)
- [ ] Use axe DevTools extension
- [ ] Manual keyboard navigation test
- [ ] Screen reader test (VoiceOver/NVDA)

**Checklist:**
- [ ] All interactive elements have focus states
- [ ] Tab order is logical
- [ ] ARIA labels on buttons/links
- [ ] Modal dialogs trap focus
- [ ] Filter changes announced
- [ ] Images have alt text
- [ ] Color contrast meets WCAG AA (4.5:1)
- [ ] Lighthouse score: 90+ accessibility

### Task 5.3: Responsive Design Testing

**Devices:**
- [ ] iPhone SE (375px)
- [ ] iPhone 12 Pro (390px)
- [ ] iPad (768px)
- [ ] iPad Pro (1024px)
- [ ] Desktop (1440px)
- [ ] Large Desktop (1920px)

**Test Cases:**
- [ ] Navigation collapses appropriately
- [ ] Cards stack on mobile
- [ ] Timeline switches to single column
- [ ] Filters remain usable
- [ ] Text remains readable
- [ ] Touch targets are 44×44px minimum

### Task 5.4: Cross-Browser Testing

**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Test Cases:**
- [ ] CSS Grid layouts work
- [ ] CSS custom properties work
- [ ] IntersectionObserver works
- [ ] Smooth scroll works
- [ ] Animations work

### Task 5.5: Performance Testing

**Metrics:**
- [ ] First Contentful Paint < 1.8s
- [ ] Time to Interactive < 3.8s
- [ ] Total page size < 1MB
- [ ] Lighthouse Performance score: 90+

**Optimizations:**
- [ ] Minify CSS/JS (production)
- [ ] Optimize images (if any added)
- [ ] Lazy-load detail panels
- [ ] Debounce search input

### Task 5.6: Documentation Updates

**Files to Update:**
- [ ] `README.md` - Add archive section
- [ ] `CLAUDE.md` - Add archive documentation
- [ ] `documentation/DEPLOYMENT.md` - Include archive pages

### Phase 5 Verification

- [ ] All navigation flows work seamlessly
- [ ] No broken links (404s)
- [ ] Accessible (WCAG AA)
- [ ] Responsive on all devices
- [ ] Cross-browser compatible
- [ ] Performance meets targets
- [ ] Documentation complete
- [ ] Git commit: "Phase 5: Integration and polish complete"

---

## Final Verification Checklist

### Hard Constraints ✅
- [ ] Zero changes to `work-*.html` case study files
- [ ] Zero changes to `css/work-case-study.css`
- [ ] Featured Work section on homepage unchanged
- [ ] No new frameworks introduced
- [ ] Build system extended, not replaced

### Functional Requirements ✅
- [ ] Archive landing page works
- [ ] Timeline view works
- [ ] Skills view works
- [ ] All filters work
- [ ] Search works
- [ ] Navigation flows work

### Technical Requirements ✅
- [ ] CSS follows existing design system
- [ ] Components use CSS custom properties
- [ ] JavaScript is vanilla (no frameworks)
- [ ] Data-driven rendering works
- [ ] Build script validates data

### Quality Requirements ✅
- [ ] Zero visual drift from brand
- [ ] WCAG 2.1 AA compliant
- [ ] Load time < 3s on 3G
- [ ] No console errors
- [ ] Git history is clean

---

## Deployment Checklist

### Pre-Deployment
- [ ] Run `npm run build:all`
- [ ] Test all pages locally
- [ ] Run Lighthouse audits
- [ ] Create backup of production site

### Deployment Files
```
📦 Deploy to production:
├── index.html (updated)
├── about.html (updated)
├── services.html (updated)
├── work-*.html (updated nav only)
├── thank-you.html (updated)
├── 404.html (updated)
├── archive/
│   ├── index.html (NEW)
│   ├── timeline.html (NEW)
│   └── skills.html (NEW)
├── css/
│   ├── styles.css (unchanged)
│   ├── work-case-study.css (unchanged)
│   ├── archive.css (NEW)
│   └── icons.css (unchanged)
├── js/
│   ├── script.js (unchanged)
│   ├── config.js (generated)
│   └── archive.js (NEW)
└── data/ (NEW)
    ├── portfolio-projects.json
    ├── project-summary.json
    └── skills-extracted.json
```

### Post-Deployment
- [ ] Test live site
- [ ] Verify all links work
- [ ] Check analytics integration
- [ ] Submit sitemap to Google
- [ ] Monitor error logs

---

## Success Metrics

**After 1 week:**
- [ ] Archive pages have page views
- [ ] No reported bugs
- [ ] No console errors in analytics

**After 1 month:**
- [ ] Users exploring archive content
- [ ] Average session duration increases
- [ ] Bounce rate stable or improved

---

## Rollback Plan

If issues arise:

1. **Revert navigation changes:**
   - Remove "Archive" link from all pages
   - Users can't access archive

2. **Remove archive directory:**
   - Delete `/archive/` folder
   - Archive becomes inaccessible but site remains functional

3. **Full rollback:**
   - Git revert to pre-archive commit
   - Redeploy previous version

**Archive work is isolated and can be removed without affecting keystone content.**

---

*End of Implementation Checklist*
