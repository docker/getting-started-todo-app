const GREETINGS = [ 
    "Bem Vindo(a)!", 
    "Todos a Bordo!", 
    "Traçando Novoo Curso à Frente!",
];
module.exports = async (req, res) => {
res.send({ 
greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length )], });

};