// Fonctions globales pour le modal de recherche (définies en premier)
window.openSearchModal = function() {
    console.log('openSearchModal appelée');
    if (window.wikiSearch) {
        console.log('Utilisation de wikiSearch.openModal()');
        window.wikiSearch.openModal();
    } else {
        // Si WikiSearch n'est pas encore chargé, l'ouvrir manuellement
        console.log('WikiSearch pas disponible, ouverture manuelle');
        const modal = document.getElementById('searchModal');
        console.log('Modal trouvé:', modal);
        if (modal) {
            console.log('Modal styles avant:', window.getComputedStyle(modal).display, window.getComputedStyle(modal).opacity, window.getComputedStyle(modal).zIndex);
            modal.classList.add('open');
            modal.style.display = 'block';
            modal.style.opacity = '1';
            modal.style.visibility = 'visible';
            modal.style.zIndex = '999999';
            modal.style.background = 'rgba(255, 0, 0, 0.5)'; // Rouge pour debug
            document.body.style.overflow = 'hidden';
            console.log('Modal styles après:', window.getComputedStyle(modal).display, window.getComputedStyle(modal).opacity, window.getComputedStyle(modal).zIndex);
            setTimeout(() => {
                const searchInput = document.getElementById('searchInput');
                if (searchInput) searchInput.focus();
            }, 100);
        } else {
            console.error('Modal de recherche introuvable !');

            // Debug: lister tous les éléments avec searchModal
            const allModals = document.querySelectorAll('[id*="search"]');
            console.log('Éléments avec "search" dans l\'ID:', allModals);
        }
    }
};

