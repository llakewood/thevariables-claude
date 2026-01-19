# Component Specifications
## Archive Component Library for The Variables Co.

**Date:** 2026-01-19
**Purpose:** Detailed specifications for archive-specific components
**CSS Module:** `css/archive.css` (NEW)
**JavaScript:** `js/archive.js` (NEW)

---

## Component Design Principles

1. **Follow existing patterns:** Match visual language from keystone case studies
2. **Data-driven:** All components accept JSON data and render dynamically
3. **Accessible:** WCAG 2.1 AA compliance, keyboard navigation, ARIA labels
4. **Performant:** Minimize reflows, use CSS transforms, lazy-load details
5. **Progressive:** Work without JavaScript (show static content)

---

## 1. Archive Project Card

### Purpose
Compact, scannable card for displaying archived projects in grid/list layouts.

### HTML Structure
```html
<article class="archive-project-card"
         data-id="canadaindie-music-blog"
         data-year-start="2009"
         data-year-end="2011"
         data-confidence="0.95"
         tabindex="0">

  <div class="archive-card-header">
    <h3 class="archive-card-title">CanadaIndie.com</h3>
    <span class="archive-card-timeline">2009–2011</span>
  </div>

  <p class="archive-card-summary">
    Music blog platform covering Canadian independent music scene with
    content aggregation, social media integration, and SEO optimization.
  </p>

  <div class="archive-card-tech">
    <div class="tags">
      <span class="tag tag-cms">WordPress</span>
      <span class="tag tag-language">PHP</span>
      <span class="tag tag-platform">MySQL</span>
    </div>
  </div>

  <div class="archive-card-footer">
    <span class="archive-card-context">Personal Project</span>
    <button class="archive-card-expand" aria-label="View project details" aria-expanded="false">
      <span>View Details</span>
      <svg class="expand-icon" width="16" height="16" viewBox="0 0 16 16">
        <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
      </svg>
    </button>
  </div>

  <!-- Optional: Confidence badge (can be hidden) -->
  <span class="confidence-badge" data-level="high" aria-label="High confidence data">
    <svg class="badge-icon" width="12" height="12">
      <circle cx="6" cy="6" r="5" fill="currentColor"/>
    </svg>
  </span>
</article>
```

### CSS Specifications

```css
/* Archive Project Card */
.archive-project-card {
  background: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: var(--transition-fast);
  position: relative;
  cursor: pointer;
}

.archive-project-card:hover,
.archive-project-card:focus {
  transform: translateY(-4px);
  border-color: var(--color-accent-primary);
  box-shadow: 0 8px 24px rgba(47, 99, 100, 0.12);
  outline: none;
}

.archive-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.archive-card-title {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0;
  line-height: 1.3;
}

.archive-card-timeline {
  font-size: 0.875rem;
  color: var(--color-gray);
  font-weight: 600;
  white-space: nowrap;
  font-variant-numeric: tabular-nums;
}

.archive-card-summary {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-gray);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.archive-card-tech {
  margin-top: auto;
}

.archive-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid var(--color-light-gray);
}

.archive-card-context {
  font-size: 0.875rem;
  color: var(--color-burgundy);
  font-weight: 500;
  text-transform: capitalize;
}

.archive-card-expand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: var(--color-accent-primary);
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
}

.archive-card-expand:hover {
  background: var(--color-cream);
  color: var(--color-navy);
}

.expand-icon {
  transition: transform 0.3s ease;
}

.archive-card-expand[aria-expanded="true"] .expand-icon {
  transform: rotate(180deg);
}

/* Confidence Badge */
.confidence-badge {
  position: absolute;
  top: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.archive-project-card:hover .confidence-badge {
  opacity: 1;
}

.confidence-badge[data-level="high"] {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
}

.confidence-badge[data-level="medium"] {
  background: rgba(234, 179, 8, 0.1);
  color: #a16207;
}

.confidence-badge[data-level="low"] {
  background: rgba(148, 163, 184, 0.1);
  color: #475569;
}

/* Tag Variations */
.tag-cms {
  background: rgba(47, 99, 100, 0.1);
  color: var(--color-accent-primary);
}

.tag-language {
  background: rgba(116, 64, 51, 0.1);
  color: var(--color-burgundy);
}

.tag-platform {
  background: rgba(15, 23, 42, 0.1);
  color: var(--color-navy);
}

/* Responsive */
@media (max-width: 768px) {
  .archive-card-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .archive-card-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
}
```

