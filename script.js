// Toggle mobile menu
function toggleMenu() {
    const nav = document.querySelector('.nav');
    const hamburger = document.querySelector('.hamburger');
    
    nav.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Toggle aria-expanded for accessibility
    const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';
    hamburger.setAttribute('aria-expanded', !isExpanded);
}

// Initialize mobile menu accessibility
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    hamburger.setAttribute('aria-expanded', 'false');
    hamburger.setAttribute('aria-label', 'Toggle menu');
}

// Open modal function
function openModal(category) {
    const modal = document.getElementById(`${category}-modal`);
    modal.style.display = "block";
    document.body.style.overflow = "hidden";
    
    // Add keyboard event listener for modal
    document.addEventListener('keydown', handleModalKeyPress);
    
    // Set focus to the modal for accessibility
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('.close');
    closeBtn.focus();
}

// Close modal function
function closeModal(category) {
    const modal = document.getElementById(`${category}-modal`);
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    
    // Remove keyboard event listener
    document.removeEventListener('keydown', handleModalKeyPress);
    
    // Update accessibility attributes
    modal.setAttribute('aria-hidden', 'true');
    
    // Pause all videos in the modal
    const videos = modal.querySelectorAll('video');
    videos.forEach(video => {
        video.pause();
    });
}

// Handle keyboard events for modals
function handleModalKeyPress(event) {
    // Close modal on ESC key
    if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal[style="display: block;"]');
        if (openModal) {
            const category = openModal.id.split('-')[0];
            closeModal(category);
        }
    }
    
    // Trap focus inside modal
    if (event.key === 'Tab') {
        const openModal = document.querySelector('.modal[style="display: block;"]');
        if (openModal) {
            const focusableElements = openModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
            const firstElement = focusableElements[0];
            const lastElement = focusableElements[focusableElements.length - 1];
            
            if (event.shiftKey && document.activeElement === firstElement) {
                lastElement.focus();
                event.preventDefault();
            } else if (!event.shiftKey && document.activeElement === lastElement) {
                firstElement.focus();
                event.preventDefault();
            }
        }
    }
}

// Close modal when clicking outside content
function setupModalCloseOnClickOutside() {
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            const category = event.target.id.split('-')[0];
            closeModal(category);
        }
    });
}

// Initialize category card animations
function initCategoryCardAnimations() {
    const cards = document.querySelectorAll('.category-cards');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

// Pause videos when they're not visible
function setupVideoVisibilityObserver() {
    const videos = document.querySelectorAll('.modal video');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.paused) {
                    // entry.target.play();
                }
            } else {
                if (!entry.target.paused) {
                    entry.target.pause();
                }
            }
        });
    }, { threshold: 0.5 });
    
    videos.forEach(video => {
        observer.observe(video);
    });
}

// Initialize smooth scrolling for anchor links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Document ready function
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initMobileMenu();
    setupModalCloseOnClickOutside();
    initCategoryCardAnimations();
    setupVideoVisibilityObserver();
    initSmoothScrolling();
    
    // Add hover effect to gallery items
    const galleryItems = document.querySelectorAll('.gallery-item');
    galleryItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = '';
            this.style.boxShadow = '';
        });
    });
    
    // Add focus styles for accessibility
    const focusableElements = document.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusableElements.forEach(el => {
        el.addEventListener('focus', function() {
            this.style.outline = `2px solid ${getComputedStyle(document.documentElement).getPropertyValue('--accent')}`;
            this.style.outlineOffset = '2px';
        });
        
        el.addEventListener('blur', function() {
            this.style.outline = '';
        });
    });
});