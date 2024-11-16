import express from 'express';
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
    const result = await pool.query('SELECT id, nome, localizacao_imagem FROM civilizacoes ORDER BY nome ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});

router.get('/civilizacoes_es/:id/unidade_es', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT nome, habilidade_especial, forte_contra, fraco_contra FROM unidade_es WHERE civilizacao_id = $1',
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
    const result = await pool.query('SELECT id, nome, localizacao_imagem FROM civilizacoes_es ORDER BY nome ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});


// Rota para buscar as unidades de uma civilização
router.get('/civilizacoes_ptbr/:id/unidades_ptbr', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT nome, habilidade_especial, forte_contra, fraco_contra FROM unidades_ptbr WHERE civilizacao_id = $1',
      [id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar unidades:', error);
    res.status(500).json({ error: 'Erro ao buscar unidades' });
  }
});

// Rota para buscar todas as civilizações com imagens em ordem alfabética
router.get('/civilizacoes_ptbr', async (req, res) => {
  try {
    // Modifique a consulta para ordenar por nome
    const result = await pool.query('SELECT id, nome, localizacao_imagem FROM civilizacoes_ptbr ORDER BY nome ASC');
    
    // Retorna as civilizações em ordem alfabética com seus respectivos caminhos das imagens
    res.json(result.rows);
  } catch (error) {
    console.error('Erro ao buscar civilizações:', error);
    res.status(500).json({ error: 'Erro ao buscar civilizações' });
  }
});

router.get('/es', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'es.html'));
});
router.get('/en', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'en.html'));
});
router.get('/ptbr', async (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ptbr.html'));
});
// Configurar middleware para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use(router); // Utiliza o roteador configurado

// Rota inicial
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ptbr.html'));
});

export default app;
