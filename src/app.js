import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pkg from 'pg'; // Importa o pacote pg
import PDFDocument from 'pdfkit';
import fs from 'fs';
import session from 'express-session';
import bcrypt from 'bcrypt';
import connectPgSimple from 'connect-pg-simple'; // Importa a integração do express-session com o PostgreSQL
import pool from './database.js'; // Importa a pool de conexões do arquivo database.js

// Definindo __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Carregando variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, 'variaveis.env') }); // Ajuste o caminho conforme necessário
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});

const app = express();

// Testando a conexão ao banco de dados
(async () => {
  try {
    await pool.query('SELECT NOW()'); // Consulta simples para testar a conexão
    console.log('Conexão bem-sucedida ao banco de dados!');
  } catch (err) {
    console.error('Erro ao conectar ao banco de dados:', err);
  }
})();


// Rota para buscar unidades de uma civilização específica
router.get('/civilizacoes/:id/unidades', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT nome FROM unidades WHERE civilizacao_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});


// Configurar middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Rotas do servidor
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
router.get('/civilizacoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM civilizacoes');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});
export default app;
