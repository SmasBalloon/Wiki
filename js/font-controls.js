// Contrôles de taille de police pour le wiki Capitalyx
class FontControls {
    constructor() {
        this.currentSize = this.loadFontSize();
        this.fontSizes = {
            'very-small': {
                scale: 0.75,
                name: 'Très petit',
                icon: 'fas fa-font',
                baseSize: '12px'
            },
            'small': {
                scale: 0.9,
                name: 'Petit',
                icon: 'fas fa-font',
                baseSize: '14px'
            },
            'normal': {
                scale: 1.0,
                name: 'Normal',
                icon: 'fas fa-font',
                baseSize: '16px'
            },
            'large': {
                scale: 1.15,
                name: 'Grand',
                icon: 'fas fa-font',
                baseSize: '18px'
            },
            'very-large': {
                scale: 1.3,
                name: 'Très grand',
                icon: 'fas fa-font',
                baseSize: '21px'
            },
            'extra-large': {
                scale: 1.5,
                name: 'Extra grand',
                icon: 'fas fa-font',
                baseSize: '24px'
            }
        };
        this.init();
    }

    // Charger la taille de police depuis localStorage
    loadFontSize() {
        try {
            const saved = localStorage.getItem('wiki-font-size');
            return saved || 'normal';
        } catch (error) {
            console.error('Erreur lors du chargement de la taille de police:', error);
            return 'normal';
        }
    }

    // Sauvegarder la taille de police
    saveFontSize() {
        try {
            localStorage.setItem('wiki-font-size', this.currentSize);
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la taille de police:', error);
        }
    }

    // Initialiser le système de contrôle de police
    init() {
        this.createFontControls();
        this.applyFontSize(this.currentSize);
        this.addFontStyles();
        this.setupKeyboardShortcuts();
    }

    // Créer les contrôles de police
    createFontControls() {
        // Attendre que le header soit chargé
        setTimeout(() => {
            const headerActions = document.querySelector('.header-actions');
            if (headerActions && !document.querySelector('.font-controls')) {
                const fontControls = document.createElement('div');
                fontControls.className = 'font-controls';
                fontControls.innerHTML = `
                    <button class="font-btn" onclick="window.fontControls?.toggleFontPanel()" title="Taille du texte">
                        <i class="fas fa-text-height"></i>
                    </button>
                    <div class="font-panel" id="fontPanel">
                        <div class="font-panel-header">
                            <h4>Taille du texte</h4>
                            <button class="font-panel-close" onclick="window.fontControls?.closeFontPanel()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        <div class="font-panel-content">
                            <div class="font-size-options">
                                ${Object.entries(this.fontSizes).map(([key, size]) => `
                                    <button class="font-size-option ${key === this.currentSize ? 'active' : ''}"
                                            data-size="${key}"
                                            onclick="window.fontControls?.setFontSize('${key}')"
                                            title="${size.name} (${size.baseSize})">
                                        <i class="${size.icon}" style="font-size: ${size.scale}em"></i>
                                        <span>${size.name}</span>
                                        <span class="size-indicator">${size.baseSize}</span>
                                    </button>
                                `).join('')}
                            </div>
                            <div class="font-panel-actions">
                                <button class="font-action-btn" onclick="window.fontControls?.resetFontSize()">
                                    <i class="fas fa-undo"></i>
                                    Réinitialiser
                                </button>
                                <button class="font-action-btn" onclick="window.fontControls?.toggleDyslexiaFont()">
                                    <i class="fas fa-universal-access"></i>
                                    Police dyslexie
                                </button>
                            </div>
                            <div class="font-preview">
                                <h5>Aperçu du texte :</h5>
                                <p>Ceci est un exemple de texte pour prévisualiser la taille de police sélectionnée.</p>
                            </div>
                        </div>
                    </div>
                `;

                // Insérer avant le sélecteur de langue ou thème
                const insertBefore = headerActions.querySelector('.theme-toggle') ||
                                   headerActions.querySelector('.language-selector');
                if (insertBefore) {
                    headerActions.insertBefore(fontControls, insertBefore);
                } else {
                    headerActions.appendChild(fontControls);
                }

                this.setupFontControlEvents();
            }
        }, 1000);
    }

