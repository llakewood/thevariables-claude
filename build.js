#!/usr/bin/env node

/**
 * Simple build script to inject environment variables into the website
 * Usage: node build.js
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnv() {
    const envPath = path.join(__dirname, '.env');

    if (!fs.existsSync(envPath)) {
        console.error('❌ Error: .env file not found!');
        console.log('📝 Please copy .env.example to .env and add your values');
        process.exit(1);
    }

    const envFile = fs.readFileSync(envPath, 'utf8');
    const env = {};

    envFile.split('\n').forEach(line => {
        // Skip comments and empty lines
        if (line.startsWith('#') || !line.trim()) return;

        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            env[key.trim()] = valueParts.join('=').trim();
        }
    });

    return env;
}

// Replace placeholders in template
function processTemplate(template, env) {
    let output = template;

    Object.keys(env).forEach(key => {
        const placeholder = `{{${key}}}`;
        output = output.replace(new RegExp(placeholder, 'g'), env[key]);
    });

    return output;
}

// Main build function
function build() {
    console.log('🚀 Building The Variables Co. website...\n');

    try {
        // Load environment variables
        const env = loadEnv();
        console.log('✅ Loaded environment variables');

        // Check if access key is set
        if (env.WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY_HERE' || !env.WEB3FORMS_ACCESS_KEY) {
            console.warn('⚠️  Warning: WEB3FORMS_ACCESS_KEY not set in .env');
            console.log('   Form submissions will not work until you add your Web3Forms access key\n');
        }

        // Create js directory if it doesn't exist
        const jsDir = path.join(__dirname, 'js');
        if (!fs.existsSync(jsDir)) {
            fs.mkdirSync(jsDir, { recursive: true });
        }

        // Process config template
        const configTemplate = fs.readFileSync(path.join(__dirname, 'config.template.js'), 'utf8');
        const configOutput = processTemplate(configTemplate, env);
        fs.writeFileSync(path.join(jsDir, 'config.js'), configOutput);
        console.log('✅ Generated js/config.js');

        // Process index.html to add config.js script
        const indexPath = path.join(__dirname, 'index.html');
        let indexHtml = fs.readFileSync(indexPath, 'utf8');

        // Check if config.js is already included
        if (!indexHtml.includes('js/config.js') && !indexHtml.includes('config.js')) {
            indexHtml = indexHtml.replace(
                '</head>',
                '    <script src="js/config.js"></script>\n</head>'
            );
            fs.writeFileSync(indexPath, indexHtml);
            console.log('✅ Added js/config.js to index.html');
        }

        console.log('\n✨ Build complete!\n');
        console.log('📋 Next steps:');
        console.log('   1. Make sure your .env file has your Web3Forms access key');
        console.log('   2. Deploy all files to your web server:');
        console.log('      - All HTML files');
        console.log('      - css/ directory');
        console.log('      - js/ directory');
        console.log('   3. Test the contact form\n');

    } catch (error) {
        console.error('❌ Build failed:', error.message);
        process.exit(1);
    }
}

// Run build
build();