### JavaScript Behavior

```javascript
// Render archive card from JSON data
function createArchiveCard(project) {
  const card = document.createElement('article');
  card.className = 'archive-project-card';
  card.dataset.id = project.id;
  card.dataset.yearStart = project.timeline.start_year;
  card.dataset.yearEnd = project.timeline.end_year || 'present';
  card.dataset.confidence = project.confidence_score;
  card.tabIndex = 0;

  const confidenceLevel =
    project.confidence_score >= 0.90 ? 'high' :
    project.confidence_score >= 0.80 ? 'medium' : 'low';

  card.innerHTML = `
    <div class="archive-card-header">
      <h3 class="archive-card-title">${project.title}</h3>
      <span class="archive-card-timeline">
        ${project.timeline.start_year}–${project.timeline.end_year || 'Present'}
      </span>
    </div>
    <p class="archive-card-summary">${project.summary}</p>
    <div class="archive-card-tech">
      <div class="tags">
        ${generateTechTags(project.tech)}
      </div>
    </div>
    <div class="archive-card-footer">
      <span class="archive-card-context">${project.organization.context}</span>
      <button class="archive-card-expand" aria-label="View project details" aria-expanded="false">
        <span>View Details</span>
        <svg class="expand-icon" width="16" height="16" viewBox="0 0 16 16">
          <path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" fill="none"/>
        </svg>
      </button>
    </div>
    <span class="confidence-badge" data-level="${confidenceLevel}">
      <svg class="badge-icon" width="12" height="12">
        <circle cx="6" cy="6" r="5" fill="currentColor"/>
      </svg>
    </span>
  `;

  // Add expand/collapse behavior
  const expandBtn = card.querySelector('.archive-card-expand');
  expandBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleProjectDetail(project.id);
  });

  // Add keyboard support
  card.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProjectDetail(project.id);
    }
  });

  return card;
}

function generateTechTags(tech) {
  const allTech = [
    ...tech.frameworks.slice(0, 2),
    ...tech.languages.slice(0, 2)
  ];

  return allTech.map(t => {
    const category = getCategoryForTech(t);
    return `<span class="tag tag-${category}">${t}</span>`;
  }).join('');
}
```

---

## 2. Project Detail Panel

### Purpose
Expandable detail view showing complete project information without page navigation.

### HTML Structure
```html
<div class="archive-project-detail" id="detail-canadaindie-music-blog" data-visible="false">
  <div class="detail-overlay" aria-hidden="true"></div>

  <div class="detail-panel" role="dialog" aria-labelledby="detail-title" aria-modal="true">
    <div class="detail-header">
      <h2 id="detail-title">CanadaIndie.com</h2>
      <button class="detail-close" aria-label="Close project details">
        <svg width="24" height="24" viewBox="0 0 24 24">
          <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </button>
    </div>

    <div class="detail-content">
      <div class="detail-grid">
        <!-- Meta Grid -->
        <div class="detail-section detail-meta">
          <div class="meta-item">
            <span class="meta-label">Timeline</span>
            <span class="meta-value">2009–2011</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Role</span>
            <span class="meta-value">Web Developer</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Context</span>
            <span class="meta-value">Personal Project</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Status</span>
            <span class="meta-value">Archived</span>
          </div>
        </div>

        <!-- Description -->
        <div class="detail-section detail-full">
          <h4>Description</h4>
          <p>Music blog platform covering Canadian independent music scene...</p>
        </div>

        <!-- Tech Stack -->
        <div class="detail-section">
          <h4>Tech Stack</h4>
          <div class="tech-list">
            <div class="tech-group">
              <span class="tech-group-label">Languages</span>
              <div class="tags">
                <span class="tag">PHP</span>
                <span class="tag">JavaScript</span>
              </div>
            </div>
            <div class="tech-group">
              <span class="tech-group-label">Frameworks</span>
              <div class="tags">
                <span class="tag">WordPress 3.x</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Responsibilities -->
        <div class="detail-section">
          <h4>Responsibilities</h4>
          <ul class="detail-list">
            <li>Custom WordPress theme development</li>
            <li>Plugin integration and configuration</li>
            <li>Facebook API integration</li>
          </ul>
        </div>

        <!-- Deliverables -->
        <div class="detail-section">
          <h4>Deliverables</h4>
          <ul class="detail-list">
            <li>Custom WordPress theme (indieblog)</li>
            <li>Social media integration</li>
            <li>RSS aggregation system</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
```

