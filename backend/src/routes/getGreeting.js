const GREETINGS = [
  "Welcome1",
  "dsadad!",
  "yoyo!",
];

module.exports = async (req, res) => {
  res.send({
    greeting: GREETINGS[Math.floor(Math.random() * GREETINGS.length)],
  });
};
