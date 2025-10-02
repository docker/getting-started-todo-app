const db = require('../../persistence');
const { v4: uuid } = require('uuid');

/**
 * Get all todo items for authenticated user
 * @route GET /api/items
 */
const getItems = async (req, res) => {
    try {
        const items = await db.getItemsByUser(req.user.id);
        res.send(items);
    } catch (error) {
        console.error('Error fetching items:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

/**
 * Create a new todo item
 * @route POST /api/items
 */
const addItem = async (req, res) => {
    try {
        const now = new Date();
        const item = {
            id: uuid(),
            name: req.body.name,
            completed: false,
            created_at: now,
            updated_at: now,
        };

        await db.storeItemForUser(item, req.user.id);

        // Get the stored item to return with proper timestamp formatting
        const storedItem = await db.getItem(item.id);
        res.send(storedItem);
    } catch (error) {
        console.error('Error adding item:', error);
        res.status(500).json({ error: 'Failed to add item' });
    }
};

/**
 * Update an existing todo item
 * @route PUT /api/items/:id
 */
const updateItem = async (req, res) => {
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

/**
 * Delete a todo item
 * @route DELETE /api/items/:id
 */
const deleteItem = async (req, res) => {
    try {
        await db.removeItem(req.params.id);
        res.sendStatus(200);
    } catch (error) {
        console.error('Error deleting item:', error);
        res.status(500).json({ error: 'Failed to delete item' });
    }
};

module.exports = {
    getItems,
    addItem,
    updateItem,
    deleteItem,
};