### CSS Specifications
```css
.archive-project-detail {
  position: fixed;
  inset: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.archive-project-detail[data-visible="true"] {
  opacity: 1;
  pointer-events: all;
}

.detail-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(4px);
}

.detail-panel {
  position: relative;
  background: var(--color-white);
  border-radius: 16px;
  max-width: 900px;
  max-height: 90vh;
  width: 90%;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  transform: scale(0.95);
  transition: transform 0.3s ease;
}

.archive-project-detail[data-visible="true"] .detail-panel {
  transform: scale(1);
}

.detail-header {
  position: sticky;
  top: 0;
  background: var(--color-white);
  padding: 2rem;
  border-bottom: 1px solid var(--color-light-gray);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 10;
}

.detail-header h2 {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0;
}

.detail-close {
  background: none;
  border: none;
  color: var(--color-gray);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 6px;
  transition: var(--transition-fast);
}

.detail-close:hover {
  background: var(--color-cream);
  color: var(--color-navy);
}

.detail-content {
  padding: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.detail-section h4 {
  font-family: var(--font-body);
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-burgundy);
  font-weight: 600;
  margin: 0;
}

.detail-full {
  grid-column: 1 / -1;
}

.detail-meta {
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-list li {
  padding-left: 1.5rem;
  position: relative;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-gray);
}

.detail-list li::before {
  content: '→';
  position: absolute;
  left: 0;
  color: var(--color-accent-primary);
  font-weight: 600;
}

.tech-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.tech-group-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-gray);
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

/* Responsive */
@media (max-width: 768px) {
  .detail-panel {
    width: 95%;
    max-height: 95vh;
  }

  .detail-header {
    padding: 1.5rem;
  }

  .detail-content {
    padding: 1.5rem;
  }

  .detail-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .detail-meta {
    grid-template-columns: repeat(2, 1fr);
  }
}
```

---

## 3. Timeline Component

### Purpose
Vertical timeline visualizing career progression with project milestones.

### HTML Structure
```html
<div class="career-timeline">
  <div class="timeline-era" data-era="wordpress">
    <div class="era-label">WordPress Era (2009–2015)</div>

    <div class="timeline-year" data-year="2009">
      <div class="year-marker">
        <span class="year-label">2009</span>
        <div class="year-dot"></div>
      </div>

      <div class="timeline-events">
        <div class="timeline-event" data-project-id="canadaindie-music-blog">
          <div class="event-card">
            <h4 class="event-title">CanadaIndie.com</h4>
            <p class="event-description">Music blog platform launch</p>
            <div class="tags">
              <span class="tag">WordPress</span>
              <span class="tag">PHP</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- More years... -->
  </div>

  <!-- More eras... -->
</div>
```

