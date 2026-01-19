# Archive Data Directory

This directory contains structured JSON data for the career archive.

## Files

### portfolio-projects.json (14KB)
Complete project data for 7 high-confidence projects spanning 2009-2026.

**Structure:** Array of project objects following `core-project-object.json` schema

### project-summary.json (4.9KB)
Quick reference table with project metadata and recommendations.

### skills-extracted.json (6.7KB)
18 skills extracted across 4 categories (CMS, Languages, Platforms, Practices).

## Usage

These files are loaded by archive pages and embedded inline for fast rendering.

## Data Quality

All projects have confidence scores ranging from 0.85-1.00 (high quality).

## Source

Data generated from filesystem analysis on 2026-01-19.
See `documentation/analysis-results.md` for detailed findings.
