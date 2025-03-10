const GREETING = 'Whalecome!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
