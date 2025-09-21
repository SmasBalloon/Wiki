// Système de pages populaires pour le wiki Capitalyx
class PopularPages {
    constructor() {
        this.viewHistory = this.loadViewHistory();
        this.pageStats = this.loadPageStats();
        this.currentPage = window.location.pathname;
        this.sessionStart = Date.now();
        this.init();
    }

    // Charger l'historique des vues
    loadViewHistory() {
        try {
            const saved = localStorage.getItem('wiki-view-history');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Erreur lors du chargement de l\'historique:', error);
            return [];
        }
    }

    // Charger les statistiques des pages
    loadPageStats() {
        try {
            const saved = localStorage.getItem('wiki-page-stats');
            return saved ? JSON.parse(saved) : {};
        } catch (error) {
            console.error('Erreur lors du chargement des statistiques:', error);
            return {};
        }
    }

    // Sauvegarder l'historique des vues
    saveViewHistory() {
        try {
            localStorage.setItem('wiki-view-history', JSON.stringify(this.viewHistory));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de l\'historique:', error);
        }
    }

    // Sauvegarder les statistiques des pages
    savePageStats() {
        try {
            localStorage.setItem('wiki-page-stats', JSON.stringify(this.pageStats));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des statistiques:', error);
        }
    }

    // Initialiser le système
    init() {
        this.recordPageView();
        this.trackTimeOnPage();
        this.addPopularPagesSection();
        this.setupBeforeUnload();
    }

    // Enregistrer une vue de page
    recordPageView() {
        const pageInfo = {
            url: this.currentPage,
            title: document.title,
            timestamp: Date.now(),
            date: new Date().toISOString(),
            referrer: document.referrer || null
        };

        // Ajouter à l'historique (max 100 entrées)
        this.viewHistory.unshift(pageInfo);
        if (this.viewHistory.length > 100) {
            this.viewHistory = this.viewHistory.slice(0, 100);
        }

        // Mettre à jour les statistiques de la page
        if (!this.pageStats[this.currentPage]) {
            this.pageStats[this.currentPage] = {
                url: this.currentPage,
                title: document.title,
                views: 0,
                totalTime: 0,
                lastVisit: null,
                firstVisit: Date.now(),
                avgTimePerVisit: 0
            };
        }

        const stats = this.pageStats[this.currentPage];
        stats.views++;
        stats.lastVisit = Date.now();
        stats.title = document.title; // Mettre à jour le titre si changé

        this.saveViewHistory();
        this.savePageStats();
    }

    // Suivre le temps passé sur la page
    trackTimeOnPage() {
        // Suivre l'activité de l'utilisateur
        this.isActive = true;
        this.lastActivity = Date.now();

        const activityEvents = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
        activityEvents.forEach(event => {
            document.addEventListener(event, () => {
                this.isActive = true;
                this.lastActivity = Date.now();
            }, { passive: true });
        });

        // Vérifier l'inactivité toutes les 30 secondes
        setInterval(() => {
            if (Date.now() - this.lastActivity > 30000) {
                this.isActive = false;
            }
        }, 30000);
    }

    // Configurer l'événement avant déchargement
    setupBeforeUnload() {
        window.addEventListener('beforeunload', () => {
            this.updateTimeOnPage();
        });

        // Aussi mettre à jour périodiquement
        setInterval(() => {
            if (this.isActive) {
                this.updateTimeOnPage();
            }
        }, 60000); // Toutes les minutes
    }

    // Mettre à jour le temps passé sur la page
    updateTimeOnPage() {
        if (!this.pageStats[this.currentPage]) return;

        const timeSpent = Date.now() - this.sessionStart;
        const stats = this.pageStats[this.currentPage];

        stats.totalTime += timeSpent;
        stats.avgTimePerVisit = Math.round(stats.totalTime / stats.views);

        this.savePageStats();
        this.sessionStart = Date.now(); // Reset pour la prochaine période
    }

    // Ajouter la section des pages populaires
    addPopularPagesSection() {
        // Attendre que la page soit chargée
        setTimeout(() => {
            this.createPopularPagesWidget();
        }, 2000);
    }

    // Créer le widget des pages populaires
    createPopularPagesWidget() {
        if (document.querySelector('.popular-pages-widget')) return;

        const widget = document.createElement('div');
        widget.className = 'popular-pages-widget';
        widget.innerHTML = `
            <div class="widget-header">
                <h4><i class="fas fa-fire"></i> Pages populaires</h4>
                <button class="widget-toggle" onclick="window.popularPages?.toggleWidget()">
                    <i class="fas fa-chevron-up"></i>
                </button>
            </div>
            <div class="widget-content">
                <div class="widget-tabs">
                    <button class="tab-btn active" data-tab="popular" onclick="window.popularPages?.showTab('popular')">
                        <i class="fas fa-fire"></i> Populaires
                    </button>
                    <button class="tab-btn" data-tab="recent" onclick="window.popularPages?.showTab('recent')">
                        <i class="fas fa-clock"></i> Récentes
                    </button>
                    <button class="tab-btn" data-tab="recommended" onclick="window.popularPages?.showTab('recommended')">
                        <i class="fas fa-thumbs-up"></i> Suggérées
                    </button>
                </div>
                <div class="tab-content">
                    <div id="popular-tab" class="tab-panel active">
                        <div class="page-list" id="popularList"></div>
                    </div>
                    <div id="recent-tab" class="tab-panel">
                        <div class="page-list" id="recentList"></div>
                    </div>
                    <div id="recommended-tab" class="tab-panel">
                        <div class="page-list" id="recommendedList"></div>
                    </div>
                </div>
                <div class="widget-footer">
                    <button class="clear-history-btn" onclick="window.popularPages?.clearHistory()">
                        <i class="fas fa-trash"></i> Effacer l'historique
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(widget);
        this.addWidgetStyles();
        this.updateAllLists();

        // Afficher le widget automatiquement après 5 secondes
        setTimeout(() => {
            widget.classList.add('visible');
        }, 5000);
    }

    // Ajouter les styles du widget
    addWidgetStyles() {
        if (document.getElementById('popular-pages-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'popular-pages-styles';
        styles.textContent = `
            .popular-pages-widget {
                position: fixed;
                bottom: 20px;
                left: 20px;
                width: 300px;
                background: var(--dark-secondary);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                z-index: 997;
                transform: translateX(-320px);
                transition: all 0.3s ease;
                max-height: 80vh;
                overflow: hidden;
            }

            .popular-pages-widget.visible {
                transform: translateX(0);
            }

            .popular-pages-widget.collapsed .widget-content {
                display: none;
            }

            .widget-header {
                background: var(--dark-primary);
                padding: 15px 20px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-radius: 12px 12px 0 0;
            }

            .widget-header h4 {
                margin: 0;
                color: var(--text-primary);
                font-size: 14px;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .widget-header .fas.fa-fire {
                color: #f97316;
            }

            .widget-toggle {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .widget-toggle:hover {
                background: var(--hover-color);
                color: var(--text-primary);
            }

            .widget-content {
                overflow-y: auto;
                max-height: calc(80vh - 80px);
            }

            .widget-tabs {
                display: flex;
                background: var(--dark-accent);
                border-bottom: 1px solid var(--border-color);
            }

            .tab-btn {
                flex: 1;
                background: none;
                border: none;
                padding: 12px 8px;
                color: var(--text-secondary);
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 11px;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                border-bottom: 2px solid transparent;
            }

            .tab-btn:hover {
                background: var(--hover-color);
                color: var(--text-primary);
            }

            .tab-btn.active {
                color: var(--primary-color);
                border-bottom-color: var(--primary-color);
                background: var(--dark-secondary);
            }

            .tab-btn i {
                font-size: 14px;
            }

            .tab-panel {
                display: none;
                padding: 15px;
            }

            .tab-panel.active {
                display: block;
            }

            .page-list {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .page-item {
                background: var(--dark-accent);
                border: 1px solid var(--border-color);
                border-radius: 6px;
                padding: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .page-item:hover {
                border-color: var(--primary-color);
                background: var(--hover-color);
                transform: translateY(-1px);
            }

            .page-title {
                color: var(--text-primary);
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 4px;
                line-height: 1.3;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }

            .page-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: var(--text-muted);
            }

            .page-stats {
                display: flex;
                gap: 8px;
                align-items: center;
            }

            .page-stats i {
                width: 12px;
                text-align: center;
            }

            .page-time {
                color: var(--text-secondary);
            }

            .page-badge {
                position: absolute;
                top: -5px;
                right: -5px;
                background: var(--primary-color);
                color: white;
                border-radius: 50%;
                width: 18px;
                height: 18px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            .recommended-badge {
                background: #10b981;
            }

            .trending-badge {
                background: #f97316;
            }

            .widget-footer {
                padding: 10px 15px;
                border-top: 1px solid var(--border-color);
                background: var(--dark-accent);
                border-radius: 0 0 12px 12px;
            }

            .clear-history-btn {
                width: 100%;
                background: none;
                border: 1px solid var(--border-color);
                color: var(--text-secondary);
                padding: 8px 12px;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 6px;
            }

            .clear-history-btn:hover {
                background: #ef4444;
                color: white;
                border-color: #ef4444;
            }

            .empty-state {
                text-align: center;
                padding: 20px;
                color: var(--text-muted);
                font-size: 12px;
            }

            .empty-state i {
                font-size: 24px;
                margin-bottom: 10px;
                opacity: 0.5;
            }

            @media (max-width: 768px) {
                .popular-pages-widget {
                    left: 10px;
                    bottom: 10px;
                    width: calc(100vw - 20px);
                    max-width: 280px;
                }

                .tab-btn {
                    font-size: 10px;
                    padding: 10px 6px;
                }

                .page-title {
                    font-size: 12px;
                }

                .page-meta {
                    font-size: 10px;
                }
            }

            /* Mode impression - masquer le widget */
            @media print {
                .popular-pages-widget {
                    display: none !important;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Basculer l'affichage du widget
    toggleWidget() {
        const widget = document.querySelector('.popular-pages-widget');
        if (widget) {
            widget.classList.toggle('collapsed');

            const toggle = widget.querySelector('.widget-toggle i');
            if (toggle) {
                if (widget.classList.contains('collapsed')) {
                    toggle.className = 'fas fa-chevron-down';
                } else {
                    toggle.className = 'fas fa-chevron-up';
                }
            }
        }
    }

    // Afficher un onglet
    showTab(tabName) {
        // Mettre à jour les boutons d'onglet
        document.querySelectorAll('.tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === tabName) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Mettre à jour les panneaux
        document.querySelectorAll('.tab-panel').forEach(panel => {
            if (panel.id === `${tabName}-tab`) {
                panel.classList.add('active');
            } else {
                panel.classList.remove('active');
            }
        });

        // Mettre à jour le contenu selon l'onglet
        switch (tabName) {
            case 'popular':
                this.updatePopularList();
                break;
            case 'recent':
                this.updateRecentList();
                break;
            case 'recommended':
                this.updateRecommendedList();
                break;
        }
    }

    // Mettre à jour toutes les listes
    updateAllLists() {
        this.updatePopularList();
        this.updateRecentList();
        this.updateRecommendedList();
    }

    // Mettre à jour la liste des pages populaires
    updatePopularList() {
        const container = document.getElementById('popularList');
        if (!container) return;

        const popular = Object.values(this.pageStats)
            .filter(page => page.views > 1)
            .sort((a, b) => b.views - a.views)
            .slice(0, 8);

        this.renderPageList(container, popular, 'popular');
    }

    // Mettre à jour la liste des pages récentes
    updateRecentList() {
        const container = document.getElementById('recentList');
        if (!container) return;

        const recent = this.viewHistory
            .slice(0, 8)
            .filter((item, index, arr) =>
                arr.findIndex(x => x.url === item.url) === index
            ); // Enlever les doublons

        const recentWithStats = recent.map(item => ({
            ...item,
            ...this.pageStats[item.url]
        }));

        this.renderPageList(container, recentWithStats, 'recent');
    }

    // Mettre à jour la liste des pages recommandées
    updateRecommendedList() {
        const container = document.getElementById('recommendedList');
        if (!container) return;

        const recommendations = this.generateRecommendations();
        this.renderPageList(container, recommendations, 'recommended');
    }

    // Générer des recommandations basées sur l'historique
    generateRecommendations() {
        const currentPageType = this.getPageType(this.currentPage);
        const relatedPages = Object.values(this.pageStats)
            .filter(page => {
                const pageType = this.getPageType(page.url);
                return pageType === currentPageType && page.url !== this.currentPage;
            })
            .sort((a, b) => b.views - a.views)
            .slice(0, 4);

        // Ajouter des pages populaires d'autres catégories
        const otherPopular = Object.values(this.pageStats)
            .filter(page => {
                const pageType = this.getPageType(page.url);
                return pageType !== currentPageType && page.views > 2;
            })
            .sort((a, b) => b.views - a.views)
            .slice(0, 4);

        return [...relatedPages, ...otherPopular].slice(0, 8);
    }

    // Déterminer le type de page
    getPageType(url) {
        if (url.includes('guide')) return 'guides';
        if (url.includes('job')) return 'jobs';
        if (url.includes('rule')) return 'rules';
        if (url.includes('command')) return 'commands';
        if (url.includes('faq')) return 'faq';
        return 'other';
    }

    // Rendre une liste de pages
    renderPageList(container, pages, type) {
        if (!pages || pages.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-${type === 'popular' ? 'fire' : type === 'recent' ? 'clock' : 'thumbs-up'}"></i>
                    <p>Aucune page ${type === 'popular' ? 'populaire' : type === 'recent' ? 'récente' : 'recommandée'} pour le moment</p>
                </div>
            `;
            return;
        }

        container.innerHTML = pages.map(page => {
            const timeAgo = this.getTimeAgo(page.lastVisit || page.timestamp);
            const views = page.views || 1;
            const avgTime = page.avgTimePerVisit ? this.formatTime(page.avgTimePerVisit) : null;

            let badge = '';
            if (type === 'popular' && views > 10) {
                badge = '<div class="page-badge trending-badge">🔥</div>';
            } else if (type === 'recommended') {
                badge = '<div class="page-badge recommended-badge">💡</div>';
            }

            return `
                <div class="page-item" onclick="window.location.href='${page.url}'">
                    ${badge}
                    <div class="page-title">${this.escapeHtml(page.title || 'Page sans titre')}</div>
                    <div class="page-meta">
                        <div class="page-stats">
                            <span><i class="fas fa-eye"></i> ${views}</span>
                            ${avgTime ? `<span><i class="fas fa-clock"></i> ${avgTime}</span>` : ''}
                        </div>
                        <div class="page-time">${timeAgo}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // Effacer l'historique
    clearHistory() {
        if (confirm('Êtes-vous sûr de vouloir effacer tout l\'historique des pages visitées ?')) {
            this.viewHistory = [];
            this.pageStats = {};
            this.saveViewHistory();
            this.savePageStats();
            this.updateAllLists();

            // Notification
            this.showNotification('Historique effacé', 'info');
        }
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `popular-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        notification.style.cssText = `
            position: fixed;
            top: 20px;
            left: 20px;
            background: var(--dark-secondary);
            color: var(--text-primary);
            padding: 12px 16px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: slideInLeft 0.3s ease-out;
            font-size: 13px;
        `;

        // Ajouter les styles d'animation
        if (!document.getElementById('popular-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'popular-notification-styles';
            styles.textContent = `
                @keyframes slideInLeft {
                    from { transform: translateX(-100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utilitaires
    getTimeAgo(timestamp) {
        const now = Date.now();
        const diff = now - timestamp;
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'À l\'instant';
        if (minutes < 60) return `${minutes}min`;
        if (hours < 24) return `${hours}h`;
        if (days < 7) return `${days}j`;
        return new Date(timestamp).toLocaleDateString('fr-FR');
    }

    formatTime(milliseconds) {
        const seconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(seconds / 60);

        if (minutes > 0) {
            return `${minutes}min`;
        }
        return `${seconds}s`;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // API publique
    getPopularPages(limit = 10) {
        return Object.values(this.pageStats)
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    }

    getRecentPages(limit = 10) {
        return this.viewHistory.slice(0, limit);
    }

    getPageStats(url = this.currentPage) {
        return this.pageStats[url] || null;
    }

    exportAnalytics() {
        return {
            viewHistory: this.viewHistory,
            pageStats: this.pageStats,
            exportDate: new Date().toISOString(),
            totalViews: this.viewHistory.length,
            uniquePages: Object.keys(this.pageStats).length
        };
    }
}

// Initialiser le système de pages populaires
document.addEventListener('DOMContentLoaded', () => {
    window.popularPages = new PopularPages();
});