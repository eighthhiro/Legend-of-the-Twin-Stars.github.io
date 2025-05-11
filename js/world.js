// World generation and management

class World {
    constructor(container) {
        this.container = container;
        this.entities = [];
        this.houseEntities = [];
        this.fixedEntities = [];
        this.grassTiles = [];
        this.pathTiles = [];
        
        // Define the house collision areas
        this.initializeHouseCollisions();
    }
    
    // Initialize house collision areas
    initializeHouseCollisions() {
        // Main house body
        this.houseEntities.push({
            type: EntityType.HOUSE,
            hitbox: {
                x: 320,
                y: 240,
                width: 120,
                height: 140
            }
        });
        
        // House door (allow player to stand in front of it)
        this.houseEntities.push({
            type: EntityType.HOUSE_DOOR,
            hitbox: {
                x: 380,
                y: 300,
                width: 40,
                height: 60
            },
            passable: true
        });
    }
    
    // Generate the world with trees, rocks, bushes, grass, path, and fixed objects
    generate() {
        // Generate grass textures first (lowest layer)
        this.generateGrass();
        
        // Generate path from house to bottom of screen
        this.generatePath();
        
        // Generate fixed objects (well only - garden beds and fences removed)
        this.generateFixedObjects();
        
        // Generate random objects
        this.generateTrees();
        this.generateRocks();
        this.generateBushes();
        
        // Add all entities to the container
        this.addAllEntities();
    }
    
    // Add all entities to the container in the correct order
    addAllEntities() {
        // Add grass tiles first (bottom layer)
        this.grassTiles.forEach(tile => {
            this.container.appendChild(tile);
        });
        
        // Add path tiles next
        this.pathTiles.forEach(tile => {
            this.container.appendChild(tile);
        });
        
        // Add fixed entities
        this.fixedEntities.forEach(entity => {
            const element = entity.createElements();
            if (element) {
                this.container.appendChild(element);
            }
        });
        
        // Add random entities
        this.entities.forEach(entity => {
            const element = entity.createElements();
            if (element) {
                this.container.appendChild(element);
            }
        });
    }
    
    // Generate grass texture tiles across the map
    generateGrass() {
        const tileSize = 32; // Size of each grass tile
        
        // Calculate how many tiles we need to cover the map
        const horizontalTiles = Math.ceil(CONFIG.width / tileSize);
        const verticalTiles = Math.ceil(CONFIG.height / tileSize);
        
        // Create grass tiles
        for (let y = 0; y < verticalTiles; y++) {
            for (let x = 0; x < horizontalTiles; x++) {
                const grassTile = document.createElement('div');
                grassTile.className = 'grass-texture';
                grassTile.style.left = `${x * tileSize}px`;
                grassTile.style.top = `${y * tileSize}px`;
                
                // Add some variation to the grass
                const rotation = Math.floor(Math.random() * 4) * 90; // 0, 90, 180, or 270 degrees
                grassTile.style.transform = `rotate(${rotation}deg)`;
                
                // Add slight color variation
                const hue = 80 + Math.floor(Math.random() * 20); // Green hue variation
                const saturation = 70 + Math.floor(Math.random() * 20);
                grassTile.style.filter = `hue-rotate(${hue - 80}deg) saturate(${saturation}%)`;
                
                this.grassTiles.push(grassTile);
            }
        }
    }
    
    // Generate path from house to bottom of screen
    generatePath() {
        const pathWidth = 64; // Width of path tiles
        const centerX = 380; // Center of the screen horizontally
        const startY = 380; // Start below the house
        
        // Calculate how many path tiles we need to reach the bottom
        const pathLength = Math.ceil((CONFIG.height - startY) / pathWidth) + 1;
        
        // Create path tiles
        for (let i = 0; i < pathLength; i++) {
            const pathTile = document.createElement('div');
            pathTile.className = 'path-tile';
            
            // Center the path horizontally and place it vertically
            pathTile.style.left = `${centerX - (pathWidth / 2)}px`;
            pathTile.style.top = `${startY + (i * pathWidth)}px`;
            
            this.pathTiles.push(pathTile);
            
            // Add path collision handling (paths are walkable)
            const pathEntity = {
                type: EntityType.PATH,
                hitbox: {
                    x: centerX - (pathWidth / 2),
                    y: startY + (i * pathWidth),
                    width: pathWidth,
                    height: pathWidth
                },
                passable: true
            };
            
            this.houseEntities.push(pathEntity); // Add to house entities for collision detection
        }
    }
    
