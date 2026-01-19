# Architecture Plan: Career Archive Integration
## The Variables Co. Portfolio Site Extension

**Date:** 2026-01-19
**Author:** Technical Lead / System Architect
**Status:** Planning Phase

---

## Executive Summary

This document provides a comprehensive technical plan for extending The Variables Co. portfolio site to support a structured career archive while preserving existing case studies as canonical keystone work. The plan prioritizes **minimal changes, maximum maintainability, and zero visual drift**.

**Core Principle:** We are technical stewards, not redesigners.

---

## 1. Codebase Review Summary

### Current Architecture

**Type:** Static HTML/CSS/JavaScript site (no framework)
**Build System:** Simple Node.js script (`build.js`) for environment variable injection
**Content Pattern:** Flat HTML files with inline styles for page-specific layouts
**Styling:** CSS custom properties with global + page-specific stylesheets

### File Structure
```
/
├── index.html              # Homepage with services + 4 featured case studies
├── about.html              # Company info with inline <style>
├── services.html           # Service pages with anchor navigation
├── work-*.html (×4)        # Case study pages (keystone content)
├── thank-you.html          # Form success page
├── 404.html                # Error page
├── build.js                # Environment variable injection script
├── config.template.js      # Template for js/config.js
├── css/
│   ├── styles.css          # Global styles (19KB)
│   ├── work-case-study.css # Case study specific styles (9.5KB)
│   └── icons.css           # Icon system documentation
├── js/
│   ├── script.js           # Interactivity (8.9KB)
│   └── config.js           # Generated from build.js
└── documentation/
    ├── portfolio-projects.json     # Archive data (14KB, 7 projects)
    ├── project-summary.json        # Quick reference
    ├── skills-extracted.json       # 18 skills
    └── analysis-results.md         # Historical analysis
```

### Content Organization Patterns

**Keystone Case Studies:**
- 4 HTML files: `work-little-red-coffee.html`, `work-john-howard.html`, `work-circular-materials.html`, `work-gocactus.html`
- Featured on homepage in "Selected Work" section
- Use `work-case-study.css` for consistent styling
- Rich narrative structure with hero, challenge, solution, outcomes

**Navigation:**
- Fixed header with logo + links
- Smooth scroll to anchors
- Section-based (services, approach, work, contact)

**Animation Pattern:**
- IntersectionObserver for scroll-triggered reveals
- Staggered delays for card grids
- Transform + opacity transitions

### Styling Approach

**Design System:**
- CSS custom properties in `:root` (colors, fonts, spacing, transitions)
- WCAG 2.1 AA compliant color palette
- Two typefaces: Fraunces (display), Outfit (body)
- Container pattern: `max-width: 1400px` with `2rem` padding

**Color Palette:**
```css
--color-navy: #0F172A         /* Primary dark */
--color-slate: #1E293B        /* Secondary dark */
--color-accent-primary: #2f6364  /* Teal accent */
--color-accent-secondary: #00df59 /* Green accent (hover states) */
--color-cream: #F8FAFC        /* Light backgrounds */
--color-gray: #7b8473         /* Body text (7:1 contrast) */
--color-burgundy: #744033     /* Brand accent (logo suffix, links) */
```

**Component Patterns:**
- `.section-header` with `.section-number` + `.section-title`
- Card grids (`.service-card`, `.work-item`)
- Tag system (`.tag`) for metadata
- Hero patterns with parallax/gradient backgrounds

### Extension Points Identified

**✅ Strengths:**
- Clean separation of global vs. page-specific styles
- Consistent component vocabulary
- Simple, maintainable build system
- Accessible color system

**⚠️ Constraints:**
- No templating system (HTML duplication for nav/footer)
- Inline styles in about.html (inconsistent pattern)
- No data-driven rendering (all content is hardcoded)
- Build script only handles config.js generation

