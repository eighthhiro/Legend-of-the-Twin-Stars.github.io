// Main game class to initialize and run the game

class Game {
    constructor() {
        // Get the game container
        this.container = document.getElementById('game-container');
        this.gameModal = new GameModal();
        
        // Game state
        this.isRunning = false;
        this.lastTimestamp = 0;
        
        // Start by loading assets, then initialize
        this.preloadAssets()
            .then(() => {
                this.initialize();
            })
            .catch(error => {
                console.error('Failed to load game assets:', error);
                // Still try to initialize with fallback assets
                this.initialize();
            });
    }
    
    // Preload game assets
    async preloadAssets() {
        // Create promises for each image to load
        const imagePromises = [
            this.loadImage('./assets/idle.png'),
            this.loadImage('./assets/walk.png')
        ];
        
        // Wait for all images to load
        await Promise.all(imagePromises);
        console.log('All player animation assets loaded');
    }
    
    // Helper to load an image and return a promise
    loadImage(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
            img.src = src;
        });
    }
    
    // Initialize the game
    initialize() {
        // Create the world
        this.world = new World(this.container);
        this.world.generate();
        
        // Create the player
        this.player = new Player(
            CONFIG.player.startX,
            CONFIG.player.startY,
            CONFIG.player.width,
            CONFIG.player.height
        );
        this.container.appendChild(this.player.createElement());
        
        // Create the collision system
        this.collisionSystem = new CollisionSystem(this.world);
        
        // Create the UI
        this.ui = new UI();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start the game loop
        this.start();
    }
    
    // Set up event listeners
    setupEventListeners() {
        // Listen for house entry attempts
        document.addEventListener('try-enter-house', () => {
            this.handleHouseEntry();
        });
    }
    
    // Handle house entry
    handleHouseEntry() {
        // Check if player is near the door
        if (this.player.nearDoor) {
            this.gameModal.showModal();
            // In a full game, this could trigger a scene change or interior view
        }
    }
    
    // Start the game
    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.lastTimestamp = performance.now();
            
            // Show welcome message
            showMessage("Welcome to Pixel Forest! Use WASD to move.", 5000);
            
            // Start the game loop
            requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
        }
    }
    
    // Pause the game
    pause() {
        this.isRunning = false;
    }
    
    // Game loop
    gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        
        // Update game state
        this.update(deltaTime);
        
        // Schedule the next frame
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
    
    // Update game state
    update(deltaTime) {
        // Update player - passing deltaTime directly for animation timing
        this.player.update(deltaTime, this.collisionSystem);
        
        // Update UI
        this.ui.updateDebugInfo(this.player);
        
        // Update collision debug visualization if enabled
        if (CONFIG.collision.showHitboxes) {
            this.collisionSystem.updateDebugVisualization();
        }
    }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const game = new Game();
});