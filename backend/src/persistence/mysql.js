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

                // Check if columns exist and add them if they don't
                pool.query(
                    `SHOW COLUMNS FROM todo_items LIKE 'created_at'`,
                    (showErr, rows) => {
                        if (showErr) {
                            console.log(`Connected to mysql db at host ${HOST}`);
                            return acc();
                        }
                        
                        if (rows.length === 0) {
                            // Add timestamp columns if they don't exist
                            pool.query(
                                `ALTER TABLE todo_items 
                                 ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                 ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`,
                                (alterErr) => {
                                    if (alterErr) console.log('Note: Timestamp columns may already exist');
                                    console.log(`Connected to mysql db at host ${HOST}`);
                                    acc();
                                }
                            );
                        } else {
                            console.log(`Connected to mysql db at host ${HOST}`);
                            acc();
                        }
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
        // Try inserting with timestamps first, fallback to basic insert if it fails
        pool.query(
            'INSERT INTO todo_items (id, name, completed, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
            [item.id, item.name, item.completed ? 1 : 0],
            (err) => {
                if (err) {
                    // Fallback to basic insert without timestamps
                    pool.query(
                        'INSERT INTO todo_items (id, name, completed) VALUES (?, ?, ?)',
                        [item.id, item.name, item.completed ? 1 : 0],
                        (fallbackErr) => {
                            if (fallbackErr) return rej(fallbackErr);
                            acc();
                        }
                    );
                } else {
                    acc();
                }
            },
        );
    });
}

async function updateItem(id, item) {
    return new Promise((acc, rej) => {
        // Try updating with timestamps first, fallback to basic update if it fails
        pool.query(
            'UPDATE todo_items SET name=?, completed=?, updated_at=NOW() WHERE id=?',
            [item.name, item.completed ? 1 : 0, id],
            (err) => {
                if (err) {
                    // Fallback to basic update without timestamps
                    pool.query(
                        'UPDATE todo_items SET name=?, completed=? WHERE id=?',
                        [item.name, item.completed ? 1 : 0, id],
                        (fallbackErr) => {
                            if (fallbackErr) return rej(fallbackErr);
                            acc();
                        }
                    );
                } else {
                    acc();
                }
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
