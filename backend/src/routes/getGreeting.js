const GREETING = 'Crazy Days Are Upon Us!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