window.closeSearchModal = function() {
    if (window.wikiSearch) {
        window.wikiSearch.closeModal();
    } else {
        // Fermeture manuelle si WikiSearch n'est pas chargé
        const modal = document.getElementById('searchModal');
        if (modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    }
};

// Système de composants réutilisables
class ComponentLoader {
    constructor() {
        this.currentLang = this.detectLanguage();
        this.basePath = this.getBasePath();
    }

    // Détecte la langue actuelle basée sur l'URL
    detectLanguage() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        // Chercher 'en' ou 'es' dans les parties du chemin
        if (pathParts.includes('en')) return 'en';
        if (pathParts.includes('es')) return 'es';
        return 'fr'; // Français par défaut
    }

    // Détermine le chemin de base pour les composants
    getBasePath() {
        const path = window.location.pathname;
        const pathParts = path.split('/').filter(part => part !== '');
        
        // Si on est dans une langue, calculer le chemin relatif vers components
        if (pathParts.includes('en') || pathParts.includes('es')) {
            const languageIndex = pathParts.findIndex(part => part === 'en' || part === 'es');
            // Compter le nombre de niveaux après la langue
            const levelsAfterLang = pathParts.length - languageIndex - 1;
            
            if (levelsAfterLang > 1) {
                // On est dans un sous-dossier, remonter d'autant de niveaux
                const backLevels = '../'.repeat(levelsAfterLang - 1);
                return `${backLevels}../components`;
            } else {
                // On est directement dans le dossier de langue
                return '../components';
            }
        }
        
        // Pour le français (racine), calculer selon le niveau actuel
        const currentLevel = pathParts.length;
        if (currentLevel > 1) {
            const backLevels = '../'.repeat(currentLevel - 1);
            return `${backLevels}components`;
        }
        
        return '/components';
    }

    // Charge un composant HTML
    async loadComponent(componentName, targetId) {
        try {
            const response = await fetch(`${this.basePath}/${this.currentLang}/${componentName}.html`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            const target = document.getElementById(targetId);
            if (target) {
                target.innerHTML = html;
                
                // Réinitialiser les événements après le chargement
                if (componentName === 'header') {
                    this.initializeHeaderEvents();
                }
            }
        } catch (error) {
            console.error(`Erreur lors du chargement du composant ${componentName}:`, error);
        }
    }

    // Initialise les événements du header après chargement
    initializeHeaderEvents() {
        // Navigation mobile
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        if (hamburger && navMenu) {
            hamburger.addEventListener('click', function() {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Fermer le menu mobile lors du clic sur un lien
            document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }));
        }

        // Sélecteur de langue
        const langBtn = document.getElementById('langBtn');
        const langDropdown = document.getElementById('langDropdown');
        
        if (langBtn && langDropdown) {
            langBtn.addEventListener('click', function() {
                langDropdown.classList.toggle('show');
            });

            // Fermer le dropdown si on clique ailleurs
            document.addEventListener('click', function(event) {
                if (!langBtn.contains(event.target) && !langDropdown.contains(event.target)) {
                    langDropdown.classList.remove('show');
                }
            });

            // Mettre à jour l'affichage de la langue actuelle
            this.updateCurrentLanguageDisplay();
        }
    }

    // Met à jour l'affichage de la langue actuelle
    updateCurrentLanguageDisplay() {
        const currentLangElement = document.getElementById('currentLang');
        if (currentLangElement) {
            const langDisplayMap = {
                'fr': 'FR',
                'en': 'EN', 
                'es': 'ES'
            };
            currentLangElement.textContent = langDisplayMap[this.currentLang] || 'FR';
        }
    }

    // Charge tous les composants
    async loadAllComponents() {
        await Promise.all([
            this.loadComponent('header', 'header-container'),
            this.loadComponent('footer', 'footer-container')
        ]);

        // Ajouter le modal de recherche si pas déjà présent
        this.addSearchModal();

        // Debug: vérifier le bouton de recherche après chargement
        setTimeout(() => {
            const searchBtn = document.querySelector('.search-btn');
            console.log('Bouton de recherche trouvé:', searchBtn);
            if (searchBtn) {
                console.log('Onclick du bouton:', searchBtn.getAttribute('onclick'));

                // Ajouter un event listener supplémentaire pour être sûr
                searchBtn.addEventListener('click', function() {
                    console.log('Bouton de recherche cliqué (event listener)');
                    window.openSearchModal();
                });
            }

            // Test Ctrl+K
            console.log('openSearchModal disponible:', typeof window.openSearchModal);

            // Forcer l'ajout des boutons s'ils ne sont pas présents
            const headerActions = document.querySelector('.header-actions');
            if (headerActions) {
                console.log('Header actions trouvé, vérification des boutons...');

                // Vérifier et ajouter le bouton de thème
                if (!document.querySelector('.theme-toggle') && window.themeSystem) {
                    console.log('Ajout forcé du bouton de thème');
                    window.themeSystem.createThemeToggle();
                }

                // Vérifier et ajouter le bouton de police
                if (!document.querySelector('.font-controls') && window.fontControls) {
                    console.log('Ajout forcé du bouton de police');
                    window.fontControls.createFontControls();
                }
            }
        }, 2000); // Augmenté à 2 secondes pour laisser le temps aux scripts de se charger
    }

    // Ajouter le modal de recherche
    addSearchModal() {
        if (document.getElementById('searchModal')) {
            console.log('Modal de recherche déjà présent');
            return; // Déjà présent
        }

        console.log('Ajout du modal de recherche...');

        const modalHTML = `
            <!-- Search Modal -->
            <div class="search-modal" id="searchModal">
                <div class="search-modal-backdrop" onclick="closeSearchModal()"></div>
                <div class="search-modal-content">
                    <div class="search-modal-header">
                        <h3>Rechercher dans le wiki</h3>
                        <button class="search-modal-close" onclick="closeSearchModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="search-container">
                        <!-- Filtres de recherche -->
                        <div class="search-filters">
                            <button class="filter-btn active" data-filter="all">Tout</button>
                            <button class="filter-btn" data-filter="rules">Règlement</button>
                            <button class="filter-btn" data-filter="guides">Guides</button>
                            <button class="filter-btn" data-filter="jobs">Métiers</button>
                            <button class="filter-btn" data-filter="commands">Commandes</button>
                            <button class="filter-btn" data-filter="faq">FAQ</button>
                        </div>

                        <!-- Barre de recherche -->
                        <div class="search-box">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" class="search-input" placeholder="Rechercher dans le wiki... (ex: règles métier, commandes, etc.)" id="searchInput">
                            <button class="search-clear" id="searchClear">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>

                        <!-- Résultats de recherche -->
                        <div class="search-results" id="searchResults"></div>
                    </div>

                    <!-- Raccourcis clavier -->
                    <div class="search-shortcuts">
                        <span class="shortcut"><kbd>↑</kbd><kbd>↓</kbd> pour naviguer</span>
                        <span class="shortcut"><kbd>Enter</kbd> pour sélectionner</span>
                        <span class="shortcut"><kbd>Esc</kbd> pour fermer</span>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        console.log('Modal de recherche ajouté au DOM');

        // Charger le script de recherche si pas déjà chargé
        if (!document.querySelector('script[src*="search.js"]')) {
            const script = document.createElement('script');
            script.src = '/js/search.js';
            document.head.appendChild(script);
            console.log('Script search.js ajouté');
        } else {
            console.log('Script search.js déjà présent');
        }

        // Charger le script des favoris si pas déjà chargé
        if (!document.querySelector('script[src*="favorites.js"]')) {
            const favScript = document.createElement('script');
            favScript.src = '/js/favorites.js';
            document.head.appendChild(favScript);
            console.log('Script favorites.js ajouté');
        } else {
            console.log('Script favorites.js déjà présent');
        }

        // Charger le script de progression de lecture si pas déjà chargé
        if (!document.querySelector('script[src*="reading-progress.js"]')) {
            const progressScript = document.createElement('script');
            progressScript.src = '/js/reading-progress.js';
            document.head.appendChild(progressScript);
            console.log('Script reading-progress.js ajouté');
        } else {
            console.log('Script reading-progress.js déjà présent');
        }

        // Charger le script du système de thème si pas déjà chargé
        if (!document.querySelector('script[src*="theme-system.js"]')) {
            const themeScript = document.createElement('script');
            themeScript.src = '/js/theme-system.js';
            document.head.appendChild(themeScript);
            console.log('Script theme-system.js ajouté');
        } else {
            console.log('Script theme-system.js déjà présent');
        }

        // Charger le script des améliorations mobiles si pas déjà chargé
        if (!document.querySelector('script[src*="mobile-enhancements.js"]')) {
            const mobileScript = document.createElement('script');
            mobileScript.src = '/js/mobile-enhancements.js';
            document.head.appendChild(mobileScript);
            console.log('Script mobile-enhancements.js ajouté');
        } else {
            console.log('Script mobile-enhancements.js déjà présent');
        }

        // Charger le script des contrôles de police si pas déjà chargé
        if (!document.querySelector('script[src*="font-controls.js"]')) {
            const fontScript = document.createElement('script');
            fontScript.src = '/js/font-controls.js';
            document.head.appendChild(fontScript);
            console.log('Script font-controls.js ajouté');
        } else {
            console.log('Script font-controls.js déjà présent');
        }

        // Charger le script des pages populaires si pas déjà chargé
        if (!document.querySelector('script[src*="popular-pages.js"]')) {
            const popularScript = document.createElement('script');
            popularScript.src = '/js/popular-pages.js';
            document.head.appendChild(popularScript);
            console.log('Script popular-pages.js ajouté');
        } else {
            console.log('Script popular-pages.js déjà présent');
        }
    }
}


// Fonction pour changer de langue
function switchLanguage(targetLang) {
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/').filter(part => part !== '');
    
    let newPath;
    
    // Détecter si on est dans une page de langue (/en/ ou /es/)
    const isInLanguageFolder = pathParts.includes('en') || pathParts.includes('es');
    
    if (targetLang === 'fr') {
        // Retour à la racine pour le français
        if (isInLanguageFolder) {
            // Retirer la langue du chemin
            const languageIndex = pathParts.findIndex(part => part === 'en' || part === 'es');
            const newPathParts = pathParts.slice(languageIndex + 1);
            newPath = '/' + newPathParts.join('/');
        } else {
            // Déjà en français
            newPath = currentPath;
        }
    } else {
        // Aller vers le dossier de langue
        if (isInLanguageFolder) {
            // Remplacer la langue existante
            const languageIndex = pathParts.findIndex(part => part === 'en' || part === 'es');
            pathParts[languageIndex] = targetLang;
            newPath = '/' + pathParts.join('/');
        } else {
            // Ajouter la langue au début du chemin
            if (pathParts.length === 0 || pathParts[0] === 'index.html') {
                newPath = `/${targetLang}/`;
            } else {
                newPath = `/${targetLang}/${pathParts.join('/')}`;
            }
        }
    }
    
    // S'assurer que les pages .html ont bien l'extension si nécessaire
    if (!newPath.endsWith('/') && !newPath.includes('.') && pathParts.length > 0) {
        // Seulement ajouter .html si le chemin original en avait une
        const originalHasExtension = currentPath.includes('.html');
        if (originalHasExtension) {
            newPath += '.html';
        }
    }
    
    // Vérifier si on est sur une page d'index et rediriger vers le dossier
    if (newPath.endsWith('/index.html')) {
        newPath = newPath.replace('/index.html', '/');
    }
    
    window.location.href = newPath;
}

// Initialisation automatique
document.addEventListener('DOMContentLoaded', async function() {
    const loader = new ComponentLoader();
    await loader.loadAllComponents();

    // Autres initialisations
    stickyHeader();
    createBackToTop();

    // Raccourci clavier Ctrl+K pour la recherche
    document.addEventListener('keydown', function(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            openSearchModal();
        }
    });
});

// Changement de style du header lors du scroll
function stickyHeader() {
    const header = document.querySelector('.header');
    
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                header.style.background = 'var(--dark-secondary)';
                header.style.boxShadow = '0 2px 20px rgba(220, 38, 38, 0.2)';
            } else {
                header.style.background = 'var(--dark-secondary)';
                header.style.boxShadow = 'none';
            }
        });
    }
}

// Bouton de retour en haut
function createBackToTop() {
    const backToTopButton = document.createElement('button');
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.className = 'back-to-top';
    backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        font-size: 18px;
        box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
    `;

    document.body.appendChild(backToTopButton);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopButton.style.opacity = '1';
            backToTopButton.style.visibility = 'visible';
        } else {
            backToTopButton.style.opacity = '0';
            backToTopButton.style.visibility = 'hidden';
        }
    });

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopButton.addEventListener('mouseenter', () => {
        backToTopButton.style.transform = 'translateY(-3px)';
    });

    backToTopButton.addEventListener('mouseleave', () => {
        backToTopButton.style.transform = 'translateY(0)';
    });
}

// Smooth scrolling pour les liens d'ancrage
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('a[href^="#"]')) {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        }
    });
});