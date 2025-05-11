// Game Configuration
const CONFIG = {
    // Game settings
    width: 800,
    height: 600,
    pixelSize: 4,
    
    // Player settings
    player: {
        width: 32,
        height: 32,
        speed: 3,
        startX: 400,
        startY: 400
    },
    
    // World settings
    world: {
        trees: 12,     // Reduced number of trees to accommodate fixed objects
        rocks: 8,      // Reduced number of rocks
        bushes: 10,    // Reduced number of bushes
        
        // Boundaries where objects can spawn (avoid house area and path)
        spawnAreas: [
            // Top section
            { x: 50, y: 50, width: 700, height: 130 },
            // Bottom section, avoid path
            { x: 50, y: 370, width: 320, height: 180 },  // Left of path
            { x: 430, y: 370, width: 320, height: 180 }, // Right of path
            // Left section
            { x: 50, y: 180, width: 240, height: 190 },
            // Right section
            { x: 510, y: 180, width: 240, height: 190 }
        ],
        
        // Central house area to avoid when spawning entities
        houseArea: {
            x: 290,
            y: 180,
            width: 220,
            height: 190
        },
        
        // Path area to avoid when spawning entities
        pathArea: {
            x: 350,
            y: 380,
            width: 60,
            height: 220
        }
    },
    
    // Collision settings
    collision: {
        enabled: true,
        showHitboxes: false  // Set to true for debugging
    },
    
    // Debug settings
    debug: true  // Set to false to hide debug information
};