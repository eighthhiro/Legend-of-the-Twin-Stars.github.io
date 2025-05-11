// Player class and controls

class Player {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = CONFIG.player.speed;
        this.element = null;
        this.direction = { x: 0, y: 0 };
        this.isMoving = false;
        
        // Input state
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        
        // Set up event listeners
        this.setupEventListeners();
    }
    
    // Create the DOM element for the player
    createElement() {
        this.element = document.createElement('div');
        this.element.className = 'player';
        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.width = `${this.width}px`;
        this.element.style.height = `${this.height}px`;
        
        return this.element;
    }
    
    // Set up keyboard event listeners
    setupEventListeners() {
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }
    
    // Handle key down events
    handleKeyDown(e) {
        if (e.key.toLowerCase() === 'w') this.keys.w = true;
        if (e.key.toLowerCase() === 'a') this.keys.a = true;
        if (e.key.toLowerCase() === 's') this.keys.s = true;
        if (e.key.toLowerCase() === 'd') this.keys.d = true;
        
        // Prevent scrolling when using arrow keys or WASD
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
            e.preventDefault();
        }
    }
    
    // Handle key up events
    handleKeyUp(e) {
        if (e.key.toLowerCase() === 'w') this.keys.w = false;
        if (e.key.toLowerCase() === 'a') this.keys.a = false;
        if (e.key.toLowerCase() === 's') this.keys.s = false;
        if (e.key.toLowerCase() === 'd') this.keys.d = false;
    }
    
    // Update player position based on input
    update(deltaTime, collisionSystem) {
        // Calculate direction based on current key state
        this.direction.x = 0;
        this.direction.y = 0;
        
        if (this.keys.w) this.direction.y = -1;
        if (this.keys.s) this.direction.y = 1;
        if (this.keys.a) this.direction.x = -1;
        if (this.keys.d) this.direction.x = 1;
        
        // Normalize diagonal movement
        if (this.direction.x !== 0 && this.direction.y !== 0) {
            const factor = 1 / Math.sqrt(2);
            this.direction.x *= factor;
            this.direction.y *= factor;
        }
        
        // Calculate new position
        let newX = this.x + this.direction.x * this.speed;
        let newY = this.y + this.direction.y * this.speed;
        
        // Check boundaries
        newX = Math.max(0, Math.min(CONFIG.width - this.width, newX));
        newY = Math.max(0, Math.min(CONFIG.height - this.height, newY));
        
        // Handle collision if enabled
        if (CONFIG.collision.enabled && collisionSystem) {
            const playerRect = { 
                x: newX, 
                y: newY, 
                width: this.width, 
                height: this.height 
            };
            
            // Try horizontal movement first
            let horizontalRect = { 
                x: newX, 
                y: this.y, 
                width: this.width, 
                height: this.height 
            };
            
            if (!collisionSystem.checkCollision(horizontalRect)) {
                this.x = newX;
            }
            
            // Try vertical movement second
            let verticalRect = { 
                x: this.x, 
                y: newY, 
                width: this.width, 
                height: this.height 
            };
            
            if (!collisionSystem.checkCollision(verticalRect)) {
                this.y = newY;
            }
        } else {
            // No collision, just move
            this.x = newX;
            this.y = newY;
        }
        
        // Update element position
        if (this.element) {
            this.element.style.left = `${this.x}px`;
            this.element.style.top = `${this.y}px`;
        }
        
        // Update debug info
        updateDebugInfo(this);
        
        // Check if we're near the house door for interaction
        this.checkHouseDoorProximity();
    }
    
    // Check if player is near the house door
    checkHouseDoorProximity() {
        const doorRect = {
            x: 380,
            y: 300,
            width: 40,
            height: 80
        };
        
        const playerRect = {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
        
        // Check proximity (within 20px)
        const expandedDoorRect = {
            x: doorRect.x - 20,
            y: doorRect.y - 20,
            width: doorRect.width + 40,
            height: doorRect.height + 40
        };
        
        if (rectsOverlap(playerRect, expandedDoorRect)) {
            // Only show the message if we weren't already in proximity
            if (!this.nearDoor) {
                showMessage("Press 'E' to enter house");
                this.nearDoor = true;
            }
        } else {
            this.nearDoor = false;
        }
    }
    
    // Get collision rectangle for this player
    getCollisionRect() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
}