// src/server.ts
import express, { Request, Response } from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid'; // Importamos o gerador UUID
import { Game, GamePayload } from './types'; // Importamos os tipos

const app = express();
const PORT = 3000;

// =======================================================
// MIDDLEWARE
// =======================================================
// Permite que o App Mobile (Frontend) acesse esta API
app.use(cors());
// Permite que o Express leia JSON no corpo das requisições
app.use(express.json());

// =======================================================
// SIMULAÇÃO DO BANCO DE DADOS (In Memory)
// =======================================================
// Usamos string nos IDs iniciais para consistência com o UUID
let games: Game[] = [ 
  { id: uuidv4(), title: 'Elden Ring', hours: 180 },
  { id: uuidv4(), title: 'Hades', hours: 45 },
  { id: uuidv4(), title: 'God of War', hours: 32 },
];

// =======================================================
// ROTAS CRUD (Tipadas)
// =======================================================

// 1. CREATE: POST /api/games - Adicionar um novo jogo zerado
app.post('/api/games', (req: Request<{}, {}, GamePayload>, res: Response<Game | { message: string }>) => {
  const { title, hours } = req.body;
  
  // Validação básica do payload
  if (!title || hours === undefined || typeof hours !== 'number' || hours <= 0) {
    return res.status(400).send({ 
      message: 'Título e Horas (número positivo) são obrigatórios e devem ser válidos.' 
    });
  }

  const newGame: Game = {
    id: uuidv4(), // Geração de ID Único
    title: title,
    hours: hours,
  };
  
  games.push(newGame);
  console.log(`[CRUD] POST: Jogo #${newGame.id} criado: ${newGame.title}`);
  res.status(201).json(newGame);
});

// 2. READ: GET /api/games - Visualizar todos os jogos zerados
app.get('/api/games', (req: Request, res: Response<Game[]>) => {
  console.log('[CRUD] GET: Lista de jogos solicitada.');
  res.json(games);
});

// 3. UPDATE: PUT /api/games/:id - Modificar um jogo zerado
app.put('/api/games/:id', (req: Request<{ id: string }, {}, Partial<GamePayload>>, res: Response<Game | { message: string }>) => {
  const id = req.params.id; // ID agora é string
  const { title, hours } = req.body;
  
  const gameIndex = games.findIndex(g => g.id === id);

  if (gameIndex === -1) {
    return res.status(404).send({ message: 'Jogo não encontrado.' });
  }

  if (title === undefined && hours === undefined) {
      return res.status(400).send({ message: 'Nenhum campo para atualizar fornecido.' });
  }

  // Aplica as modificações:
  if (title !== undefined) games[gameIndex].title = title;
  if (hours !== undefined) games[gameIndex].hours = Number(hours);

  console.log(`[CRUD] PUT: Jogo #${id} atualizado.`);
  res.json(games[gameIndex]);
});

// 4. DELETE: DELETE /api/games/:id - Excluir um jogo zerado
app.delete('/api/games/:id', (req: Request<{ id: string }>, res: Response<{ message: string }> ) => {
  const id = req.params.id;
  
  const initialLength = games.length;
  // Filtra o array, removendo o jogo com o ID correspondente
  games = games.filter(g => g.id !== id);

  if (games.length === initialLength) {
    return res.status(404).send({ message: 'Jogo não encontrado para exclusão.' });
  }

  console.log(`[CRUD] DELETE: Jogo #${id} excluído.`);
  res.status(204).send({ message: 'Deletado com sucesso.' }); 
});


// =======================================================
// INICIALIZAÇÃO DO SERVIDOR
// =======================================================
app.listen(PORT, () => {
  console.log(`
  🚀 Servidor Save Point API (TS) rodando em http://localhost:${PORT}
  --------------------------------------------------
  `);
});