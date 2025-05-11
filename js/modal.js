class GameModal {
    constructor() {
        this.modal = document.getElementById('game-modal');
        this.modalText = document.getElementById('modal-text');
        this.closeButton = document.querySelector('.close-button');
        this.typewriterSpeed = 30; // Speed in ms per character
        this.gameDescription = `Welcome to our Home My Dear!

I made this today while you're so focused with your buod and I've thought of making it meaningful, just for you. For it can be a simple reward for your perseverance and for being the sweetest partner there is.

Just like this game, our story is still under development, we will create more chapters, decorate more floors, and write our story together. Thank you for holding on tight to me, for choosing me, for loving me, you are my home in the middle of the forest. Let's explore the world together, shall we?

Here you are the pink cutie patootie adorable character as I always pictured you. You become more beautiful each day my darling. I will grab that hand and take you on an adventure.

Happiest 29th Monthsary My Darling! You'll always be the Love of my Life! Habibi is so grateful to have you! You are the Best!!! I Love Youuuuuuuuuuuuuuuuuuuuuu!!!!!!!!!!!!!`;

        // Initialize the modal
        this.initialize();
    }

    initialize() {
        // Set up event listeners for the house
        const house = document.querySelector('.house');
        if (house) {
            house.style.cursor = 'pointer';
            house.addEventListener('click', () => this.showModal());
        }

        // Close modal when the X is clicked
        this.closeButton.addEventListener('click', () => this.hideModal());

        // Close modal when ESC key is pressed
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('show')) {
                this.hideModal();
            }
        });
        
        // Close modal when clicking outside the content
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hideModal();
            }
        });
    }

    showModal() {
        // Reset the text and start animation
        this.modalText.textContent = '';
        this.modal.classList.add('show');
        this.typewriterEffect(this.gameDescription);
        
        // Play a sound effect if you have one
        // const sound = new Audio('./assets/ui_open.mp3');
        // sound.play();
    }

    hideModal() {
        this.modal.classList.remove('show');
        
        // Play a sound effect if you have one
        // const sound = new Audio('./assets/ui_close.mp3');
        // sound.play();
    }

    typewriterEffect(text) {
        const characters = text.split('');
        let i = 0;
        
        // Clear any existing timer
        if (this.typewriterTimer) {
            clearInterval(this.typewriterTimer);
        }
        
        this.typewriterTimer = setInterval(() => {
            if (i < characters.length) {
                this.modalText.textContent += characters[i];
                i++;
            } else {
                clearInterval(this.typewriterTimer);
            }
        }, this.typewriterSpeed);
    }
}

// Initialize the modal when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const gameModal = new GameModal();
});