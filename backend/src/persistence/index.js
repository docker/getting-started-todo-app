if (process.env.MYSQL_HOST) {
    module.exports = require('./mysql');
} else {
    try {
        module.exports = require('./sqlite');
    } catch (error) {
        console.warn('SQLite not available, falling back to MySQL mode:', error.message);
        console.warn('Set MYSQL_HOST environment variable to use MySQL explicitly');
        module.exports = require('./mysql');
    }
}