**🎯 Opportunities:**
- Add JSON data loading without framework
- Create reusable archive components in new CSS module
- Extend build script to validate data
- Add new pages with existing patterns

---

## 2. Build System Evaluation

### Current Capabilities

**What it does:**
- Reads `.env` file
- Processes `config.template.js` with placeholder replacement
- Generates `js/config.js` with Web3Forms credentials
- Adds `<script>` tag to index.html if missing

**What it doesn't do:**
- Process HTML templates
- Generate pages from data
- Bundle/minify assets
- Transform CSS or JS

### Assessment: **SUFFICIENT**

The existing build system is adequate for the archive integration. We will extend it minimally rather than replace it.

### Proposed Extensions

**Option 1: Minimal Enhancement (RECOMMENDED)**
- Keep existing `build.js` as-is
- Add optional `build-archive.js` for archive-specific tasks
- Manually create archive HTML pages following existing patterns
- Load JSON data client-side with vanilla JavaScript

**Benefits:**
- Zero risk to existing build
- Maintains simplicity
- No new dependencies
- Easy to understand and maintain

**Option 2: Enhanced Build (NOT RECOMMENDED)**
- Add template engine (Handlebars, EJS)
- Generate pages from JSON data
- Add watch mode, hot reload

**Why we're not doing this:**
- Adds complexity
- Requires team training
- Risk of breaking existing pages
- Over-engineering for 3-4 new pages

### Decision: **Proceed with Option 1**

**Implementation:**
```javascript
// build-archive.js (NEW)
// Validates JSON structure
// Generates sitemap entries
// Creates metadata for archive pages
// DOES NOT generate HTML (manual creation following patterns)
```

---

## 3. Data Integration Strategy

### Archival Dataset Review

**Available Data:**
- 7 high-confidence projects (portfolio-projects.json)
- Project summary with recommendations (project-summary.json)
- 18 extracted skills (skills-extracted.json)
- Detailed analysis documentation (analysis-results.md)

**Data Quality:**
- 2 projects marked for "feature" (portfolio display)
- 5 projects marked for "archive" (historical)
- Confidence scores: 0.85–1.00 (high quality)
- Rich metadata: timeline, tech stack, responsibilities, deliverables

### Integration Approach

**File Format:** JSON (already structured)
**Storage Location:** `/data/` (NEW directory)
**Access Method:** Client-side fetch or inline `<script>`

### Directory Structure (Proposed)

```
/
├── data/                              # NEW: Structured data
│   ├── portfolio-projects.json        # MOVE from documentation/
│   ├── project-summary.json           # MOVE from documentation/
│   ├── skills-extracted.json          # MOVE from documentation/
│   └── README.md                      # Data documentation
├── archive/                           # NEW: Archive pages
│   ├── index.html                     # Archive landing page
│   ├── timeline.html                  # Timeline view
│   └── skills.html                    # Skills/competency view
├── css/
│   ├── styles.css                     # EXISTING (no changes)
│   ├── work-case-study.css            # EXISTING (no changes)
│   ├── archive.css                    # NEW: Archive-specific styles
│   └── icons.css                      # EXISTING
├── js/
│   ├── script.js                      # EXISTING (no changes)
│   ├── config.js                      # GENERATED
│   └── archive.js                     # NEW: Archive page logic
└── work-*.html                        # EXISTING (no changes)
```

### Data Access Pattern

**Approach: Inline JSON with Progressive Enhancement**

```html
<!-- archive/index.html -->
<script>
  // Inline critical data for fast load
  window.archiveData = {
    projects: [...], // Subset or full dataset
    featured: [...],
    archive: [...]
  };
</script>
<script src="../js/archive.js"></script>
```