    // Configurer les événements des contrôles de police
    setupFontControlEvents() {
        const fontBtn = document.querySelector('.font-btn');
        const fontPanel = document.getElementById('fontPanel');

        if (fontBtn && fontPanel) {
            // Fermer le panel si on clique ailleurs
            document.addEventListener('click', (event) => {
                if (!fontBtn.contains(event.target) && !fontPanel.contains(event.target)) {
                    fontPanel.classList.remove('show');
                }
            });
        }

        // Écouter les changements de taille de fenêtre pour ajuster le panel
        window.addEventListener('resize', () => {
            this.adjustPanelPosition();
        });
    }

    // Basculer l'affichage du panel de police
    toggleFontPanel() {
        const panel = document.getElementById('fontPanel');
        if (panel) {
            panel.classList.toggle('show');
            this.adjustPanelPosition();
        }
    }

    // Fermer le panel de police
    closeFontPanel() {
        const panel = document.getElementById('fontPanel');
        if (panel) {
            panel.classList.remove('show');
        }
    }

    // Ajuster la position du panel
    adjustPanelPosition() {
        const panel = document.getElementById('fontPanel');
        if (!panel || !panel.classList.contains('show')) return;

        const btn = document.querySelector('.font-btn');
        if (!btn) return;

        const btnRect = btn.getBoundingClientRect();
        const panelRect = panel.getBoundingClientRect();
        const viewportWidth = window.innerWidth;

        // Ajuster la position si le panel dépasse de la fenêtre
        if (btnRect.right + panelRect.width > viewportWidth) {
            panel.style.right = '0';
            panel.style.left = 'auto';
        } else {
            panel.style.left = '0';
            panel.style.right = 'auto';
        }
    }

    // Définir une taille de police
    setFontSize(sizeKey) {
        if (!this.fontSizes[sizeKey]) return;

        this.currentSize = sizeKey;
        this.applyFontSize(sizeKey);
        this.saveFontSize();
        this.updateFontOptions();
        this.showFontNotification(`Taille de texte : ${this.fontSizes[sizeKey].name}`);
    }

    // Appliquer la taille de police
    applyFontSize(sizeKey) {
        if (!this.fontSizes[sizeKey]) return;

        const size = this.fontSizes[sizeKey];
        const root = document.documentElement;

        // Appliquer la scale à la racine
        root.style.setProperty('--font-scale', size.scale.toString());
        root.style.setProperty('--base-font-size', size.baseSize);
        root.setAttribute('data-font-size', sizeKey);

        // Appliquer directement au body pour un effet immédiat
        document.body.style.fontSize = `${size.scale}rem`;

        // Mettre à jour la prévisualisation
        this.updatePreview();
    }

    // Mettre à jour les options de police
    updateFontOptions() {
        const options = document.querySelectorAll('.font-size-option');
        options.forEach(option => {
            const sizeKey = option.getAttribute('data-size');
            if (sizeKey === this.currentSize) {
                option.classList.add('active');
            } else {
                option.classList.remove('active');
            }
        });
    }

    // Mettre à jour la prévisualisation
    updatePreview() {
        const preview = document.querySelector('.font-preview p');
        if (preview) {
            const size = this.fontSizes[this.currentSize];
            preview.style.fontSize = `${size.scale}em`;
        }
    }

    // Réinitialiser la taille de police
    resetFontSize() {
        this.setFontSize('normal');
        this.showFontNotification('Taille de texte réinitialisée');
    }

    // Basculer la police pour dyslexie
    toggleDyslexiaFont() {
        const root = document.documentElement;
        const isDyslexiaActive = root.hasAttribute('data-dyslexia-font');

        if (isDyslexiaActive) {
            root.removeAttribute('data-dyslexia-font');
            localStorage.removeItem('wiki-dyslexia-font');
            this.showFontNotification('Police standard activée');
        } else {
            root.setAttribute('data-dyslexia-font', 'true');
            localStorage.setItem('wiki-dyslexia-font', 'true');
            this.showFontNotification('Police pour dyslexie activée');
        }

        // Mettre à jour le bouton
        const btn = document.querySelector('.font-action-btn[onclick*="toggleDyslexiaFont"]');
        if (btn) {
            if (isDyslexiaActive) {
                btn.classList.remove('active');
            } else {
                btn.classList.add('active');
            }
        }
    }