### CSS Specifications
```css
.career-timeline {
  position: relative;
  padding: 4rem 2rem;
  max-width: 900px;
  margin: 0 auto;
}

/* Vertical line */
.career-timeline::before {
  content: '';
  position: absolute;
  left: 50%;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom,
    transparent,
    var(--color-accent-primary),
    var(--color-accent-primary),
    transparent
  );
  transform: translateX(-1px);
}

.timeline-era {
  margin-bottom: 4rem;
}

.era-label {
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-navy);
  margin-bottom: 3rem;
  padding: 1rem 2rem;
  background: var(--color-cream);
  border-radius: 12px;
  display: inline-block;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
}

.timeline-year {
  position: relative;
  margin-bottom: 3rem;
}

.year-marker {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
}

.year-label {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  background: var(--color-white);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 2px solid var(--color-accent-primary);
}

.year-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-accent-primary);
  border: 4px solid var(--color-white);
  box-shadow: 0 0 0 2px var(--color-accent-primary);
}

.timeline-events {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 4rem;
}

.timeline-event {
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

.timeline-event.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Alternate sides */
.timeline-event:nth-child(odd) {
  grid-column: 1;
  justify-self: end;
}

.timeline-event:nth-child(even) {
  grid-column: 2;
  justify-self: start;
}

.event-card {
  background: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: 12px;
  padding: 1.5rem;
  max-width: 350px;
  transition: var(--transition-fast);
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(47, 99, 100, 0.12);
  border-color: var(--color-accent-primary);
}

.event-title {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0 0 0.5rem 0;
}

.event-description {
  font-size: 0.95rem;
  color: var(--color-gray);
  margin: 0 0 1rem 0;
}

/* Responsive */
@media (max-width: 768px) {
  .career-timeline::before {
    left: 2rem;
  }

  .year-marker {
    left: 2rem;
  }

  .timeline-events {
    grid-template-columns: 1fr;
    margin-left: 5rem;
  }

  .timeline-event:nth-child(odd),
  .timeline-event:nth-child(even) {
    grid-column: 1;
    justify-self: start;
  }
}
```

---

## 4. Skills Grid Component

### Purpose
Display 18 skills grouped by category with proficiency indicators.

### HTML Structure
```html
<div class="skills-container">
  <div class="skills-category">
    <h3 class="skills-category-title">
      <span class="category-icon">📦</span>
      CMS
    </h3>

    <div class="skills-grid">
      <div class="skill-card" data-skill="wordpress">
        <div class="skill-header">
          <h4 class="skill-name">WordPress</h4>
          <span class="skill-years">6 years</span>
        </div>

        <div class="skill-meta">
          <span class="skill-projects">4 projects</span>
          <span class="skill-proficiency" data-level="expert">Expert</span>
        </div>

        <div class="skill-bar-container">
          <div class="skill-bar" style="--proficiency: 90%"></div>
        </div>

        <div class="skill-evidence">
          <p>Custom theme development, plugin integration, multi-site management</p>
        </div>
      </div>
      <!-- More skills... -->
    </div>
  </div>
  <!-- More categories... -->
</div>
```

### CSS Specifications
```css
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.skills-category {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.skills-category-title {
  font-family: var(--font-display);
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-navy);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.category-icon {
  font-size: 1.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.skill-card {
  background: var(--color-white);
  border: 1px solid var(--color-light-gray);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  transition: var(--transition-fast);
}

.skill-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(47, 99, 100, 0.12);
  border-color: var(--color-accent-primary);
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.skill-name {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-navy);
  margin: 0;
}

.skill-years {
  font-size: 0.875rem;
  color: var(--color-gray);
  font-weight: 600;
}

.skill-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-projects {
  font-size: 0.875rem;
  color: var(--color-gray);
}

.skill-proficiency {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

.skill-proficiency[data-level="expert"] {
  background: rgba(34, 197, 94, 0.1);
  color: #15803d;
}

.skill-proficiency[data-level="advanced"] {
  background: rgba(59, 130, 246, 0.1);
  color: #1e40af;
}

.skill-proficiency[data-level="intermediate"] {
  background: rgba(234, 179, 8, 0.1);
  color: #a16207;
}

.skill-bar-container {
  width: 100%;
  height: 4px;
  background: var(--color-light-gray);
  border-radius: 2px;
  overflow: hidden;
}

.skill-bar {
  height: 100%;
  width: var(--proficiency);
  background: linear-gradient(to right,
    var(--color-accent-primary),
    var(--color-accent-secondary)
  );
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.skill-evidence {
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--color-gray);
}

.skill-evidence p {
  margin: 0;
}
```

