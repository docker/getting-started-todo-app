const GREETING = 'Hello Wicky 1 2 3';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
