// ===== LANDING PAGE SYSTEM =====
// File ini menangani rendering landing page dari data localStorage

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Loading landing page...');
    
    // Load dan render data
    renderLandingPage();
    
    // Show admin quick access jika sudah login
    showAdminQuickAccess();
    
    console.log('✅ Landing page loaded');
});

// ===== RENDER FUNCTIONS =====

/**
 * Render semua konten landing page
 */
function renderLandingPage() {
    const data = getLandingPageData();
    
    if (!data) {
        console.warn('No landing page data found, using defaults');
        return;
    }
    
    // Render hero section
    renderHeroSection(data.hero);
    
    // Render about section
    renderAboutSection(data.about);
    
    // Render contact section
    renderContactSection(data.contact);
    
    console.log('📄 Landing page rendered');
}

/**
 * Get landing page data dari localStorage
 */
function getLandingPageData() {
    try {
        const data = localStorage.getItem('landingPageData');
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Error getting landing page data:', error);
        return null;
    }
}

/**
 * Render hero section
 */
function renderHeroSection(heroData) {
    if (!heroData) return;
    
    // Update title
    const titleEl = document.getElementById('heroTitle');
    if (titleEl && heroData.title) {
        titleEl.textContent = heroData.title;
        animateElement(titleEl);
    }
    
    // Update subtitle
    const subtitleEl = document.getElementById('heroSubtitle');
    if (subtitleEl && heroData.subtitle) {
        subtitleEl.textContent = heroData.subtitle;
        animateElement(subtitleEl);
    }
    
    // Update description
    const descriptionEl = document.getElementById('heroDescription');
    if (descriptionEl && heroData.description) {
        descriptionEl.textContent = heroData.description;
        animateElement(descriptionEl);
    }
    
    // Update image
    const imageEl = document.getElementById('heroImage');
    if (imageEl && heroData.image) {
        imageEl.src = heroData.image;
        imageEl.alt = heroData.title || 'Hero Image';
    }
    
    // Update CTA button
    const ctaButton = document.getElementById('heroCTAButton');
    const ctaText = document.getElementById('heroCTAText');
    
    if (ctaButton && heroData.ctaLink) {
        ctaButton.href = heroData.ctaLink;
    }
    
    if (ctaText && heroData.ctaText) {
        ctaText.textContent = heroData.ctaText;
    }
    
    // Update page title
    if (heroData.title) {
        document.getElementById('pageTitle').textContent = heroData.title;
    }
}

/**
 * Render about section
 */
function renderAboutSection(aboutData) {
    if (!aboutData) return;
    
    // Update title
    const titleEl = document.getElementById('aboutTitle');
    if (titleEl && aboutData.title) {
        titleEl.textContent = aboutData.title;
    }
    
    // Update content (support multiple paragraphs)
    const contentEl = document.getElementById('aboutContent');
    if (contentEl && aboutData.content) {
        // Split by newlines and create paragraphs
        const paragraphs = aboutData.content.split('\n').filter(p => p.trim());
        contentEl.innerHTML = paragraphs.map(p => `<p>${p}</p>`).join('');
    }
    
    // Update image
    const imageEl = document.getElementById('aboutImage');
    if (imageEl && aboutData.image) {
        imageEl.src = aboutData.image;
        imageEl.alt = aboutData.title || 'About Image';
    }
}

/**
 * Render contact section
 */
function renderContactSection(contactData) {
    if (!contactData) return;
    
    // Update email
    const emailEl = document.getElementById('contactEmail');
    if (emailEl && contactData.email) {
        emailEl.textContent = contactData.email;
    }
    
    // Update phone
    const phoneEl = document.getElementById('contactPhone');
    if (phoneEl && contactData.phone) {
        phoneEl.textContent = contactData.phone;
    }
    
    // Update address
    const addressEl = document.getElementById('contactAddress');
    if (addressEl && contactData.address) {
        addressEl.textContent = contactData.address;
    }
}

// ===== ADMIN QUICK ACCESS =====

/**
 * Show admin quick access jika sudah login
 */
function showAdminQuickAccess() {
    // Cek apakah user sudah login
    if (typeof isAuthenticated === 'function' && isAuthenticated()) {
        const quickAccess = document.getElementById('adminQuickAccess');
        if (quickAccess) {
            quickAccess.style.display = 'block';
            animateElement(quickAccess);
        }
    }
}

// ===== ANIMATION HELPERS =====

/**
 * Animate element dengan fade in
 */
function animateElement(element) {
    if (!element) return;
    
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        element.style.transition = 'all 0.6s ease';
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }, 100);
}

// ===== SMOOTH SCROLL =====

// Smooth scroll untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Skip jika href hanya "#"
        if (href === '#') return;
        
        e.preventDefault();
        
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== NAVBAR SCROLL EFFECT =====

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
});

// ===== INTERSECTION OBSERVER (Animate on scroll) =====

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
        }
    });
}, observerOptions);

// Observe sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== CONSOLE INFO =====
console.log(`
╔════════════════════════════════════════╗
║  Landing Page System Ready 🌐          ║
╚════════════════════════════════════════╝

📚 Features:
- Dynamic content from localStorage
- Smooth animations
- Responsive design
- Admin quick access (if logged in)

💾 Data loaded from: landingPageData
`);
