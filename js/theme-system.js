// Système de thème sombre/clair pour le wiki Capitalyx
class ThemeSystem {
    constructor() {
        this.currentTheme = this.loadTheme();
        this.autoTheme = this.loadAutoTheme();
        this.themes = {
            dark: {
                // Couleurs principales
                '--primary-color': '#dc2626',
                '--secondary-color': '#dc2626',
                '--accent-color': '#fbbf24',
                '--accent-light': '#fef3c7',

                // Couleurs sombres (existantes)
                '--dark-color': '#0f0f0f',
                '--dark-secondary': '#1a1a1a',
                '--dark-tertiary': '#171717',
                '--dark-primary': '#111827',
                '--dark-accent': '#1f2937',

                // Couleurs de texte
                '--text-color': '#f5f5f5',
                '--text-primary': '#f9fafb',
                '--text-secondary': '#d1d5db',
                '--text-light': '#9ca3af',
                '--text-muted': '#6b7280',

                // Couleurs de bordure
                '--border-color': '#374151',
                '--card-bg': '#111827',

                // Couleurs spécifiques
                '--background-primary': '#0f0f0f',
                '--background-secondary': '#1a1a1a',
                '--surface-color': '#1f2937',
                '--hover-color': '#374151'
            },
            light: {
                // Couleurs principales (conservées)
                '--primary-color': '#dc2626',
                '--secondary-color': '#dc2626',
                '--accent-color': '#f59e0b',
                '--accent-light': '#fef3c7',

                // Couleurs claires
                '--dark-color': '#ffffff',
                '--dark-secondary': '#f9fafb',
                '--dark-tertiary': '#f3f4f6',
                '--dark-primary': '#ffffff',
                '--dark-accent': '#f3f4f6',

                // Couleurs de texte
                '--text-color': '#111827',
                '--text-primary': '#111827',
                '--text-secondary': '#374151',
                '--text-light': '#6b7280',
                '--text-muted': '#9ca3af',

                // Couleurs de bordure
                '--border-color': '#d1d5db',
                '--card-bg': '#ffffff',

                // Couleurs spécifiques
                '--background-primary': '#ffffff',
                '--background-secondary': '#f9fafb',
                '--surface-color': '#ffffff',
                '--hover-color': '#f3f4f6'
            }
        };
        this.init();
    }

    // Charger le thème depuis localStorage
    loadTheme() {
        try {
            const saved = localStorage.getItem('wiki-theme');
            return saved || 'dark'; // Dark par défaut
        } catch (error) {
            console.error('Erreur lors du chargement du thème:', error);
            return 'dark';
        }
    }

    // Charger la préférence de thème automatique
    loadAutoTheme() {
        try {
            const saved = localStorage.getItem('wiki-auto-theme');
            return saved === 'true';
        } catch (error) {
            console.error('Erreur lors du chargement de la préférence auto-thème:', error);
            return false;
        }
    }

    // Sauvegarder le thème
    saveTheme() {
        try {
            localStorage.setItem('wiki-theme', this.currentTheme);
            localStorage.setItem('wiki-auto-theme', this.autoTheme.toString());
        } catch (error) {
            console.error('Erreur lors de la sauvegarde du thème:', error);
        }
    }

    // Initialiser le système de thème
    init() {
        this.createThemeToggle();
        this.applyTheme(this.currentTheme);
        this.setupAutoTheme();
        this.addThemeStyles();

        // Appliquer le thème automatique si activé
        if (this.autoTheme) {
            this.updateAutoTheme();
        }
    }

