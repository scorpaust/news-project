const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Contro-Allow-Header",
    "Origin, X-Request-Width, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.post("/api/articles", (req, res, next) => {
  const article = req.body;
  console.log(article);
  res.status(201).json({ message: "Article added successfully!" });
});

app.use("/api/articles", async (req, res, next) => {
  const articles = [
    {
      title: 'Sanches Osório: "A Europa não manda nada na guerra"',
      subtitle:
        "Sanches Osório defende uma solução diplomática para a guerra, porque o conflito só serve os interesses dos Estados Unidos e da China.\r\n&etilde;",
      content:
        'Relacionados\r\n"Temos de administrar bem a nossa pequenez"\r\npor Raquel Abecasis\r\nComo está a ver a guerra na Ucrânia?\r\nAcho que este é um problema entre os Estados Unidos e a China.\r\nMas não foi a Chi… [+3817 chars]',
      image: "https://cdn1.newsplex.pt/media/2023/7/1/fb/854854.jpg",
      author: "Raquel Abecassis",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title:
        "Palavras de Putin após motim de Prigozhin podem levá-lo a ter de responder por crimes de guerra",
      subtitle:
        "O financiamento do Grupo Wagner pelo Estado russo pode levar o Tribunal Penal Internacional a decidir que Putin e a Rússia são responsáveis pelos crimes de guerra alegadamente cometidos na Ucrânia",
      content:
        "O momento de rutura entre Vladimir Putin e o Grupo Wagner, após o motim organizado por Yevgeny Prigozhin na semana passada, pode ter facilitado a tarefa do Tribunal Penal Internacional, de processar … [+1931 chars]",
      image:
        "https://images.impresa.pt/expresso/2023-07-01-Vladimir-Putin-e68f1d6f-1/1.91x1?wm=true&outputFormat=jpeg",
      author: "Expresso",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title:
        "Ponto de situação. O que se passou ao 493.º dia de guerra na Ucrânia?",
      subtitle:
        "Pedro Sánchez esteve em Kiev e prometeu um apoio de 55 milhões de euros e mais armamento para a Ucrânia. Zelensky deixou críticas aos parceiros ocidentais por atrasarem a formação de pilotos.",
      content:
        "Acompanhe aqui o nosso liveblog sobre a guerra na Ucrânia\r\nAo 493.º dia de guerra na Ucrânia, Zelensky recebeu a visita do primeiro-ministro espanhol, Pedro Sánchez. O espanhol discursou no parlament… [+631 chars]",
      image:
        "https://wm.observador.pt/wm/obs/l/https%3A%2F%2Fbordalo.observador.pt%2Fv2%2Frs%3Afill%3A770%3A403%2Fc%3A3618%3A2030%3Anowe%3A0%3A341%2Fq%3A85%2Fplain%2Fhttps%3A%2F%2Fs3.observador.pt%2Fwp-content%2Fuploads%2F2023%2F07%2F01162039%2F73d26bb73f1fc4747c28ff3c4501d65c-1688213275.jpeg",
      author: "Cátia Rocha",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  res.json({
    message: "Articles fetched successfully!",
    articles: articles,
  });
});

module.exports = app;
