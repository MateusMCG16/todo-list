const express = require("express");
const app = express();
const port = 3500;

app.get("/", (req, res) => {
  res.send("Nada aqui");
});

app.listen(port, () => {
  console.log("servidor rodando em http://localhost:3500");
});
