const waitPort = require('wait-port');
const fs = require('fs');
const mysql = require('mysql2');

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
            `CREATE TABLE IF NOT EXISTS todo_items (
                id varchar(36) PRIMARY KEY, 
                name varchar(255) NOT NULL, 
                completed boolean DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) DEFAULT CHARSET utf8mb4`,
            (err) => {
                if (err) return rej(err);

                // Add columns if they don't exist (for existing databases)
                pool.query(
                    `ALTER TABLE todo_items 
                     ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                     ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
                    (alterErr) => {
                        // Ignore error if columns already exist
                        console.log(`Connected to mysql db at host ${HOST}`);
                        acc();
                    }
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
                rows.map((item) => ({
                    ...item,
                    completed: item.completed === 1,
                })),
            );
        });
    });
}

async function getItem(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM todo_items WHERE id=?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(
                rows.map((item) => ({
                    ...item,
                    completed: item.completed === 1,
                }))[0],
            );
        });
    });
}

async function storeItem(item) {
    return new Promise((acc, rej) => {
        const now = new Date();
        pool.query(
            'INSERT INTO todo_items (id, name, completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)',
            [item.id, item.name, item.completed ? 1 : 0, now, now],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        const now = new Date();
        pool.query(
            'UPDATE todo_items SET name=?, completed=?, updated_at=? WHERE id=?',
            [item.name, item.completed ? 1 : 0, now, id],
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
