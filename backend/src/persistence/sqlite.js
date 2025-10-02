const Database = require('better-sqlite3');
const fs = require('fs');
const location = process.env.SQLITE_DB_LOCATION || '/etc/todos/todo.db';

let db;

function init() {
    const dirName = require('path').dirname(location);
    if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
    }

    return new Promise((acc, rej) => {
        try {
            db = new Database(location);

            if (process.env.NODE_ENV !== 'test')

            // Create table if it doesn't exist
            db.exec(
                'CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean)'
            );

            acc();
        } catch (err) {
            rej(err);
        }
    });
}

function teardown() {
    return new Promise((acc, rej) => {
        try {
            if (db) {
                db.close();
            }
            acc();
        } catch (err) {
            rej(err);
        }
    });
}

function getItems() {
    return new Promise((acc, rej) => {
        try {
            const rows = db.prepare('SELECT * FROM todo_items').all();
            acc(
                rows.map((item) =>
                    Object.assign({}, item, {
                        completed: item.completed === 1,
                    }),
                ),
            );
        } catch (err) {
            rej(err);
        }
    });
}

function getItem(id) {
    return new Promise((acc, rej) => {
        try {
            const row = db.prepare('SELECT * FROM todo_items WHERE id = ?').get(id);
            if (row) {
                acc(Object.assign({}, row, {
                    completed: row.completed === 1,
                }));
            } else {
                acc(undefined);
            }
        } catch (err) {
            rej(err);
        }
    });
}

function storeItem(item) {
    return new Promise((acc, rej) => {
        try {
            db.prepare(
                'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)'
            ).run(item.id, item.name, item.completed ? 1 : 0);
            acc();
        } catch (err) {
            rej(err);
        }
    });
}

function updateItem(id, item) {
    return new Promise((acc, rej) => {
        try {
            db.prepare(
                'UPDATE todo_items SET name=?, completed=? WHERE id = ?'
            ).run(item.name, item.completed ? 1 : 0, id);
            acc();
        } catch (err) {
            rej(err);
        }
    });
}

function removeItem(id) {
    return new Promise((acc, rej) => {
        try {
            db.prepare('DELETE FROM todo_items WHERE id = ?').run(id);
            acc();
        } catch (err) {
            rej(err);
        }
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
