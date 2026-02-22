import "./App.css"
import { useState, useEffect } from "react";

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [titulo, setTitulo] = useState("");
  const [idEditando, setIdEditando] = useState(null);

  const fetchTarefas = () => {
    fetch("http://localhost:3500/tarefa")
      .then((resposta) => resposta.json())
      .then((dados) => setTarefas(dados))
      .catch((erro) => console.log("erro na busca!", erro));
  };

  useEffect(() => {
    fetchTarefas();
  }, []);

  const salvarTarefa = (e) => {
    e.preventDefault();
    if (!titulo) return;

    if (idEditando) {
      const tarefaAtual = tarefas.find((t) => t.id === idEditando);

      fetch(`http://localhost:3500/tarefa/${idEditando}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: titulo,
          descricao: tarefaAtual.descricao || "",
          concluida: tarefaAtual.concluida,
        }),
      }).then(() => {
        setTitulo("");
        setIdEditando(null);
        fetchTarefas();
      });
    } else {
      fetch("http://localhost:3500/tarefa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo: titulo, descricao: "" }),
      }).then(() => {
        setTitulo("");
        fetchTarefas();
      });
    }
  };

  const trocarStatus = (tarefa) => {
    fetch(`http://localhost:3500/tarefa/${tarefa.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: tarefa.titulo,
        descricao: tarefa.descricao || "",
        concluida: !tarefa.concluida,
      }),
    }).then(() => {
      fetchTarefas();
    });
  };

  const apagarTarefa = (id) => {
    fetch(`http://localhost:3500/tarefa/${id}`, {
      method: "DELETE",
    }).then(() => {
      fetchTarefas();
    });
  };

  const edicao = (tarefa) => {
    setTitulo(tarefa.titulo);
    setIdEditando(tarefa.id);
  };

  return (
    <div className="container">
      <h1>Todo List</h1>

      <form onSubmit={salvarTarefa} className="formulario">
        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Escreva a tarefa"
          className="input-tarefa"
        />

        <button type="submit" className="btn-salvar">
          {idEditando ? "Atualizar Tarefa" : "Adicionar Tarefa"}
        </button>

        {idEditando && (
          <button
            type="button"
            className="btn-cancelar"
            onClick={() => {
              setTitulo("");
              setIdEditando(null);
            }}
          >
            Cancelar
          </button>
        )}
      </form>

      <ul className="lista-tarefas">
        {tarefas.map((tarefa) => (
          <li key={tarefa.id} className="item-tarefa">
            <span
              className={
                tarefa.concluida ? "texto-concluido" : "texto-pendente"
              }
            >
              {tarefa.titulo}
            </span>

            <div className="botoes-acoes">
              <button
                className="btn-concluir"
                onClick={() => trocarStatus(tarefa)}
              >
                {tarefa.concluida ? "Desmarcar" : "Concluir"}
              </button>

              <button className="btn-editar" onClick={() => edicao(tarefa)}>
                Editar
              </button>

              <button
                className="btn-deletar"
                onClick={() => apagarTarefa(tarefa.id)}
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
