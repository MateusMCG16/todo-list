require("dotenv").config();

const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const app = express();
const port = 3500;

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.log("Erro de conexão com o banco.", err.message);
    return;
  }
  console.log("Sucesso ao conectar com o banco!");
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("servidor ON");
});

app.post("/tarefa", (req, res) => {
  const { titulo, descricao } = req.body;

  if (!titulo) {
    return res.status(400).json({ erro: "a tarefa tem que ter um titulo! " });
  }

  const query = "INSERT INTO tarefa (titulo, descricao) VALUES (? , ?)";

  db.query(query, [titulo, descricao], (err, results) => {
    if (err) {
      console.log("Erro ao adiciona tarefa", err);
      return res.status(500).json({ erro: "Erro ao salvar no banco." });
    }

    res.status(200).json({
      mensagem: "Tarefaa adicionada com sucesso!",
      idTarefa: results.insertId,
    });
  });
});

app.get("/tarefa", (req, res) => {
  const query = "SELECT * FROM tarefa";

  db.query(query, (err, results) => {
    if (err) {
      console.log("Erro ao buscar tarefas", err);
      return res.status(500).json({ erro: "Erro ao buscar no banco." });
    }

    res.status(200).json(results);
  });
});

app.put("/tarefa/:id", (req, res) => {
  const { id } = req.params;

  const { titulo, descricao, concluida } = req.body;

  const query =
    "UPDATE tarefa SET titulo = ?, descricao = ?, concluida = ? WHERE id = ?";

  db.query(query, [titulo, descricao, concluida, id], (err, results) => {
    if (err) {
      console.log("Erro ao atualizar tarefa", err);
      return res.status(500).json({ erro: "Erro ao atualizar no banco." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }

    res.status(200).json({ mensagem: "Tarefa atualizada com sucesso!" });
  });
});

app.delete("/tarefa/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM tarefa WHERE id = ?";

  db.query(query, [id], (err, results) => {
    if (err) {
      console.log("Erro ao deletar tarefa", err);
      return res.status(500).json({ erro: "Erro ao deletar do banco." });
    }

    if (results.affectedRows === 0) {
      return res.status(404).json({ mensagem: "Tarefa não encontrada." });
    }

    res.status(200).json({ mensagem: "Tarefa deletada com sucesso!" });
  });
});

app.listen(port, () => {
  console.log("servidor rodando em http://localhost:3500");
});
