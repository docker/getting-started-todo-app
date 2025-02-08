const GREETINGS = [ 
    "Bem Vindo(a)!", 
    "Estejam Todos a Bordo!", 
    "Traçando Novo Curso à Frente!",
    "Saiba O Que Fazer!",
    "Não Perca Tempo",
];
module.exports = async (req, res) => {
res.send({ 
greeting: GREETINGS[ Math.floor( Math.random() * GREETINGS.length )], });

};