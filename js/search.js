// Système de recherche pour le wiki Capitalyx
class WikiSearch {
    constructor() {
        this.searchModal = document.getElementById('searchModal');
        this.searchInput = document.getElementById('searchInput');
        this.searchClear = document.getElementById('searchClear');
        this.searchResults = document.getElementById('searchResults');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.currentFilter = 'all';
        this.selectedIndex = -1;

        // Base de données de recherche
        this.searchData = [
            // Règlement
            {
                title: "Respect et Courtoisie",
                category: "rules",
                description: "Tout manque de respect envers les autres joueurs ou le staff est strictement interdit.",
                url: "rules.html#regles-generales",
                keywords: ["respect", "courtoisie", "politesse", "comportement"]
            },
            {
                title: "Langage Approprié",
                category: "rules",
                description: "Les insultes, propos discriminatoires ou haineux ne sont pas tolérés.",
                url: "rules.html#regles-generales",
                keywords: ["langage", "insultes", "discrimination", "haine"]
            },
            {
                title: "Publicité Interdite",
                category: "rules",
                description: "Toute forme de publicité pour d'autres serveurs ou services externes est interdite.",
                url: "rules.html#regles-generales",
                keywords: ["publicité", "spam", "promotion", "serveur"]
            },
            {
                title: "Choix de Métier",
                category: "rules",
                description: "Chaque joueur peut choisir librement son métier et en changer à tout moment.",
                url: "rules.html#regles-metiers",
                keywords: ["métier", "job", "choix", "liberté"]
            },
            {
                title: "Entraide Encouragée",
                category: "rules",
                description: "L'échange de ressources et l'entraide entre joueurs sont fortement encouragés.",
                url: "rules.html#regles-metiers",
                keywords: ["entraide", "échange", "ressources", "coopération"]
            },
            {
                title: "Ambiance Chill",
                category: "rules",
                description: "Le serveur privilégie une ambiance détendue et conviviale.",
                url: "rules.html#regles-gameplay",
                keywords: ["chill", "détendu", "ambiance", "convivial"]
            },
            {
                title: "Griefing Interdit",
                category: "rules",
                description: "Détruire ou saboter le travail d'autres joueurs volontairement est strictement interdit.",
                url: "rules.html#regles-gameplay",
                keywords: ["griefing", "destruction", "sabotage", "vandalisme"]
            },
            {
                title: "Sanctions",
                category: "rules",
                description: "Système de sanctions : avertissement, kick temporaire, bannissement.",
                url: "rules.html#sanctions",
                keywords: ["sanctions", "avertissement", "kick", "ban", "bannissement"]
            },

            // Guides
            {
                title: "Comment Rejoindre le Serveur",
                category: "guides",
                description: "Instructions complètes pour vous connecter à Capitalyx pour la première fois.",
                url: "guides.html#guides-debutant",
                keywords: ["rejoindre", "connexion", "serveur", "FiveM", "débutant"]
            },
            {
                title: "Création de Personnage",
                category: "guides",
                description: "Guide pour créer votre personnage et choisir votre orientation business.",
                url: "guides.html#guides-debutant",
                keywords: ["création", "personnage", "character", "business", "entrepreneur"]
            },
            {
                title: "Lieux de Production",
                category: "guides",
                description: "Découvrez les zones clés pour développer votre business.",
                url: "guides.html#zones-activite",
                keywords: ["production", "zones", "fermes", "mines", "commerce", "entrepôts"]
            },
            {
                title: "Choisir son Métier",
                category: "guides",
                description: "Guide pour sélectionner le métier qui correspond à votre style de jeu.",
                url: "guides.html#metiers-business",
                keywords: ["métier", "fermier", "mineur", "commerçant", "transporteur"]
            },
            {
                title: "Système d'Échanges",
                category: "guides",
                description: "Comment commercer avec d'autres joueurs et bénéficier des bonus de groupe.",
                url: "guides.html#metiers-business",
                keywords: ["échanges", "commerce", "troc", "marché", "bonus"]
            },
            {
                title: "Communication",
                category: "guides",
                description: "Guide des différents moyens de communiquer et collaborer.",
                url: "guides.html#communication",
                keywords: ["communication", "chat", "équipe", "collaboration"]
            },
            {
                title: "Factions et Bonus",
                category: "guides",
                description: "Les factions offrent des avantages pour optimiser votre progression.",
                url: "guides.html#factions",
                keywords: ["factions", "bonus", "XP", "avantages", "événements"]
            },

            // Métiers
            {
                title: "Chauffeur de Taxi",
                category: "jobs",
                description: "Transport de passagers et missions de taxi.",
                url: "jobs.html",
                keywords: ["taxi", "chauffeur", "transport", "passagers"]
            },
            {
                title: "Chauffeur de Bus",
                category: "jobs",
                description: "Transport public et lignes de bus.",
                url: "jobs/busdriver.html",
                keywords: ["bus", "transport", "public", "lignes"]
            },
            {
                title: "Livreur",
                category: "jobs",
                description: "Livraison et transport de colis.",
                url: "jobs/courier.html",
                keywords: ["livraison", "colis", "coursier", "transport"]
            },
            {
                title: "Conducteur de Train",
                category: "jobs",
                description: "Conduite de trains sur le réseau ferroviaire.",
                url: "jobs/trainconductor.html",
                keywords: ["train", "conducteur", "ferroviaire", "transport"]
            },

            // Commandes
            {
                title: "/pay [id] [montant]",
                category: "commands",
                description: "Donne de l'argent liquide à un autre joueur.",
                url: "commands.html",
                keywords: ["pay", "payer", "argent", "donation", "transfer"]
            },
            {
                title: "/trade",
                category: "commands",
                description: "Proposer un échange avec un autre joueur.",
                url: "commands.html",
                keywords: ["trade", "échange", "commerce", "troc"]
            },
            {
                title: "/help",
                category: "commands",
                description: "Demander de l'aide aux autres joueurs ou au staff.",
                url: "commands.html",
                keywords: ["help", "aide", "assistance", "support"]
            },
            {
                title: "/market",
                category: "commands",
                description: "Accéder au marché pour acheter et vendre.",
                url: "commands.html",
                keywords: ["market", "marché", "achat", "vente"]
            },
            {
                title: "/team",
                category: "commands",
                description: "Communication d'équipe pour coordonner les actions.",
                url: "commands.html",
                keywords: ["team", "équipe", "coordination", "communication"]
            },

            // FAQ
            {
                title: "Questions Fréquentes",
                category: "faq",
                description: "Réponses aux questions les plus courantes sur Capitalyx.",
                url: "faq.html",
                keywords: ["faq", "questions", "réponses", "problèmes", "aide"]
            }
        ];

        this.init();
    }

