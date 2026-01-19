/**
 * Archive Page Logic
 * The Variables Co. - Career Archive
 *
 * Handles rendering and interactions for archive pages:
 * - Project grid with filtering
 * - Timeline visualization
 * - Skills showcase
 *
 * Created: 2026-01-19
 */

// Global state
let allProjects = [];
let filteredProjects = [];
let currentFilters = {
    search: '',
    tech: '',
    year: ''
};

/**
 * Initialize archive page
 */
function initArchive() {
    // Load data from window.archiveData
    if (!window.archiveData || !window.archiveData.projects) {
        console.error('Archive data not found');
        return;
    }

    allProjects = window.archiveData.projects;
    filteredProjects = [...allProjects];

    // Render initial projects
    renderProjects(filteredProjects);

    // Setup event listeners
    setupFilterListeners();
    setupModalListeners();
}

/**
 * Render project cards to the grid
 */
function renderProjects(projects) {
    const grid = document.getElementById('project-grid');
    const noResults = document.getElementById('no-results');

    if (!grid) return;

    if (projects.length === 0) {
        grid.style.display = 'none';
        noResults.style.display = 'block';
        return;
    }

    grid.style.display = 'grid';
    noResults.style.display = 'none';

    grid.innerHTML = projects.map(project => createProjectCard(project)).join('');

    // Add click listeners to cards
    grid.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.projectId;
            const project = allProjects.find(p => p.id === projectId);
            if (project) {
                showProjectDetail(project);
            }
        });
    });
}

/**
 * Create HTML for a single project card
 */
function createProjectCard(project) {
    const tech = project.technology_stack || [];
    const primaryTech = tech.slice(0, 3); // Show first 3 technologies
    const confidence = Math.round(project.confidence_score * 100);

    return `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-card-header">
                <h3 class="project-card-title">${project.title}</h3>
                <div class="project-card-timeline">${project.timeline}</div>
            </div>

            <div class="project-card-body">
                <p class="project-card-description">${project.description}</p>

                <div class="project-card-tech">
                    ${primaryTech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                    ${tech.length > 3 ? `<span class="tech-badge">+${tech.length - 3} more</span>` : ''}
                </div>
            </div>

            <div class="project-card-footer">
                <div class="confidence-badge">
                    <span>Confidence</span>
                    <div class="confidence-bar">
                        <div class="confidence-fill" style="width: ${confidence}%"></div>
                    </div>
                </div>
                <span class="view-details">View Details</span>
            </div>
        </div>
    `;
}

/**
 * Filter projects based on current criteria
 */
function filterProjects(criteria) {
    const { search, tech, year } = criteria;

    filteredProjects = allProjects.filter(project => {
        // Search filter
        if (search) {
            const searchLower = search.toLowerCase();
            const matchesTitle = project.title.toLowerCase().includes(searchLower);
            const matchesDesc = project.description.toLowerCase().includes(searchLower);
            const matchesTech = project.technology_stack.some(t =>
                t.toLowerCase().includes(searchLower)
            );

            if (!matchesTitle && !matchesDesc && !matchesTech) {
                return false;
            }
        }

        // Technology filter
        if (tech && !project.technology_stack.includes(tech)) {
            return false;
        }

        // Year filter
        if (year) {
            const projectYear = extractYearFromTimeline(project.timeline);
            if (!matchesYearFilter(projectYear, year)) {
                return false;
            }
        }

        return true;
    });

    renderProjects(filteredProjects);
}

/**
 * Extract start year from timeline string
 */
function extractYearFromTimeline(timeline) {
    const match = timeline.match(/\d{4}/);
    return match ? parseInt(match[0]) : null;
}

/**
 * Check if project year matches filter
 */
function matchesYearFilter(projectYear, filterYear) {
    if (!projectYear) return false;

    const year = parseInt(filterYear);

    if (year === 2024) return projectYear >= 2024;
    if (year === 2020) return projectYear >= 2020 && projectYear <= 2023;
    if (year === 2015) return projectYear >= 2015 && projectYear <= 2019;
    if (year === 2010) return projectYear >= 2010 && projectYear <= 2014;
    if (year === 2009) return projectYear === 2009;

    return true;
}

/**
 * Setup filter event listeners
 */
