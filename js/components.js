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