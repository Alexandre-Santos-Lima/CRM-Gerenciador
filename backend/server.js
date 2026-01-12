const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Função para ler dados
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return getInitialData();
  }
};

// Função para salvar dados
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Dados iniciais com valores
const getInitialData = () => ({
  columns: [
    {
      id: 1,
      titulo: 'Backlog',
      cor: 'bg-gray-500',
      ordem: 1,
      cards: [
        {
          id: 1,
          titulo: 'Redesign do Portal',
          descricao: 'Modernizar interface do portal corporativo',
          cliente: 'Tech Corp',
          prazo: '2026-03-15',
          responsavel: 'Ana Silva',
          prioridade: 'Média',
          etiquetas: ['UI/UX', 'Web'],
          comentarios: 3,
          anexos: 2,
          valor: 25000,
          ordem: 1
        },
        {
          id: 2,
          titulo: 'Integração API Pagamento',
          descricao: 'Integrar gateway de pagamento',
          cliente: 'E-commerce Plus',
          prazo: '2026-02-20',
          responsavel: 'Carlos Santos',
          prioridade: 'Alta',
          etiquetas: ['Backend', 'API'],
          comentarios: 1,
          anexos: 0,
          valor: 15000,
          ordem: 2
        }
      ]
    },
    {
      id: 2,
      titulo: 'A Fazer',
      cor: 'bg-blue-500',
      ordem: 2,
      cards: [
        {
          id: 3,
          titulo: 'App Mobile iOS',
          descricao: 'Desenvolver versão iOS do aplicativo',
          cliente: 'StartupX',
          prazo: '2026-02-28',
          responsavel: 'Maria Costa',
          prioridade: 'Alta',
          etiquetas: ['Mobile', 'iOS'],
          comentarios: 5,
          anexos: 3,
          valor: 45000,
          ordem: 1
        },
        {
          id: 4,
          titulo: 'Dashboard Analytics',
          descricao: 'Criar dashboard de métricas',
          cliente: 'Data Corp',
          prazo: '2026-03-10',
          responsavel: 'João Silva',
          prioridade: 'Média',
          etiquetas: ['Frontend', 'Analytics'],
          comentarios: 2,
          anexos: 1,
          valor: 18000,
          ordem: 2
        }
      ]
    },
    {
      id: 3,
      titulo: 'Em Andamento',
      cor: 'bg-yellow-500',
      ordem: 3,
      cards: [
        {
          id: 5,
          titulo: 'Sistema ERP',
          descricao: 'Módulo de gestão financeira',
          cliente: 'Indústria ABC',
          prazo: '2026-02-25',
          responsavel: 'Pedro Lima',
          prioridade: 'Alta',
          etiquetas: ['ERP', 'Backend'],
          comentarios: 8,
          anexos: 5,
          valor: 75000,
          ordem: 1
        },
        {
          id: 6,
          titulo: 'Landing Page',
          descricao: 'Nova landing page institucional',
          cliente: 'Marketing Pro',
          prazo: '2026-02-18',
          responsavel: 'Ana Silva',
          prioridade: 'Média',
          etiquetas: ['Frontend', 'Marketing'],
          comentarios: 4,
          anexos: 2,
          valor: 8000,
          ordem: 2
        }
      ]
    },
    {
      id: 4,
      titulo: 'Em Revisão',
      cor: 'bg-purple-500',
      ordem: 4,
      cards: [
        {
          id: 7,
          titulo: 'Módulo de Relatórios',
          descricao: 'Sistema de geração de relatórios',
          cliente: 'Tech Corp',
          prazo: '2026-02-15',
          responsavel: 'Carlos Santos',
          prioridade: 'Alta',
          etiquetas: ['Backend', 'Reports'],
          comentarios: 6,
          anexos: 4,
          valor: 22000,
          ordem: 1
        }
      ]
    },
    {
      id: 5,
      titulo: 'Concluído',
      cor: 'bg-green-500',
      ordem: 5,
      cards: [
        {
          id: 8,
          titulo: 'Website Institucional',
          descricao: 'Site corporativo responsivo',
          cliente: 'Empresa XYZ',
          prazo: '2026-01-30',
          responsavel: 'Maria Costa',
          prioridade: 'Alta',
          etiquetas: ['Web', 'Frontend'],
          comentarios: 12,
          anexos: 7,
          valor: 32000,
          ordem: 1
        },
        {
          id: 9,
          titulo: 'Chatbot Atendimento',
          descricao: 'Bot de atendimento automatizado',
          cliente: 'StartupX',
          prazo: '2026-01-25',
          responsavel: 'João Silva',
          prioridade: 'Média',
          etiquetas: ['AI', 'Backend'],
          comentarios: 9,
          anexos: 3,
          valor: 28000,
          ordem: 2
        }
      ]
    }
  ]
});