---

## 5. Filter Controls Component

### Purpose
Filter and search archive projects by technology, year, type.

### HTML Structure
```html
<div class="archive-filters">
  <div class="filter-group">
    <label class="filter-label">Technology</label>
    <div class="filter-pills">
      <button class="filter-pill active" data-filter="all">All</button>
      <button class="filter-pill" data-filter="wordpress">WordPress</button>
      <button class="filter-pill" data-filter="javascript">JavaScript</button>
      <button class="filter-pill" data-filter="react">React</button>
      <button class="filter-pill" data-filter="php">PHP</button>
    </div>
  </div>

  <div class="filter-group">
    <label class="filter-label">Era</label>
    <select class="filter-select" data-filter-type="era">
      <option value="all">All Years</option>
      <option value="wordpress-era">2009–2015 (WordPress Era)</option>
      <option value="modern-js">2020–2022 (Modern JS Era)</option>
      <option value="current">2024–Present (Current)</option>
    </select>
  </div>

  <div class="filter-group">
    <label class="filter-label">Search</label>
    <div class="filter-search">
      <input type="search"
             placeholder="Search projects..."
             class="search-input"
             aria-label="Search projects">
      <svg class="search-icon" width="20" height="20" viewBox="0 0 20 20">
        <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-width="2" fill="none"/>
        <path d="M13 13l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
  </div>
</div>
```

### CSS Specifications
```css
.archive-filters {
  background: var(--color-cream);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.filter-label {
  font-size: 0.875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-burgundy);
  font-weight: 600;
}

.filter-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-pill {
  background: var(--color-white);
  border: 1px solid var(--color-light-gray);
  color: var(--color-navy);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition-fast);
}

.filter-pill:hover {
  border-color: var(--color-accent-primary);
  background: rgba(47, 99, 100, 0.05);
}

.filter-pill.active {
  background: var(--color-accent-primary);
  color: var(--color-white);
  border-color: var(--color-accent-primary);
}

.filter-select {
  background: var(--color-white);
  border: 1px solid var(--color-light-gray);
  color: var(--color-navy);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  cursor: pointer;
  transition: var(--transition-fast);
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px rgba(47, 99, 100, 0.1);
}

.filter-search {
  position: relative;
}

.search-input {
  width: 100%;
  background: var(--color-white);
  border: 1px solid var(--color-light-gray);
  color: var(--color-navy);
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.95rem;
  transition: var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-accent-primary);
  box-shadow: 0 0 0 3px rgba(47, 99, 100, 0.1);
}

.search-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-gray);
  pointer-events: none;
}

/* Responsive */
@media (max-width: 768px) {
  .archive-filters {
    padding: 1.5rem;
  }

  .filter-pills {
    max-height: 120px;
    overflow-y: auto;
  }
}
```

---

## Usage Guidelines

### Data Binding
All components should receive data from `window.archiveData` or `data/portfolio-projects.json`.

### Accessibility Checklist
- [ ] All interactive elements have focus states
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] ARIA labels on buttons and inputs
- [ ] Modal dialogs trap focus
- [ ] Filter changes announced to screen readers
- [ ] Color contrast meets WCAG AA (4.5:1 minimum)

### Performance Considerations
- Lazy-load detail panels (don't render until needed)
- Debounce search input (300ms delay)
- Use CSS transforms for animations (GPU-accelerated)
- Limit IntersectionObserver instances

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- No IE11 support required

---

*End of Component Specifications*