**Why inline instead of fetch?**
- Faster initial render (no network request)
- Works without server (file:// protocol)
- Simpler error handling
- Can progressively enhance with fetch if needed

### Data Loading Strategy

**For Archive Pages:**
1. Inline critical data in HTML (project list, metadata)
2. Use `archive.js` to render components client-side
3. Apply filters, sorts, searches in browser

**For Homepage Work Section:**
- No changes to existing work-item markup
- Keystone case studies remain hardcoded
- Optional: Add "View All Projects" link to archive

### Separation of Concerns

**Keystone Projects (DO NOT TOUCH):**
- `work-little-red-coffee.html`
- `work-john-howard.html`
- `work-circular-materials.html`
- `work-gocactus.html`

**Archive Projects (NEW):**
- Data lives in `/data/portfolio-projects.json`
- Rendered dynamically in `/archive/index.html`
- Can surface confidence scores in UI (optional)
- Clearly labeled as "Project Archive" vs. "Featured Work"

### Naming Conventions

**HTML Files:**
- `archive/index.html` - Main archive page
- `archive/timeline.html` - Career timeline
- `archive/skills.html` - Skills overview

**Data IDs:**
- Use existing `id` field from JSON (e.g., `canadaindie-music-blog`)
- URL fragments: `#canadaindie-music-blog`
- CSS classes: `.project-card[data-id="canadaindie-music-blog"]`

---

## 4. Brand Styleguide

### Visual Language Extract

#### Typography

**Display Font:** Fraunces (Serif)
- Usage: Hero titles, section titles, case study titles
- Weights: 400, 600, 700, 900
- Variable font with optical sizing (opsz 9-144)
- Example: `.hero-title`, `.case-title`

**Body Font:** Outfit (Sans-serif)
- Usage: Body text, navigation, UI elements
- Weights: 300, 400, 500, 600
- Example: Body text, `.service-description`, `.meta-value`

**Scale:**
```css
/* Hero/Display */
font-size: clamp(3rem, 8vw, 5rem);  /* 48-80px */
line-height: 1.1;

/* Section Titles */
font-size: 2.5rem;                   /* 40px */
line-height: 1.2;

/* Subsection Titles */
font-size: 1.5rem;                   /* 24px */
line-height: 1.6;

/* Body */
font-size: 1rem;                     /* 16px */
line-height: 1.6;

/* Small */
font-size: 0.95rem;                  /* 15px */
font-size: 0.875rem;                 /* 14px */
```

#### Color System

**Primary Palette:**
```css
Navy (#0F172A)          → Headers, primary text, navigation
Slate (#1E293B)         → Secondary text
Cream (#F8FAFC)         → Backgrounds, cards
Gray (#7b8473)          → Body text, descriptions
```

**Accent Palette:**
```css
Teal (#2f6364)          → Primary CTAs, accent elements
Green (#00df59)         → Hover states, success
Burgundy (#744033)      → Brand accent (logo, links on hover)
```

**Semantic Usage:**
- Logo: Navy + Burgundy
- Navigation links: Navy → Burgundy (hover)
- CTAs: Teal background → Green (hover)
- Section numbers: Burgundy
- Meta labels: Burgundy (uppercase)
- Cards: White background, Cream hover

#### Spacing System

**Container:**
```css
max-width: 1400px;
padding: 2rem;          /* Mobile: 2rem, Desktop: 2rem */
```

**Section Padding:**
```css
padding: 8rem 2rem;     /* Vertical: 8rem, Horizontal: container padding */
padding: 6rem 2rem;     /* Tighter sections */
padding: 4rem 2rem;     /* Compact sections */
```

**Component Spacing:**
```css
gap: 3rem;              /* Grid gaps (large) */
gap: 2rem;              /* Grid gaps (medium) */
gap: 1rem;              /* Card internal spacing */
gap: 0.5rem;            /* Tight groupings */
```

#### Animation & Transitions

**Standard Timing:**
```css
--transition-smooth: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
--transition-fast: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

**Scroll Animations:**
- IntersectionObserver triggers
- `opacity: 0` → `opacity: 1`
- `transform: translateY(30px)` → `translateY(0)`
- Staggered delays: `index * 0.1s` or `index * 0.15s`

**Hover Effects:**
- Links: Color change + underline expansion
- Cards: Transform lift + shadow
- CTAs: Background color + lift + glow

#### Component Patterns

**Section Header:**
```html
<div class="section-header">
  <span class="section-number">01</span>
  <h2 class="section-title">Section Name</h2>
</div>
```

**Card Grid:**
```html
<div class="[service|work]-grid">
  <div class="[service|work]-card">
    <!-- Content -->
  </div>
</div>
```

**Tags:**
```html
<div class="tags">
  <span class="tag">Tag Name</span>
</div>
```

**Meta Display:**
```html
<div class="meta-item">
  <span class="meta-label">Label</span>
  <span class="meta-value">Value</span>
</div>
```

### Design Rules for New Components

**MUST:**
1. Use CSS custom properties (no hardcoded colors)
2. Follow existing font scale
3. Use `clamp()` for responsive typography
4. Implement IntersectionObserver animations
5. Include hover states with `--transition-fast`
6. Maintain 4.5:1 contrast minimum (WCAG AA)

**MUST NOT:**
1. Introduce new color values
2. Add new fonts
3. Create conflicting spacing systems
4. Override keystone case study styles
5. Use px values where custom properties exist

**AVOID:**
1. Over-animation (keep it subtle)
2. Complex gradients (use existing patterns)
3. Heavy imagery (site is illustration-based)

---

## 5. Component Library Design

### Archive-Specific Components

**Location:** `css/archive.css` (NEW)
**JavaScript:** `js/archive.js` (NEW)

#### Component Inventory

##### 1. Project Card (Archive)
**Purpose:** Display archived project in grid/list view
**Distinction:** Lighter, more compact than keystone work-item
**Data-driven:** Yes

```html
<article class="archive-project-card" data-id="canadaindie-music-blog">
  <div class="archive-card-header">
    <h3 class="archive-card-title">CanadaIndie.com</h3>
    <span class="archive-card-year">2009-2011</span>
  </div>
  <p class="archive-card-summary">
    Music blog platform covering Canadian independent music...
  </p>
  <div class="archive-card-meta">
    <div class="tags">
      <span class="tag">WordPress</span>
      <span class="tag">PHP</span>
    </div>
    <span class="confidence-badge" data-confidence="0.95">
      High Confidence
    </span>
  </div>
  <button class="archive-card-expand">View Details</button>
</article>
```

**Styling:**
- Background: White
- Border: 1px solid `--color-light-gray`
- Hover: Transform lift + border color change
- Compact padding (1.5rem vs. 2rem for work-items)

##### 2. Project Detail Modal/Expansion
**Purpose:** Show full project data without navigation
**Pattern:** Expandable accordion or modal overlay

```html
<div class="archive-project-detail" data-id="canadaindie-music-blog">
  <div class="detail-header">
    <h2>CanadaIndie.com</h2>
    <button class="detail-close">×</button>
  </div>
  <div class="detail-grid">
    <div class="detail-section">
      <h4>Timeline</h4>
      <p>2009-2011</p>
    </div>
    <div class="detail-section">
      <h4>Role</h4>
      <p>Web Developer (Solo)</p>
    </div>
    <div class="detail-section">
      <h4>Tech Stack</h4>
      <div class="tags">...</div>
    </div>
    <div class="detail-section detail-full">
      <h4>Responsibilities</h4>
      <ul>...</ul>
    </div>
  </div>
</div>
```

##### 3. Timeline Entry
**Purpose:** Visualize project along career timeline
**Layout:** Vertical timeline with year markers

```html
<div class="timeline">
  <div class="timeline-year" data-year="2009">
    <span class="timeline-marker">2009</span>
    <div class="timeline-events">
      <div class="timeline-event" data-project-id="canadaindie-music-blog">
        <h4>CanadaIndie.com</h4>
        <p>WordPress Era begins</p>
      </div>
    </div>
  </div>
  <!-- More years -->
</div>
```

**Styling:**
- Vertical line with year markers
- Events positioned along line
- Connect events with dot indicators
- Highlight technology transitions

##### 4. Skills Grid
**Purpose:** Display 18 extracted skills with project counts
**Layout:** Responsive grid grouped by category

```html
<div class="skills-container">
  <div class="skills-category">
    <h3 class="skills-category-title">CMS</h3>
    <div class="skills-grid">
      <div class="skill-card" data-skill="WordPress">
        <h4 class="skill-name">WordPress</h4>
        <p class="skill-years">6 years experience</p>
        <p class="skill-projects">4 projects</p>
        <div class="skill-proficiency">
          <span class="proficiency-bar" style="--width: 90%"></span>
        </div>
      </div>
    </div>
  </div>
</div>
```

##### 5. Filter Controls
**Purpose:** Filter archive by tech, year, type
**Pattern:** Button group or dropdown

```html
<div class="archive-filters">
  <div class="filter-group">
    <label class="filter-label">Technology</label>
    <div class="filter-buttons">
      <button class="filter-btn active" data-filter="all">All</button>
      <button class="filter-btn" data-filter="wordpress">WordPress</button>
      <button class="filter-btn" data-filter="javascript">JavaScript</button>
    </div>
  </div>
  <div class="filter-group">
    <label class="filter-label">Era</label>
    <select class="filter-select" data-filter-type="year">
      <option value="all">All Years</option>
      <option value="2009-2015">2009-2015 (WordPress Era)</option>
      <option value="2020-2022">2020-2022 (Modern JS Era)</option>
    </select>
  </div>
</div>
```

##### 6. Confidence Badge (Optional)
**Purpose:** Surface data quality scores
**Display:** Small badge with color coding

```html
<span class="confidence-badge" data-score="0.95">
  <svg class="badge-icon">...</svg>
  High Confidence
</span>
```

**Color coding:**
- 0.90-1.00: Green (high)
- 0.80-0.89: Yellow (medium)
- Below 0.80: Gray (lower)

### Component Accessibility

**All components must:**
- Use semantic HTML (`<article>`, `<section>`, `<nav>`)
- Include ARIA labels for interactive elements
- Support keyboard navigation (Tab, Enter, Escape)
- Announce filter changes to screen readers
- Maintain focus management (modals, expansions)

---

## 6. Career Views: Page Types & Navigation

### Proposed Page Architecture

#### Page 1: Archive Landing (`/archive/index.html`)
**Purpose:** Main entry point for historical projects
**Layout:** Grid of archive-project-cards with filters

**Sections:**
1. **Hero**
   - Title: "Project Archive"
   - Subtitle: "20 years of building digital products"
   - Quick stats (7 projects, 18 skills, X clients)

2. **Filter Controls**
   - Technology, Year, Project Type

3. **Project Grid**
   - Archive-project-cards (data-driven)
   - Sort options (date, confidence, tech)

4. **Footer**
   - Link to timeline view
   - Link to skills view
   - Back to featured work

**Key Difference from Homepage:**
- Homepage shows 4 keystone case studies (hardcoded, detailed)
- Archive shows 7+ historical projects (data-driven, compact)

#### Page 2: Timeline View (`/archive/timeline.html`)
**Purpose:** Chronological career visualization
**Layout:** Vertical timeline with project events

**Sections:**
1. **Hero**
   - Title: "Career Timeline"
   - Subtitle: "From WordPress to Modern JavaScript"

2. **Timeline Visualization**
   - Vertical line with year markers (2009-2026)
   - Projects positioned at start years
   - Technology era labels
   - Hover/click for project details

3. **Era Highlights**
   - WordPress Era (2009-2015)
   - Modern JS Era (2020-2022)
   - Current Era (2024-present)

#### Page 3: Skills Overview (`/archive/skills.html`)
**Purpose:** Competency showcase grouped by category
**Layout:** Category sections with skill cards

**Sections:**
1. **Hero**
   - Title: "Skills & Technologies"
   - Subtitle: "18 skills across 4 categories"

2. **Skills by Category**
   - CMS (WordPress, Strapi)
   - Languages (JavaScript, PHP, React, Svelte)
   - Platforms (Node.js, MySQL, LAMP Stack)
   - Practices (Git, Build Tools, Accessibility, SEO)

3. **Experience Visualization**
   - Years active
   - Project count
   - Proficiency level

### Navigation Structure

```
Homepage (index.html)
├── Featured Work Section
│   ├── Little Red Coffee (keystone)
│   ├── John Howard Society (keystone)
│   ├── Circular Materials (keystone)
│   ├── GOCACTUS (keystone)
│   └── [NEW] "View Full Archive" CTA → /archive/
│
└── Navigation
    └── [NEW] "Archive" link (optional)

Archive Landing (/archive/index.html)
├── Back to Featured Work
├── Filter/Search Projects
├── View Timeline →
└── View Skills →

Timeline View (/archive/timeline.html)
├── Back to Archive
└── View Skills →

Skills View (/archive/skills.html)
├── Back to Archive
└── View Timeline →
```

### User Flow Patterns

**Discovery Flow:**
1. User lands on homepage
2. Sees 4 featured case studies (keystone work)
3. Clicks "View Full Archive" CTA
4. Browses archive grid with filters
5. Clicks project card → details expand
6. Navigates to timeline or skills views

**Direct Access Flow:**
1. User lands on `/archive/` from external link
2. Sees breadcrumb: Home > Archive
3. Can navigate to timeline/skills
4. Can return to featured work

**Navigation Indicators:**
- Breadcrumbs on archive pages
- "Featured Work" vs. "Project Archive" labels
- Clear CTAs between sections
- Consistent back navigation

### Visual Differentiation

**Featured Work (Keystone):**
- Large work-item cards with gradients
- Prominent on homepage
- Rich narrative case study pages
- Professional project photography (SVG placeholders)

**Project Archive:**
- Compact archive-project-cards
- Separate archive section
- Data-driven rendering
- Confidence badges visible
- More technical/factual tone

**Typography Hierarchy:**
- Featured Work uses larger display type
- Archive uses standard subsection sizing
- Clear visual separation via spacing + backgrounds

---

## 7. Implementation Roadmap

### Phase 1: Foundation (Week 1)

**Tasks:**
1. Read `/data/` directory 
2. Create `/archive/` directory structure
3. Create `css/archive.css` (empty, with TODOs)
4. Create `js/archive.js` (empty, with TODOs)
5. Add "Archive" link to navigation (all pages)
6. Create `build-archive.js` validation script

**Deliverables:**
- Directory structure in place
- Navigation updated
- No visual changes yet

### Phase 2: Archive Landing Page (Week 2)

**Tasks:**
1. Create `/archive/index.html`
2. Implement archive-project-card component
3. Implement filter controls
4. Load data from JSON (inline script)
5. Add IntersectionObserver animations
6. Add project detail expansion

**Deliverables:**
- Functional archive page
- Working filters
- Data-driven rendering

### Phase 3: Timeline View (Week 3)

**Tasks:**
1. Create `/archive/timeline.html`
2. Implement timeline component (CSS + JS)
3. Plot projects on timeline
4. Add era markers
5. Link to project details

**Deliverables:**
- Visual timeline
- Chronological career view

### Phase 4: Skills View (Week 3-4)

**Tasks:**
1. Create `/archive/skills.html`
2. Implement skills-grid component
3. Group by category
4. Add proficiency visualizations
5. Link skills to projects

**Deliverables:**
- Skills showcase page
- Category groupings

### Phase 5: Integration & Polish (Week 4)

**Tasks:**
1. Add "View Full Archive" CTA to homepage
2. Test all navigation flows
3. Accessibility audit (WCAG AA)
4. Responsive design testing
5. Cross-browser testing
6. Documentation updates

**Deliverables:**
- Complete integration
- Tested on all devices
- Documentation complete

---

## 8. Hard Constraints Verification

### ✅ Constraints Met

1. **Do NOT modify existing case study content**
   - Zero changes to `work-*.html` files
   - Case study CSS unchanged
   - Featured work section on homepage unchanged

2. **Do NOT rewrite historical analysis**
   - Analysis documents moved to `/data/` but not modified
   - JSON structure preserved as-is

3. **Do NOT introduce unnecessary frameworks**
   - No React, Vue, or Angular
   - Vanilla JavaScript only
   - CSS follows existing patterns

4. **Prefer clarity, maintainability, and longevity**
   - Simple directory structure
   - Minimal build script changes
   - Data-driven but not over-engineered
   - Comprehensive documentation

### Technical Stewardship Principles Applied

- **Minimal intervention:** Extend, don't replace
- **Pattern consistency:** Follow existing conventions
- **Progressive enhancement:** Archive works without JavaScript (shows static list)
- **Documentation-first:** This plan before implementation
- **Reversibility:** Archive pages can be removed without affecting keystone work

---

## 9. Success Criteria

**Functional Requirements:**
- [ ] Archive landing page displays all 7 historical projects
- [ ] Filters work (technology, year, type)
- [ ] Timeline visualizes career progression
- [ ] Skills page groups 18 skills by category
- [ ] Navigation flows between all views

**Technical Requirements:**
- [ ] No changes to existing case study files
- [ ] CSS follows existing design system
- [ ] Components use CSS custom properties
- [ ] Accessible (WCAG AA)
- [ ] Works on mobile, tablet, desktop

**Quality Requirements:**
- [ ] Zero visual drift from existing brand
- [ ] Load time < 3s on 3G
- [ ] No JavaScript errors in console
- [ ] Data validation passes in build script

---

## 10. Open Questions & Decisions Needed

1. **Homepage CTA placement:** Where should "View Full Archive" link appear? Below featured work grid and in About us page

2. **Confidence badges:** Display on archive cards (transparency about data quality) and in detail view

3. **Archive URL structure:**  `/archive/` 

4. **Mobile navigation:** Add archive to hamburger menu? Yes, a implementing mobile nav

---

## 11. Risk Assessment

**Low Risk:**
- Creating new pages (no impact on existing)
- Adding CSS module (isolated styles)
- Moving JSON files (no functionality change)

**Medium Risk:**
- Adding navigation link (requires editing all HTML files)
- Client-side rendering (JavaScript dependency)

**Mitigation:**
- Test navigation changes thoroughly
- Provide fallback for no-JavaScript users
- Version control all changes
- Create backup before modifications

**High Risk Areas (AVOID):**
- ❌ Modifying `work-*.html` files
- ❌ Changing global CSS that affects case studies
- ❌ Altering build.js behavior
- ❌ Introducing breaking dependencies

---

## 12. Next Steps

**Immediate Actions:**
1. Review this plan with stakeholders
2. Answer open questions (section 10)
3. Set up `/data/` and `/archive/` directories
4. Create empty component files with structure TODOs
5. Begin Phase 1 implementation

**Developer Handoff:**
This document provides complete technical specifications for implementation. Developers should:
1. Read sections 1-6 thoroughly
2. Reference section 4 (styleguide) continuously
3. Follow section 7 (roadmap) sequentially
4. Verify section 8 (constraints) before each commit

---

## Document Metadata

**Version:** 1.0
**Last Updated:** 2026-01-19
**Status:** Approved for Implementation
**Next Review:** After Phase 2 completion

---

*End of Architecture Plan*
