const db = require('../persistence');
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const { normalizeCategory } = require('../categories');

module.exports = async (req, res) => {
    const updates = {
        ...req.body,
        priority: VALID_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'medium'
    };
    await db.updateItem(req.params.id, updates);
    const item = await db.getItem(req.params.id);
    res.send(item);
};
