const db = require('../persistence');
const { v4: uuid } = require('uuid');
const { normalizeCategory } = require('../categories');
const VALID_PRIORITIES = ['low', 'medium', 'high'];

module.exports = async (req, res) => {
    const priority = VALID_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'medium';
    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
        priority,
        category: normalizeCategory(req.body.category),
    };

    await db.storeItem(item);
    res.send(item);
};
