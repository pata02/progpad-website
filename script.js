document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const mobileNav = document.querySelector('.mobile-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
    const allNavButtons = document.querySelectorAll('[data-section]');
    const markers = document.querySelectorAll('.marker');
    const connector = document.getElementById('connector');
    const showBtn = document.getElementById('show-video');
    const popup = document.getElementById('video-bg');
    const closeBtn = document.getElementById('close-video');
    const iframe = popup.querySelector('iframe');
    const defaultSrc = iframe.src;

    mobileMenuBtn.addEventListener('click', function() {
        mobileMenuBtn.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    // =======================
    // Reveal Animation Delay
    // =======================
    document.querySelectorAll('.reveal').forEach((el, i) => {
        el.style.animationDelay = `${i * 0.1}s`;
    });

    // =======================
    // Video Popup Controls
    // =======================
    function openVideo() {
        iframe.src = defaultSrc;
        popup.style.display = 'flex';
    }
    function closeVideo() {
        popup.style.display = 'none';
        iframe.src = '';
    }
    showBtn.addEventListener('click', openVideo);
    closeBtn.addEventListener('click', closeVideo);
    window.addEventListener('keydown', e => {
        if (e.key === 'Escape') closeVideo();
    });
    popup.addEventListener('mousedown', e => {
        if (e.target === popup) closeVideo();
    });

    // =======================
    // Marker Tooltip & Connector Logic
    // =======================
    markers.forEach(marker => {
        const tooltip = marker.nextElementSibling; // Select the tooltip related to this marker

        function showConnector() {
            // Hide all tooltips first
            markers.forEach(m => {
                const t = m.nextElementSibling;
                t.style.opacity = '0';
                t.style.display = 'none';
            });

            // Show this tooltip
            tooltip.style.display = 'block';
            tooltip.style.opacity = '1';

            // 2. Then show connector
            const markerX = marker.offsetLeft;
            const markerY = marker.offsetTop;
            const tooltipX = tooltip.offsetLeft;
            const tooltipY = tooltip.offsetTop;
            const dx = tooltipX - markerX;
            const dy = tooltipY - markerY;
            const length = Math.hypot(dx, dy) + 5;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);

            connector.style.left = `${markerX}px`;
            connector.style.top = `${markerY}px`;
            connector.style.width = `${length}px`;
            connector.style.transform = `rotate(${angle}deg)`;
            connector.style.display = 'block';

            requestAnimationFrame(() => {
                connector.style.opacity = '1';
            });
        }

        function hideConnector() {
            // 1. Hide connector first
            connector.style.opacity = '0';
            connector.style.display = 'none';

            // 2. Then hide tooltip (last thing)
            tooltip.style.opacity = '0';
            tooltip.style.display = 'none';
        }

        marker.addEventListener('pointerenter', (e) => {
            if (e.pointerType === 'mouse') {
                showConnector();
            }
        });

        marker.addEventListener('pointerleave', hideConnector);

        marker.addEventListener('click', e => {
            e.stopPropagation();
            showConnector();
            markers.forEach(m => m.classList.remove('active'));
            marker.classList.add('active');
        });
    });
    document.addEventListener('click', e => {
        if (!e.target.closest('.marker')) {
            markers.forEach(marker => {
                const tooltip = marker.nextElementSibling;
                tooltip.style.opacity = '0';
                tooltip.style.display = 'none';
            });
            connector.style.display = 'none';
            connector.style.opacity = '0';
            markers.forEach(m => m.classList.remove('active'));
        }
    });
    window.addEventListener('scroll', () => {
        markers.forEach(marker => {
            const tooltip = marker.nextElementSibling;
            tooltip.style.opacity = '0';
            tooltip.style.display = 'none';
        });
        connector.style.display = 'none';
        connector.style.opacity = '0';
        markers.forEach(m => m.classList.remove('active'));
    });
    

    // =======================
    // Navigation Transparency on Scroll
    // =======================
    function handleNavTransparency() {
        const nav = document.querySelector('.nav');
        if (window.scrollY > 10) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }

    // =======================
    // Section Navigation & Highlight
    // =======================
    function setActiveSection(targetSection) {
        navLinks.forEach(link => link.classList.remove('active'));
        mobileNavLinks.forEach(link => link.classList.remove('active'));
        navLinks.forEach(link => {
            if (link.dataset.section === targetSection) {
                link.classList.add('active');
            }
        });
        mobileNavLinks.forEach(link => {
            if (link.dataset.section === targetSection) {
                link.classList.add('active');
            }
        });
    }
    function scrollToSection(sectionId) {
        mobileMenuBtn.classList.remove('active');
        mobileNav.classList.remove('active');
        

        setTimeout(() => {
            if (sectionId === 'home') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const element = document.getElementById(sectionId);
                if (element) {
                    const navHeight = document.querySelector('.nav').offsetHeight;
                    window.scrollTo({
                        top: element.offsetTop - navHeight,
                        behavior: 'smooth'
                    });
                }
            }
        }, 10);
    }
    allNavButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetSection = this.dataset.section;
            setActiveSection(targetSection);
            scrollToSection(targetSection);
        });
    });

    // =======================
    // Active Section on Scroll
    // =======================
    function handleScroll() {
        const sections = ['home', 'product', 'founders', 'contact'];
        const navHeight = document.querySelector('.nav').offsetHeight;
        const scrollPosition = window.scrollY + navHeight + 100;
        let currentSection = 'home';
        sections.forEach(id => {
            const el = document.getElementById(id);
            if (el && scrollPosition >= el.offsetTop && scrollPosition < el.offsetTop + el.offsetHeight) {
                currentSection = id;
            }
        });
        if (window.scrollY < 100) currentSection = 'home';
        setActiveSection(currentSection);
    }
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            handleScroll();
            handleNavTransparency();
        }, 10);
    });
    handleScroll();

    // =======================
    // Responsive Navigation Reset
    // =======================
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            mobileMenuBtn.classList.remove('active');
            mobileNav.classList.remove('active');
        }
    });

    // =======================
    // Intersection Observer Animations
    // =======================
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -15px 0px' };
    const observer = new IntersectionObserver(entries => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.scale = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    ['.feature-card', '.founder-card', '.contact-box'].forEach(selector => {
        document.querySelectorAll(selector).forEach((el, i) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = `opacity 0.8s ease ${i*0.1}s, transform 1.2s ease-out ${i*0.1}s`;
            observer.observe(el);
        });
    });
    document.querySelectorAll('.timeline-text').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.transform = 'translateX(20px)';
        el.style.transition = `opacity 0.8s ease ${i*0.1}s, transform 0.8s ease ${i*0.1}s`;
        observer.observe(el);
    });
    document.querySelectorAll('.marker-dot').forEach((el, i) => {
        el.style.opacity = '0';
        el.style.scale = '0.2';
        el.style.transition = `opacity 0.3s ease ${i*0.03}s, scale 1s ease-out ${i*0.03}s`;
        observer.observe(el);
    });
});