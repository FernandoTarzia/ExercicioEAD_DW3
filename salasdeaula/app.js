const express = require("express");
require('dotenv').config(); 

const { Pool } = require('pg'); 

const port = process.env.PORT || 40000; // Define a porta, com um fallback
const Routes = require("./src/routes/routes.js");

const app = express();
const appName = "ex_EAD";

// Configuração do pool de conexões com o banco de dados
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

// Testa a conexão com o banco de dados
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao adquirir cliente do pool', err.stack);
  }
  client.query('SELECT NOW()', (err, result) => {
    release(); // Libera o cliente de volta para o pool
    if (err) {
      return console.error('Erro ao executar query de teste', err.stack);
    }
    console.log('Conexão com o banco de dados PostgreSQL estabelecida com sucesso!');
  });
});


app.use((req, res, next) => {
  req.pool = pool;
  next();
});

app.use(express.json());
app.use(Routes); 

app.get("/", (req, res) => {
  res.send("Bem-vindo à API Salas de Aula!");
});

app.listen(port, () => {
  console.log("Executando a aplicação:", appName);
  console.log("Servidor ouvindo na porta:", port);
});