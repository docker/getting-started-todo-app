const GREETING = 'Hello Wicky III';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
