// UI management

class UI {
    constructor() {
        this.gameUI = document.getElementById('game-ui');
        this.debugInfo = document.getElementById('debug-info');
        this.messageBox = document.getElementById('message-box');
        
        // Initialize UI
        this.initialize();
    }
    
    // Initialize UI elements
    initialize() {
        // Set visibility of debug info based on config
        this.debugInfo.style.display = CONFIG.debug ? 'block' : 'none';
        
        // Add event listener for 'E' key to handle house entry
        document.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'e') {
                // Game.js will check if player is near door
                this.tryEnterHouse();
            }
        });
    }
    
    // Try to enter the house (will be called from player.js)
    tryEnterHouse() {
        // This is just a placeholder function - the actual implementation
        // would be in Game.js which has access to both the player and world
        const event = new CustomEvent('try-enter-house');
        document.dispatchEvent(event);
    }
    
    // Show a message in the message box
    showMessage(message, duration = 3000) {
        this.messageBox.textContent = message;
        this.messageBox.style.display = 'block';
        
        // Hide the message after the specified duration
        setTimeout(() => {
            this.messageBox.style.display = 'none';
        }, duration);
    }
    
    // Update debug information
    updateDebugInfo(player) {
        if (!CONFIG.debug) return;
        
        this.debugInfo.textContent = `Position: ${Math.round(player.x)},${Math.round(player.y)}`;
    }
}