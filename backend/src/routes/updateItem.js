const db = require('../persistence');

module.exports = async (req, res) => {
    try {
        await db.updateItem(req.params.id, {
            name: req.body.name,
            completed: req.body.completed,
        });
        const item = await db.getItem(req.params.id);
        res.send(item);
    } catch (error) {
        console.error('Error updating item:', error);
        res.status(500).json({ error: 'Failed to update item' });
    }
};
