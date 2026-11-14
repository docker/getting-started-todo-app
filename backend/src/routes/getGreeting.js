const GREETING = 'Hello from version 2 on Kubernetes!';

module.exports = async (req, res) => {
    res.send({
        greeting: GREETING,
    });
};
