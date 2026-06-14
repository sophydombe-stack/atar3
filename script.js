document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // Theme Toggle (Dark / Light Mode)
    // ==========================================================================
    const themeToggleBtn = document.getElementById('themeToggle');
    const bodyElement = document.body;
    const themeIcon = themeToggleBtn.querySelector('i');

    // Retrieve theme preference from localStorage or default to dark
    const currentTheme = localStorage.getItem('theme') || 'dark';
    
    if (currentTheme === 'light') {
        bodyElement.classList.remove('dark-theme');
        bodyElement.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        bodyElement.classList.remove('light-theme');
        bodyElement.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            // Switch to light theme
            bodyElement.classList.remove('dark-theme');
            bodyElement.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            // Switch to dark theme
            bodyElement.classList.remove('light-theme');
            bodyElement.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    // ==========================================================================
    // Mobile Navigation Drawer Menu
    // ==========================================================================
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    mobileToggle.addEventListener('click', () => {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link highlighting on scroll
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 150)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // CV Tab Switcher (Experience vs Education)
    // ==========================================================================
    const tabButtons = document.querySelectorAll('.cv-tab-btn');
    const tabContents = document.querySelectorAll('.cv-tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // Remove active class from buttons and contents
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // Add active class to selected button and content
            button.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // ==========================================================================
    // Portfolio Filter Logic
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filterValue = button.getAttribute('data-filter');

            // Active button styling
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // Filter project cards with transition effect
            projectCards.forEach(card => {
                const cardCategory = card.getAttribute('data-category');
                
                // Reset card transition properties
                card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

                if (filterValue === 'all' || cardCategory === filterValue) {
                    // Show card
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    // Hide card
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ==========================================================================
    // Contact Form Submission & Validation
    // ==========================================================================
    const contactForm = document.getElementById('contactForm');
    const formFeedback = document.getElementById('formFeedback');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (name === '' || email === '' || message === '') {
            showFeedback('אנא מלא/י את כל השדות הדרושים.', 'error');
            return;
        }

        // Simulating form submission (e.g. email sending)
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = submitButton.innerHTML;
        submitButton.innerHTML = 'שולח... <i class="fa-solid fa-spinner fa-spin" style="margin-right: 8px;"></i>';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.innerHTML = originalBtnText;
            submitButton.disabled = false;
            
            showFeedback('תודה! ההודעה שלך נשלחה בהצלחה. נחזור אליך בהקדם.', 'success');
            contactForm.reset();
        }, 1500);
    });

    function showFeedback(text, status) {
        formFeedback.innerText = text;
        formFeedback.className = `form-feedback ${status}`;
        
        // Hide feedback after 5 seconds
        setTimeout(() => {
            formFeedback.style.display = 'none';
        }, 5000);
    }

    // ==========================================================================
    // Scroll Reveal (using Intersection Observer)
    // ==========================================================================
    const revealElements = [
        ...document.querySelectorAll('.section-header'),
        ...document.querySelectorAll('.about-grid > div'),
        ...document.querySelectorAll('.timeline-item'),
        ...document.querySelectorAll('.project-card'),
        ...document.querySelectorAll('.resource-col'),
        ...document.querySelectorAll('.contact-info-card'),
        ...document.querySelectorAll('.contact-form-wrapper')
    ];

    // Initial styles for animations
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(40px)';
        el.style.transition = 'opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // Once element is revealed, unobserve it
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });
});
