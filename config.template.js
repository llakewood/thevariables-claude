// Configuration Template
// This file gets processed by build.js to inject environment variables
const config = {
    web3formsAccessKey: '{{WEB3FORMS_ACCESS_KEY}}',
    formRedirectUrl: '{{FORM_REDIRECT_URL}}',
    contactEmail: '{{CONTACT_EMAIL}}',
    siteUrl: '{{SITE_URL}}'
};

// Make config available globally
window.siteConfig = config;