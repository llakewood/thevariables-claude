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
}

// Run validation
try {
    validateArchiveData();
} catch (error) {
    console.error('❌ Validation failed:', error.message);
    process.exit(1);
}
