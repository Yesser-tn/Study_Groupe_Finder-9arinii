document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    var AOS = {
        init: function(options) {
            // Mock AOS initialization
            console.log('AOS Initialized with options:', options);
        }
    };
    AOS.init({
        duration: 1000,
        once: true,
        offset: 100
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Add/remove background color based on scroll position
        if (scrollTop > 50) {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            navbar.style.boxShadow = 'none';
        }

        lastScrollTop = scrollTop;
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                name: this.querySelector('input[type="text"]').value,
                email: this.querySelector('input[type="email"]').value,
                message: this.querySelector('textarea').value
            };

            // Validate form data
            if (!formData.name || !formData.email || !formData.message) {
                showNotification('Please fill in all fields', 'error');
                return;
            }

            if (!isValidEmail(formData.email)) {
                showNotification('Please enter a valid email address', 'error');
                return;
            }

            // Simulate form submission
            showNotification('Message sent successfully!', 'success');
            contactForm.reset();
        });
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    // Notification system
    function showNotification(message, type = 'success') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;

        // Add notification styles
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.padding = '15px 25px';
        notification.style.borderRadius = '5px';
        notification.style.color = 'white';
        notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
        notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        notification.style.transition = 'all 0.3s ease';
        notification.style.zIndex = '1000';

        // Add to document
        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Mobile menu toggle
    const createMobileMenu = () => {
        const navbar = document.querySelector('.navbar');
        const navLinks = document.querySelector('.nav-links');
        
        // Create hamburger button
        const hamburger = document.createElement('button');
        hamburger.className = 'mobile-menu-btn';
        hamburger.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        // Add styles for mobile menu button
        const style = document.createElement('style');
        style.textContent = `
            .mobile-menu-btn {
                display: none;
                background: none;
                border: none;
                cursor: pointer;
                padding: 10px;
            }

            .mobile-menu-btn span {
                display: block;
                width: 25px;
                height: 3px;
                background-color: #6c63ff;
                margin: 5px 0;
                transition: all 0.3s ease;
            }

            @media (max-width: 768px) {
                .mobile-menu-btn {
                    display: block;
                }

                .nav-links {
                    display: none;
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background-color: white;
                    padding: 1rem;
                    flex-direction: column;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }

                .nav-links.active {
                    display: flex;
                }

                .mobile-menu-btn.active span:nth-child(1) {
                    transform: rotate(45deg) translate(8px, 8px);
                }

                .mobile-menu-btn.active span:nth-child(2) {
                    opacity: 0;
                }

                .mobile-menu-btn.active span:nth-child(3) {
                    transform: rotate(-45deg) translate(7px, -7px);
                }
            }
        `;

        document.head.appendChild(style);
        navbar.appendChild(hamburger);

        // Toggle menu
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navbar.contains(e.target) && navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    };

    createMobileMenu();

    // Add loading animation for images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('load', function() {
            this.classList.add('loaded');
        });
    });

    // Add hover effect for feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            this.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        });
    });

    // Add scroll progress indicator
    const addScrollProgress = () => {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        
        const style = document.createElement('style');
        style.textContent = `
            .scroll-progress {
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(to right, #6c63ff, #5a52cc);
                z-index: 1001;
                transition: width 0.2s ease;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (window.scrollY / windowHeight) * 100;
            progressBar.style.width = `${scrolled}%`;
        });
    };

    addScrollProgress();

    // Enhanced slideshow functionality
    function initializeSlideshow() {
        const slideshow = document.getElementById('heroSlideshow');
        
        // Array of background images with titles
        const backgrounds = [
            {
                url: 'study-group-background.jpg',
                title: 'Study Together'
            },
            {
                url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3',
                title: 'Collaborate'
            },
            {
                url: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3',
                title: 'Learn'
            },
            {
                url: 'https://images.unsplash.com/photo-1616587226960-4a03badbe8bf?ixlib=rb-4.0.3',
                title: 'Succeed'
            }
        ];

        // Create slideshow container
        const slideshowContainer = document.createElement('div');
        slideshowContainer.className = 'slideshow-container';

        // Create progress bar
        const progressContainer = document.createElement('div');
        progressContainer.className = 'slideshow-progress';
        const progressBar = document.createElement('div');
        progressBar.className = 'slideshow-progress-bar';
        progressContainer.appendChild(progressBar);
        slideshow.appendChild(progressContainer);

        // Create slides
        backgrounds.forEach((bg, index) => {
            const slide = document.createElement('div');
            slide.className = `slideshow-item ${index === 0 ? 'active' : ''}`;
            slide.style.backgroundImage = `url(${bg.url})`;
            slideshowContainer.appendChild(slide);
        });

        slideshow.appendChild(slideshowContainer);

        let currentSlide = 0;
        const slides = document.querySelectorAll('.slideshow-item');
        const slideDuration = 6000; // 6 seconds per slide

        function updateProgress(progress) {
            progressBar.style.width = `${progress * 100}%`;
        }

        function nextSlide() {
            // Reset progress bar
            progressBar.style.transition = 'none';
            updateProgress(0);
            
            // Remove active class from current slide
            slides[currentSlide].classList.remove('active');
            
            // Update current slide index
            currentSlide = (currentSlide + 1) % slides.length;
            
            // Add active class to new slide
            slides[currentSlide].classList.add('active');
            
            // Restart progress bar animation
            setTimeout(() => {
                progressBar.style.transition = `width ${slideDuration}ms linear`;
                updateProgress(1);
            }, 50);
        }

        // Preload images for smooth transitions
        function preloadImages() {
            backgrounds.forEach(bg => {
                const img = new Image();
                img.src = bg.url;
            });
        }

        // Initialize slideshow
        function startSlideshow() {
            // Start progress bar animation
            progressBar.style.transition = `width ${slideDuration}ms linear`;
            updateProgress(1);

            // Set interval for slide changes
            setInterval(nextSlide, slideDuration);
        }

        // Initialize
        preloadImages();
        startSlideshow();

        // Optional: Pause on hover
        slideshow.addEventListener('mouseenter', () => {
            progressBar.style.animationPlayState = 'paused';
        });

        slideshow.addEventListener('mouseleave', () => {
            progressBar.style.animationPlayState = 'running';
        });
    }
    
    initializeSlideshow();
});