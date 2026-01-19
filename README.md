# The Variables Co. Website

A modern, distinctive website for The Variables Co. technical consultancy featuring editorial-inspired design, bold typography, and sophisticated animations.

## Design Features

- **Strategic Editorial Aesthetic**: Inspired by high-end design publications with bold typography and asymmetric layouts
- **Brand Colors**: Navy blue, cream, green, and burgundy palette reflecting the existing brand
- **Typography**: Fraunces (editorial serif) for headings, Outfit (geometric sans-serif) for body text
- **Animations**: Smooth scroll-triggered animations, parallax effects, and micro-interactions
- **Fully Responsive**: Optimized for desktop, tablet, and mobile devices

## Structure

### Main Page (index.html)
- **Hero Section**: Bold introduction with animated grid visual
- **Services**: Three core service offerings with detailed descriptions
- **Approach**: Company philosophy and statistics
- **Work**: Portfolio showcase with four real projects (links to case studies)
- **Testimonial**: Client feedback section
- **Contact**: Multi-channel contact information with working form

### About Us Page (about.html)
- Company mission and vision
- Core values
- Leadership information
- Call to action

### Services Page (services.html)
- Detailed service descriptions with anchors
- Three core service sections: Strategy (#strategy), Development (#development), Support (#support)
- Philosophy and approach
- Call to action

### Utility Pages
- **404 Page (404.html)**: Custom error page with helpful navigation
- **Thank You Page (thank-you.html)**: Post-form submission confirmation page

### Case Study Pages
All case studies use real content from The Variables Co. portfolio:

- **Little Red Coffee** (work-little-red-coffee.html): Small business startup launch with branding, Square POS, Weebly e-commerce, and grant funding
- **John Howard Society Ontario** (work-john-howard.html): Prison Visitation Guide transformation from PDF to searchable WordPress web application
- **Circular Materials** (work-circular-materials.html): Security rescue mission for compromised website under 17K daily bot attacks
- **GOCACTUS Design Inc.** (work-gocactus.html): Agency support model for managing legacy WordPress portfolio during business transition

Each case study includes:
- Real project details and context
- Actual challenges faced
- Solutions implemented
- Measurable results
- Technologies and services used

## Getting Started

### Quick Start (No Build)
Simply open `index.html` in a web browser to view the site.

### With Contact Form (Recommended)
1. Configure your Web3Forms access key in `.env`
2. Run the build: `npm run build`
3. Open `index.html` in a web browser

See `SETUP-INSTRUCTIONS.md` for detailed setup instructions.

## Customization

### Updating Colors
Edit CSS variables in `styles.css`:
```css
:root {
    --color-navy: #1a2332;
    --color-cream: #eae5d9;
    --color-green: #004a0e;
    --color-burgundy: #ab3414;
}
```

### Updating Content
- Edit text directly in `index.html`
- Replace placeholder work items with actual project images
- Update contact information (email, phone, location)

### Form Integration
The contact form currently logs to console. To connect to your backend:
1. Open `script.js`
2. Find the form handling section
3. Replace `console.log` with your API endpoint

## Project Structure

```
/
├── css/                        # Stylesheets
│   ├── styles.css             # Main styles
│   ├── work-case-study.css    # Case study styles
│   └── icons.css              # Icon system documentation
├── js/                         # JavaScript files
│   ├── config.js              # Generated config (from build)
│   └── script.js              # Main JavaScript
├── index.html                  # Homepage
├── about.html                  # About Us page
├── services.html               # Services page
├── work-*.html                 # Case study pages (4 files)
├── 404.html                    # Error page
├── thank-you.html              # Form success page
├── build.js                    # Build script
├── .env                        # Environment variables (not committed)
└── README.md                   # This file
```

## Documentation

- `SETUP-INSTRUCTIONS.md` - Setup guide including Node.js installation
- `DEPLOYMENT.md` - Deployment guide for production
- `SECURITY.md` - Security considerations for Web3Forms

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Credits

Design and development for The Variables Co.
Fonts: Fraunces by Undercase Type, Outfit by Rodrigo Fuenzalida