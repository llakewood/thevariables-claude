# Career Archive Analysis - Output Documentation

**Analysis Date:** 2026-01-19
**Analyst:** Claude Sonnet 4.5
**Source:** Filesystem archive analysis from `/Users/lakewood/Sites/archive/`

---

## Overview

This analysis processed 14,132 lines of filesystem data, signal extraction files, and URL references to reconstruct Les Lakewood's 20-year software development career. The output includes structured JSON data ready for integration into a portfolio website.

---

## Output Files

### 1. Portfolio Projects ([portfolio-projects.json](portfolio-projects.json))
**7 complete project objects** following the core-project-object schema:

| Project | Timeline | Confidence | Status | Tech Stack |
|---------|----------|------------|--------|------------|
| CanadaIndie.com | 2009-2011 | 0.95 | Archive | WordPress 3.x, PHP |
| Ingredient Sync | 2021-2022 | 0.98 | Archive | Strapi, React, Node.js |
| Blog.MeaghanBent.com | 2011-2015 | 0.90 | Archive | WordPress, PHP |
| DBLDNM.com | 2012+ | 0.85 | Archive | WordPress, PHP |
| BeOurGuestEvents.ca | 2015 | 0.88 | Archive | WordPress, PHP |
| John Howard Society Guide | 2020-2022 | 0.92 | **Portfolio** | Web Application |
| The Variables Co. Website | 2024-present | 1.00 | **Portfolio** | HTML, CSS, JS |

**Usage:**
- Import directly into portfolio CMS or static site
- Each object includes complete metadata: timeline, tech stack, responsibilities, deliverables
- Artifacts section links to filesystem paths for screenshots/code
- Evidence tracking shows data source reliability

---

### 2. Project Summary ([project-summary.json](project-summary.json))
**Quick-reference table** with:
- 10 total project candidates (7 high-confidence, 3 medium-confidence)
- Confidence scores and timelines
- Recommended actions (feature vs. archive)
- Technology era classification
- Live sites without filesystem evidence

**Key Insights:**
- **WordPress Era (2009-2015):** 4 projects, demonstrating 6+ years WordPress expertise
- **Modern JS Era (2020-2022):** 2 projects with Strapi/React/Svelte
- **Current Era (2024-present):** Active development on The Variables Co. site

**Additional Live Sites Found:**
7 active sites referenced in urls.txt but without filesystem archives:
- littleredcoffee.ca (has case study)
- gocactus.com (has case study)
- coderdojo.ca
- niagaraqueerarchive.ca
- lauramoore.ca
- wornertcouture.ca
- bucketsof.com

---

### 3. Skills Extracted ([skills-extracted.json](skills-extracted.json))
**18 distinct skills** across 4 categories:

**CMS:** WordPress (6 years), Strapi (2 years)
**Languages:** JavaScript (17 years), PHP (10 years), React, Svelte
**Platforms:** Node.js, MySQL, LAMP Stack
**Practices:** Git, Webpack, Vite, Rollup, Redux, SEO, Accessibility, Static Site Generation

Each skill includes:
- Project references (by ID)
- Years active estimate
- Proficiency level
- Evidence examples
- Confidence score

**Usage:**
- Generate skills page on portfolio
- Filter projects by technology
- Demonstrate technology evolution over time

---

### 4. Ignored Paths ([ignored-paths.json](ignored-paths.json))
**Noise filtering documentation** showing:
- Vendor dependencies excluded (node_modules, bower_components)
- System files ignored (.DS_Store, .env, etc.)
- WordPress core files excluded
- Cache/temp directories ignored

**Analysis Quality Metrics:**
- ~60% of filesystem is vendor dependencies
- ~20% is WordPress core files
- ~20% is actual project code

**Excluded from Portfolio:**
8 URLs without filesystem evidence documented for future investigation

---

### 5. Detailed Analysis ([analysis-results.md](analysis-results.md))
**599-line comprehensive analysis** including:
- Evidence clusters for each project
- Filesystem structure highlights
- Signal correlation matrix
- Technology pattern analysis
- Client/sector classification
- Confidence scoring methodology

---

## Data Quality & Confidence

### High-Confidence Projects (0.85+)
All 7 archived projects have strong filesystem evidence with multiple reinforcing signals:
- WordPress projects: wp-config + themes + plugins + upload archives
- Modern JS projects: package.json + git repo + build configs + node_modules

### Confidence Scoring Method
Based on correlation of multiple signals:
- ✓✓✓ Extensive evidence (7+ signals) = 0.95-1.00
- ✓✓ Multiple signals (4-6 signals) = 0.85-0.94
- ✓ Basic evidence (2-3 signals) = 0.75-0.84
- URL only (1 signal) = 0.60-0.74

### Inferred vs. Confirmed Data
All inferred data marked with:
- `"confidence": "inferred"` in tech stack
- Notes field explaining inference reasoning
- Timeline confidence levels (high/medium/low)

---

## Next Steps

### For Portfolio Integration

1. **Featured Projects** (recommended for homepage):
   - John Howard Society Guide (client work, accessibility focus)
   - The Variables Co. Website (current, showcases skills)

2. **Archive Section** (historical work):
   - All WordPress-era projects (demonstrate evolution)
   - Modern JS projects (show current capabilities)

3. **Skills Page**:
   - Import skills-extracted.json
   - Group by category (CMS, Languages, Platforms, Practices)
   - Show timeline visualization

4. **Case Studies**:
   - 4 existing case studies in current site (Little Red Coffee, John Howard, Circular Materials, GOCACTUS)
   - Add filesystem-based projects with screenshots from artifact paths

### Additional Data Collection

**Live sites without filesystem archives:**
Consider adding manual project entries for:
- littleredcoffee.ca
- gocactus.com
- coderdojo.ca
- niagaraqueerarchive.ca

These could be populated from:
- LinkedIn project descriptions
- Client testimonials
- Screenshots/screen recordings
- Memory/notes

---

## File Formats

All JSON files follow the data models in `/documentation/context/`:
- [core-project-object.json](context/core-project-object.json) - Project schema
- [skill-extraction-model.json](context/skill-extraction-model.json) - Skills schema
- [timeline-career-model.json](context/timeline-career-model.json) - Career/employment schema

---

## Methodology

### Analysis Process
1. **Filesystem Clustering**: Analyzed tree.txt (14,132 lines) to identify project root directories
2. **Signal Correlation**: Cross-referenced signals_*.txt files (JS, README, WP, client indicators)
3. **URL Matching**: Matched filesystem projects to urls.txt references
4. **Confidence Scoring**: Assigned scores based on signal strength and correlation
5. **JSON Generation**: Created structured objects following provided schemas



## Credits

**Analysis performed by:** Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)
**For:** Les Lakewood Career Archive Project
**Project site:** The Variables Co. (thevariables.com)

