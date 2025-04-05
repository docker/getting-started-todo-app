const GREETING = 'Hello world! Sandeep Patil';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
