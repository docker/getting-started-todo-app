const GREETING = 'Hello world!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
