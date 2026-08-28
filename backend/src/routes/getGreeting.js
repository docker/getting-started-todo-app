const GREETINGS = [
    'Hello world!',
    'It is a great day to learn something new!',
    'Keep pushing forward and never give up on your dreams!',
];

module.exports = async (req, res) => {
    res.send({
        greeting: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
    });
};