    // Créer le bouton de basculement de thème
    createThemeToggle() {
        // Attendre que le header soit chargé
        setTimeout(() => {
            const headerActions = document.querySelector('.header-actions');
            if (headerActions && !document.querySelector('.theme-toggle')) {
                const themeToggle = document.createElement('div');
                themeToggle.className = 'theme-toggle';
                themeToggle.innerHTML = `
                    <button class="theme-btn" onclick="window.themeSystem?.toggleTheme()" title="Basculer le thème">
                        <i class="fas fa-${this.currentTheme === 'dark' ? 'sun' : 'moon'}"></i>
                    </button>
                    <div class="theme-dropdown" id="themeDropdown">
                        <div class="theme-option" onclick="window.themeSystem?.setTheme('dark')">
                            <i class="fas fa-moon"></i>
                            <span>Sombre</span>
                            <i class="fas fa-check theme-check ${this.currentTheme === 'dark' ? 'active' : ''}"></i>
                        </div>
                        <div class="theme-option" onclick="window.themeSystem?.setTheme('light')">
                            <i class="fas fa-sun"></i>
                            <span>Clair</span>
                            <i class="fas fa-check theme-check ${this.currentTheme === 'light' ? 'active' : ''}"></i>
                        </div>
                        <div class="theme-separator"></div>
                        <div class="theme-option auto-theme" onclick="window.themeSystem?.toggleAutoTheme()">
                            <i class="fas fa-clock"></i>
                            <span>Automatique</span>
                            <i class="fas fa-check theme-check ${this.autoTheme ? 'active' : ''}"></i>
                        </div>
                    </div>
                `;

                // Insérer avant le sélecteur de langue
                headerActions.insertBefore(themeToggle, headerActions.querySelector('.language-selector'));

                // Ajouter les event listeners
                this.setupThemeToggleEvents();
            }
        }, 1000);
    }

    // Configurer les événements du toggle de thème
    setupThemeToggleEvents() {
        const themeBtn = document.querySelector('.theme-btn');
        const themeDropdown = document.getElementById('themeDropdown');

        if (themeBtn && themeDropdown) {
            // Clic long pour ouvrir le dropdown
            let longPressTimer;

            themeBtn.addEventListener('mousedown', () => {
                longPressTimer = setTimeout(() => {
                    themeDropdown.classList.toggle('show');
                }, 500);
            });

            themeBtn.addEventListener('mouseup', () => {
                clearTimeout(longPressTimer);
            });

            themeBtn.addEventListener('mouseleave', () => {
                clearTimeout(longPressTimer);
            });

            // Clic pour basculer directement
            themeBtn.addEventListener('click', (e) => {
                if (!themeDropdown.classList.contains('show')) {
                    this.toggleTheme();
                }
            });

            // Fermer le dropdown si on clique ailleurs
            document.addEventListener('click', (event) => {
                if (!themeBtn.contains(event.target) && !themeDropdown.contains(event.target)) {
                    themeDropdown.classList.remove('show');
                }
            });
        }
    }

