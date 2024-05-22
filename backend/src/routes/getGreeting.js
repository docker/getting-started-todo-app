const GREETING = 'Hi world!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
