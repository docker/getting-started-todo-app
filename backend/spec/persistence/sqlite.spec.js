const os = require('os');
const path = require('path');

process.env.SQLITE_DB_LOCATION = path.join(os.tmpdir(), 'test-todo.db');

const db = require('../../src/persistence/sqlite');
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION;

const ITEM = {
    id: '7aef3d7c-d301-4846-8358-2a91ec9d6be3',
    name: 'Test',
    completed: false,
    priority: 'medium',
    category: 'personal',
};

beforeEach(() => {
    if (fs.existsSync(location)) {
        fs.unlinkSync(location);
    }
});

test('it initializes correctly', async () => {
    await db.init();
});

test('it can store and retrieve items', async () => {
    await db.init();

    await db.storeItem(ITEM);

    const items = await db.getItems();
    expect(items.length).toBe(1);
    expect(items[0]).toEqual(ITEM);
});

test('it can update an existing item', async () => {
    await db.init();

    const initialItems = await db.getItems();
    expect(initialItems.length).toBe(0);

    await db.storeItem(ITEM);

    await db.updateItem(
        ITEM.id,
        Object.assign({}, ITEM, { completed: !ITEM.completed, category: 'shopping', }),
    );

    const items = await db.getItems();
    expect(items[0].category).toBe('shopping');
    expect(items.length).toBe(1);
    expect(items[0].completed).toBe(!ITEM.completed);
});

test('it can remove an existing item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    await db.removeItem(ITEM.id);

    const items = await db.getItems();
    expect(items.length).toBe(0);
});

test('it can get a single item', async () => {
    await db.init();
    await db.storeItem(ITEM);

    const item = await db.getItem(ITEM.id);
    expect(item).toEqual(ITEM);
});

test('it stores and retrieves the priority field', async () => {
    await db.init();

    const item = { ...ITEM, priority: 'high' };
    await db.storeItem(item);

    const items = await db.getItems();
    expect(items[0].priority).toBe('high');
});
