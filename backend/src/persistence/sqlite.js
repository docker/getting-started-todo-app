const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const {
    CATEGORIES,
    DEFAULT_CATEGORY,
    normalizeCategory,
} = require('../categories');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db, dbAll, dbRun;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        db = new sqlite3.Database(location, (err) => {
            if (err) return rej(err);

            if (process.env.NODE_ENV !== 'test')
                console.log(`Using sqlite database at ${location}`);

            db.run(
                `CREATE TABLE IF NOT EXISTS todo_items (
                    id varchar(36),
                    name varchar(255),
                    priority varchar(20),
                    completed boolean,
                    category text NOT NULL DEFAULT '${DEFAULT_CATEGORY}'
                        CHECK(category IN (${CATEGORIES.map((value) => `'${value}'`).join(', ')}))
                )`,
                (err) => {
                    if (err) return rej(err);

                    db.all('PRAGMA table_info(todo_items)', (tableErr, rows) => {
                        if (tableErr) return rej(tableErr);

                        const hasCategoryColumn = rows.some(
                            (column) => column.name === 'category',
                        );

                        if (hasCategoryColumn) {
                            acc();
                            return;
                        }

                        db.run(
                            `ALTER TABLE todo_items ADD COLUMN category text NOT NULL DEFAULT '${DEFAULT_CATEGORY}'`,
                            (alterErr) => {
                                if (alterErr) return rej(alterErr);
                                acc();
                            },
                        );
                    });
                },
            );
        });
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        db.close((err) => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items', (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map((item) =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                        category: normalizeCategory(item.category),
                    }),
                ),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        db.all('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map((item) =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                        category: normalizeCategory(item.category),
                    }),
                )[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        db.run(
            'INSERT INTO todo_items (id, name, completed, priority, category) VALUES (?, ?, ?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0, item.priority, normalizeCategory(item.category),],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        db.run(
            'UPDATE todo_items SET name=?, category = ?, completed=? WHERE id = ?',
            [item.name, normalizeCategory(item.category), item.completed ? 1 : 0, id],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function removeItem(id) {
    return new Promise((acc, rej) => {
        db.run('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
            if (err) return rej(err);
            acc();
        });
    });
}

module.exports = {
    init,
    teardown,
    getItems,
    getItem,
    storeItem,
    updateItem,
    removeItem,
};