    // Configurer les raccourcis clavier
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl + et Ctrl - pour changer la taille
            if (e.ctrlKey || e.metaKey) {
                if (e.key === '+' || e.key === '=') {
                    e.preventDefault();
                    this.increaseFontSize();
                } else if (e.key === '-') {
                    e.preventDefault();
                    this.decreaseFontSize();
                } else if (e.key === '0') {
                    e.preventDefault();
                    this.resetFontSize();
                }
            }
        });
    }

    // Augmenter la taille de police
    increaseFontSize() {
        const sizes = Object.keys(this.fontSizes);
        const currentIndex = sizes.indexOf(this.currentSize);

        if (currentIndex < sizes.length - 1) {
            this.setFontSize(sizes[currentIndex + 1]);
        } else {
            this.showFontNotification('Taille maximale atteinte');
        }
    }

    // Diminuer la taille de police
    decreaseFontSize() {
        const sizes = Object.keys(this.fontSizes);
        const currentIndex = sizes.indexOf(this.currentSize);

        if (currentIndex > 0) {
            this.setFontSize(sizes[currentIndex - 1]);
        } else {
            this.showFontNotification('Taille minimale atteinte');
        }
    }

    // Ajouter les styles pour les contrôles de police
    addFontStyles() {
        if (document.getElementById('font-controls-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'font-controls-styles';
        styles.textContent = `
            /* Variables de taille de police */
            :root {
                --font-scale: 1;
                --base-font-size: 16px;
            }

            /* Application de la scale à tous les éléments de texte */
            body {
                font-size: calc(var(--base-font-size) * var(--font-scale));
            }

            h1 { font-size: calc(2.5rem * var(--font-scale)); }
            h2 { font-size: calc(2rem * var(--font-scale)); }
            h3 { font-size: calc(1.75rem * var(--font-scale)); }
            h4 { font-size: calc(1.5rem * var(--font-scale)); }
            h5 { font-size: calc(1.25rem * var(--font-scale)); }
            h6 { font-size: calc(1.1rem * var(--font-scale)); }

            p, li, span, a, button {
                font-size: calc(1rem * var(--font-scale));
            }

            .font-controls {
                position: relative;
                margin-right: 15px;
            }

            .font-btn {
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

            .font-btn:hover {
                background: var(--hover-color);
                color: var(--text-primary);
                transform: scale(1.1);
            }

            .font-panel {
                position: absolute;
                top: 100%;
                right: 0;
                background: var(--dark-secondary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 1000;
                min-width: 280px;
                max-width: 320px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                margin-top: 8px;
            }

            .font-panel.show {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .font-panel-header {
                padding: 15px 20px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--dark-primary);
                border-radius: 12px 12px 0 0;
            }

            .font-panel-header h4 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1rem;
            }

            .font-panel-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 16px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .font-panel-close:hover {
                background: var(--primary-color);
                color: white;
            }

            .font-panel-content {
                padding: 20px;
            }

            .font-size-options {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 20px;
            }

            .font-size-option {
                padding: 12px;
                background: var(--dark-accent);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                text-align: center;
                min-height: 80px;
                justify-content: center;
            }

            .font-size-option:hover {
                border-color: var(--primary-color);
                background: var(--hover-color);
                transform: translateY(-2px);
            }

            .font-size-option.active {
                border-color: var(--primary-color);
                background: rgba(220, 38, 38, 0.1);
                color: var(--primary-color);
            }

            .font-size-option i {
                color: var(--text-secondary);
                margin-bottom: 2px;
            }

            .font-size-option.active i {
                color: var(--primary-color);
            }

            .font-size-option span {
                font-size: 12px;
                color: var(--text-secondary);
                font-weight: 500;
            }

            .font-size-option.active span {
                color: var(--primary-color);
            }

            .size-indicator {
                font-size: 10px !important;
                opacity: 0.7;
            }

            .font-panel-actions {
                display: flex;
                gap: 8px;
                margin-bottom: 20px;
            }

            .font-action-btn {
                flex: 1;
                padding: 10px 12px;
                background: var(--dark-accent);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
                font-size: 12px;
            }

            .font-action-btn:hover {
                background: var(--hover-color);
                color: var(--text-primary);
                border-color: var(--primary-color);
            }

            .font-action-btn.active {
                background: var(--primary-color);
                color: white;
                border-color: var(--primary-color);
            }

            .font-preview {
                border-top: 1px solid var(--border-color);
                padding-top: 15px;
            }

            .font-preview h5 {
                margin: 0 0 10px 0;
                color: var(--text-primary);
                font-size: 13px;
            }

            .font-preview p {
                margin: 0;
                color: var(--text-secondary);
                line-height: 1.5;
                font-size: 14px;
                transition: font-size 0.3s ease;
            }

            /* Police pour dyslexie */
            [data-dyslexia-font="true"] {
                font-family: 'OpenDyslexic', 'Comic Sans MS', 'Trebuchet MS', sans-serif;
            }

            /* Notification de changement de police */
            .font-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: var(--dark-secondary);
                color: var(--text-primary);
                padding: 12px 20px;
                border-radius: 8px;
                border: 1px solid var(--border-color);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 10002;
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14px;
                animation: fontNotificationSlide 0.3s ease-out;
            }

            @keyframes fontNotificationSlide {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @media (max-width: 768px) {
                .font-panel {
                    right: -20px;
                    min-width: 260px;
                    max-width: calc(100vw - 40px);
                }

                .font-btn {
                    width: 36px;
                    height: 36px;
                    font-size: 16px;
                }

                .font-size-options {
                    grid-template-columns: 1fr 1fr;
                    gap: 6px;
                }

                .font-size-option {
                    min-height: 70px;
                    padding: 8px;
                }

                .font-panel-actions {
                    flex-direction: column;
                }

                .font-notification {
                    left: 20px;
                    right: 20px;
                    font-size: 13px;
                }

                /* Ajustements des tailles pour mobile */
                h1 { font-size: calc(2rem * var(--font-scale)); }
                h2 { font-size: calc(1.75rem * var(--font-scale)); }
                h3 { font-size: calc(1.5rem * var(--font-scale)); }
            }

            /* Amélioration de la lisibilité pour les grandes tailles */
            [data-font-size="large"],
            [data-font-size="very-large"],
            [data-font-size="extra-large"] {
                line-height: 1.7;
            }

            [data-font-size="large"] .container,
            [data-font-size="very-large"] .container,
            [data-font-size="extra-large"] .container {
                max-width: 900px;
            }
        `;

        document.head.appendChild(styles);

        // Charger et appliquer la police dyslexie si activée
        const dyslexiaFont = localStorage.getItem('wiki-dyslexia-font');
        if (dyslexiaFont === 'true') {
            document.documentElement.setAttribute('data-dyslexia-font', 'true');
            setTimeout(() => {
                const btn = document.querySelector('.font-action-btn[onclick*="toggleDyslexiaFont"]');
                if (btn) btn.classList.add('active');
            }, 1000);
        }
    }

    // Afficher une notification de changement de police
    showFontNotification(message) {
        // Retirer les notifications existantes
        document.querySelectorAll('.font-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = 'font-notification';
        notification.innerHTML = `
            <i class="fas fa-text-height"></i>
            <span>${message}</span>
        `;

        document.body.appendChild(notification);

        // Retirer automatiquement après 2 secondes
        setTimeout(() => {
            notification.style.animation = 'fontNotificationSlide 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Obtenir la taille actuelle
    getCurrentSize() {
        return this.currentSize;
    }

    // Obtenir toutes les tailles disponibles
    getAvailableSizes() {
        return this.fontSizes;
    }

    // Exporter les préférences de police
    exportFontPreferences() {
        return {
            fontSize: this.currentSize,
            dyslexiaFont: document.documentElement.hasAttribute('data-dyslexia-font'),
            exportDate: new Date().toISOString()
        };
    }

    // Importer les préférences de police
    importFontPreferences(preferences) {
        if (preferences.fontSize && this.fontSizes[preferences.fontSize]) {
            this.setFontSize(preferences.fontSize);
        }

        if (typeof preferences.dyslexiaFont === 'boolean') {
            const isCurrentlyActive = document.documentElement.hasAttribute('data-dyslexia-font');
            if (preferences.dyslexiaFont !== isCurrentlyActive) {
                this.toggleDyslexiaFont();
            }
        }
    }
}

// Initialiser les contrôles de police
document.addEventListener('DOMContentLoaded', () => {
    window.fontControls = new FontControls();
});