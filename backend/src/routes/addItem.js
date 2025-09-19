const db = require('../persistence');
const { v4: uuid } = require('uuid');

module.exports = async (req, res) => {
    try {
        const now = new Date();
        const item = {
            id: uuid(),
            name: req.body.name,
            completed: false,
            created_at: now,
            updated_at: now,
        };

        await db.storeItem(item);
        
        // Get the stored item to return with proper timestamp formatting
        const storedItem = await db.getItem(item.id);
        res.send(storedItem);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
};
