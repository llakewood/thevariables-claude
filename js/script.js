// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const navHeight = document.querySelector('.nav').offsetHeight;
            const targetPosition = target.offsetTop - navHeight;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
const nav = document.querySelector('.nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        nav.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.08)';
    } else {
        nav.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animate service cards
document.querySelectorAll('.service-card').forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(card);
});

// Animate work items
document.querySelectorAll('.work-item').forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
    observer.observe(item);
});

// Animate principles
document.querySelectorAll('.principle').forEach((principle, index) => {
    principle.style.opacity = '0';
    principle.style.transform = 'translateX(-30px)';
    principle.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
    observer.observe(principle);
});

// Animate stats
document.querySelectorAll('.approach-stat').forEach((stat, index) => {
    stat.style.opacity = '0';
    stat.style.transform = 'translateX(30px)';
    stat.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.15}s`;
    observer.observe(stat);
});

// Form handling with Web3Forms
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    // Inject access key and redirect URL from config
    if (window.siteConfig) {
        // Set access key
        const accessKeyInput = document.getElementById('web3forms-access-key');
        if (accessKeyInput && window.siteConfig.web3formsAccessKey) {
            accessKeyInput.value = window.siteConfig.web3formsAccessKey;
        }

        // Set redirect URL (use relative path for local, or full URL for production)
        const redirectInput = document.getElementById('form-redirect-url');
        if (redirectInput && window.siteConfig.formRedirectUrl) {
            // Use relative path for local development
            redirectInput.value = 'thank-you.html';
        }
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const button = contactForm.querySelector('.form-submit');
        const originalText = button.textContent;

        // Disable button and show loading state
        button.disabled = true;
        button.textContent = 'Sending...';
        button.style.opacity = '0.7';

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                // Show success message briefly
                if (formStatus) {
                    formStatus.style.display = 'block';
                    formStatus.style.color = '#059669';
                    formStatus.style.padding = '1rem';
                    formStatus.style.background = '#f0fdf4';
                    formStatus.style.borderRadius = '8px';
                    formStatus.textContent = 'Thank you! Redirecting...';
                }

                button.textContent = 'Message Sent!';
                button.style.background = '#059669';

                // Redirect to thank you page after brief delay
                setTimeout(() => {
                    window.location.href = 'thank-you.html';
                }, 1500);
            } else {
                throw new Error(data.message || 'Something went wrong');
            }
        } catch (error) {
            // Show error message
            console.error('Form submission error:', error);

            if (formStatus) {
                formStatus.style.display = 'block';
                formStatus.style.color = '#dc2626';
                formStatus.style.padding = '1rem';
                formStatus.style.background = '#fef2f2';
                formStatus.style.borderRadius = '8px';
                formStatus.textContent = 'Oops! There was a problem sending your message. Please try again or email us directly at info@thevariables.com';
            }

            button.textContent = originalText;
            button.style.opacity = '';
            button.disabled = false;
        }
    });
}

// Parallax effect for hero visual
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.3}px)`;
    }
});

// Add hover effect to work items
document.querySelectorAll('.work-item').forEach(item => {
    const image = item.querySelector('.work-image');

    item.addEventListener('mouseenter', () => {
        image.style.transform = 'scale(1.05)';
        image.style.transition = 'transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    item.addEventListener('mouseleave', () => {
        image.style.transform = 'scale(1)';
    });
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let current = 0;
    const increment = target / (duration / 16);
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// Observe stats for counter animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const number = entry.target.querySelector('.stat-number');
            const text = number.textContent;

            if (text === '∞') return;

            const value = parseInt(text);
            if (value) {
                number.textContent = '0+';
                animateCounter(number, value);
            }

            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.approach-stat').forEach(stat => {
    statsObserver.observe(stat);
});

// Mobile menu toggle (if needed in future)
// This is a placeholder for mobile menu functionality
const createMobileMenu = () => {
    const isMobile = window.innerWidth <= 768;
    if (isMobile) {
        // Add mobile menu logic here if needed
    }
};

window.addEventListener('resize', createMobileMenu);
createMobileMenu();

// Add cursor effect on interactive elements
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
        document.body.style.cursor = 'pointer';
    });

    element.addEventListener('mouseleave', () => {
        document.body.style.cursor = 'default';
    });
});

// Animate contact methods on hover
document.querySelectorAll('.contact-method').forEach(method => {
    const icon = method.querySelector('.method-icon');

    method.addEventListener('mouseenter', () => {
        icon.style.transform = 'rotate(5deg) scale(1.1)';
        icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    method.addEventListener('mouseleave', () => {
        icon.style.transform = 'rotate(0) scale(1)';
    });
});

// Log a welcome message
console.log('%c✨ The Variables Co.', 'font-size: 24px; font-weight: bold; color: #1a2332;');
console.log('%cDigital Strategists creating meaningful change', 'font-size: 14px; color: #ab3414;');
console.log('%cInterested in working with us? Visit #contact', 'font-size: 12px; color: #6b7280;');