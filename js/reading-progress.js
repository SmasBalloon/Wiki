// Système de progression de lecture pour le wiki Capitalyx
class ReadingProgress {
    constructor() {
        this.progress = this.loadProgress();
        this.currentPage = window.location.pathname;
        this.sections = [];
        this.init();
    }

    // Charger la progression depuis localStorage
    loadProgress() {
        try {
            const saved = localStorage.getItem('wiki-reading-progress');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Erreur lors du chargement de la progression:', error);
            return {};
        }
    }

    // Sauvegarder la progression dans localStorage
    saveProgress() {
        try {
            localStorage.setItem('wiki-reading-progress', JSON.stringify(this.progress));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la progression:', error);
        }
    }

    // Initialiser le système de progression
    init() {
        this.detectSections();
        this.createProgressBar();
        this.addSectionCheckboxes();
        this.setupIntersectionObserver();
        this.setupScrollProgress();
        this.restoreProgress();
        this.addProgressStats();
    }

    // Détecter les sections de la page
    detectSections() {
        // Chercher les sections principales
        const sections = document.querySelectorAll('h2, h3, .guide-item, .guide-category, section[id]');

        this.sections = Array.from(sections).map((section, index) => {
            // Générer un ID unique si pas présent
            if (!section.id) {
                section.id = `section-${index}`;
            }

            return {
                id: section.id,
                title: this.getElementTitle(section),
                element: section,
                type: this.getSectionType(section),
                completed: false
            };
        }).filter(section => section.title); // Filtrer les sections sans titre
    }

    // Obtenir le titre d'une section
    getElementTitle(element) {
        // Chercher le texte du titre selon le type d'élément
        if (element.tagName === 'H2' || element.tagName === 'H3') {
            return element.textContent.trim();
        }

        if (element.classList.contains('guide-item')) {
            const h3 = element.querySelector('h3');
            return h3 ? h3.textContent.trim() : '';
        }

        if (element.classList.contains('guide-category')) {
            const h2 = element.querySelector('h2');
            return h2 ? h2.textContent.trim() : '';
        }

        // Fallback pour les autres éléments
        const title = element.querySelector('h1, h2, h3, h4, h5, h6');
        return title ? title.textContent.trim() : '';
    }

    // Déterminer le type de section
    getSectionType(element) {
        if (element.classList.contains('guide-category')) return 'category';
        if (element.classList.contains('guide-item')) return 'guide';
        if (element.tagName === 'H2') return 'section';
        if (element.tagName === 'H3') return 'subsection';
        return 'content';
    }

    // Créer la barre de progression
    createProgressBar() {
        if (document.querySelector('.reading-progress-bar')) return;

        const progressBar = document.createElement('div');
        progressBar.className = 'reading-progress-bar';
        progressBar.innerHTML = `
            <div class="progress-container">
                <div class="progress-track">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
                <div class="progress-text" id="progressText">0%</div>
            </div>
        `;

        document.body.appendChild(progressBar);
        this.addProgressBarStyles();
    }

