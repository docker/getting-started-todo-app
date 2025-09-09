const GREETINGS = [ 
	"What happen?"
	"Somebody set up us the bomb",
	"Main screen turn on",
	"Hello Mentlegen"
	"All Your Base",
	"Are Belong To Us",
	"You have no Chance",
	"Make your time",
	"Move ZIG!"
	"For great justice!",
	"You know what you doing",
	"How are you gentlemen!?",
	"You!?"
	"Take off every ZIG!!",
];

module.exports = async (req, res) => {
    res.send({
        greeting: GREETINGS[ Math.floor(Math.random() * GREETINGS.length )],
    });
};
