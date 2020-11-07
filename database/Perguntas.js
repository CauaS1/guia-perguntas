/*M O D E L */
const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define("perguntas" /*aqui muda o nome da tabela*/, {
  titulo: { //nome do campo
    type: Sequelize.STRING, //tipo dele | TEXTOS CURTOS 
    allowNull: false //impede de receber valores nulos
  },
  descricao: {
    type: Sequelize.TEXT, // PARA TEXTOS LONGOS
    allowNull: false
  }
});

Pergunta.sync({force: false}).then(() => {})
//force: se a tabela pergunta ja existir, ele n vai forcar a craição dela

module.exports = Pergunta;