// Initialisation des composants et de la page
document.addEventListener('DOMContentLoaded', async function() {
    // Charger les composants header et footer
    const componentLoader = new ComponentLoader();
    await componentLoader.loadAllComponents();
    
    // Les événements du header sont maintenant initialisés par ComponentLoader
    // Les autres fonctionnalités de la page peuvent être ajoutées ici
});

// Smooth scrolling pour les liens d'ancrage
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Changement de style du header lors du scroll
function stickyHeader() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(15, 15, 15, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(220, 38, 38, 0.2)';
        } else {
            header.style.background = 'rgba(15, 15, 15, 0.95)';
            header.style.boxShadow = 'none';
        }
    });
}

// Bouton de retour en haut (optionnel)
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

// Initialisation de toutes les fonctions
document.addEventListener('DOMContentLoaded', function() {
    stickyHeader();
    createBackToTop();
});

// Gestion des erreurs d'images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.addEventListener('error', function() {
            // Remplacer par une image par défaut ou masquer
            this.style.display = 'none';
            console.warn('Image non trouvée:', this.src);
        });
    });
});