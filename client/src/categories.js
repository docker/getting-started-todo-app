export const CATEGORIES = ['work', 'personal', 'shopping'];
export const DEFAULT_CATEGORY = 'personal';

export function formatCategoryLabel(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
}
