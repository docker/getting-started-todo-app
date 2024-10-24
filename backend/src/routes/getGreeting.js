const GREETING = 'Hey, it's me!!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
