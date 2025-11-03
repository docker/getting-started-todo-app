const GREETING = 'To Do';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
