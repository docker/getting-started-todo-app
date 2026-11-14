const GREETING = 'Hello from my DevOps learning app!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
