const db = require('../persistence');
const { v4: uuid } = require('uuid');
const { normalizeCategory } = require('../categories');

const VALID_PRIORITIES = ['low', 'medium', 'high'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

module.exports = async (req, res) => {
    const priority = VALID_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'medium';
    const rawDate = req.body.due_date;
    const due_date = rawDate && DATE_REGEX.test(rawDate) ? rawDate : null;

    const item = {
        id: uuid(),
        name: req.body.name,
        completed: false,
        priority,
        category: normalizeCategory(req.body.category),
        due_date
    };

    await db.storeItem(item);
    res.send(item);
};
