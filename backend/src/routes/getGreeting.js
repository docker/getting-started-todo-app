const GREETINGS = [ 
	"All Your Base",
	"Are Belong To Us",
	"You have no Chance",
	"Make your time",
	"Move ZIG!",
];

module.exports = async (req, res) => {
    res.send({
        greeting: GREETINGS[ Math.floor(Math.random() * GREETINGS.length )],
    });
};
