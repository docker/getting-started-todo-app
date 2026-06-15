const https = require('https');

// Simple hash function to convert query to a number for deterministic images
function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash);
}

module.exports = async (req, res) => {
    const query = req.query.q || 'celebration';
    const width = 400;
    const height = 400;
    
    // Use Picsum Photos with a seed based on the query hash
    // This gives consistent, beautiful images for the same search term
    const seed = hashString(query.toLowerCase().trim());
    const imageUrl = `https://picsum.photos/seed/${seed}/${width}/${height}`;
    
    res.json({
        imageUrl: imageUrl,
        query: query,
    });
};
