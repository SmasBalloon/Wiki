// Système d'agrandissement d'images pour les pages jobs
class ImageModal {
    constructor() {
        this.init();
    }

    init() {
        this.createModal();
        this.bindEvents();
    }

    createModal() {
        // Créer la structure du modal
        const modalHTML = `
            <div id="image-modal" class="image-modal">
                <div class="image-modal-content">
                    <span class="image-modal-close">&times;</span>
                    <img id="modal-image" class="modal-image" src="" alt="">
                    <div class="image-modal-caption" id="modal-caption"></div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Ajouter les styles CSS dynamiquement
        const style = document.createElement('style');
        style.textContent = `
            .image-modal {
                display: none;
                position: fixed;
                z-index: 9999;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                backdrop-filter: blur(5px);
            }

            .image-modal-content {
                position: relative;
                width: 90%;
                max-width: 1200px;
                margin: 2% auto;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 96%;
            }

            .modal-image {
                max-width: 100%;
                max-height: 85%;
                object-fit: contain;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
                transition: transform 0.3s ease;
            }

            .image-modal-close {
                position: absolute;
                top: 20px;
                right: 30px;
                color: #fff;
                font-size: 40px;
                font-weight: bold;
                cursor: pointer;
                z-index: 10000;
                transition: opacity 0.3s ease;
                text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
            }

            .image-modal-close:hover {
                opacity: 0.7;
            }

            .image-modal-caption {
                color: #fff;
                text-align: center;
                padding: 20px;
                font-size: 18px;
                background: rgba(0, 0, 0, 0.5);
                border-radius: 8px;
                margin-top: 20px;
                backdrop-filter: blur(10px);
            }

            /* Animation d'entrée */
            .image-modal.show {
                display: block !important;
                animation: fadeIn 0.3s ease;
            }

            .image-modal.show .modal-image {
                animation: zoomIn 0.3s ease;
            }

            /* Animation de sortie */
            .image-modal.hiding {
                animation: fadeOut 0.3s ease;
            }

            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }

            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }

            @keyframes zoomIn {
                from { 
                    opacity: 0;
                    transform: scale(0.3);
                }
                to { 
                    opacity: 1;
                    transform: scale(1);
                }
            }

            /* Responsive */
            @media (max-width: 768px) {
                .image-modal-content {
                    width: 95%;
                    margin: 5% auto;
                    height: 90%;
                }

                .image-modal-close {
                    top: 10px;
                    right: 15px;
                    font-size: 30px;
                }

                .image-modal-caption {
                    font-size: 16px;
                    padding: 15px;
                }
            }

            /* Curseur pointer pour les images cliquables */
            .location-image img {
                cursor: pointer;
                transition: transform 0.3s ease, filter 0.3s ease;
            }

            .location-image img:hover {
                transform: scale(1.05);
                filter: brightness(1.1);
            }
        `;
        
        document.head.appendChild(style);
    }

    bindEvents() {
        // Rendre toutes les images des sections location cliquables
        document.addEventListener('click', (e) => {
            if (e.target.matches('.location-image img')) {
                this.openModal(e.target);
            }
        });

        // Fermer le modal
        document.addEventListener('click', (e) => {
            if (e.target.matches('.image-modal-close') || 
                e.target.matches('.image-modal')) {
                this.closeModal();
            }
        });

        // Fermer avec Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    openModal(img) {
        const modal = document.getElementById('image-modal');
        const modalImg = document.getElementById('modal-image');
        const caption = document.getElementById('modal-caption');

        modalImg.src = img.src;
        caption.textContent = img.alt;
        modal.style.display = 'block';
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        const modal = document.getElementById('image-modal');
        modal.classList.remove('show');
        modal.classList.add('hiding');
        document.body.style.overflow = '';
        
        // Attendre la fin de l'animation avant de cacher
        setTimeout(() => {
            modal.classList.remove('hiding');
            modal.style.display = 'none';
        }, 300);
    }
}

// Initialiser le système d'images dès que le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    new ImageModal();
});
