// Améliorations mobiles pour le wiki Capitalyx
class MobileEnhancements {
    constructor() {
        this.isMobile = this.detectMobile();
        this.isTouch = 'ontouchstart' in window;
        this.currentSection = 0;
        this.sections = [];
        this.swipeThreshold = 50;
        this.init();
    }

    // Détecter si on est sur mobile
    detectMobile() {
        return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Initialiser les améliorations mobiles
    init() {
        if (!this.isMobile && !this.isTouch) return;

        this.detectSections();
        this.setupSwipeNavigation();
        this.enhanceMobileMenu();
        this.addMobileControls();
        this.optimizeTouchTargets();
        this.setupPullToRefresh();
        this.addMobileStyles();

        // Réinitialiser sur resize
        window.addEventListener('resize', () => {
            this.isMobile = this.detectMobile();
            if (this.isMobile) {
                this.updateMobileFeatures();
            }
        });
    }

    // Détecter les sections pour la navigation par swipe
    detectSections() {
        // Chercher les sections principales selon le type de page
        const selectors = [
            '.guide-category',
            '.content-section',
            'section[id]',
            '.job-category',
            '.rule-section'
        ];

        this.sections = [];
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.id && !this.sections.find(s => s.id === el.id)) {
                    this.sections.push({
                        id: el.id,
                        element: el,
                        title: this.getSectionTitle(el)
                    });
                }
            });
        });

        // Trier par position dans le document
        this.sections.sort((a, b) => {
            const aPos = a.element.getBoundingClientRect().top + window.scrollY;
            const bPos = b.element.getBoundingClientRect().top + window.scrollY;
            return aPos - bPos;
        });
    }

    // Obtenir le titre d'une section
    getSectionTitle(element) {
        const titleEl = element.querySelector('h1, h2, h3, .category-header h2, .section-title');
        return titleEl ? titleEl.textContent.trim() : 'Section';
    }

    // Configurer la navigation par swipe
    setupSwipeNavigation() {
        if (!this.isTouch || this.sections.length < 2) return;

        let startY = 0;
        let startX = 0;
        let isScrolling = false;

        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
            isScrolling = false;
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!startY || !startX) return;

            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = Math.abs(currentY - startY);
            const diffX = Math.abs(currentX - startX);

            // Si le mouvement est plus vertical qu'horizontal, c'est du scroll
            if (diffY > diffX) {
                isScrolling = true;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!startY || !startX || isScrolling) {
                startY = 0;
                startX = 0;
                return;
            }

            const endX = e.changedTouches[0].clientX;
            const diffX = startX - endX;

            // Swipe horizontal suffisant
            if (Math.abs(diffX) > this.swipeThreshold) {
                if (diffX > 0) {
                    // Swipe vers la gauche - section suivante
                    this.navigateToNextSection();
                } else {
                    // Swipe vers la droite - section précédente
                    this.navigateToPreviousSection();
                }
            }

            startY = 0;
            startX = 0;
        }, { passive: true });

        // Ajouter des indicateurs de swipe
        this.addSwipeIndicators();
    }

    // Naviguer vers la section suivante
    navigateToNextSection() {
        if (this.currentSection < this.sections.length - 1) {
            this.currentSection++;
            this.scrollToSection(this.currentSection);
            this.showNavigationFeedback('Section suivante');
        } else {
            this.showNavigationFeedback('Dernière section atteinte');
        }
    }

    // Naviguer vers la section précédente
    navigateToPreviousSection() {
        if (this.currentSection > 0) {
            this.currentSection--;
            this.scrollToSection(this.currentSection);
            this.showNavigationFeedback('Section précédente');
        } else {
            this.showNavigationFeedback('Première section atteinte');
        }
    }

    // Défiler vers une section
    scrollToSection(index) {
        if (!this.sections[index]) return;

        const element = this.sections[index].element;
        const headerOffset = 80;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });

        this.updateSectionIndicator(index);
    }

    // Ajouter des indicateurs de swipe
    addSwipeIndicators() {
        if (document.querySelector('.swipe-indicators')) return;

        const indicators = document.createElement('div');
        indicators.className = 'swipe-indicators';
        indicators.innerHTML = `
            <div class="swipe-hint">
                <i class="fas fa-hand-paper"></i>
                <span>Glissez pour naviguer</span>
            </div>
            <div class="section-dots">
                ${this.sections.map((_, index) =>
                    `<div class="section-dot ${index === 0 ? 'active' : ''}" onclick="window.mobileEnhancements?.scrollToSection(${index})"></div>`
                ).join('')}
            </div>
        `;

        document.body.appendChild(indicators);

        // Masquer automatiquement après 5 secondes
        setTimeout(() => {
            const hint = indicators.querySelector('.swipe-hint');
            if (hint) {
                hint.style.animation = 'fadeOut 0.5s ease-out forwards';
            }
        }, 5000);
    }

    // Mettre à jour l'indicateur de section
    updateSectionIndicator(activeIndex) {
        const dots = document.querySelectorAll('.section-dot');
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    // Améliorer le menu mobile
    enhanceMobileMenu() {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (!hamburger || !navMenu) return;

        // Améliorer l'animation du hamburger
        hamburger.addEventListener('click', () => {
            // Vibration tactile si supportée
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        });

        // Fermer le menu en glissant vers le haut
        if (this.isTouch) {
            let startY = 0;

            navMenu.addEventListener('touchstart', (e) => {
                startY = e.touches[0].clientY;
            }, { passive: true });

            navMenu.addEventListener('touchend', (e) => {
                const endY = e.changedTouches[0].clientY;
                const diffY = startY - endY;

                // Swipe vers le haut pour fermer
                if (diffY > this.swipeThreshold) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }, { passive: true });
        }
    }

    // Ajouter des contrôles mobiles
    addMobileControls() {
        if (document.querySelector('.mobile-controls')) return;

        const controls = document.createElement('div');
        controls.className = 'mobile-controls';
        controls.innerHTML = `
            <button class="mobile-control-btn quick-search" onclick="window.openSearchModal?.()" title="Recherche rapide">
                <i class="fas fa-search"></i>
            </button>
            <button class="mobile-control-btn quick-favorites" onclick="window.wikiFavorites?.toggleFavoritesModal()" title="Favoris">
                <i class="fas fa-star"></i>
            </button>
            <button class="mobile-control-btn quick-toc" onclick="window.openTOCModal?.()" title="Table des matières">
                <i class="fas fa-list"></i>
            </button>
            <button class="mobile-control-btn scroll-top" onclick="window.scrollTo({top: 0, behavior: 'smooth'})" title="Haut de page">
                <i class="fas fa-arrow-up"></i>
            </button>
        `;

        document.body.appendChild(controls);

        // Afficher/masquer selon le scroll
        this.setupMobileControlsVisibility();
    }

    // Configurer la visibilité des contrôles mobiles
    setupMobileControlsVisibility() {
        const controls = document.querySelector('.mobile-controls');
        if (!controls) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        const updateControls = () => {
            const scrollY = window.scrollY;
            const isScrollingDown = scrollY > lastScrollY;
            const isNearTop = scrollY < 200;

            if (isNearTop) {
                controls.classList.remove('visible');
            } else {
                controls.classList.add('visible');
            }

            // Masquer en scrollant vers le bas, afficher en scrollant vers le haut
            if (isScrollingDown && scrollY > 300) {
                controls.classList.add('hidden');
            } else if (!isScrollingDown) {
                controls.classList.remove('hidden');
            }

            lastScrollY = scrollY;
            ticking = false;
        };

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateControls);
                ticking = true;
            }
        });
    }

    // Optimiser les zones de touche
    optimizeTouchTargets() {
        const links = document.querySelectorAll('a, button, [onclick]');

        links.forEach(link => {
            const rect = link.getBoundingClientRect();
            const minSize = 44; // Taille minimale recommandée pour iOS/Android

            if (rect.width < minSize || rect.height < minSize) {
                link.style.minWidth = `${minSize}px`;
                link.style.minHeight = `${minSize}px`;
                link.style.display = 'inline-flex';
                link.style.alignItems = 'center';
                link.style.justifyContent = 'center';
            }
        });

        // Ajouter plus d'espace entre les éléments interactifs
        this.addTouchSpacing();
    }

    // Ajouter de l'espacement pour le toucher
    addTouchSpacing() {
        const style = document.createElement('style');
        style.textContent = `
            @media (max-width: 768px) {
                .nav-link {
                    padding: 15px 20px !important;
                    margin: 5px 0 !important;
                }

                .guide-item, .job-item {
                    margin-bottom: 20px !important;
                }

                button, .btn {
                    min-height: 44px !important;
                    padding: 12px 20px !important;
                }

                .search-btn, .theme-btn {
                    min-width: 44px !important;
                    min-height: 44px !important;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Configurer le pull-to-refresh
    setupPullToRefresh() {
        if (!this.isTouch) return;

        let startY = 0;
        let isPulling = false;
        let refreshThreshold = 100;

        const createRefreshIndicator = () => {
            if (document.querySelector('.pull-refresh-indicator')) return;

            const indicator = document.createElement('div');
            indicator.className = 'pull-refresh-indicator';
            indicator.innerHTML = `
                <div class="refresh-spinner">
                    <i class="fas fa-redo-alt"></i>
                </div>
                <span class="refresh-text">Relâchez pour actualiser</span>
            `;
            document.body.insertBefore(indicator, document.body.firstChild);
        };

        document.addEventListener('touchstart', (e) => {
            if (window.scrollY === 0) {
                startY = e.touches[0].clientY;
                createRefreshIndicator();
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (window.scrollY === 0 && startY > 0) {
                const currentY = e.touches[0].clientY;
                const diff = currentY - startY;

                if (diff > 0) {
                    isPulling = true;
                    const indicator = document.querySelector('.pull-refresh-indicator');

                    if (indicator) {
                        const scale = Math.min(diff / refreshThreshold, 1);
                        indicator.style.transform = `translateY(${diff * 0.5}px) scale(${scale})`;
                        indicator.style.opacity = scale;

                        if (diff > refreshThreshold) {
                            indicator.classList.add('ready');
                        } else {
                            indicator.classList.remove('ready');
                        }
                    }
                }
            }
        }, { passive: true });

        document.addEventListener('touchend', () => {
            if (isPulling) {
                const indicator = document.querySelector('.pull-refresh-indicator');

                if (indicator && indicator.classList.contains('ready')) {
                    this.performRefresh();
                } else if (indicator) {
                    indicator.style.transform = 'translateY(-100px)';
                    indicator.style.opacity = '0';
                    setTimeout(() => indicator.remove(), 300);
                }

                isPulling = false;
                startY = 0;
            }
        }, { passive: true });
    }

    // Effectuer l'actualisation
    performRefresh() {
        const indicator = document.querySelector('.pull-refresh-indicator');

        if (indicator) {
            indicator.classList.add('refreshing');
            indicator.querySelector('.refresh-text').textContent = 'Actualisation...';

            // Simpler refresh - just reload after animation
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    }

    // Ajouter les styles mobiles
    addMobileStyles() {
        if (document.getElementById('mobile-enhancements-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'mobile-enhancements-styles';
        styles.textContent = `
            @media (max-width: 768px) {
                .swipe-indicators {
                    position: fixed;
                    bottom: 20px;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 1000;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 10px;
                }

                .swipe-hint {
                    background: var(--dark-secondary);
                    color: var(--text-secondary);
                    padding: 8px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    border: 1px solid var(--border-color);
                    animation: fadeInUp 0.5s ease-out;
                }

                .section-dots {
                    display: flex;
                    gap: 8px;
                }

                .section-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: var(--text-muted);
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .section-dot.active {
                    background: var(--primary-color);
                    transform: scale(1.3);
                }

                .mobile-controls {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    z-index: 999;
                    transform: translateX(100px);
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .mobile-controls.visible {
                    transform: translateX(0);
                    opacity: 1;
                }

                .mobile-controls.hidden {
                    transform: translateX(100px);
                    opacity: 0;
                }

                .mobile-control-btn {
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .mobile-control-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
                }

                .mobile-control-btn:active {
                    transform: scale(0.95);
                }

                .quick-search {
                    background: #3b82f6;
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
                }

                .quick-favorites {
                    background: #f59e0b;
                    box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
                }

                .quick-toc {
                    background: #10b981;
                    box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
                }

                .pull-refresh-indicator {
                    position: fixed;
                    top: -100px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: var(--dark-secondary);
                    color: var(--text-primary);
                    padding: 15px 20px;
                    border-radius: 25px;
                    border: 1px solid var(--border-color);
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    z-index: 10000;
                    transition: all 0.3s ease;
                    opacity: 0;
                }

                .pull-refresh-indicator.ready {
                    background: var(--primary-color);
                    color: white;
                }

                .pull-refresh-indicator.refreshing .refresh-spinner {
                    animation: spin 1s linear infinite;
                }

                .refresh-spinner {
                    width: 20px;
                    height: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .refresh-text {
                    font-size: 14px;
                    font-weight: 600;
                }

                /* Améliorations du menu mobile */
                .nav-menu {
                    padding: 20px 0;
                }

                .nav-menu.active {
                    animation: slideInFromTop 0.3s ease-out;
                }

                .hamburger.active .bar:nth-child(1) {
                    transform: translateY(8px) rotate(45deg);
                }

                .hamburger.active .bar:nth-child(2) {
                    opacity: 0;
                }

                .hamburger.active .bar:nth-child(3) {
                    transform: translateY(-8px) rotate(-45deg);
                }

                /* Amélioration des zones de touche */
                .search-btn, .theme-btn, .lang-btn {
                    min-width: 44px;
                    min-height: 44px;
                    touch-action: manipulation;
                }

                /* Feedback visuel pour les interactions tactiles */
                .nav-link:active,
                .mobile-control-btn:active,
                button:active {
                    transform: scale(0.95);
                    transition: transform 0.1s ease;
                }
            }

            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(20px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes fadeOut {
                to {
                    opacity: 0;
                    transform: translateY(-20px);
                }
            }

            @keyframes slideInFromTop {
                from {
                    transform: translateY(-100%);
                }
                to {
                    transform: translateY(0);
                }
            }

            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;

        document.head.appendChild(styles);
    }

    // Afficher un feedback de navigation
    showNavigationFeedback(message) {
        // Retirer les feedbacks existants
        document.querySelectorAll('.navigation-feedback').forEach(f => f.remove());

        const feedback = document.createElement('div');
        feedback.className = 'navigation-feedback';
        feedback.innerHTML = `
            <i class="fas fa-hand-point-right"></i>
            <span>${message}</span>
        `;

        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--dark-secondary);
            color: var(--text-primary);
            padding: 12px 20px;
            border-radius: 25px;
            border: 1px solid var(--border-color);
            z-index: 10001;
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 14px;
            animation: fadeInScale 0.3s ease-out;
            pointer-events: none;
        `;

        // Ajouter les styles d'animation
        if (!document.getElementById('navigation-feedback-styles')) {
            const styles = document.createElement('style');
            styles.id = 'navigation-feedback-styles';
            styles.textContent = `
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(feedback);

        // Vibration tactile
        if (navigator.vibrate) {
            navigator.vibrate(30);
        }

        // Retirer automatiquement après 1.5 secondes
        setTimeout(() => {
            feedback.style.animation = 'fadeInScale 0.3s ease-out reverse';
            setTimeout(() => feedback.remove(), 300);
        }, 1500);
    }

    // Mettre à jour les fonctionnalités mobiles
    updateMobileFeatures() {
        // Redétecter les sections si la page a changé
        this.detectSections();

        // Réinitialiser les indicateurs
        const indicators = document.querySelector('.swipe-indicators');
        if (indicators) {
            indicators.remove();
            this.addSwipeIndicators();
        }
    }

    // Méthodes utilitaires publiques
    getCurrentSection() {
        return this.currentSection;
    }

    getTotalSections() {
        return this.sections.length;
    }

    getSections() {
        return this.sections;
    }
}

// Initialiser les améliorations mobiles
document.addEventListener('DOMContentLoaded', () => {
    window.mobileEnhancements = new MobileEnhancements();
});