function setupFilterListeners() {
    const searchInput = document.getElementById('search');
    const techFilter = document.getElementById('tech-filter');
    const yearFilter = document.getElementById('year-filter');
    const resetButton = document.getElementById('reset-filters');
    const resetFromEmpty = document.getElementById('reset-from-empty');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentFilters.search = e.target.value;
            filterProjects(currentFilters);
        });
    }

    if (techFilter) {
        techFilter.addEventListener('change', (e) => {
            currentFilters.tech = e.target.value;
            filterProjects(currentFilters);
        });
    }

    if (yearFilter) {
        yearFilter.addEventListener('change', (e) => {
            currentFilters.year = e.target.value;
            filterProjects(currentFilters);
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }

    if (resetFromEmpty) {
        resetFromEmpty.addEventListener('click', resetFilters);
    }
}

/**
 * Reset all filters
 */
function resetFilters() {
    currentFilters = { search: '', tech: '', year: '' };

    const searchInput = document.getElementById('search');
    const techFilter = document.getElementById('tech-filter');
    const yearFilter = document.getElementById('year-filter');

    if (searchInput) searchInput.value = '';
    if (techFilter) techFilter.value = '';
    if (yearFilter) yearFilter.value = '';

    filterProjects(currentFilters);
}

/**
 * Show project detail modal
 */
function showProjectDetail(project) {
    const modal = document.getElementById('project-modal');
    const modalBody = document.getElementById('modal-body');

    if (!modal || !modalBody) return;

    const confidence = Math.round(project.confidence_score * 100);
    const tech = project.technology_stack || [];

    modalBody.innerHTML = `
        <div class="modal-header">
            <h2 class="modal-title" id="modal-title">${project.title}</h2>
            <div class="modal-timeline">📅 ${project.timeline}</div>
            <div class="modal-tech">
                ${tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
            </div>
        </div>

        <div class="modal-body">
            <div class="modal-section">
                <h3 class="modal-section-title">Overview</h3>
                <p>${project.description}</p>
            </div>

            ${project.role ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Role</h3>
                    <p>${project.role}</p>
                </div>
            ` : ''}

            ${project.key_achievements && project.key_achievements.length > 0 ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Key Achievements</h3>
                    <ul>
                        ${project.key_achievements.map(a => `<li>${a}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${project.technologies_used && project.technologies_used.length > 0 ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Technologies</h3>
                    <ul>
                        ${project.technologies_used.map(t => `<li>${t}</li>`).join('')}
                    </ul>
                </div>
            ` : ''}

            ${project.project_type ? `
                <div class="modal-section">
                    <h3 class="modal-section-title">Project Type</h3>
                    <p>${project.project_type}</p>
                </div>
            ` : ''}

            <div class="modal-confidence">
                <span class="modal-confidence-label">Data Confidence:</span>
                <div class="confidence-bar">
                    <div class="confidence-fill" style="width: ${confidence}%"></div>
                </div>
                <span class="modal-confidence-value">${confidence}%</span>
            </div>
        </div>
    `;

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

/**
 * Hide project detail modal
 */
function hideProjectDetail() {
    const modal = document.getElementById('project-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

/**
 * Setup modal event listeners
 */
function setupModalListeners() {
    const modal = document.getElementById('project-modal');
    const closeButton = modal?.querySelector('.modal-close');
    const overlay = modal?.querySelector('.modal-overlay');

    if (closeButton) {
        closeButton.addEventListener('click', hideProjectDetail);
    }

    if (overlay) {
        overlay.addEventListener('click', hideProjectDetail);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            hideProjectDetail();
        }
    });
}

/**
 * Render timeline view
 */
function renderTimeline(projects) {
    const timeline = document.getElementById('timeline');
    if (!timeline) return;

    // Sort projects by year (most recent first)
    const sorted = [...projects].sort((a, b) => {
        const yearA = extractYearFromTimeline(a.timeline);
        const yearB = extractYearFromTimeline(b.timeline);
        return yearB - yearA;
    });

    timeline.innerHTML = sorted.map(project => {
        const year = extractYearFromTimeline(project.timeline);
        const tech = project.technology_stack.slice(0, 3);

        return `
            <div class="timeline-item" data-project-id="${project.id}">
                <div class="timeline-year">${year}</div>
                <div class="timeline-card">
                    <h3 class="timeline-card-title">${project.title}</h3>
                    <p class="timeline-card-description">${project.description}</p>
                    <div class="project-card-tech">
                        ${tech.map(t => `<span class="tech-badge">${t}</span>`).join('')}
                    </div>
                </div>
            </div>
        `;
    }).join('');

    // Add click listeners
    timeline.querySelectorAll('.timeline-item').forEach(item => {
        item.addEventListener('click', () => {
            const projectId = item.dataset.projectId;
            const project = projects.find(p => p.id === projectId);
            if (project) {
                showProjectDetail(project);
            }
        });
    });
}

/**
 * Render skills grid
 */
function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!container) return;

    // Group skills by category
    const grouped = skills.reduce((acc, skill) => {
        const category = skill.category || 'Other';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    container.innerHTML = Object.entries(grouped).map(([category, categorySkills]) => `
        <div class="skills-category">
            <h2 class="skills-category-title">${category}</h2>
            <div class="skills-grid">
                ${categorySkills.map(skill => `
                    <div class="skill-card">
                        <div class="skill-card-header">
                            <h3 class="skill-card-name">${skill.skill}</h3>
                            <span class="skill-card-years">${skill.years_experience} years</span>
                        </div>
                        <p class="skill-card-description">${skill.description || 'Technology used across multiple projects'}</p>
                        <div class="skill-card-projects">
                            <strong>Projects:</strong> ${skill.project_count || 0}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `).join('');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    console.log('Archive page initialized');

    // Detect which archive page we're on
    const path = window.location.pathname;

    if (path.includes('timeline.html')) {
        // Timeline page
        if (window.archiveData && window.archiveData.projects) {
            renderTimeline(window.archiveData.projects);
            setupModalListeners();
        }
    } else if (path.includes('skills.html')) {
        // Skills page
        if (window.archiveData && window.archiveData.skills) {
            renderSkills(window.archiveData.skills);
        }
    } else {
        // Default: Projects grid page
        initArchive();
    }
});
