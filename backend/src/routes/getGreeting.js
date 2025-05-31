const GREETING = 'Yo Digga Was geht';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
