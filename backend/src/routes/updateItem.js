const db = require('../persistence');
const VALID_PRIORITIES = ['low', 'medium', 'high'];
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

module.exports = async (req, res) => {
    const rawDate = req.body.due_date;
    const updates = {
        ...req.body,
        priority: VALID_PRIORITIES.includes(req.body.priority) ? req.body.priority : 'medium', due_date: rawDate && DATE_REGEX.test(rawDate) ? rawDate : null,
    };
    await db.updateItem(req.params.id, updates);
    const item = await db.getItem(req.params.id);
    res.send(item);
};
