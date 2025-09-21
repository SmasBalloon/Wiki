// Système de favoris et signets pour le wiki Capitalyx
class WikiFavorites {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }

    // Charger les favoris depuis localStorage
    loadFavorites() {
        try {
            const saved = localStorage.getItem('wiki-favorites');
            return saved ? JSON.parse(saved) : [];
        } catch (error) {
            console.error('Erreur lors du chargement des favoris:', error);
            return [];
        }
    }

    // Sauvegarder les favoris dans localStorage
    saveFavorites() {
        try {
            localStorage.setItem('wiki-favorites', JSON.stringify(this.favorites));
            this.updateFavoritesCount();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des favoris:', error);
        }
    }

    // Initialiser le système de favoris
    init() {
        this.createFavoritesButton();
        this.createFavoritesModal();
        this.addCurrentPageButton();
        this.updateFavoritesCount();
        this.initKeyboardShortcuts();
    }

    // Créer le bouton d'accès aux favoris dans le header
    createFavoritesButton() {
        // Attendre que le header soit chargé
        setTimeout(() => {
            const nav = document.querySelector('.nav-menu');
            if (nav && !document.querySelector('.favorites-btn')) {
                const favoritesItem = document.createElement('li');
                favoritesItem.innerHTML = `
                    <a href="#" class="nav-link favorites-btn" onclick="window.wikiFavorites?.toggleFavoritesModal(); return false;">
                        <i class="fas fa-star"></i>
                        Favoris
                        <span class="favorites-count" id="favoritesCount">0</span>
                    </a>
                `;
                nav.appendChild(favoritesItem);
            }
        }, 1000);
    }

    // Créer le modal des favoris
    createFavoritesModal() {
        if (document.getElementById('favoritesModal')) return;

        const modalHTML = `
            <div class="favorites-modal" id="favoritesModal">
                <div class="favorites-modal-backdrop" onclick="window.wikiFavorites?.closeFavoritesModal()"></div>
                <div class="favorites-modal-content">
                    <div class="favorites-modal-header">
                        <h3><i class="fas fa-star"></i> Mes Favoris</h3>
                        <button class="favorites-modal-close" onclick="window.wikiFavorites?.closeFavoritesModal()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>

                    <div class="favorites-content">
                        <div class="favorites-actions">
                            <button class="btn-primary add-current-page" onclick="window.wikiFavorites?.addCurrentPage()">
                                <i class="fas fa-plus"></i> Ajouter cette page
                            </button>
                            <button class="btn-secondary clear-favorites" onclick="window.wikiFavorites?.clearAllFavorites()">
                                <i class="fas fa-trash"></i> Tout effacer
                            </button>
                        </div>

                        <div class="favorites-list" id="favoritesList">
                            <!-- Les favoris seront affichés ici -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHTML);
        this.addFavoritesStyles();
    }

    // Ajouter les styles pour les favoris
    addFavoritesStyles() {
        if (document.getElementById('favorites-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'favorites-styles';
        styles.textContent = `
            .favorites-count {
                background: var(--primary-color);
                color: white;
                border-radius: 10px;
                padding: 2px 6px;
                font-size: 12px;
                margin-left: 5px;
                min-width: 18px;
                text-align: center;
                display: inline-block;
            }

            .favorites-count:empty {
                display: none;
            }

            .page-favorite-btn {
                position: fixed;
                top: 120px;
                right: 20px;
                background: var(--primary-color);
                color: white;
                border: none;
                border-radius: 50%;
                width: 50px;
                height: 50px;
                font-size: 18px;
                cursor: pointer;
                box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
                transition: all 0.3s ease;
                z-index: 999;
            }

            .page-favorite-btn:hover {
                transform: translateY(-3px);
                box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
            }

            .page-favorite-btn.favorited {
                background: #fbbf24;
                color: #92400e;
            }

            .favorites-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                z-index: 10000;
                display: none;
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .favorites-modal.open {
                display: flex;
                opacity: 1;
                align-items: center;
                justify-content: center;
            }

            .favorites-modal-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
            }

            .favorites-modal-content {
                background: var(--dark-secondary);
                border-radius: 12px;
                max-width: 600px;
                width: 90%;
                max-height: 80vh;
                position: relative;
                border: 1px solid var(--border-color);
                overflow: hidden;
            }

            .favorites-modal-header {
                padding: 20px;
                border-bottom: 1px solid var(--border-color);
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: var(--dark-primary);
            }

            .favorites-modal-header h3 {
                margin: 0;
                color: var(--text-primary);
                font-size: 1.2rem;
            }

            .favorites-modal-close {
                background: none;
                border: none;
                color: var(--text-secondary);
                font-size: 18px;
                cursor: pointer;
                padding: 5px;
                border-radius: 4px;
                transition: all 0.3s ease;
            }

            .favorites-modal-close:hover {
                background: var(--primary-color);
                color: white;
            }

            .favorites-content {
                padding: 20px;
                max-height: calc(80vh - 80px);
                overflow-y: auto;
            }

            .favorites-actions {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                flex-wrap: wrap;
            }

            .favorites-actions button {
                padding: 10px 15px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .btn-primary {
                background: var(--primary-color);
                color: white;
            }

            .btn-primary:hover {
                background: #b91c1c;
                transform: translateY(-1px);
            }

            .btn-secondary {
                background: var(--dark-accent);
                color: var(--text-secondary);
                border: 1px solid var(--border-color);
            }

            .btn-secondary:hover {
                background: var(--border-color);
                color: var(--text-primary);
            }

            .favorites-list {
                display: flex;
                flex-direction: column;
                gap: 10px;
            }

            .favorite-item {
                background: var(--dark-accent);
                border: 1px solid var(--border-color);
                border-radius: 8px;
                padding: 15px;
                transition: all 0.3s ease;
            }

            .favorite-item:hover {
                border-color: var(--primary-color);
                transform: translateY(-1px);
            }

            .favorite-header {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                margin-bottom: 8px;
            }

            .favorite-title {
                color: var(--text-primary);
                font-weight: 600;
                font-size: 16px;
                margin: 0;
                flex: 1;
            }

            .favorite-actions {
                display: flex;
                gap: 5px;
            }

            .favorite-btn {
                background: none;
                border: none;
                color: var(--text-secondary);
                cursor: pointer;
                padding: 5px 8px;
                border-radius: 4px;
                font-size: 14px;
                transition: all 0.3s ease;
            }

            .favorite-btn:hover {
                background: var(--primary-color);
                color: white;
            }

            .favorite-url {
                color: var(--text-secondary);
                font-size: 13px;
                margin-bottom: 8px;
                word-break: break-all;
            }

            .favorite-date {
                color: var(--text-muted);
                font-size: 12px;
            }

            .favorites-empty {
                text-align: center;
                color: var(--text-secondary);
                padding: 40px 20px;
            }

            .favorites-empty i {
                font-size: 48px;
                margin-bottom: 15px;
                opacity: 0.5;
            }

            @media (max-width: 768px) {
                .favorites-modal-content {
                    width: 95%;
                    max-height: 90vh;
                }

                .favorites-actions {
                    flex-direction: column;
                }

                .favorite-header {
                    flex-direction: column;
                    align-items: flex-start;
                }

                .favorite-actions {
                    margin-top: 10px;
                }

                .page-favorite-btn {
                    right: 15px;
                    top: 100px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // Ajouter le bouton de favori pour la page courante
    addCurrentPageButton() {
        if (document.querySelector('.page-favorite-btn')) return;

        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'page-favorite-btn';
        favoriteBtn.innerHTML = '<i class="fas fa-star"></i>';
        favoriteBtn.title = 'Ajouter aux favoris';

        favoriteBtn.addEventListener('click', () => {
            this.toggleCurrentPage();
        });

        document.body.appendChild(favoriteBtn);
        this.updateCurrentPageButton();
    }

    // Mettre à jour l'état du bouton de la page courante
    updateCurrentPageButton() {
        const btn = document.querySelector('.page-favorite-btn');
        if (!btn) return;

        const currentUrl = window.location.pathname;
        const isFavorited = this.favorites.some(fav => fav.url === currentUrl);

        if (isFavorited) {
            btn.classList.add('favorited');
            btn.title = 'Retirer des favoris';
        } else {
            btn.classList.remove('favorited');
            btn.title = 'Ajouter aux favoris';
        }
    }

    // Basculer l'état favori de la page courante
    toggleCurrentPage() {
        const currentUrl = window.location.pathname;
        const existingIndex = this.favorites.findIndex(fav => fav.url === currentUrl);

        if (existingIndex >= 0) {
            this.removeFavorite(existingIndex);
            this.showNotification('Page retirée des favoris', 'remove');
        } else {
            this.addCurrentPage();
        }
    }

    // Ajouter la page courante aux favoris
    addCurrentPage() {
        const currentUrl = window.location.pathname;
        const currentTitle = document.title || 'Page sans titre';

        // Vérifier si déjà en favoris
        if (this.favorites.some(fav => fav.url === currentUrl)) {
            this.showNotification('Cette page est déjà dans vos favoris', 'info');
            return;
        }

        const favorite = {
            id: Date.now(),
            title: currentTitle,
            url: currentUrl,
            dateAdded: new Date().toISOString()
        };

        this.favorites.unshift(favorite); // Ajouter au début
        this.saveFavorites();
        this.renderFavorites();
        this.updateCurrentPageButton();
        this.showNotification('Page ajoutée aux favoris', 'add');
    }

    // Retirer un favori
    removeFavorite(index) {
        this.favorites.splice(index, 1);
        this.saveFavorites();
        this.renderFavorites();
        this.updateCurrentPageButton();
    }

    // Effacer tous les favoris
    clearAllFavorites() {
        if (confirm('Êtes-vous sûr de vouloir effacer tous vos favoris ?')) {
            this.favorites = [];
            this.saveFavorites();
            this.renderFavorites();
            this.updateCurrentPageButton();
            this.showNotification('Tous les favoris ont été effacés', 'remove');
        }
    }

    // Afficher/masquer le modal des favoris
    toggleFavoritesModal() {
        const modal = document.getElementById('favoritesModal');
        if (modal) {
            if (modal.classList.contains('open')) {
                this.closeFavoritesModal();
            } else {
                this.openFavoritesModal();
            }
        }
    }

    // Ouvrir le modal des favoris
    openFavoritesModal() {
        const modal = document.getElementById('favoritesModal');
        if (modal) {
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('open');
            }, 10);
            this.renderFavorites();
            document.body.style.overflow = 'hidden';
        }
    }

    // Fermer le modal des favoris
    closeFavoritesModal() {
        const modal = document.getElementById('favoritesModal');
        if (modal) {
            modal.classList.remove('open');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        }
    }

    // Afficher les favoris dans le modal
    renderFavorites() {
        const favoritesList = document.getElementById('favoritesList');
        if (!favoritesList) return;

        if (this.favorites.length === 0) {
            favoritesList.innerHTML = `
                <div class="favorites-empty">
                    <i class="fas fa-star"></i>
                    <h4>Aucun favori</h4>
                    <p>Ajoutez des pages à vos favoris pour les retrouver facilement.</p>
                </div>
            `;
            return;
        }

        favoritesList.innerHTML = this.favorites.map((favorite, index) => `
            <div class="favorite-item">
                <div class="favorite-header">
                    <h4 class="favorite-title">${this.escapeHtml(favorite.title)}</h4>
                    <div class="favorite-actions">
                        <button class="favorite-btn" onclick="window.location.href='${favorite.url}'" title="Ouvrir">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                        <button class="favorite-btn" onclick="window.wikiFavorites?.removeFavorite(${index})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div class="favorite-url">${this.escapeHtml(favorite.url)}</div>
                <div class="favorite-date">Ajouté le ${this.formatDate(favorite.dateAdded)}</div>
            </div>
        `).join('');
    }

    // Mettre à jour le compteur de favoris
    updateFavoritesCount() {
        const countElement = document.getElementById('favoritesCount');
        if (countElement) {
            countElement.textContent = this.favorites.length;
        }
    }

    // Initialiser les raccourcis clavier
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl+B pour basculer les favoris
            if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
                e.preventDefault();
                this.toggleFavoritesModal();
            }

            // Ctrl+D pour ajouter/retirer la page courante
            if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
                e.preventDefault();
                this.toggleCurrentPage();
            }

            // Échap pour fermer le modal
            if (e.key === 'Escape') {
                this.closeFavoritesModal();
            }
        });
    }

    // Afficher une notification
    showNotification(message, type = 'info') {
        // Retirer les notifications existantes
        document.querySelectorAll('.favorite-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `favorite-notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'add' ? 'star' : type === 'remove' ? 'trash' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--dark-secondary);
            color: var(--text-primary);
            padding: 15px 20px;
            border-radius: 8px;
            border: 1px solid var(--border-color);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
            z-index: 10001;
            animation: slideIn 0.3s ease-out;
            max-width: 300px;
        `;

        // Ajouter les styles d'animation
        if (!document.getElementById('notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }
                .notification-add { border-left: 4px solid #10b981; }
                .notification-remove { border-left: 4px solid #ef4444; }
                .notification-info { border-left: 4px solid #3b82f6; }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Retirer automatiquement après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideIn 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    // Utilitaires
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    formatDate(isoString) {
        const date = new Date(isoString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
}

// Initialiser le système de favoris
document.addEventListener('DOMContentLoaded', () => {
    window.wikiFavorites = new WikiFavorites();
});