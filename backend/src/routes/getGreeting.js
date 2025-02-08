const GREETINGS = [ 
    "Bem Vindo(a)!", 
    "Estejam Todos a Bordo!", 
    "Traçando Novo Curso à Frente!",
];
module.exports = async (req, res) => {
res.send({ 
greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length )], });

};