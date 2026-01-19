#!/usr/bin/env node

/**
 * Archive Build Validation Script
 * Validates JSON structure and generates metadata
 *
 * Usage: node build-archive.js
 */

const fs = require('fs');
const path = require('path');

function validateArchiveData() {
    console.log('🔍 Validating archive data...\n');

    // Check if data directory exists
    const dataDir = path.join(__dirname, 'data');
    if (!fs.existsSync(dataDir)) {
        console.error('❌ Error: /data/ directory not found!');
        console.log('📝 Please run Phase 1 setup first');
        process.exit(1);
    }

    // Check portfolio-projects.json
    const projectsPath = path.join(dataDir, 'portfolio-projects.json');
    if (!fs.existsSync(projectsPath)) {
        console.error('❌ Missing: data/portfolio-projects.json');
        process.exit(1);
    }

    const projects = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
    console.log(`✅ Found ${projects.length} projects`);

    // Validate structure
    let invalidCount = 0;
    projects.forEach((p, index) => {
        if (!p.id || !p.title || !p.timeline) {
            console.error(`❌ Invalid project structure at index ${index}: ${p.title || 'Unknown'}`);
            invalidCount++;
        }
    });

    if (invalidCount > 0) {
        console.error(`\n❌ Found ${invalidCount} invalid projects`);
        process.exit(1);
    }

    console.log('✅ All projects valid');

    // Check project-summary.json
    const summaryPath = path.join(dataDir, 'project-summary.json');
    if (!fs.existsSync(summaryPath)) {
        console.error('❌ Missing: data/project-summary.json');
        process.exit(1);
    }

    const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
    console.log(`✅ Summary has ${summary.summary.total_candidates} total candidates`);

    // Check skills-extracted.json
    const skillsPath = path.join(dataDir, 'skills-extracted.json');
    if (!fs.existsSync(skillsPath)) {
        console.error('❌ Missing: data/skills-extracted.json');
        process.exit(1);
    }

    const skills = JSON.parse(fs.readFileSync(skillsPath, 'utf8'));
    console.log(`✅ Found ${skills.length} skills`);

    console.log('\n✨ Archive data validation complete!\n');

    // Generate some useful stats
    console.log('📊 Data Summary:');
    console.log(`   Projects: ${projects.length}`);
    console.log(`   Skills: ${skills.length}`);
    console.log(`   Confidence scores: ${projects.map(p => p.confidence_score).join(', ')}`);

    const avgConfidence = projects.reduce((sum, p) => sum + p.confidence_score, 0) / projects.length;
    console.log(`   Average confidence: ${avgConfidence.toFixed(2)}`);

    console.log('\n✅ All checks passed!');

    return { projects, skills };
}

function injectDataIntoHTML(projects, skills) {
    console.log('\n📝 Injecting data into HTML files...\n');

    // Transform projects to match frontend expectations
    const transformedProjects = projects.map(p => ({
        id: p.id,
        title: p.title,
        description: p.description,
        timeline: formatTimeline(p.timeline),
        technology_stack: extractTechStack(p.tech),
        confidence_score: p.confidence_score,
        role: p.role && p.role.title ? p.role.title : null,
        key_achievements: p.responsibilities || [],
        technologies_used: p.deliverables || [],
        project_type: Array.isArray(p.project_type) ? p.project_type.join(', ') : p.project_type
    }));

    // Create data object
    const dataObject = {
        projects: transformedProjects,
        skills: skills
    };

    // Read archive HTML files
    const archiveFiles = ['archive/index.html', 'archive/timeline.html', 'archive/skills.html'];

    archiveFiles.forEach(filePath => {
        const fullPath = path.join(__dirname, filePath);
        if (!fs.existsSync(fullPath)) {
            console.log(`⚠️  Skipping ${filePath} (not found)`);
            return;
        }

        let html = fs.readFileSync(fullPath, 'utf8');

        // Find and replace the window.archiveData placeholder
        const dataString = JSON.stringify(dataObject, null, 2);
        const replacement = `window.archiveData = ${dataString};`;

        if (html.includes('window.archiveData')) {
            // Match the entire archiveData object including nested structures
            html = html.replace(/window\.archiveData\s*=\s*\{[\s\S]*?\};/m, replacement);
        } else {
            // If not found, inject before closing body tag
            html = html.replace(
                /<script src=".*\/js\/archive\.js"/,
                `<script>\n        ${replacement}\n    </script>\n    <script src="../js/archive.js"`
            );
        }

        fs.writeFileSync(fullPath, html);
        console.log(`✅ Updated ${filePath}`);
    });

    console.log('\n✨ Data injection complete!');
}

function formatTimeline(timeline) {
    if (typeof timeline === 'string') return timeline;
    if (timeline.start_year && timeline.end_year) {
        return `${timeline.start_year}-${timeline.end_year}`;
    }
    if (timeline.start_year) {
        return `${timeline.start_year}-present`;
    }
    return 'Unknown';
}

function extractTechStack(tech) {
    if (!tech) return [];

    const stack = [];
    if (tech.cms && Array.isArray(tech.cms)) stack.push(...tech.cms);
    if (tech.frameworks && Array.isArray(tech.frameworks)) stack.push(...tech.frameworks);
    if (tech.languages && Array.isArray(tech.languages)) stack.push(...tech.languages);
    if (tech.platforms && Array.isArray(tech.platforms)) stack.push(...tech.platforms);

    return [...new Set(stack)]; // Remove duplicates
}

// Run validation and injection
try {
    const { projects, skills } = validateArchiveData();
    injectDataIntoHTML(projects, skills);
} catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
}
