# 🚀 Kanban CRM - Versão Simplificada (JSON)

## 📁 Estrutura do Projeto

```
kanban-crm/
├── backend/
│   ├── package.json
│   ├── server.js
│   └── data.json
└── frontend/
    ├── package.json
    ├── vite.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api.js
        └── index.css
```

---

## 📁 BACKEND

### 📄 `backend/package.json`

```json
{
  "name": "kanban-backend",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "dev": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5"
  }
}
```

### 📄 `backend/server.js`

```javascript
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
    // Se arquivo não existe, retorna dados iniciais
    return getInitialData();
  }
};

// Função para salvar dados
const saveData = (data) => {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
};

// Dados iniciais
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
    const { column_id, titulo, descricao, cliente, prazo, responsavel, prioridade, etiquetas } = req.body;
    const data = readData();
    
    // Encontra a coluna
    const column = data.columns.find(col => col.id === column_id);
    if (!column) {
      return res.status(404).json({ error: 'Coluna não encontrada' });
    }
    
    // Gera novo ID
    const allCards = data.columns.flatMap(col => col.cards);
    const maxId = allCards.length > 0 ? Math.max(...allCards.map(c => c.id)) : 0;
    
    // Cria novo card
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
    
    // Encontra o card e remove da coluna atual
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
    
    // Adiciona na nova coluna
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
    const { titulo, descricao, cliente, prazo, responsavel, prioridade, etiquetas } = req.body;
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
        card.etiquetas = etiquetas;
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
```

---

## 📁 FRONTEND

### 📄 `frontend/package.json`

```json
{
  "name": "kanban-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "^5.0.0"
  }
}
```

### 📄 `frontend/vite.config.js`

```javascript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true
      }
    }
  }
});
```

