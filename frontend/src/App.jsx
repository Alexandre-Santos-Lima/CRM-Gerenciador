import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Calendar, Users, MessageSquare, Paperclip, X, Trash2, 
  Sparkles, TrendingUp, Clock, Edit2, DollarSign, BarChart3, Building2,
  Phone, Mail, MapPin, Save, ChevronRight, Target, Briefcase, Filter,
  ArrowUpRight, ArrowDownRight, Menu, Repeat, AlertCircle, CheckCircle
} from 'lucide-react';
import { fetchColumns, createCard, moveCard, deleteCard, updateCard } from './api';

const App = () => {
  const [columns, setColumns] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [recorrencias, setRecorrencias] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewCard, setShowNewCard] = useState(null);
  const [showEditCard, setShowEditCard] = useState(null);
  const [showClienteModal, setShowClienteModal] = useState(false);
  const [showRecorrenciaModal, setShowRecorrenciaModal] = useState(false);
  const [editingRecorrencia, setEditingRecorrencia] = useState(null);
  const [showFinanceiro, setShowFinanceiro] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [loading, setLoading] = useState(true);
  const [draggedCard, setDraggedCard] = useState(null);
  const [draggedFrom, setDraggedFrom] = useState(null);
  const [activeView, setActiveView] = useState('dashboard'); // dashboard, kanban, clientes, recorrencias, financeiro
  
  const [newCard, setNewCard] = useState({
    titulo: '',
    descricao: '',
    cliente: '',
    prazo: '',
    responsavel: '',
    prioridade: 'Média',
    etiquetas: [],
    valor: 0
  });

  const [novoCliente, setNovoCliente] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    contato: '',
    observacoes: ''
  });

  const [novaRecorrencia, setNovaRecorrencia] = useState({
    cliente: '',
    descricao: '',
    valor: 0,
    diaVencimento: 1,
    status: 'ativo',
    dataInicio: '',
    observacoes: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await fetchColumns();
      setColumns(data);
      
      // Carregar clientes do localStorage
      const savedClientes = localStorage.getItem('clientes');
      if (savedClientes) {
        setClientes(JSON.parse(savedClientes));
      }
      
      // Carregar recorrências do localStorage
      const savedRecorrencias = localStorage.getItem('recorrencias');
      if (savedRecorrencias) {
        setRecorrencias(JSON.parse(savedRecorrencias));
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      setLoading(false);
    }
  };

  const saveClientes = (updatedClientes) => {
    setClientes(updatedClientes);
    localStorage.setItem('clientes', JSON.stringify(updatedClientes));
  };

  const saveRecorrencias = (updatedRecorrencias) => {
    setRecorrencias(updatedRecorrencias);
    localStorage.setItem('recorrencias', JSON.stringify(updatedRecorrencias));
  };

  const handleAddRecorrencia = () => {
    if (!novaRecorrencia.cliente || !novaRecorrencia.descricao) {
      alert('Preencha o cliente e descrição');
      return;
    }

    const recorrencia = {
      id: Date.now(),
      ...novaRecorrencia,
      criadaEm: new Date().toISOString()
    };

    const updated = [...recorrencias, recorrencia];
    saveRecorrencias(updated);
    
    setNovaRecorrencia({
      cliente: '',
      descricao: '',
      valor: 0,
      diaVencimento: 1,
      status: 'ativo',
      dataInicio: '',
      observacoes: ''
    });
    setShowRecorrenciaModal(false);
  };

  const handleUpdateRecorrencia = () => {
    if (!editingRecorrencia.cliente || !editingRecorrencia.descricao) {
      alert('Preencha o cliente e descrição');
      return;
    }

    const updated = recorrencias.map(r => 
      r.id === editingRecorrencia.id ? editingRecorrencia : r
    );
    saveRecorrencias(updated);
    setEditingRecorrencia(null);
  };

  const handleDeleteRecorrencia = (id) => {
    if (!confirm('Tem certeza que deseja deletar esta recorrência?')) return;
    const updated = recorrencias.filter(r => r.id !== id);
    saveRecorrencias(updated);
  };

  const getProximosVencimentos = () => {
    const hoje = new Date();
    const proximosMeses = [];
    
    for (let i = 0; i < 6; i++) {
      const mes = new Date(hoje.getFullYear(), hoje.getMonth() + i, 1);
      proximosMeses.push(mes);
    }
    
    return proximosMeses.map(mes => {
      const recorrenciasAtivas = recorrencias.filter(r => r.status === 'ativo');
      const vencimentosMes = recorrenciasAtivas.map(r => {
        const dataVencimento = new Date(mes.getFullYear(), mes.getMonth(), r.diaVencimento);
        return {
          ...r,
          dataVencimento,
          atrasado: dataVencimento < hoje && mes.getMonth() === hoje.getMonth()
        };
      });
      
      return {
        mes: mes.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }),
        vencimentos: vencimentosMes,
        total: vencimentosMes.reduce((sum, v) => sum + parseFloat(v.valor), 0)
      };
    });
  };

  const handleAddCliente = () => {
    if (!novoCliente.nome) {
      alert('Digite o nome do cliente');
      return;
    }

    const cliente = {
      id: Date.now(),
      ...novoCliente,
      criadoEm: new Date().toISOString()
    };

    const updated = [...clientes, cliente];
    saveClientes(updated);
    
    setNovoCliente({
      nome: '',
      email: '',
      telefone: '',
      endereco: '',
      contato: '',
      observacoes: ''
    });
    setShowClienteModal(false);
  };

  const handleUpdateCliente = () => {
    if (!editingCliente.nome) {
      alert('Digite o nome do cliente');
      return;
    }

    const updated = clientes.map(c => 
      c.id === editingCliente.id ? editingCliente : c
    );
    saveClientes(updated);
    setEditingCliente(null);
  };

  const handleDeleteCliente = (id) => {
    if (!confirm('Tem certeza que deseja deletar este cliente?')) return;
    const updated = clientes.filter(c => c.id !== id);
    saveClientes(updated);
  };

  const getPrioridadeColor = (prioridade) => {
    const colors = {
      'Alta': 'bg-red-500 text-white',
      'Média': 'bg-yellow-500 text-white',
      'Baixa': 'bg-green-500 text-white'
    };
    return colors[prioridade] || 'bg-gray-500 text-white';
  };

  const getColumnColor = (index) => {
    const colors = [
      'bg-slate-600',
      'bg-blue-600',
      'bg-amber-600',
      'bg-violet-600',
      'bg-emerald-600'
    ];
    return colors[index % colors.length];
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
      await loadData();
      setDraggedCard(null);
      setDraggedFrom(null);
    } catch (error) {
      console.error('Erro ao mover card:', error);
    }
  };

  const handleAddCard = async (columnId) => {
    if (!newCard.titulo) {
      alert('Digite um título para o projeto');
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
        etiquetas: [],
        valor: 0
      });
      setShowNewCard(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao criar card:', error);
      alert('Erro ao criar projeto');
    }
  };

  const handleEditCard = async () => {
    if (!showEditCard.titulo) {
      alert('Digite um título para o projeto');
      return;
    }

    try {
      await updateCard(showEditCard.id, showEditCard);
      setShowEditCard(null);
      await loadData();
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      alert('Erro ao atualizar projeto');
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!confirm('Tem certeza que deseja deletar este projeto?')) return;
    
    try {
      await deleteCard(cardId);
      await loadData();
    } catch (error) {
      console.error('Erro ao deletar card:', error);
      alert('Erro ao deletar projeto');
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

  // Cálculos financeiros
  const allCards = columns.flatMap(col => col.cards);
  const totalProjetos = allCards.length;
  const totalReceita = allCards.reduce((sum, card) => sum + (parseFloat(card.valor) || 0), 0);
  const projetosAtivos = columns.slice(0, 4).flatMap(col => col.cards);
  const receitaAtiva = projetosAtivos.reduce((sum, card) => sum + (parseFloat(card.valor) || 0), 0);
  const projetosConcluidos = columns[4]?.cards || [];
  const receitaConcluida = projetosConcluidos.reduce((sum, card) => sum + (parseFloat(card.valor) || 0), 0);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
          <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-purple-400" size={24} />
        </div>
        <p className="mt-4 text-lg font-medium text-white">Carregando workspace...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/30 backdrop-blur-xl sticky top-0 z-30 border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-xl shadow-purple-500/50">
                <img
                  src="https://apsolutions.ia.br/imagens/apsolutions_logo.webp"
                  alt="Logo"
                  className="h-12 w-auto object-contain"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">
                  APsolutions CRM
                </h1>
                <p className="text-sm text-purple-300 font-medium">Gestão Inteligente de Projetos</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeView === 'dashboard' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <TrendingUp size={18} className="inline mr-2" />
                Dashboard
              </button>
              <button
                onClick={() => setActiveView('kanban')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeView === 'kanban' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <BarChart3 size={18} className="inline mr-2" />
                Kanban
              </button>
              <button
                onClick={() => setActiveView('recorrencias')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeView === 'recorrencias' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Repeat size={18} className="inline mr-2" />
                Recorrências
              </button>
              <button
                onClick={() => setActiveView('clientes')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeView === 'clientes' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <Building2 size={18} className="inline mr-2" />
                Clientes
              </button>
              <button
                onClick={() => setActiveView('financeiro')}
                className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                  activeView === 'financeiro' 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/50' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                <DollarSign size={18} className="inline mr-2" />
                Financeiro
              </button>
            </div>
          </div>

          {/* Search */}
          {activeView === 'kanban' && (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-400" size={20} />
              <input
                type="text"
                placeholder="Buscar projetos, clientes ou responsáveis..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:border-purple-500 transition-all"
              />
            </div>
          )}
        </div>
      </header>

      {/* Dashboard View */}
      {activeView === 'dashboard' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Dashboard Geral</h2>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Target className="text-purple-400" size={28} />
                  <ArrowUpRight className="text-green-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{totalProjetos}</p>
                <p className="text-sm text-purple-300">Total de Projetos</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Clock className="text-amber-400" size={28} />
                  <ArrowUpRight className="text-green-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{projetosAtivos.length}</p>
                <p className="text-sm text-purple-300">Em Andamento</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="text-green-400" size={28} />
                  <TrendingUp className="text-green-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceita)}
                </p>
                <p className="text-sm text-purple-300">Receita Total</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-5 border border-white/20">
                <div className="flex items-center justify-between mb-2">
                  <Building2 className="text-blue-400" size={28} />
                  <Users className="text-blue-400" size={20} />
                </div>
                <p className="text-3xl font-bold text-white mb-1">{clientes.length}</p>
                <p className="text-sm text-purple-300">Clientes Ativos</p>
              </div>
            </div>

            {/* Projetos por Status */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6">Distribuição de Projetos</h3>
              <div className="space-y-4">
                {columns.map((col, index) => {
                  const percentual = totalProjetos > 0 ? (col.cards.length / totalProjetos) * 100 : 0;

                  return (
                    <div key={col.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${getColumnColor(index)} rounded-full`}></div>
                          <span className="text-white font-medium">{col.titulo}</span>
                        </div>
                        <span className="text-white font-bold">{col.cards.length} projetos</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${getColumnColor(index)} transition-all duration-500`}
                          style={{ width: `${percentual}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Projetos Recentes */}
            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Projetos Recentes</h3>
              <div className="space-y-3">
                {allCards
                  .slice()
                  .reverse()
                  .slice(0, 10)
                  .map((card) => {
                    const coluna = columns.find(col => col.cards.some(c => c.id === card.id));
                    return (
                      <div key={card.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                            {card.titulo.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1">
                            <p className="text-white font-semibold">{card.titulo}</p>
                            <p className="text-slate-400 text-sm">{card.cliente}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          {coluna && (
                            <span className={`px-3 py-1 ${getColumnColor(columns.indexOf(coluna))} text-white text-xs font-semibold rounded-full`}>
                              {coluna.titulo}
                            </span>
                          )}
                          {card.valor > 0 && (
                            <span className="text-green-400 font-bold">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.valor)}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Kanban View */}
      {activeView === 'kanban' && (
        <div className="p-6 overflow-x-auto">
          <div className="flex gap-5 min-w-max pb-4">
            {filteredColumns.map((column, colIndex) => (
              <div
                key={column.id}
                className="w-80 flex-shrink-0"
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(column.id)}
              >
                <div className="mb-3">
                  <div className={`flex items-center justify-between p-3 ${getColumnColor(colIndex)} rounded-xl shadow-xl text-white`}>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold">{column.cards.length}</span>
                      </div>
                      <h3 className="text-base font-bold">{column.titulo}</h3>
                    </div>
                    <button
                      onClick={() => setShowNewCard(column.id)}
                      className="w-7 h-7 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-all hover:scale-110"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-3 min-h-32">
                  {showNewCard === column.id && (
                    <div className="bg-slate-800 rounded-xl shadow-2xl border-2 border-purple-500 p-4">
                      <input
                        type="text"
                        placeholder="Título do projeto*"
                        value={newCard.titulo}
                        onChange={(e) => setNewCard({...newCard, titulo: e.target.value})}
                        className="w-full mb-2 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                        autoFocus
                      />
                      <textarea
                        placeholder="Descrição"
                        value={newCard.descricao}
                        onChange={(e) => setNewCard({...newCard, descricao: e.target.value})}
                        className="w-full mb-2 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                        rows="2"
                      />
                      <select
                        value={newCard.cliente}
                        onChange={(e) => setNewCard({...newCard, cliente: e.target.value})}
                        className="w-full mb-2 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="">Selecione o cliente</option>
                        {clientes.map(c => (
                          <option key={c.id} value={c.nome}>{c.nome}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Responsável"
                        value={newCard.responsavel}
                        onChange={(e) => setNewCard({...newCard, responsavel: e.target.value})}
                        className="w-full mb-2 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <input
                        type="date"
                        value={newCard.prazo}
                        onChange={(e) => setNewCard({...newCard, prazo: e.target.value})}
                        className="w-full mb-2 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <input
                        type="number"
                        placeholder="Valor do projeto (R$)"
                        value={newCard.valor}
                        onChange={(e) => setNewCard({...newCard, valor: e.target.value})}
                        className="w-full mb-2 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                      />
                      <select
                        value={newCard.prioridade}
                        onChange={(e) => setNewCard({...newCard, prioridade: e.target.value})}
                        className="w-full mb-3 px-3 py-2 bg-slate-700 border-2 border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:border-purple-500 transition-all"
                      >
                        <option value="Alta">Alta</option>
                        <option value="Média">Média</option>
                        <option value="Baixa">Baixa</option>
                      </select>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddCard(column.id)}
                          className="flex-1 px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
                        >
                          Adicionar
                        </button>
                        <button
                          onClick={() => setShowNewCard(null)}
                          className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-all"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  {column.cards.map((card) => (
                    <div
                      key={card.id}
                      draggable
                      onDragStart={() => handleDragStart(card, column.id)}
                      className="bg-slate-800 rounded-xl border border-slate-700 p-4 group cursor-move hover:border-purple-500 transition-all hover:shadow-2xl hover:shadow-purple-500/20"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-bold text-white flex-1 pr-2 text-base">{card.titulo}</h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button 
                            onClick={() => setShowEditCard(card)}
                            className="text-slate-400 hover:text-purple-400 transition-all"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteCard(card.id)}
                            className="text-slate-400 hover:text-red-400 transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {card.descricao && (
                        <p className="text-xs text-slate-400 mb-3 line-clamp-2">{card.descricao}</p>
                      )}

                      {card.valor && card.valor > 0 && (
                        <div className="mb-3 p-2 bg-green-500/20 border border-green-500/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-green-400" />
                            <span className="text-base font-bold text-green-400">
                              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.valor)}
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="mb-3">
                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded-full ${getPrioridadeColor(card.prioridade)}`}>
                          {card.prioridade}
                        </span>
                      </div>

                      <div className="space-y-2">
                        {card.cliente && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="w-6 h-6 bg-purple-500/20 rounded-lg flex items-center justify-center">
                              <Building2 size={12} className="text-purple-400" />
                            </div>
                            <span className="text-xs font-medium">{card.cliente}</span>
                          </div>
                        )}
                        {card.responsavel && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold shadow-md">
                              {card.responsavel.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-xs font-medium">{card.responsavel}</span>
                          </div>
                        )}
                        {card.prazo && (
                          <div className="flex items-center gap-2 text-slate-300">
                            <div className="w-6 h-6 bg-pink-500/20 rounded-lg flex items-center justify-center">
                              <Calendar size={12} className="text-pink-400" />
                            </div>
                            <span className="text-xs font-medium">{new Date(card.prazo).toLocaleDateString('pt-BR')}</span>
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
      )}

      {/* Clientes View */}
      {activeView === 'clientes' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold text-white">Gerenciamento de Clientes</h2>
              <button
                onClick={() => setShowClienteModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Novo Cliente
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {clientes.map(cliente => (
                <div key={cliente.id} className="bg-slate-800 rounded-xl border border-slate-700 p-4 hover:border-purple-500 transition-all">
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                      {cliente.nome.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingCliente(cliente)}
                        className="text-slate-400 hover:text-purple-400 transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteCliente(cliente.id)}
                        className="text-slate-400 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-3">{cliente.nome}</h3>

                  <div className="space-y-2">
                    {cliente.email && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Mail size={14} className="text-purple-400" />
                        <span className="text-xs truncate">{cliente.email}</span>
                      </div>
                    )}
                    {cliente.telefone && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Phone size={14} className="text-purple-400" />
                        <span className="text-xs">{cliente.telefone}</span>
                      </div>
                    )}
                    {cliente.endereco && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <MapPin size={14} className="text-purple-400" />
                        <span className="text-xs truncate">{cliente.endereco}</span>
                      </div>
                    )}
                    {cliente.contato && (
                      <div className="flex items-center gap-2 text-slate-300">
                        <Users size={14} className="text-purple-400" />
                        <span className="text-xs">{cliente.contato}</span>
                      </div>
                    )}
                  </div>

                  {cliente.observacoes && (
                    <div className="mt-3 p-2 bg-slate-700/50 rounded-lg">
                      <p className="text-xs text-slate-400 line-clamp-2">{cliente.observacoes}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Recorrências View */}
      {activeView === 'recorrencias' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-3xl font-bold text-white">Contratos Recorrentes</h2>
                <p className="text-purple-300 text-sm mt-1">Gerencie assinaturas e pagamentos mensais</p>
              </div>
              <button
                onClick={() => setShowRecorrenciaModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg flex items-center gap-2"
              >
                <Plus size={20} />
                Nova Recorrência
              </button>
            </div>

            {/* Resumo Recorrências Ativas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-5 shadow-xl">
                <Repeat className="text-white/80 mb-3" size={28} />
                <p className="text-white/80 text-sm mb-1">Contratos Ativos</p>
                <p className="text-3xl font-bold text-white">
                  {recorrencias.filter(r => r.status === 'ativo').length}
                </p>
              </div>
              <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl p-5 shadow-xl">
                <DollarSign className="text-white/80 mb-3" size={28} />
                <p className="text-white/80 text-sm mb-1">Receita Mensal</p>
                <p className="text-3xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
                    recorrencias
                      .filter(r => r.status === 'ativo')
                      .reduce((sum, r) => sum + parseFloat(r.valor), 0)
                  )}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl p-5 shadow-xl">
                <Calendar className="text-white/80 mb-3" size={28} />
                <p className="text-white/80 text-sm mb-1">Vencimentos Este Mês</p>
                <p className="text-3xl font-bold text-white">
                  {recorrencias.filter(r => r.status === 'ativo').length}
                </p>
              </div>
            </div>

            {/* Contratos Ativos */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mb-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <CheckCircle className="text-green-400" size={24} />
                Contratos Ativos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {recorrencias.filter(r => r.status === 'ativo').map(rec => (
                  <div key={rec.id} className="bg-slate-700/50 rounded-xl p-4 border border-slate-600 hover:border-purple-500 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h4 className="text-white font-bold text-lg">{rec.cliente}</h4>
                        <p className="text-slate-300 text-sm">{rec.descricao}</p>
                      </div>
                      <div className="flex gap-1">
                        <button
                          onClick={() => setEditingRecorrencia(rec)}
                          className="text-slate-400 hover:text-purple-400 transition-all"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteRecorrencia(rec.id)}
                          className="text-slate-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Valor Mensal:</span>
                        <span className="text-green-400 font-bold text-lg">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rec.valor)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Vencimento:</span>
                        <span className="text-white font-semibold">Dia {rec.diaVencimento}</span>
                      </div>
                      {rec.dataInicio && (
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 text-sm">Início:</span>
                          <span className="text-slate-300 text-sm">
                            {new Date(rec.dataInicio).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      )}
                    </div>

                    {rec.observacoes && (
                      <div className="mt-3 p-2 bg-slate-800/50 rounded-lg">
                        <p className="text-xs text-slate-400">{rec.observacoes}</p>
                      </div>
                    )}
                  </div>
                ))}
                
                {recorrencias.filter(r => r.status === 'ativo').length === 0 && (
                  <div className="col-span-2 text-center py-12">
                    <Repeat className="mx-auto text-slate-600 mb-4" size={48} />
                    <p className="text-slate-400">Nenhum contrato recorrente ativo</p>
                    <button
                      onClick={() => setShowRecorrenciaModal(true)}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                    >
                      Adicionar Primeiro Contrato
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Calendário de Vencimentos */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <Calendar className="text-blue-400" size={24} />
                Próximos Vencimentos (6 meses)
              </h3>
              <div className="space-y-4">
                {getProximosVencimentos().map((mesData, index) => (
                  <div key={index} className="bg-slate-700/50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-white font-bold text-lg capitalize">{mesData.mes}</h4>
                      <span className="text-green-400 font-bold text-xl">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(mesData.total)}
                      </span>
                    </div>
                    
                    {mesData.vencimentos.length > 0 ? (
                      <div className="space-y-2">
                        {mesData.vencimentos.map((venc, vIdx) => (
                          <div 
                            key={vIdx} 
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              venc.atrasado ? 'bg-red-500/20 border border-red-500/30' : 'bg-slate-800/50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {venc.atrasado && <AlertCircle className="text-red-400" size={18} />}
                              <div>
                                <p className="text-white font-semibold">{venc.cliente}</p>
                                <p className="text-slate-400 text-sm">{venc.descricao}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-green-400 font-bold">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venc.valor)}
                              </p>
                              <p className="text-slate-400 text-xs">
                                {venc.dataVencimento.toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-slate-400 text-sm text-center py-4">Nenhum vencimento neste mês</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Contratos Inativos */}
            {recorrencias.filter(r => r.status === 'inativo').length > 0 && (
              <div className="bg-slate-800 rounded-xl border border-slate-700 p-6 mt-6">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                  <X className="text-slate-400" size={24} />
                  Contratos Inativos
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recorrencias.filter(r => r.status === 'inativo').map(rec => (
                    <div key={rec.id} className="bg-slate-700/30 rounded-xl p-4 border border-slate-600 opacity-60">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h4 className="text-white font-bold text-lg">{rec.cliente}</h4>
                          <p className="text-slate-400 text-sm">{rec.descricao}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteRecorrencia(rec.id)}
                          className="text-slate-400 hover:text-red-400 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">Era:</span>
                        <span className="text-slate-400 font-semibold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(rec.valor)}/mês
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Financeiro View */}
      {activeView === 'financeiro' && (
        <div className="p-6">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Projeção Financeira</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 shadow-2xl">
                <DollarSign className="text-white/80 mb-4" size={32} />
                <p className="text-white/80 text-sm mb-2">Receita Total</p>
                <p className="text-4xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalReceita)}
                </p>
                <p className="text-white/60 text-sm mt-2">{totalProjetos} projetos</p>
              </div>

              <div className="bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl p-6 shadow-2xl">
                <Clock className="text-white/80 mb-4" size={32} />
                <p className="text-white/80 text-sm mb-2">Em Andamento</p>
                <p className="text-4xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaAtiva)}
                </p>
                <p className="text-white/60 text-sm mt-2">{projetosAtivos.length} projetos ativos</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-2xl">
                <Target className="text-white/80 mb-4" size={32} />
                <p className="text-white/80 text-sm mb-2">Concluídos</p>
                <p className="text-4xl font-bold text-white">
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaConcluida)}
                </p>
                <p className="text-white/60 text-sm mt-2">{projetosConcluidos.length} projetos finalizados</p>
              </div>
            </div>

            <div className="bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Projetos por Status</h3>
              <div className="space-y-4">
                {columns.map((col, index) => {
                  const receitaColuna = col.cards.reduce((sum, card) => sum + (parseFloat(card.valor) || 0), 0);
                  const percentual = totalReceita > 0 ? (receitaColuna / totalReceita) * 100 : 0;

                  return (
                    <div key={col.id}>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={`w-4 h-4 ${getColumnColor(index)} rounded-full`}></div>
                          <span className="text-white font-medium">{col.titulo}</span>
                          <span className="text-slate-400 text-sm">({col.cards.length} projetos)</span>
                        </div>
                        <span className="text-white font-bold">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(receitaColuna)}
                        </span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-full ${getColumnColor(index)} transition-all duration-500`}
                          style={{ width: `${percentual}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="mt-8 bg-slate-800 rounded-2xl border border-slate-700 p-6">
              <h3 className="text-2xl font-bold text-white mb-6">Top 10 Projetos por Valor</h3>
              <div className="space-y-3">
                {allCards
                  .filter(card => card.valor > 0)
                  .sort((a, b) => parseFloat(b.valor) - parseFloat(a.valor))
                  .slice(0, 10)
                  .map((card, index) => (
                    <div key={card.id} className="flex items-center justify-between p-4 bg-slate-700/50 rounded-xl hover:bg-slate-700 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-white font-semibold">{card.titulo}</p>
                          <p className="text-slate-400 text-sm">{card.cliente}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-green-400 font-bold text-lg">
                          {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(card.valor)}
                        </p>
                        <p className="text-slate-400 text-sm">{card.responsavel}</p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal Novo Cliente */}
      {showClienteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Novo Cliente</h3>
              <button
                onClick={() => setShowClienteModal(false)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Nome do Cliente*</label>
                <input
                  type="text"
                  value={novoCliente.nome}
                  onChange={(e) => setNovoCliente({...novoCliente, nome: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="Ex: Empresa XYZ Ltda"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    value={novoCliente.email}
                    onChange={(e) => setNovoCliente({...novoCliente, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="contato@empresa.com"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Telefone</label>
                  <input
                    type="tel"
                    value={novoCliente.telefone}
                    onChange={(e) => setNovoCliente({...novoCliente, telefone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="(11) 99999-9999"
                  />
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Endereço</label>
                <input
                  type="text"
                  value={novoCliente.endereco}
                  onChange={(e) => setNovoCliente({...novoCliente, endereco: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="Rua, Número, Bairro, Cidade"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Pessoa de Contato</label>
                <input
                  type="text"
                  value={novoCliente.contato}
                  onChange={(e) => setNovoCliente({...novoCliente, contato: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="Nome do responsável"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Observações</label>
                <textarea
                  value={novoCliente.observacoes}
                  onChange={(e) => setNovoCliente({...novoCliente, observacoes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  rows="4"
                  placeholder="Informações adicionais sobre o cliente..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddCliente}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Salvar Cliente
              </button>
              <button
                onClick={() => setShowClienteModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Cliente */}
      {editingCliente && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Editar Cliente</h3>
              <button
                onClick={() => setEditingCliente(null)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Nome do Cliente*</label>
                <input
                  type="text"
                  value={editingCliente.nome}
                  onChange={(e) => setEditingCliente({...editingCliente, nome: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Email</label>
                  <input
                    type="email"
                    value={editingCliente.email}
                    onChange={(e) => setEditingCliente({...editingCliente, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Telefone</label>
                  <input
                    type="tel"
                    value={editingCliente.telefone}
                    onChange={(e) => setEditingCliente({...editingCliente, telefone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Endereço</label>
                <input
                  type="text"
                  value={editingCliente.endereco}
                  onChange={(e) => setEditingCliente({...editingCliente, endereco: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Pessoa de Contato</label>
                <input
                  type="text"
                  value={editingCliente.contato}
                  onChange={(e) => setEditingCliente({...editingCliente, contato: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Observações</label>
                <textarea
                  value={editingCliente.observacoes}
                  onChange={(e) => setEditingCliente({...editingCliente, observacoes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  rows="4"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdateCliente}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => setEditingCliente(null)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Nova Recorrência */}
      {showRecorrenciaModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Nova Recorrência</h3>
              <button
                onClick={() => setShowRecorrenciaModal(false)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Cliente*</label>
                <select
                  value={novaRecorrencia.cliente}
                  onChange={(e) => setNovaRecorrencia({...novaRecorrencia, cliente: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="">Selecione o cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Descrição do Serviço*</label>
                <input
                  type="text"
                  value={novaRecorrencia.descricao}
                  onChange={(e) => setNovaRecorrencia({...novaRecorrencia, descricao: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  placeholder="Ex: Site + Hospedagem"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Valor Mensal (R$)*</label>
                  <input
                    type="number"
                    value={novaRecorrencia.valor}
                    onChange={(e) => setNovaRecorrencia({...novaRecorrencia, valor: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Dia do Vencimento*</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={novaRecorrencia.diaVencimento}
                    onChange={(e) => setNovaRecorrencia({...novaRecorrencia, diaVencimento: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Data de Início</label>
                  <input
                    type="date"
                    value={novaRecorrencia.dataInicio}
                    onChange={(e) => setNovaRecorrencia({...novaRecorrencia, dataInicio: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Status</label>
                  <select
                    value={novaRecorrencia.status}
                    onChange={(e) => setNovaRecorrencia({...novaRecorrencia, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Observações</label>
                <textarea
                  value={novaRecorrencia.observacoes}
                  onChange={(e) => setNovaRecorrencia({...novaRecorrencia, observacoes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  rows="3"
                  placeholder="Informações adicionais sobre o contrato..."
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleAddRecorrencia}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Salvar Recorrência
              </button>
              <button
                onClick={() => setShowRecorrenciaModal(false)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Recorrência */}
      {editingRecorrencia && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Editar Recorrência</h3>
              <button
                onClick={() => setEditingRecorrencia(null)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Cliente*</label>
                <select
                  value={editingRecorrencia.cliente}
                  onChange={(e) => setEditingRecorrencia({...editingRecorrencia, cliente: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="">Selecione o cliente</option>
                  {clientes.map(c => (
                    <option key={c.id} value={c.nome}>{c.nome}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Descrição do Serviço*</label>
                <input
                  type="text"
                  value={editingRecorrencia.descricao}
                  onChange={(e) => setEditingRecorrencia({...editingRecorrencia, descricao: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Valor Mensal (R$)*</label>
                  <input
                    type="number"
                    value={editingRecorrencia.valor}
                    onChange={(e) => setEditingRecorrencia({...editingRecorrencia, valor: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Dia do Vencimento*</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={editingRecorrencia.diaVencimento}
                    onChange={(e) => setEditingRecorrencia({...editingRecorrencia, diaVencimento: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Data de Início</label>
                  <input
                    type="date"
                    value={editingRecorrencia.dataInicio}
                    onChange={(e) => setEditingRecorrencia({...editingRecorrencia, dataInicio: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Status</label>
                  <select
                    value={editingRecorrencia.status}
                    onChange={(e) => setEditingRecorrencia({...editingRecorrencia, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="ativo">Ativo</option>
                    <option value="inativo">Inativo</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Observações</label>
                <textarea
                  value={editingRecorrencia.observacoes}
                  onChange={(e) => setEditingRecorrencia({...editingRecorrencia, observacoes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  rows="3"
                />
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleUpdateRecorrencia}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => setEditingRecorrencia(null)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Editar Card */}
      {showEditCard && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-3xl border border-slate-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Editar Projeto</h3>
              <button
                onClick={() => setShowEditCard(null)}
                className="text-slate-400 hover:text-white transition-all"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-white font-medium mb-2 block">Título*</label>
                <input
                  type="text"
                  value={showEditCard.titulo}
                  onChange={(e) => setShowEditCard({...showEditCard, titulo: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                />
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Descrição</label>
                <textarea
                  value={showEditCard.descricao}
                  onChange={(e) => setShowEditCard({...showEditCard, descricao: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all resize-none"
                  rows="4"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Cliente</label>
                  <select
                    value={showEditCard.cliente}
                    onChange={(e) => setShowEditCard({...showEditCard, cliente: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                  >
                    <option value="">Selecione o cliente</option>
                    {clientes.map(c => (
                      <option key={c.id} value={c.nome}>{c.nome}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Responsável</label>
                  <input
                    type="text"
                    value={showEditCard.responsavel}
                    onChange={(e) => setShowEditCard({...showEditCard, responsavel: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white font-medium mb-2 block">Prazo</label>
                  <input
                    type="date"
                    value={showEditCard.prazo}
                    onChange={(e) => setShowEditCard({...showEditCard, prazo: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label className="text-white font-medium mb-2 block">Valor (R$)</label>
                  <input
                    type="number"
                    value={showEditCard.valor}
                    onChange={(e) => setShowEditCard({...showEditCard, valor: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-white font-medium mb-2 block">Prioridade</label>
                <select
                  value={showEditCard.prioridade}
                  onChange={(e) => setShowEditCard({...showEditCard, prioridade: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-700 border-2 border-slate-600 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-all"
                >
                  <option value="Alta">Alta</option>
                  <option value="Média">Média</option>
                  <option value="Baixa">Baixa</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleEditCard}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Salvar Alterações
              </button>
              <button
                onClick={() => setShowEditCard(null)}
                className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;