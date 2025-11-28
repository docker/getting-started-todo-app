const GREETING = 'Hello Wicky';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
