// Utility functions

// Generate a random number between min and max (inclusive)
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Check if a point is inside a rectangle
function pointInRect(x, y, rect) {
    return x >= rect.x && 
           x <= rect.x + rect.width && 
           y >= rect.y && 
           y <= rect.y + rect.height;
}

// Check if two rectangles overlap
function rectsOverlap(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Find a random position within specified spawn areas
function getRandomPosition(spawnAreas, entityWidth, entityHeight) {
    // Select a random spawn area
    const area = spawnAreas[randomInt(0, spawnAreas.length - 1)];
    
    // Generate position within that area
    const x = randomInt(area.x, area.x + area.width - entityWidth);
    const y = randomInt(area.y, area.y + area.height - entityHeight);
    
    return { x, y };
}

// Show a temporary message
function showMessage(message, duration = 3000) {
    const messageBox = document.getElementById('message-box');
    messageBox.textContent = message;
    messageBox.style.display = 'block';
    
    setTimeout(() => {
        messageBox.style.display = 'none';
    }, duration);
}

// Update debug information
function updateDebugInfo(player) {
    if (!CONFIG.debug) return;
    
    const debugInfo = document.getElementById('debug-info');
    debugInfo.textContent = `Position: ${Math.round(player.x)},${Math.round(player.y)}`;
}