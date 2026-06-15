const CATEGORIES = ['work', 'personal', 'shopping'];
const DEFAULT_CATEGORY = 'personal';

function normalizeCategory(category) {
    return CATEGORIES.includes(category) ? category : DEFAULT_CATEGORY;
}

module.exports = { CATEGORIES, DEFAULT_CATEGORY, normalizeCategory };
