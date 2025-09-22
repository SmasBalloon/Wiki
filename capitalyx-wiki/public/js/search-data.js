// Base de données de recherche pour le wiki Capitalyx
window.searchData = [
    // Règlement
    {
        title: "Respect et Courtoisie",
        category: "rules",
        description: "Tout manque de respect envers les autres joueurs ou le staff est strictement interdit.",
        url: "/rules#regles-generales",
        keywords: ["respect", "courtoisie", "politesse", "comportement"]
    },
    {
        title: "Langage Approprié",
        category: "rules",
        description: "Les insultes, propos discriminatoires ou haineux ne sont pas tolérés.",
        url: "/rules#regles-generales",
        keywords: ["langage", "insultes", "discrimination", "haine"]
    },
    {
        title: "Publicité Interdite",
        category: "rules",
        description: "Toute forme de publicité pour d'autres serveurs ou services externes est interdite.",
        url: "/rules#regles-generales",
        keywords: ["publicité", "spam", "promotion", "serveur"]
    },
    {
        title: "Choix de Métier",
        category: "rules",
        description: "Chaque joueur peut choisir librement son métier et en changer à tout moment.",
        url: "/rules#regles-metiers",
        keywords: ["métier", "job", "choix", "liberté"]
    },
    {
        title: "Entraide Encouragée",
        category: "rules",
        description: "L'échange de ressources et l'entraide entre joueurs sont fortement encouragés.",
        url: "/rules#regles-metiers",
        keywords: ["entraide", "échange", "ressources", "coopération"]
    },
    {
        title: "Ambiance Chill",
        category: "rules",
        description: "Le serveur privilégie une ambiance détendue et conviviale.",
        url: "/rules#regles-gameplay",
        keywords: ["chill", "détendu", "ambiance", "convivial"]
    },
    {
        title: "Griefing Interdit",
        category: "rules",
        description: "Détruire ou saboter le travail d'autres joueurs volontairement est strictement interdit.",
        url: "/rules#regles-gameplay",
        keywords: ["griefing", "destruction", "sabotage", "vandalisme"]
    },
    {
        title: "Sanctions",
        category: "rules",
        description: "Système de sanctions : avertissement, kick temporaire, bannissement.",
        url: "/rules#sanctions",
        keywords: ["sanctions", "avertissement", "kick", "ban", "bannissement"]
    },

    // Guides
    {
        title: "Comment Rejoindre le Serveur",
        category: "guides",
        description: "Instructions complètes pour vous connecter à Capitalyx pour la première fois.",
        url: "/guides#guides-debutant",
        keywords: ["rejoindre", "connexion", "serveur", "FiveM", "débutant"]
    },
    {
        title: "Création de Personnage",
        category: "guides",
        description: "Guide pour créer votre personnage et choisir votre orientation business.",
        url: "/guides#guides-debutant",
        keywords: ["création", "personnage", "character", "business", "entrepreneur"]
    },
    {
        title: "Lieux de Production",
        category: "guides",
        description: "Découvrez les zones clés pour développer votre business.",
        url: "/guides#zones-activite",
        keywords: ["production", "zones", "fermes", "mines", "commerce", "entrepôts"]
    },
    {
        title: "Choisir son Métier",
        category: "guides",
        description: "Guide pour sélectionner le métier qui correspond à votre style de jeu.",
        url: "/guides#metiers-business",
        keywords: ["métier", "fermier", "mineur", "commerçant", "transporteur"]
    },
    {
        title: "Système d'Échanges",
        category: "guides",
        description: "Comment commercer avec d'autres joueurs et bénéficier des bonus de groupe.",
        url: "/guides#metiers-business",
        keywords: ["échanges", "commerce", "troc", "marché", "bonus"]
    },
    {
        title: "Communication",
        category: "guides",
        description: "Guide des différents moyens de communiquer et collaborer.",
        url: "/guides#communication",
        keywords: ["communication", "chat", "équipe", "collaboration"]
    },
    {
        title: "Factions et Bonus",
        category: "guides",
        description: "Les factions offrent des avantages pour optimiser votre progression.",
        url: "/guides#factions",
        keywords: ["factions", "bonus", "XP", "avantages", "événements"]
    },

    // Métiers
    {
        title: "Chauffeur de Taxi",
        category: "jobs",
        description: "Transport de passagers et missions de taxi.",
        url: "/jobs/cab",
        keywords: ["taxi", "chauffeur", "transport", "passagers"]
    },
    {
        title: "Chauffeur de Bus",
        category: "jobs",
        description: "Transport public et lignes de bus.",
        url: "/jobs/busdriver",
        keywords: ["bus", "transport", "public", "lignes"]
    },
    {
        title: "Livreur",
        category: "jobs",
        description: "Livraison et transport de colis.",
        url: "/jobs/courier",
        keywords: ["livraison", "colis", "coursier", "transport"]
    },
    {
        title: "Conducteur de Train",
        category: "jobs",
        description: "Conduite de trains sur le réseau ferroviaire.",
        url: "/jobs/trainconductor",
        keywords: ["train", "conducteur", "ferroviaire", "transport"]
    },
    {
        title: "Chauffeur de Camion",
        category: "jobs",
        description: "Transport de marchandises et livraisons longue distance.",
        url: "/jobs/truckdriver",
        keywords: ["camion", "truck", "marchandises", "livraison", "fret"]
    },
    {
        title: "Pilote d'Avion",
        category: "jobs",
        description: "Transport aérien de passagers et de fret.",
        url: "/jobs/avionpilot",
        keywords: ["avion", "pilote", "aviation", "vol", "aérien"]
    },
    {
        title: "Pilote d'Hélicoptère",
        category: "jobs",
        description: "Missions en hélicoptère et transport spécialisé.",
        url: "/jobs/helicopterdriver",
        keywords: ["hélicoptère", "helicopter", "pilote", "missions", "transport"]
    },
    {
        title: "Services d'Urgence (EMS)",
        category: "jobs",
        description: "Services médicaux d'urgence et assistance aux joueurs.",
        url: "/jobs/ems",
        keywords: ["ems", "urgence", "médical", "ambulance", "secours", "santé"]
    },

    // Commandes
    {
        title: "/pay [id] [montant]",
        category: "commands",
        description: "Donne de l'argent liquide à un autre joueur.",
        url: "/commands",
        keywords: ["pay", "payer", "argent", "donation", "transfer"]
    },
    {
        title: "/trade",
        category: "commands",
        description: "Proposer un échange avec un autre joueur.",
        url: "/commands",
        keywords: ["trade", "échange", "commerce", "troc"]
    },
    {
        title: "/help",
        category: "commands",
        description: "Demander de l'aide aux autres joueurs ou au staff.",
        url: "/commands",
        keywords: ["help", "aide", "assistance", "support"]
    },
    {
        title: "/market",
        category: "commands",
        description: "Accéder au marché pour acheter et vendre.",
        url: "/commands",
        keywords: ["market", "marché", "achat", "vente"]
    },
    {
        title: "/team",
        category: "commands",
        description: "Communication d'équipe pour coordonner les actions.",
        url: "/commands",
        keywords: ["team", "équipe", "coordination", "communication"]
    },

    // FAQ
    {
        title: "Questions Fréquentes",
        category: "faq",
        description: "Réponses aux questions les plus courantes sur Capitalyx.",
        url: "/faq",
        keywords: ["faq", "questions", "réponses", "problèmes", "aide"]
    }
];

// Fonction utilitaire pour obtenir le nom de catégorie localisé
window.getCategoryName = function(category) {
    const names = {
        'main': 'Principal',
        'rules': 'Règlement',
        'guides': 'Guides',
        'jobs': 'Métiers',
        'commands': 'Commandes',
        'faq': 'FAQ'
    };
    return names[category] || category;
};