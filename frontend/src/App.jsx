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