// Inicializar arquivo se não existir
if (!fs.existsSync(DATA_FILE)) {
  saveData(getInitialData());
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// GET todas as colunas com cards
app.get('/api/columns', (req, res) => {
  try {
    const data = readData();
    res.json(data.columns);
  } catch (error) {
    console.error('Erro ao ler dados:', error);
    res.status(500).json({ error: 'Erro ao buscar dados' });
  }
});

// POST criar novo card
app.post('/api/cards', (req, res) => {
  try {
    const { column_id, titulo, descricao, cliente, prazo, responsavel, prioridade, etiquetas, valor } = req.body;
    const data = readData();
    
    const column = data.columns.find(col => col.id === column_id);
    if (!column) {
      return res.status(404).json({ error: 'Coluna não encontrada' });
    }
    
    const allCards = data.columns.flatMap(col => col.cards);
    const maxId = allCards.length > 0 ? Math.max(...allCards.map(c => c.id)) : 0;
    
    const newCard = {
      id: maxId + 1,
      titulo,
      descricao: descricao || '',
      cliente: cliente || '',
      prazo: prazo || null,
      responsavel: responsavel || '',
      prioridade: prioridade || 'Média',
      etiquetas: etiquetas || [],
      comentarios: 0,
      anexos: 0,
      valor: parseFloat(valor) || 0,
      ordem: column.cards.length + 1
    };
    
    column.cards.push(newCard);
    saveData(data);
    
    res.json(newCard);
  } catch (error) {
    console.error('Erro ao criar card:', error);
    res.status(500).json({ error: 'Erro ao criar card' });
  }
});

// PUT mover card entre colunas
app.put('/api/cards/:id/move', (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const { column_id } = req.body;
    const data = readData();
    
    let movedCard = null;
    data.columns.forEach(col => {
      const cardIndex = col.cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        movedCard = col.cards.splice(cardIndex, 1)[0];
      }
    });
    
    if (!movedCard) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }
    
    const targetColumn = data.columns.find(col => col.id === column_id);
    if (!targetColumn) {
      return res.status(404).json({ error: 'Coluna não encontrada' });
    }
    
    movedCard.ordem = targetColumn.cards.length + 1;
    targetColumn.cards.push(movedCard);
    
    saveData(data);
    res.json(movedCard);
  } catch (error) {
    console.error('Erro ao mover card:', error);
    res.status(500).json({ error: 'Erro ao mover card' });
  }
});

// DELETE card
app.delete('/api/cards/:id', (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const data = readData();
    
    let deleted = false;
    data.columns.forEach(col => {
      const cardIndex = col.cards.findIndex(c => c.id === cardId);
      if (cardIndex !== -1) {
        col.cards.splice(cardIndex, 1);
        deleted = true;
      }
    });
    
    if (!deleted) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }
    
    saveData(data);
    res.json({ success: true });
  } catch (error) {
    console.error('Erro ao deletar card:', error);
    res.status(500).json({ error: 'Erro ao deletar card' });
  }
});

// PUT atualizar card
app.put('/api/cards/:id', (req, res) => {
  try {
    const cardId = parseInt(req.params.id);
    const { titulo, descricao, cliente, prazo, responsavel, prioridade, etiquetas, valor } = req.body;
    const data = readData();
    
    let updatedCard = null;
    data.columns.forEach(col => {
      const card = col.cards.find(c => c.id === cardId);
      if (card) {
        card.titulo = titulo;
        card.descricao = descricao;
        card.cliente = cliente;
        card.prazo = prazo;
        card.responsavel = responsavel;
        card.prioridade = prioridade;
        card.etiquetas = etiquetas || [];
        card.valor = parseFloat(valor) || 0;
        updatedCard = card;
      }
    });
    
    if (!updatedCard) {
      return res.status(404).json({ error: 'Card não encontrado' });
    }
    
    saveData(data);
    res.json(updatedCard);
  } catch (error) {
    console.error('Erro ao atualizar card:', error);
    res.status(500).json({ error: 'Erro ao atualizar card' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Backend rodando na porta ${PORT}`);
  console.log(`📁 Dados salvos em: ${DATA_FILE}`);
});