    init() {
        // Event listeners
        this.searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        this.searchInput.addEventListener('focus', () => this.showResults());
        this.searchClear.addEventListener('click', () => this.clearSearch());

        // Filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', (e) => this.setFilter(e.target.dataset.filter));
        });

        // Fermer les résultats quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.search-container')) {
                this.hideResults();
            }
        });

        // Raccourcis clavier
        document.addEventListener('keydown', (e) => {
            // Ctrl+K pour ouvrir le modal
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.openModal();
                return;
            }

            // Si le modal est ouvert
            if (this.isModalOpen()) {
                // Escape pour fermer
                if (e.key === 'Escape') {
                    e.preventDefault();
                    this.closeModal();
                    return;
                }

                // Navigation avec flèches
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    this.navigateResults(1);
                    return;
                }

                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    this.navigateResults(-1);
                    return;
                }

                // Enter pour sélectionner
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.selectResult();
                    return;
                }
            }
        });
    }

    handleSearch(query) {
        query = query.trim().toLowerCase();

        // Afficher/masquer le bouton clear
        if (query.length > 0) {
            this.searchClear.classList.add('visible');
        } else {
            this.searchClear.classList.remove('visible');
            this.hideResults();
            return;
        }

        // Recherche en temps réel
        const results = this.search(query);
        this.displayResults(results, query);
        this.showResults();
    }

    search(query) {
        if (query.length < 2) return [];

        const results = this.searchData.filter(item => {
            // Filtrer par catégorie si nécessaire
            if (this.currentFilter !== 'all' && item.category !== this.currentFilter) {
                return false;
            }

            // Recherche dans le titre, description et mots-clés
            const searchText = (
                item.title + ' ' +
                item.description + ' ' +
                item.keywords.join(' ')
            ).toLowerCase();

            return searchText.includes(query);
        });

        // Trier par pertinence (titre > description > mots-clés)
        return results.sort((a, b) => {
            const aTitle = a.title.toLowerCase().includes(query) ? 3 : 0;
            const aDesc = a.description.toLowerCase().includes(query) ? 2 : 0;
            const aKeywords = a.keywords.some(k => k.includes(query)) ? 1 : 0;

            const bTitle = b.title.toLowerCase().includes(query) ? 3 : 0;
            const bDesc = b.description.toLowerCase().includes(query) ? 2 : 0;
            const bKeywords = b.keywords.some(k => k.includes(query)) ? 1 : 0;

            return (bTitle + bDesc + bKeywords) - (aTitle + aDesc + aKeywords);
        });
    }

    displayResults(results, query) {
        this.selectedIndex = -1; // Reset selection

        if (results.length === 0) {
            this.searchResults.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Aucun résultat trouvé pour "${query}"</p>
                    <small>Essayez avec des mots-clés différents</small>
                </div>
            `;
            return;
        }

        const html = results.map((result, index) => {
            const highlightedTitle = this.highlightText(result.title, query);
            const highlightedDesc = this.highlightText(result.description, query);
            const categoryName = this.getCategoryName(result.category);

            return `
                <div class="search-result-item" data-index="${index}" data-url="${result.url}">
                    <div class="result-category">${categoryName}</div>
                    <div class="result-title">${highlightedTitle}</div>
                    <div class="result-description">${highlightedDesc}</div>
                </div>
            `;
        }).join('');

        this.searchResults.innerHTML = html;

        // Add click events
        this.searchResults.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                window.location.href = item.dataset.url;
            });
        });
    }

    highlightText(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<span class="result-highlight">$1</span>');
    }

    getCategoryName(category) {
        const names = {
            'rules': 'Règlement',
            'guides': 'Guides',
            'jobs': 'Métiers',
            'commands': 'Commandes',
            'faq': 'FAQ'
        };
        return names[category] || category;
    }

    setFilter(filter) {
        this.currentFilter = filter;

        // Update active button
        this.filterButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');

        // Re-run search if there's a query
        const query = this.searchInput.value.trim();
        if (query.length > 0) {
            this.handleSearch(query);
        }
    }

    clearSearch() {
        this.searchInput.value = '';
        this.searchClear.classList.remove('visible');
        this.hideResults();
        this.searchInput.focus();
    }

    showResults() {
        if (this.searchResults.innerHTML.trim() !== '') {
            this.searchResults.classList.add('visible');
        }
    }

    hideResults() {
        this.searchResults.classList.remove('visible');
    }

    // Modal functions
    openModal() {
        this.searchModal.classList.add('open');
        document.body.style.overflow = 'hidden';

        // Focus input after animation
        setTimeout(() => {
            this.searchInput.focus();
        }, 100);
    }

    closeModal() {
        this.searchModal.classList.remove('open');
        document.body.style.overflow = '';
        this.clearSearch();
    }

    isModalOpen() {
        return this.searchModal.classList.contains('open');
    }

    // Navigation functions
    navigateResults(direction) {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        if (items.length === 0) return;

        // Remove current selection
        if (this.selectedIndex >= 0) {
            items[this.selectedIndex].classList.remove('selected');
        }

        // Update index
        this.selectedIndex += direction;

        // Wrap around
        if (this.selectedIndex >= items.length) {
            this.selectedIndex = 0;
        } else if (this.selectedIndex < 0) {
            this.selectedIndex = items.length - 1;
        }

        // Add new selection
        items[this.selectedIndex].classList.add('selected');

        // Scroll into view
        items[this.selectedIndex].scrollIntoView({
            block: 'nearest',
            behavior: 'smooth'
        });
    }

    selectResult() {
        const items = this.searchResults.querySelectorAll('.search-result-item');
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            const url = items[this.selectedIndex].dataset.url;
            window.location.href = url;
        }
    }
}

// Global functions for modal
function openSearchModal() {
    if (window.wikiSearch) {
        window.wikiSearch.openModal();
    }
}

function closeSearchModal() {
    if (window.wikiSearch) {
        window.wikiSearch.closeModal();
    }
}

// Initialiser la recherche quand le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('searchInput')) {
        window.wikiSearch = new WikiSearch();
    }
});