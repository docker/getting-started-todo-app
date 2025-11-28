const GREETING = 'Hello Wicky II';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
