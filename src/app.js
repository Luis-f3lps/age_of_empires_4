﻿import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import pool from './database.js'; // Importa a pool de conexões do arquivo database.js

// Definindo __filename e __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Carregando variáveis de ambiente do arquivo .env
dotenv.config({ path: path.resolve(__dirname, 'variaveis.env') });
console.log({
  DB_HOST: process.env.DB_HOST,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_NAME: process.env.DB_NAME,
});

const app = express();
const router = express.Router(); // Inicializa o roteador

// Testando a conexão ao banco de dados
(async () => {
  try {
    await pool.query('SELECT NOW()');
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
      'SELECT nome, habilidade_especial, forte_contra, fraco_contra FROM unidades WHERE civilizacao_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});

// Rota para buscar todas as civilizações
router.get('/civilizacoes', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM civilizacoes');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});

router.get('/civilizacoes_es/:id/unidades_es', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT nome, habilidade_especial, forte_contra, fraco_contra FROM unidades WHERE civilizacao_es_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});

// Rota para buscar todas as civilizações
router.get('/civilizacoes_es', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM civilizacoes_es');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});


router.get('/civilizacoes_ptbr/:id/unidade_ptbr', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT nome, habilidade_especial, forte_contra, fraco_contra FROM unidades WHERE civilizacao_ptbr_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});

// Rota para buscar todas as civilizações
router.get('/civilizacoes_ptbr', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, nome FROM civilizacoes_ptbr');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});

router.get('/es', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'es.html'));
});
router.get('/ptbr', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ptbr.html'));
});
// Configurar middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(router); // Utiliza o roteador configurado

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;