    // Ajouter les styles de la barre de progression
    addProgressBarStyles() {
        if (document.getElementById('reading-progress-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'reading-progress-styles';
        styles.textContent = `
            .reading-progress-bar {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 4px;
                background: rgba(0, 0, 0, 0.1);
                z-index: 9999;
                transition: all 0.3s ease;
            }

            .progress-container {
                display: flex;
                align-items: center;
                height: 100%;
                background: var(--dark-secondary);
                border-bottom: 1px solid var(--border-color);
            }

            .progress-track {
                flex: 1;
                height: 4px;
                background: rgba(220, 38, 38, 0.2);
                position: relative;
                overflow: hidden;
            }

            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, var(--primary-color), #ef4444);
                width: 0%;
                transition: width 0.3s ease;
                position: relative;
            }

            .progress-fill::after {
                content: '';
                position: absolute;
                top: 0;
                right: -10px;
                width: 10px;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
                animation: shimmer 2s infinite;
            }

            @keyframes shimmer {
                0% { transform: translateX(-10px); }
                100% { transform: translateX(10px); }
            }

            .progress-text {
                padding: 8px 15px;
                color: var(--text-primary);
                font-size: 12px;
                font-weight: 600;
                min-width: 50px;
                text-align: center;
                background: var(--dark-secondary);
            }

            .section-checkbox {
                position: absolute;
                top: 10px;
                right: 10px;
                width: 24px;
                height: 24px;
                background: var(--dark-secondary);
                border: 2px solid var(--border-color);
                border-radius: 50%;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.3s ease;
                font-size: 12px;
                color: transparent;
                z-index: 10;
            }

            .section-checkbox:hover {
                border-color: var(--primary-color);
                background: var(--primary-color);
                color: white;
                transform: scale(1.1);
            }

            .section-checkbox.completed {
                background: #10b981;
                border-color: #10b981;
                color: white;
            }

            .section-checkbox.completed::before {
                content: '✓';
                font-weight: bold;
            }

            .guide-item, .guide-category {
                position: relative;
            }

            .reading-stats {
                position: fixed;
                bottom: 80px;
                right: 20px;
                background: var(--dark-secondary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                padding: 15px;
                min-width: 200px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 998;
                transform: translateX(250px);
                transition: all 0.3s ease;
            }

            .reading-stats.show {
                transform: translateX(0);
            }

            .reading-stats-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 10px;
            }

            .reading-stats-title {
                color: var(--text-primary);
                font-size: 14px;
                font-weight: 600;
                margin: 0;
            }

            .reading-stats-toggle {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .reading-stats-toggle:hover {
                background: var(--primary-color);
                color: white;
            }

            .reading-stats-content {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .reading-stat-item {
                display: flex;
                justify-content: space-between;
                align-items: center;
                color: var(--text-secondary);
                font-size: 13px;
            }

            .reading-stat-value {
                color: var(--primary-color);
                font-weight: 600;
            }

            .reading-progress-circle {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                background: conic-gradient(var(--primary-color) 0deg, var(--dark-accent) 0deg);
                display: flex;
                align-items: center;
                justify-content: center;
                color: var(--text-primary);
                font-size: 10px;
                font-weight: 600;
                margin: 10px auto;
            }

            @media (max-width: 768px) {
                .reading-stats {
                    bottom: 120px;
                    right: 15px;
                    min-width: 180px;
                }

                .section-checkbox {
                    width: 20px;
                    height: 20px;
                    font-size: 10px;
                }

                .progress-text {
                    padding: 6px 10px;
                    font-size: 11px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Ajouter les checkboxes aux sections
    addSectionCheckboxes() {
        this.sections.forEach((section, index) => {
            const checkbox = document.createElement('div');
            checkbox.className = 'section-checkbox';
            checkbox.title = `Marquer "${section.title}" comme lu`;
            checkbox.addEventListener('click', () => this.toggleSectionComplete(index));

            // Ajouter la checkbox à l'élément approprié
            if (section.element.classList.contains('guide-item') ||
                section.element.classList.contains('guide-category')) {
                section.element.style.position = 'relative';
                section.element.appendChild(checkbox);
            }

            section.checkbox = checkbox;
        });
    }

    // Configurer l'observateur d'intersection pour la lecture automatique
    setupIntersectionObserver() {
        const options = {
            threshold: 0.6, // 60% de la section visible
            rootMargin: '-10% 0px -10% 0px'
        };

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionIndex = this.sections.findIndex(s => s.element === entry.target);
                    if (sectionIndex >= 0) {
                        this.markAsRead(sectionIndex);
                    }
                }
            });
        }, options);

        // Observer toutes les sections
        this.sections.forEach(section => {
            this.observer.observe(section.element);
        });
    }

    // Configurer la progression au scroll
    setupScrollProgress() {
        window.addEventListener('scroll', () => {
            this.updateScrollProgress();
        });
    }

    // Mettre à jour la progression au scroll
    updateScrollProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;

        const progressFill = document.getElementById('progressFill');
        const progressText = document.getElementById('progressText');

        if (progressFill && progressText) {
            progressFill.style.width = `${Math.min(scrollPercent, 100)}%`;
            progressText.textContent = `${Math.round(scrollPercent)}%`;
        }
    }

    // Basculer l'état de completion d'une section
    toggleSectionComplete(index) {
        const section = this.sections[index];
        if (!section) return;

        section.completed = !section.completed;
        this.updateSectionCheckbox(index);
        this.savePageProgress();
        this.updateStats();

        // Notification
        const action = section.completed ? 'marquée comme lue' : 'marquée comme non lue';
        this.showProgressNotification(`"${section.title}" ${action}`, section.completed ? 'success' : 'info');
    }

    // Marquer une section comme lue (automatique)
    markAsRead(index) {
        const section = this.sections[index];
        if (!section || section.completed) return;

        section.completed = true;
        this.updateSectionCheckbox(index);
        this.savePageProgress();
        this.updateStats();
    }

    // Mettre à jour l'apparence de la checkbox
    updateSectionCheckbox(index) {
        const section = this.sections[index];
        if (!section.checkbox) return;

        if (section.completed) {
            section.checkbox.classList.add('completed');
            section.checkbox.title = `"${section.title}" - Lu (clic pour marquer comme non lu)`;
        } else {
            section.checkbox.classList.remove('completed');
            section.checkbox.title = `Marquer "${section.title}" comme lu`;
        }
    }

    // Sauvegarder la progression de la page
    savePageProgress() {
        if (!this.progress[this.currentPage]) {
            this.progress[this.currentPage] = {};
        }

        this.progress[this.currentPage].sections = this.sections.map(section => ({
            id: section.id,
            title: section.title,
            completed: section.completed
        }));

        this.progress[this.currentPage].lastVisit = new Date().toISOString();
        this.progress[this.currentPage].completedSections = this.sections.filter(s => s.completed).length;
        this.progress[this.currentPage].totalSections = this.sections.length;

        this.saveProgress();
    }

    // Restaurer la progression sauvegardée
    restoreProgress() {
        const pageProgress = this.progress[this.currentPage];
        if (!pageProgress || !pageProgress.sections) return;

        pageProgress.sections.forEach(savedSection => {
            const sectionIndex = this.sections.findIndex(s => s.id === savedSection.id);
            if (sectionIndex >= 0 && savedSection.completed) {
                this.sections[sectionIndex].completed = true;
                this.updateSectionCheckbox(sectionIndex);
            }
        });

        this.updateStats();
    }

    // Ajouter les statistiques de lecture
    addProgressStats() {
        if (document.querySelector('.reading-stats')) return;

        const stats = document.createElement('div');
        stats.className = 'reading-stats';
        stats.innerHTML = `
            <div class="reading-stats-header">
                <h4 class="reading-stats-title">Progression</h4>
                <button class="reading-stats-toggle" onclick="this.parentElement.parentElement.classList.toggle('show')">
                    <i class="fas fa-chart-bar"></i>
                </button>
            </div>
            <div class="reading-stats-content">
                <div class="reading-progress-circle" id="progressCircle">0%</div>
                <div class="reading-stat-item">
                    <span>Sections lues</span>
                    <span class="reading-stat-value" id="completedCount">0</span>
                </div>
                <div class="reading-stat-item">
                    <span>Total sections</span>
                    <span class="reading-stat-value" id="totalCount">0</span>
                </div>
                <div class="reading-stat-item">
                    <span>Temps estimé</span>
                    <span class="reading-stat-value" id="estimatedTime">-</span>
                </div>
            </div>
        `;

        document.body.appendChild(stats);

        // Afficher automatiquement après 3 secondes
        setTimeout(() => {
            stats.classList.add('show');
        }, 3000);

        this.updateStats();
    }

    // Mettre à jour les statistiques
    updateStats() {
        const completed = this.sections.filter(s => s.completed).length;
        const total = this.sections.length;
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;

        // Mettre à jour le cercle de progression
        const progressCircle = document.getElementById('progressCircle');
        if (progressCircle) {
            const angle = (percentage / 100) * 360;
            progressCircle.style.background = `conic-gradient(var(--primary-color) ${angle}deg, var(--dark-accent) ${angle}deg)`;
            progressCircle.textContent = `${percentage}%`;
        }

        // Mettre à jour les compteurs
        const completedCount = document.getElementById('completedCount');
        const totalCount = document.getElementById('totalCount');
        const estimatedTime = document.getElementById('estimatedTime');

        if (completedCount) completedCount.textContent = completed;
        if (totalCount) totalCount.textContent = total;
        if (estimatedTime) {
            const remaining = total - completed;
            const timePerSection = 2; // 2 minutes par section
            const totalMinutes = remaining * timePerSection;

            if (totalMinutes === 0) {
                estimatedTime.textContent = 'Terminé !';
                estimatedTime.style.color = '#10b981';
            } else {
                estimatedTime.textContent = `${totalMinutes}min`;
            }
        }
    }

    // Afficher une notification de progression
    showProgressNotification(message, type = 'info') {
        // Retirer les notifications existantes
        document.querySelectorAll('.progress-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `progress-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: var(--dark-secondary);
            color: var(--text-primary);
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: slideInProgress 0.3s ease-out;
            max-width: 250px;
            font-size: 13px;
        `;

        // Ajouter les styles d'animation si pas présents
        if (!document.getElementById('progress-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'progress-notification-styles';
            styles.textContent = `
                @keyframes slideInProgress {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-success { border-left: 4px solid #10b981; }
                .notification-info { border-left: 4px solid #3b82f6; }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Retirer automatiquement après 2 secondes
        setTimeout(() => {
            notification.style.animation = 'slideInProgress 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }

    // Obtenir le pourcentage de progression global
    getGlobalProgress() {
        const pages = Object.keys(this.progress);
        if (pages.length === 0) return 0;

        let totalSections = 0;
        let completedSections = 0;

        pages.forEach(page => {
            const pageData = this.progress[page];
            if (pageData.totalSections) {
                totalSections += pageData.totalSections;
                completedSections += pageData.completedSections || 0;
            }
        });

        return totalSections > 0 ? Math.round((completedSections / totalSections) * 100) : 0;
    }

    // Réinitialiser la progression de la page
    resetPageProgress() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser votre progression sur cette page ?')) {
            this.sections.forEach((section, index) => {
                section.completed = false;
                this.updateSectionCheckbox(index);
            });

            delete this.progress[this.currentPage];
            this.saveProgress();
            this.updateStats();
            this.showProgressNotification('Progression réinitialisée', 'info');
        }
    }
}

// Initialiser le système de progression de lecture
document.addEventListener('DOMContentLoaded', () => {
    // Seulement sur les pages guides et rules
    const isGuidePage = window.location.pathname.includes('guide') ||
                        window.location.pathname.includes('rule') ||
                        document.querySelector('.guide-item, .guide-category');

    if (isGuidePage) {
        window.readingProgress = new ReadingProgress();
    }
});