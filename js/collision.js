// Collision detection and handling

class CollisionSystem {
    constructor(world) {
        this.world = world;
        this.debugMode = CONFIG.collision.showHitboxes;
        this.hitboxElements = [];
        
        // Initialize debug visualization if enabled
        if (this.debugMode) {
            this.initializeDebugVisualization();
        }
    }
    
    // Check if a rectangle collides with any entity in the world
    checkCollision(rect) {
        const entities = this.world.getCollidableEntities();
        
        for (const entity of entities) {
            // Skip if this entity is marked as passable
            if (entity.passable) continue;
            
            const entityRect = entity.hitbox || entity.getCollisionRect();
            
            if (rectsOverlap(rect, entityRect)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Initialize debug visualization of hitboxes
    initializeDebugVisualization() {
        const container = this.world.container;
        const entities = this.world.getCollidableEntities();
        
        // Remove existing hitbox elements
        this.hitboxElements.forEach(element => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        });
        this.hitboxElements = [];
        
        // Create hitbox visualizations for all entities
        entities.forEach(entity => {
            const hitbox = entity.hitbox || entity.getCollisionRect();
            
            if (hitbox) {
                const hitboxElement = document.createElement('div');
                hitboxElement.style.position = 'absolute';
                hitboxElement.style.left = `${hitbox.x}px`;
                hitboxElement.style.top = `${hitbox.y}px`;
                hitboxElement.style.width = `${hitbox.width}px`;
                hitboxElement.style.height = `${hitbox.height}px`;
                hitboxElement.style.border = '1px solid rgba(255, 0, 0, 0.7)';
                hitboxElement.style.backgroundColor = 'rgba(255, 0, 0, 0.3)';
                hitboxElement.style.zIndex = '500';
                hitboxElement.style.pointerEvents = 'none'; // Don't interfere with clicks
                
                container.appendChild(hitboxElement);
                this.hitboxElements.push(hitboxElement);
            }
        });
    }
    
    // Update debug visualization (call this when needed to refresh hitboxes)
    updateDebugVisualization() {
        if (!this.debugMode) return;
        
        // Recreate all hitboxes
        this.initializeDebugVisualization();
    }
}