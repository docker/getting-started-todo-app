const express = require('express');
const pino = require('pino');
const pinoHttp = require('pino-http');
const app = express();
const db = require('./persistence');
const getGreeting = require('./routes/getGreeting');
const getItems = require('./routes/getItems');
const addItem = require('./routes/addItem');
const updateItem = require('./routes/updateItem');
const deleteItem = require('./routes/deleteItem');

const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
});

app.use(pinoHttp({ logger }));
app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/api/greeting', getGreeting);
app.get('/api/items', getItems);
app.post('/api/items', addItem);
app.put('/api/items/:id', updateItem);
app.delete('/api/items/:id', deleteItem);

db.init()
    .then(() => {
        app.listen(3000, () => logger.info('Listening on port 3000'));
    })
    .catch((err) => {
        logger.error(err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    db.teardown()
        .catch((err) => {
            logger.warn({ err }, 'Error during DB teardown');
        })
        .then(() => {
            logger.info('Shutting down');
            process.exit();
        });
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
