const express = require('express');
const app = express();
const db = require('./persistence');
const getGreeting = require('./routes/getGreeting');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');
const { register, login } = require('./routes/auth');
const { authenticateToken } = require('./middleware/auth');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

// Health check endpoint for container health monitoring
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes
app.get('/api/greeting', getGreeting);
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);

// Protected routes (require authentication)
app.get('/api/items', authenticateToken, getItems);
app.post('/api/items', authenticateToken, addItem);
app.put('/api/items/:id', authenticateToken, updateItem);
app.delete('/api/items/:id', authenticateToken, deleteItem);

db.init()
    .then(() => {
        app.listen(3000, () => console.log('Listening on port 3000'));
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