### 📄 `frontend/index.html`

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>APsolutions CRM - Kanban</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        * {
            font-family: 'Inter', sans-serif;
        }
        
        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        
        .animate-slide-in {
            animation: slideIn 0.3s ease-out;
        }
        
        .animate-fade-in {
            animation: fadeIn 0.4s ease-out;
        }
        
        .card-shadow {
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.05);
            transition: all 0.2s ease;
        }
        
        .card-shadow:hover {
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1), 0 6px 10px rgba(0, 0, 0, 0.08);
            transform: translateY(-2px);
        }
        
        .glass-effect {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-bg-blue {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .gradient-bg-purple {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
        }
        
        .gradient-bg-green {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .gradient-bg-orange {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }
        
        .gradient-bg-pink {
            background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);
        }
        
        .scrollbar-thin::-webkit-scrollbar {
            height: 6px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-track {
            background: #f1f1f1;
            border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 10px;
        }
        
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: #555;
        }
    </style>
</head>
<body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### 📄 `frontend/src/main.jsx`

```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 📄 `frontend/src/index.css`

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#root {
  min-height: 100vh;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 📄 `frontend/src/api.js`

```javascript
const API_URL = '/api';

export const fetchColumns = async () => {
  const response = await fetch(`${API_URL}/columns`);
  if (!response.ok) throw new Error('Erro ao buscar colunas');
  return response.json();
};

export const createCard = async (cardData) => {
  const response = await fetch(`${API_URL}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  if (!response.ok) throw new Error('Erro ao criar card');
  return response.json();
};

export const moveCard = async (cardId, columnId) => {
  const response = await fetch(`${API_URL}/cards/${cardId}/move`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ column_id: columnId }),
  });
  if (!response.ok) throw new Error('Erro ao mover card');
  return response.json();
};

export const updateCard = async (cardId, cardData) => {
  const response = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cardData),
  });
  if (!response.ok) throw new Error('Erro ao atualizar card');
  return response.json();
};

export const deleteCard = async (cardId) => {
  const response = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar card');
  return response.json();
};
```

### 📄 `frontend/src/App.jsx`

```javascript
import React, { useState, useEffect } from 'react';
import { Plus, Search, MoreVertical, Calendar, Users, MessageSquare, Paperclip, X, Trash2, Sparkles, TrendingUp, Clock } from 'lucide-react';
import { fetchColumns, createCard, moveCard, deleteCard } from './api';

const App = () => {
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCard, setShowNewCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [newCard, setNewCard] = useState({
    titulo: '',
    descricao: '',
    cliente: '',
    prazo: '',
    responsavel: '',
    prioridade: 'Média',
    etiquetas: []
  });

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    try {
      const data = await fetchColumns();
      setColumns(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade) => {
    const colors = {
      'Alta': 'bg-gradient-to-r from-red-50 to-red-100 text-red-700 border-red-200',
      'Média': 'bg-gradient-to-r from-yellow-50 to-yellow-100 text-yellow-700 border-yellow-200',
      'Baixa': 'bg-gradient-to-r from-green-50 to-green-100 text-green-700 border-green-200'
    };
    return colors[prioridade] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getColumnGradient = (index) => {
    const gradients = [
      'from-gray-400 to-gray-600',
      'from-blue-400 to-blue-600',
      'from-yellow-400 to-yellow-600',
      'from-purple-400 to-purple-600',
      'from-green-400 to-green-600'
    ];
    return gradients[index % gradients.length];
  };

  const handleDragStart = (card, columnId) => {
    setDraggedCard(card);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetColumnId) => {
    if (!draggedCard || !draggedFrom || draggedFrom === targetColumnId) {
      setDraggedCard(null);
      setDraggedFrom(null);
      return;
    }

    try {
      await moveCard(draggedCard.id, targetColumnId);
      await loadColumns();
      setDraggedCard(null);
      setDraggedFrom(null);
    } catch (error) {
      console.error('Erro ao mover card:', error);
    }
  };

  const handleAddCard = async (columnId) => {
    if (!newCard.titulo) {
      alert('Digite um título para o card');
      return;
    }

    try {
      await createCard({
        column_id: columnId,
        ...newCard
      });
      
      setNewCard({
        titulo: '',
        descricao: '',
        cliente: '',
        prazo: '',
        responsavel: '',
        prioridade: 'Média',
        etiquetas: []
      });
      setShowNewCard(null);
      await loadColumns();
    } catch (error) {
      console.error('Erro ao criar card:', error);
      alert('Erro ao criar card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Tem certeza que deseja deletar este card?')) return;
    
    try {
      await deleteCard(cardId);
      await loadColumns();
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      alert('Erro ao deletar card');
    }
  };

  const filteredColumns = columns.map(col => ({
    ...col,
    cards: col.cards.filter(card =>
      card.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.cliente && card.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.responsavel && card.responsavel.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }));

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-indigo-600" size={24} />
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">Carregando seu workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-20 border-b border-white/20 shadow-lg">
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <Sparkles className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  APsolutions CRM
                </h1>
                <p className="text-sm text-gray-600 font-medium">Gestão Inteligente de Projetos</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-6">
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                  <TrendingUp className="text-indigo-500" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Total</p>
                    <p className="text-lg font-bold text-gray-900">{totalCards}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm">
                  <Clock className="text-purple-500" size={18} />
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Ativos</p>
                    <p className="text-lg font-bold text-gray-900">{columns[2]?.cards.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative max-w-xl">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar projetos, clientes, responsáveis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border-2 border-transparent rounded-xl focus:outline-none focus:border-indigo-400 shadow-sm transition-all"
            />
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="p-6 overflow-x-auto scrollbar-thin">
        <div className="flex gap-5 min-w-max pb-4">
          {filteredColumns.map((column, colIndex) => (
            <div
              key={column.id}
              className="w-96 flex-shrink-0 animate-fade-in"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="mb-4">
                <div className={`flex items-center justify-between p-4 bg-gradient-to-r ${getColumnGradient(colIndex)} rounded-2xl shadow-lg text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                      <span className="text-xl font-bold">{column.cards.length}</span>
                    </div>
                    <h3 className="text-lg font-bold">{column.titulo}</h3>
                  </div>
                  <button
                    onClick={() => setShowNewCard(column.id)}
                    className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-4 min-h-32">
                {showNewCard === column.id && (
                  <div className="bg-white rounded-2xl shadow-xl border-2 border-indigo-400 p-5 animate-slide-in">
                    <input
                      type="text"
                      placeholder="✨ Título do projeto*"
                      value={newCard.titulo}
                      onChange={(e) => setNewCard({...newCard, titulo: e.target.value})}
                      className="w-full mb-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all font-medium"
                      autoFocus
                    />
                    <textarea
                      placeholder="📝 Descrição"
                      value={newCard.descricao}
                      onChange={(e) => setNewCard({...newCard, descricao: e.target.value})}
                      className="w-full mb-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all text-sm resize-none"
                      rows="3"
                    />
                    <input
                      type="text"
                      placeholder="🏢 Cliente"
                      value={newCard.cliente}
                      onChange={(e) => setNewCard({...newCard, cliente: e.target.value})}
                      className="w-full mb-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all text-sm"
                    />
                    <input
                      type="text"
                      placeholder="👤 Responsável"
                      value={newCard.responsavel}
                      onChange={(e) => setNewCard({...newCard, responsavel: e.target.value})}
                      className="w-full mb-3 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all text-sm"
                    />
                    <input
                      type="date"
                      value={newCard.prazo}
                      onChange={(e) => setNewCard({...newCard, prazo: e.target.value})}
                      className="w-full mb-4 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-indigo-400 transition-all text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddCard(column.id)}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setShowNewCard(null)}
                        className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card, column.id)}
                    className="bg-white rounded-2xl card-shadow border border-gray-100 p-5 group cursor-move"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-bold text-gray-900 flex-1 pr-2 text-lg leading-tight">{card.titulo}</h4>
                      <button 
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {card.descricao && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">{card.descricao}</p>
                    )}

                    {card.etiquetas && card.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {card.etiquetas.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 text-xs font-semibold rounded-full border border-indigo-100"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mb-4">
                      <span className={`inline-block px-3 py-1.5 text-xs font-bold rounded-full border ${getPrioridadeColor(card.prioridade)}`}>
                        {card.prioridade}
                      </span>
                    </div>

                    <div className="space-y-3 mb-4">
                      {card.cliente && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <Users size={16} className="text-indigo-600" />
                          </div>
                          <span className="text-sm font-medium">{card.cliente}</span>
                        </div>
                      )}
                      {card.responsavel && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold shadow-md">
                            {card.responsavel.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium">{card.responsavel}</span>
                        </div>
                      )}
                      {card.prazo && (
                        <div className="flex items-center gap-3 text-gray-600">
                          <div className="w-8 h-8 bg-pink-100 rounded-lg flex items-center justify-center">
                            <Calendar size={16} className="text-pink-600" />
                          </div>
                          <span className="text-sm font-medium">{new Date(card.prazo).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                      {card.comentarios > 0 && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <MessageSquare size={16} />
                          <span className="text-sm font-medium">{card.comentarios}</span>
                        </div>
                      )}
                      {card.anexos > 0 && (
                        <div className="flex items-center gap-2 text-gray-500">
                          <Paperclip size={16} />
                          <span className="text-sm font-medium">{card.anexos}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
```

const App = () => {
  const [columns, setColumns] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCard, setShowNewCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [newCard, setNewCard] = useState({
    titulo: '',
    descricao: '',
    cliente: '',
    prazo: '',
    responsavel: '',
    prioridade: 'Média',
    etiquetas: []
  });

  useEffect(() => {
    loadColumns();
  }, []);

  const loadColumns = async () => {
    try {
      const data = await fetchColumns();
      setColumns(data);
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const getPrioridadeColor = (prioridade) => {
    const colors = {
      'Alta': 'bg-red-100 text-red-700 border-red-200',
      'Média': 'bg-yellow-100 text-yellow-700 border-yellow-200',
      'Baixa': 'bg-green-100 text-green-700 border-green-200'
    };
    return colors[prioridade] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const handleDragStart = (card, columnId) => {
    setDraggedCard(card);
    setDraggedFrom(columnId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (targetColumnId) => {
    if (!draggedCard || !draggedFrom || draggedFrom === targetColumnId) {
      setDraggedCard(null);
      setDraggedFrom(null);
      return;
    }

    try {
      await moveCard(draggedCard.id, targetColumnId);
      await loadColumns();
      setDraggedCard(null);
      setDraggedFrom(null);
    } catch (error) {
      console.error('Erro ao mover card:', error);
    }
  };

  const handleAddCard = async (columnId) => {
    if (!newCard.titulo) {
      alert('Digite um título para o card');
      return;
    }

    try {
      await createCard({
        column_id: columnId,
        ...newCard
      });
      
      setNewCard({
        titulo: '',
        descricao: '',
        cliente: '',
        prazo: '',
        responsavel: '',
        prioridade: 'Média',
        etiquetas: []
      });
      setShowNewCard(null);
      await loadColumns();
    } catch (error) {
      console.error('Erro ao criar card:', error);
      alert('Erro ao criar card');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Tem certeza que deseja deletar este card?')) return;
    
    try {
      await deleteCard(cardId);
      await loadColumns();
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      alert('Erro ao deletar card');
    }
  };

  const filteredColumns = columns.map(col => ({
    ...col,
    cards: col.cards.filter(card =>
      card.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (card.cliente && card.cliente.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (card.responsavel && card.responsavel.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }));

  const totalCards = columns.reduce((sum, col) => sum + col.cards.length, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">APsolutions CRM</h1>
              <p className="text-sm text-gray-600">Kanban de Projetos</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-600">
                <span className="font-semibold">{totalCards}</span> projetos ativos
              </div>
            </div>
          </div>
          
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Buscar projetos, clientes, responsáveis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <div className="p-6 overflow-x-auto">
        <div className="flex gap-4 min-w-max pb-4">
          {filteredColumns.map((column) => (
            <div
              key={column.id}
              className="w-80 flex-shrink-0"
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
            >
              <div className="mb-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${column.cor}`}></div>
                    <h3 className="font-semibold text-gray-900">{column.titulo}</h3>
                    <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                      {column.cards.length}
                    </span>
                  </div>
                  <button
                    onClick={() => setShowNewCard(column.id)}
                    className="text-gray-400 hover:text-gray-600 transition"
                  >
                    <Plus size={20} />
                  </button>
                </div>
              </div>

              <div className="space-y-3 min-h-32">
                {showNewCard === column.id && (
                  <div className="bg-white rounded-lg shadow-md border-2 border-blue-500 p-4">
                    <input
                      type="text"
                      placeholder="Título do projeto*"
                      value={newCard.titulo}
                      onChange={(e) => setNewCard({...newCard, titulo: e.target.value})}
                      className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      autoFocus
                    />
                    <textarea
                      placeholder="Descrição"
                      value={newCard.descricao}
                      onChange={(e) => setNewCard({...newCard, descricao: e.target.value})}
                      className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      rows="2"
                    />
                    <input
                      type="text"
                      placeholder="Cliente"
                      value={newCard.cliente}
                      onChange={(e) => setNewCard({...newCard, cliente: e.target.value})}
                      className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Responsável"
                      value={newCard.responsavel}
                      onChange={(e) => setNewCard({...newCard, responsavel: e.target.value})}
                      className="w-full mb-2 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <input
                      type="date"
                      value={newCard.prazo}
                      onChange={(e) => setNewCard({...newCard, prazo: e.target.value})}
                      className="w-full mb-3 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddCard(column.id)}
                        className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition text-sm font-medium"
                      >
                        Adicionar
                      </button>
                      <button
                        onClick={() => setShowNewCard(null)}
                        className="px-3 py-2 border rounded hover:bg-gray-50 transition"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                )}

                {column.cards.map((card) => (
                  <div
                    key={card.id}
                    draggable
                    onDragStart={() => handleDragStart(card, column.id)}
                    className="bg-white rounded-lg shadow-sm border hover:shadow-md transition cursor-move p-4 group"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 flex-1 pr-2">{card.titulo}</h4>
                      <button 
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    {card.descricao && (
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{card.descricao}</p>
                    )}

                    {card.etiquetas && card.etiquetas.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-3">
                        {card.etiquetas.map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mb-3">
                      <span className={`inline-block px-2 py-1 text-xs font-medium rounded border ${getPrioridadeColor(card.prioridade)}`}>
                        {card.prioridade}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3 text-sm">
                      {card.cliente && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Users size={14} />
                          <span className="text-xs">{card.cliente}</span>
                        </div>
                      )}
                      {card.responsavel && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-medium">
                            {card.responsavel.charAt(0)}
                          </div>
                          <span className="text-xs">{card.responsavel}</span>
                        </div>
                      )}
                      {card.prazo && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Calendar size={14} />
                          <span className="text-xs">{new Date(card.prazo).toLocaleDateString('pt-BR')}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 pt-3 border-t text-gray-500">
                      {card.comentarios > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <MessageSquare size={14} />
                          <span>{card.comentarios}</span>
                        </div>
                      )}
                      {card.anexos > 0 && (
                        <div className="flex items-center gap-1 text-xs">
                          <Paperclip size={14} />
                          <span>{card.anexos}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default App;
```

---

---

## 🚀 COMO RODAR

### 1. Instale o Node.js
Baixe em: https://nodejs.org/ (versão LTS)

### 2. Backend
```bash
cd backend
npm install
npm start
```
✅ Backend rodando em: `http://localhost:5000`

### 3. Frontend (novo terminal)
```bash
cd frontend
npm install
npm run dev
```
✅ Frontend rodando em: `http://localhost:3000`

### 4. Abra no navegador e recarregue
```
http://localhost:3000
```
Pressione `Ctrl+R` (ou `Cmd+R` no Mac) para ver o novo design!

---

## 🎨 Novo Design Inclui:

- ✨ **Gradientes modernos** nas colunas
- 💫 **Animações suaves** (fade in, slide in)
- 🎭 **Efeito glass/blur** no header
- 💎 **Hover elevado** nos cards
- 🌈 **Cores vibrantes** e vivas
- 📊 **Estatísticas** no header
- 🎪 **Loading animado** bonito
- 🔮 **Avatares com gradiente**
- 💅 **Fonte Inter** do Google

---

## 📁 Seus dados ficam em:
```
backend/data.json
```

Todos os cards que você criar/mover/deletar são salvos automaticamente nesse arquivo!

---

## ✨ Funcionalidades
- ✅ Drag & Drop entre colunas
- ✅ Criar novos cards
- ✅ Deletar cards
- ✅ Busca em tempo real
- ✅ **Persiste em data.json**
- ✅ **Design moderno e bonito**
- ✅ Sem banco de dados necessário