// Entity creation and management

// Entity types
const EntityType = {
    TREE: 'tree',
    ROCK: 'rock',
    BUSH: 'bush',
    HOUSE: 'house',
    HOUSE_DOOR: 'house_door',
    PATH: 'path',
    WELL: 'well',
};

// Entity class to represent game objects
class Entity {
    constructor(type, x, y, width, height) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.element = null;
        this.hitbox = {
            x: x,
            y: y,
            width: width,
            height: height
        };

        // Special hitbox adjustments based on entity type
        if (type === EntityType.TREE) {
            // For trees, make the hitbox just the trunk
            this.hitbox = {
                x: x + width * 0.25,
                y: y + height * 0.6,
                width: width * 0.5,
                height: height * 0.4
            };
        } else if (type === EntityType.WELL) {
            // Adjust well hitbox to be slightly smaller than visual
            this.hitbox = {
                x: x + 4,
                y: y + 4,
                width: width - 8,
                height: height - 8
            };
        }
    }

    // Create the DOM element for this entity
    createElements() {
        switch (this.type) {
            case EntityType.TREE:
                this.element = document.createElement('div');
                this.element.className = 'tree';
                this.element.style.left = `${this.x}px`;
                this.element.style.top = `${this.y}px`;

                const trunk = document.createElement('div');
                trunk.className = 'tree-trunk';
                
                const top = document.createElement('div');
                top.className = 'tree-top';
                
                this.element.appendChild(trunk);
                this.element.appendChild(top);
                break;
                
            case EntityType.ROCK:
                this.element = document.createElement('div');
                this.element.className = 'rock';
                this.element.style.left = `${this.x}px`;
                this.element.style.top = `${this.y}px`;
                break;
                
            case EntityType.BUSH:
                this.element = document.createElement('div');
                this.element.className = 'bush';
                this.element.style.left = `${this.x}px`;
                this.element.style.top = `${this.y}px`;
                break;
                
            case EntityType.WELL:
                this.element = document.createElement('div');
                this.element.className = 'well';
                this.element.style.left = `${this.x}px`;
                this.element.style.top = `${this.y}px`;
                break;

            default:
                console.warn(`Unknown entity type: ${this.type}`);
                return null;
        }
        
        return this.element;
    }
    
    // Update the entity's position
    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        
        if (this.element) {
            this.element.style.left = `${x}px`;
            this.element.style.top = `${y}px`;
        }
        
        // Update hitbox position
        if (this.type === EntityType.TREE) {
            this.hitbox.x = x + this.width * 0.25;
            this.hitbox.y = y + this.height * 0.6;
        } else if (this.type === EntityType.WELL) {
            this.hitbox.x = x + 4;
            this.hitbox.y = y + 4;
        } else {
            this.hitbox.x = x;
            this.hitbox.y = y;
        }
    }
    
    // Get the collision rectangle for this entity
    getCollisionRect() {
        return this.hitbox;
    }
}

// Create a tree entity
function createTree(x, y) {
    return new Entity(EntityType.TREE, x, y, 30, 80);
}

// Create a rock entity
function createRock(x, y) {
    return new Entity(EntityType.ROCK, x, y, 25, 15);
}

// Create a bush entity
function createBush(x, y) {
    return new Entity(EntityType.BUSH, x, y, 35, 20);
}

// Create a well entity
function createWell(x, y) {
    return new Entity(EntityType.WELL, x, y, 48, 48);
}