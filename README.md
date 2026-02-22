# Todo List

Lista de tarefas com backend em Node.js (Express) e frontend em React.

## Tecnologias

- Node.js + Express
- MySQL
- React + Vite

## Como rodar

### Backend

1. Crie um arquivo `.env` na raiz com as variáveis do banco:

```
DB_HOST=localhost
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_NAME=seu_banco
```

2. Crie a tabela no MySQL:

```sql
CREATE TABLE tarefa (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(255) NOT NULL,
  descricao TEXT,
  concluida BOOLEAN DEFAULT FALSE
);
```

3. Instale as dependencias e inicie o servidor:

```
npm install
node server.js
```

O servidor roda na porta 3500.

### Frontend

```
cd front
npm install
npm run dev
```
