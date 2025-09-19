const db = require('../persistence');

module.exports = async (req, res) => {
    try {
        await db.removeItem(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};
