const db = require('../persistence');

module.exports = async (req, res) => {
    try {
        const items = await db.getItemsByUser(req.user.id);
        res.send(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