    // Ajouter les styles pour le système de thème
    addThemeStyles() {
        if (document.getElementById('theme-system-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'theme-system-styles';
        styles.textContent = `
            .theme-toggle {
                position: relative;
                margin-right: 15px;
            }

            .theme-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 18px;
                cursor: pointer;
                padding: 8px;
                border-radius: 6px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
            }

            .theme-btn:hover {
                background: var(--hover-color);
                color: var(--text-primary);
                transform: scale(1.1);
            }

            .theme-dropdown {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--dark-secondary);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                min-width: 180px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                margin-top: 8px;
            }

            .theme-dropdown.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .theme-option {
                padding: 12px 15px;
                display: flex;
                align-items: center;
                gap: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: var(--text-secondary);
                border-radius: 6px;
                margin: 4px;
            }

            .theme-option:hover {
                background: var(--hover-color);
                color: var(--text-primary);
            }

            .theme-option i:first-child {
                width: 16px;
                text-align: center;
            }

            .theme-option span {
                flex: 1;
                font-size: 14px;
            }

            .theme-check {
                opacity: 0;
                transition: all 0.3s ease;
                color: var(--primary-color);
            }

            .theme-check.active {
                opacity: 1;
            }

            .theme-separator {
                height: 1px;
                background: var(--border-color);
                margin: 4px 8px;
            }

            .auto-theme {
                color: var(--accent-color);
            }

            .auto-theme.active {
                background: rgba(251, 191, 36, 0.1);
            }

            /* Animation de transition de thème */
            body.theme-transition {
                transition: background-color 0.5s ease, color 0.5s ease;
            }

            body.theme-transition * {
                transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease !important;
            }

            /* Styles spécifiques pour le thème clair */
            [data-theme="light"] {
                --shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
                --shadow-red: 0 8px 25px rgba(220, 38, 38, 0.2);
                --shadow-yellow: 0 8px 25px rgba(245, 158, 11, 0.2);
            }

            [data-theme="light"] .main-content {
                background:
                    radial-gradient(circle at 20% 50%, rgba(220, 38, 38, 0.1) 0%, transparent 60%),
                    radial-gradient(circle at 80% 20%, rgba(245, 158, 11, 0.1) 0%, transparent 60%),
                    linear-gradient(to bottom, #ffffff, #f9fafb);
            }

            /* Ajustements pour les images en mode clair */
            [data-theme="light"] .logo {
                filter: brightness(0.8) contrast(1.2);
            }

            [data-theme="light"] .job-image {
                border: 2px solid var(--border-color);
            }

            /* Notification de changement de thème */
            .theme-notification {
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--dark-secondary);
                color: var(--text-primary);
                padding: 12px 20px;
                border-radius: 25px;
                border: 1px solid var(--border-color);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                animation: themeNotificationSlide 0.4s ease-out;
            }

            @keyframes themeNotificationSlide {
                from {
                    opacity: 0;
                    transform: translateX(-50%) translateY(-20px);
                }
                to {
                    opacity: 1;
                    transform: translateX(-50%) translateY(0);
                }
            }

            @media (max-width: 768px) {
                .theme-dropdown {
                    right: -20px;
                    min-width: 160px;
                }

                .theme-btn {
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                }

                .theme-notification {
                    left: 20px;
                    right: 20px;
                    transform: none;
                    font-size: 13px;
                }

                @keyframes themeNotificationSlide {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Appliquer un thème
    applyTheme(themeName) {
        if (!this.themes[themeName]) return;

        const root = document.documentElement;
        const theme = this.themes[themeName];

        // Ajouter la classe de transition temporairement
        document.body.classList.add('theme-transition');

        // Appliquer les variables CSS
        Object.entries(theme).forEach(([property, value]) => {
            root.style.setProperty(property, value);
        });

        // Définir l'attribut data-theme
        root.setAttribute('data-theme', themeName);

        // Mettre à jour l'icône du bouton
        const themeBtn = document.querySelector('.theme-btn i');
        if (themeBtn) {
            themeBtn.className = `fas fa-${themeName === 'dark' ? 'sun' : 'moon'}`;
        }

        // Mettre à jour les indicateurs dans le dropdown
        this.updateThemeDropdown();

        // Retirer la classe de transition après l'animation
        setTimeout(() => {
            document.body.classList.remove('theme-transition');
        }, 500);

        this.currentTheme = themeName;
        this.saveTheme();
    }

    // Mettre à jour le dropdown de thème
    updateThemeDropdown() {
        const checks = document.querySelectorAll('.theme-check');
        checks.forEach(check => {
            check.classList.remove('active');
        });

        // Activer la coche du thème actuel
        const activeOption = document.querySelector(`[onclick*="'${this.currentTheme}'"]`);
        if (activeOption) {
            const check = activeOption.querySelector('.theme-check');
            if (check) check.classList.add('active');
        }

        // Mettre à jour la coche auto-thème
        const autoCheck = document.querySelector('.auto-theme .theme-check');
        if (autoCheck) {
            if (this.autoTheme) {
                autoCheck.classList.add('active');
            } else {
                autoCheck.classList.remove('active');
            }
        }
    }

    // Basculer entre les thèmes
    toggleTheme() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.setTheme(newTheme);
    }

    // Définir un thème spécifique
    setTheme(themeName) {
        if (!this.themes[themeName]) return;

        // Désactiver le thème automatique si on change manuellement
        if (this.autoTheme) {
            this.autoTheme = false;
            this.saveTheme();
        }

        this.applyTheme(themeName);
        this.showThemeNotification(`Thème ${themeName === 'dark' ? 'sombre' : 'clair'} activé`);

        // Fermer le dropdown
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // Basculer le thème automatique
    toggleAutoTheme() {
        this.autoTheme = !this.autoTheme;
        this.saveTheme();
        this.updateThemeDropdown();

        if (this.autoTheme) {
            this.setupAutoTheme();
            this.updateAutoTheme();
            this.showThemeNotification('Thème automatique activé');
        } else {
            this.showThemeNotification('Thème automatique désactivé');
        }

        // Fermer le dropdown
        const dropdown = document.getElementById('themeDropdown');
        if (dropdown) {
            dropdown.classList.remove('show');
        }
    }

    // Configurer le thème automatique
    setupAutoTheme() {
        if (!this.autoTheme) return;

        // Vérifier toutes les heures
        setInterval(() => {
            if (this.autoTheme) {
                this.updateAutoTheme();
            }
        }, 60 * 60 * 1000); // 1 heure

        // Écouter les changements de préférence système
        if (window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
            mediaQuery.addListener(() => {
                if (this.autoTheme) {
                    this.updateAutoTheme();
                }
            });
        }
    }

    // Mettre à jour le thème automatique selon l'heure
    updateAutoTheme() {
        if (!this.autoTheme) return;

        const now = new Date();
        const hour = now.getHours();

        // Thème sombre de 20h à 6h, clair de 6h à 20h
        const shouldBeDark = hour >= 20 || hour < 6;

        // Vérifier aussi les préférences système
        const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

        const newTheme = (shouldBeDark || prefersDark) ? 'dark' : 'light';

        if (newTheme !== this.currentTheme) {
            this.applyTheme(newTheme);

            const timeMessage = shouldBeDark ? 'Mode nuit automatique' : 'Mode jour automatique';
            this.showThemeNotification(timeMessage);
        }
    }

    // Afficher une notification de changement de thème
    showThemeNotification(message) {
        // Retirer les notifications existantes
        document.querySelectorAll('.theme-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'theme-notification';
        notification.innerHTML = `
            <i class="fas fa-palette"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Retirer automatiquement après 2 secondes
        setTimeout(() => {
            notification.style.animation = 'themeNotificationSlide 0.4s ease-out reverse';
            setTimeout(() => notification.remove(), 400);
        }, 2000);
    }

    // Obtenir le thème actuel
    getCurrentTheme() {
        return this.currentTheme;
    }

    // Vérifier si le thème automatique est activé
    isAutoTheme() {
        return this.autoTheme;
    }

    // Exporter les préférences de thème
    exportThemePreferences() {
        return {
            theme: this.currentTheme,
            autoTheme: this.autoTheme,
            exportDate: new Date().toISOString()
        };
    }

    // Importer les préférences de thème
    importThemePreferences(preferences) {
        if (preferences.theme && this.themes[preferences.theme]) {
            this.currentTheme = preferences.theme;
        }
        if (typeof preferences.autoTheme === 'boolean') {
            this.autoTheme = preferences.autoTheme;
        }

        this.applyTheme(this.currentTheme);
        this.saveTheme();

        if (this.autoTheme) {
            this.setupAutoTheme();
            this.updateAutoTheme();
        }
    }
}

// Initialiser le système de thème
document.addEventListener('DOMContentLoaded', () => {
    window.themeSystem = new ThemeSystem();
});