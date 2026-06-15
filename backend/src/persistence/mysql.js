const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');
const { DEFAULT_CATEGORY, normalizeCategory } = require('../categories');

const {
    MYSQL_HOST: HOST,
    MYSQL_HOST_FILE: HOST_FILE,
    MYSQL_USER: USER,
    MYSQL_USER_FILE: USER_FILE,
    MYSQL_PASSWORD: PASSWORD,
    MYSQL_PASSWORD_FILE: PASSWORD_FILE,
    MYSQL_DB: DB,
    MYSQL_DB_FILE: DB_FILE,
} = process.env;

let pool;

async function init() {
    const host = HOST_FILE ? fs.readFileSync(HOST_FILE) : HOST;
    const user = USER_FILE ? fs.readFileSync(USER_FILE) : USER;
    const password = PASSWORD_FILE ? fs.readFileSync(PASSWORD_FILE) : PASSWORD;
    const database = DB_FILE ? fs.readFileSync(DB_FILE) : DB;

    await waitPort({
        host,
        port: 3306,
        timeout: 10000,
        waitForDns: true,
    });

    pool = mysql.createPool({
        connectionLimit: 5,
        host,
        user,
        password,
        database,
        charset: 'utf8mb4',
    });

    return new Promise((acc, rej) => {
        pool.query(
            `CREATE TABLE IF NOT EXISTS todo_items (id varchar(36), name varchar(255), completed boolean, priority varchar(10) DEFAULT 'medium', due_date varchar(10) DEFAULT NULL, category VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_CATEGORY}')`,
            (err) => {
                if (err) return rej(err);

                console.log(`Connected to mysql db at host ${HOST}`);

                // Migrate existing databases that predate the category column
                pool.query(
                    `ALTER TABLE todo_items ADD COLUMN category VARCHAR(20) NOT NULL DEFAULT '${DEFAULT_CATEGORY}'`,
                    (err2) => {
                        // errno 1060 = duplicate column — already exists, safe to ignore
                        if (err2 && err2.errno !== 1060) return rej(err2);
                        acc();
                    },
                );
            },
        );
    });
}

async function teardown() {
    return new Promise((acc, rej) => {
        pool.end((err) => {
            if (err) rej(err);
            else acc();
        });
    });
}

async function getItems() {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM todo_items', (err, rows) => {
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
        pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
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
        pool.query(
            'INSERT INTO todo_items (id, name, completed, priority, due_date, category) VALUES (?, ?, ?, ?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0, item.priority, item.due_date || null, normalizeCategory(item.category)],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        pool.query(
            'UPDATE todo_items SET name=?, completed=?, priority=?, due_date=?, category=? WHERE id=?',
            [item.name, item.completed ? 1 : 0, item.priority, item.due_date || null, normalizeCategory(item.category), id],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function removeItem(id) {
    return new Promise((acc, rej) => {
        pool.query('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
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