    // Generate fixed objects (well only - garden beds and fences removed)
    generateFixedObjects() {
        // Add well to the right of path
        const well = createWell(500, 450);
        this.fixedEntities.push(well);
    }
    
    // Generate trees
    generateTrees() {
        for (let i = 0; i < CONFIG.world.trees; i++) {
            let position;
            let overlapping;
            let attempts = 0;
            
            // Try to find a non-overlapping position
            do {
                position = getRandomPosition(CONFIG.world.spawnAreas, 30, 80);
                overlapping = this.checkEntityOverlap(position.x, position.y, 30, 80);
                attempts++;
            } while (overlapping && attempts < 50);
            
            // If we found a valid position, create the tree
            if (!overlapping) {
                const tree = createTree(position.x, position.y);
                this.entities.push(tree);
            }
        }
        
        // Add a few fixed trees
        const fixedTreePositions = [
            {x: 100, y: 100}, 
            {x: 650, y: 150},
            {x: 150, y: 500},
            {x: 600, y: 500}
        ];
        
        fixedTreePositions.forEach(pos => {
            if (!this.checkEntityOverlap(pos.x, pos.y, 30, 80)) {
                const tree = createTree(pos.x, pos.y);
                this.entities.push(tree);
            }
        });
    }
    
    // Generate rocks
    generateRocks() {
        for (let i = 0; i < CONFIG.world.rocks; i++) {
            let position;
            let overlapping;
            let attempts = 0;
            
            // Try to find a non-overlapping position
            do {
                position = getRandomPosition(CONFIG.world.spawnAreas, 25, 15);
                overlapping = this.checkEntityOverlap(position.x, position.y, 25, 15);
                attempts++;
            } while (overlapping && attempts < 50);
            
            // If we found a valid position, create the rock
            if (!overlapping) {
                const rock = createRock(position.x, position.y);
                this.entities.push(rock);
            }
        }
        
        // Add some fixed rocks along the path
        const fixedRockPositions = [
            {x: 360, y: 430},
            {x: 420, y: 480},
            {x: 370, y: 520}
        ];
        
        fixedRockPositions.forEach(pos => {
            if (!this.checkEntityOverlap(pos.x, pos.y, 25, 15)) {
                const rock = createRock(pos.x, pos.y);
                this.entities.push(rock);
            }
        });
    }
    
    // Generate bushes
    generateBushes() {
        for (let i = 0; i < CONFIG.world.bushes; i++) {
            let position;
            let overlapping;
            let attempts = 0;
            
            // Try to find a non-overlapping position
            do {
                position = getRandomPosition(CONFIG.world.spawnAreas, 35, 20);
                overlapping = this.checkEntityOverlap(position.x, position.y, 35, 20);
                attempts++;
            } while (overlapping && attempts < 50);
            
            // If we found a valid position, create the bush
            if (!overlapping) {
                const bush = createBush(position.x, position.y);
                this.entities.push(bush);
            }
        }
        
        // Add some fixed bushes
        const fixedBushPositions = [
            {x: 295, y: 200},
            {x: 470, y: 200},
            {x: 200, y: 400},
            {x: 550, y: 400}
        ];
        
        fixedBushPositions.forEach(pos => {
            if (!this.checkEntityOverlap(pos.x, pos.y, 35, 20)) {
                const bush = createBush(pos.x, pos.y);
                this.entities.push(bush);
            }
        });
    }
    
    // Check if a new entity would overlap with existing entities or house
    checkEntityOverlap(x, y, width, height) {
        const newRect = { x, y, width, height };
        
        // Check if it overlaps with existing entities
        for (const entity of [...this.entities, ...this.fixedEntities]) {
            const entityRect = entity.getCollisionRect();
            if (rectsOverlap(newRect, entityRect)) {
                return true;
            }
        }
        
        // Check if it overlaps with the house area
        if (rectsOverlap(newRect, CONFIG.world.houseArea)) {
            return true;
        }
        
        // Check if it overlaps with path area
        for (let i = 0; i < this.pathTiles.length; i++) {
            const pathTile = this.pathTiles[i];
            const left = parseInt(pathTile.style.left);
            const top = parseInt(pathTile.style.top);
            const pathRect = { x: left, y: top, width: 64, height: 64 };
            
            if (rectsOverlap(newRect, pathRect)) {
                return true;
            }
        }
        
        return false;
    }
    
    // Get all collidable entities
    getCollidableEntities() {
        return [...this.entities, ...this.houseEntities, ...this.fixedEntities];
    }
}