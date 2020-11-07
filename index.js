const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Perguntas");
const Resposta = require("./database/Resposta");
//Database
connection
  .authenticate()  
  .then(() => {
    console.log("Success");
  })
  .catch((msgErro) => {
    console.log(msgErro);
  })

app.set("view engine", 'ejs'); //estou dizendo para o express usar o EJS como view engine
app.use(express.static("public")); //arquivos estaticos (css, img, scripts)
//Body parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Rotas
app.get("/", (req, res) => {
  Pergunta.findAll({ raw: true /*so os dados e nada mais*/, order: [
    ["id", "DESC"] //ASC = Crescente || DESC = Decrescente
    //ao inves de id poderia ser "titulo", o nome do campo que voce definiu
  ]}).then(perguntas => {
    res.render("index", { perguntas }); //n precisa usar /view/... pq automaticamente o render já olha dentro da pasta views
  }) //PROCURA TODAS AS PERGUNTAS DA TABELA E RETORNA
  //equivalente a SELECT * FROM perguntas;
  
});

app.get("/perguntar", (req, res) => {
  res.render("perguntar")
})

app.post("/salvarpergunta", (req,res) => { // ------------------------------------------------ caso de erro foi pq eu apaguei o saverpegunta
  const titulo = req.body.titulo;
  const descricao = req.body.descricao;
  Pergunta.create({ //isso é equivalente a "INSERT INTO perguntas ..."
    titulo: titulo,
    descricao: descricao
  }).then(() => {
    res.redirect("/");
  }) /*as variaveis titulo de descricao são as que estão no Model (Perguntar.js)*/
});

app.get("/pergunta/:id", (req,res) => {
  const id = req.params.id;
  Pergunta.findOne({  //vai pegar o id, titulo... da tabela
    where: { id: id } //uma pergunta que tenha um ID, e compare com a variavel ID
  }).then((pergunta) => {
    if(pergunta != undefined) { //se encontrar a pergunta
      Resposta.findAll({ 
        where: {perguntaId: pergunta.id},
        order: [
          ['id', "DESC"]
        ]
      }).then(respostas => {
        res.render("pergunta", {
          pergunta: pergunta,
          respostas: respostas
        });
      });
    } else { //se não encontrar a 
      res.redirect("/")
    }
  })
});

app.post("/responder", (req,res) => {
  const corpo = req.body.corpo;
  const perguntaId = req.body.pergunta;

  Resposta.create({
    corpo: corpo,
    perguntaId: perguntaId
  }).then(() => {
    res.redirect("/pergunta/"+perguntaId)
  });
})


app.listen(5500, () => {
  console.log("Starting server...");
});