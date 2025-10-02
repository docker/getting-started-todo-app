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

    pool = mysql
        .createPool({
            connectionLimit: 5,
            host,
            user,
            password,
            database,
            charset: 'utf8mb4',
        })
        .promise();

    await pool.query(
        `CREATE TABLE IF NOT EXISTS todo_items (
            id varchar(36) PRIMARY KEY,
            name varchar(255) NOT NULL,
            completed boolean DEFAULT FALSE,
            user_id varchar(36),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) DEFAULT CHARSET utf8mb4`,
    );

    // Initialize database schema: create users table
    await pool.query(
        `CREATE TABLE IF NOT EXISTS users (
            id varchar(36) PRIMARY KEY,
            first_name varchar(100) NOT NULL,
            last_name varchar(100) NOT NULL,
            email varchar(255) UNIQUE NOT NULL,
            password_hash varchar(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        ) DEFAULT CHARSET utf8mb4`,
    );

    // Verify and migrate: ensure user_id column exists in todo_items table
    try {
        const [rows] = await pool.query(
            "SHOW COLUMNS FROM todo_items LIKE 'user_id'",
        );

        if (rows.length === 0) {
            // Add user_id column if it doesn't exist
            try {
                await pool.query(
                    'ALTER TABLE todo_items ADD COLUMN user_id varchar(36)',
                );
            } catch (alterErr) {
                console.log('Note: user_id column may already exist');
            }
        }
    } catch (showErr) {}

    console.log(`Connected to mysql db at host ${HOST}`);
}

function teardown() {
    return new Promise((acc, rej) => {
        pool.end((err) => {
            if (err) rej(err);
            else acc();
        });
    });
}

function getItems() {
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

function getItem(id) {
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

// skipcq: JS-0116
function storeItem(item) {
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
                        },
                    );
                } else {
                    acc();
                }
            },
        );
    });
}

function updateItem(id, item) {
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
                        },
                    );
                } else {
                    acc();
                }
            },
        );
    });
}

// skipcq: JS-0116
function removeItem(id) {
    return new Promise((acc, rej) => {
        pool.query('DELETE FROM todo_items WHERE id = ?', [id], (err) => {
            if (err) return rej(err);
            acc();
        });
    });
}

// User management functions
// skipcq: JS-0116
function createUser(user) {
    return new Promise((acc, rej) => {
        pool.query(
            'INSERT INTO users (id, first_name, last_name, email, password_hash) VALUES (?, ?, ?, ?, ?)',
            [
                user.id,
                user.firstName,
                user.lastName,
                user.email,
                user.passwordHash,
            ],
            (err) => {
                if (err) return rej(err);
                acc();
            },
        );
    });
}

function getUserByEmail(email) {
    return new Promise((acc, rej) => {
        pool.query(
            'SELECT * FROM users WHERE email = ?',
            [email],
            (err, rows) => {
                if (err) return rej(err);
                acc(rows[0] || null);
            },
        );
    });
}

function getUserById(id) {
    return new Promise((acc, rej) => {
        pool.query('SELECT * FROM users WHERE id = ?', [id], (err, rows) => {
            if (err) return rej(err);
            acc(rows[0] || null);
        });
    });
}

// Update existing functions to filter by user
function getItemsByUser(userId) {
    return new Promise((acc, rej) => {
        pool.query(
            'SELECT * FROM todo_items WHERE user_id = ?',
            [userId],
            (err, rows) => {
                if (err) return rej(err);
                acc(
                    rows.map((item) => ({
                        ...item,
                        completed: item.completed === 1,
                    })),
                );
            },
        );
    });
}

function storeItemForUser(item, userId) {
    return new Promise((acc, rej) => {
        // Try inserting with timestamps first, fallback to basic insert if it fails
        pool.query(
            'INSERT INTO todo_items (id, name, completed, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
            [item.id, item.name, item.completed ? 1 : 0, userId],
            (err) => {
                if (err) {
                    // Fallback to basic insert without timestamps
                    pool.query(
                        'INSERT INTO todo_items (id, name, completed, user_id) VALUES (?, ?, ?, ?)',
                        [item.id, item.name, item.completed ? 1 : 0, userId],
                        (fallbackErr) => {
                            if (fallbackErr) return rej(fallbackErr);
                            acc();
                        },
                    );
                } else {
                    acc();
                }
            },
        );
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
    createUser,
    getUserByEmail,
    getUserById,
    getItemsByUser,
    storeItemForUser,
};
