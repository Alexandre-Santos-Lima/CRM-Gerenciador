# APsolutions CRM - Sistema Kanban Completo

Sistema completo de gerenciamento de projetos com Kanban, gestão de clientes e projeção financeira.

## 🚀 Funcionalidades

### 📊 Kanban Board
- Visualização em colunas: Backlog, A Fazer, Em Andamento, Em Revisão, Concluído
- Drag & Drop de cards entre colunas
- Criação, edição e exclusão de projetos
- Filtros e busca avançada
- Priorização de tarefas (Alta, Média, Baixa)

### 💼 Gerenciamento de Clientes
- CRUD completo de clientes
- Informações detalhadas: nome, email, telefone, endereço, contato, observações
- Interface moderna e intuitiva
- Cards visuais com todas as informações

### 💰 Projeção Financeira
- Dashboard financeiro completo
- Visualização de receita total, em andamento e concluída
- Gráficos por status do projeto
- Top 10 projetos por valor
- Estatísticas em tempo real

### ✨ Recursos Adicionais
- Interface dark mode moderna
- Animações suaves
- Design responsivo
- Dados persistentes (localStorage para clientes)
- Estatísticas em tempo real no header

## 🛠️ Tecnologias

### Frontend
- React 18
- Vite
- Tailwind CSS
- Lucide React (ícones)

### Backend
- Node.js
- Express
- Armazenamento em JSON

## 📦 Instalação

### Backend
```bash
cd backend
npm install
npm start
```

O servidor rodará na porta 5000.

### Frontend
```bash
cd frontend
npm install
npm run dev
```

O frontend rodará na porta 3000.

## 🎨 Design

O sistema utiliza um tema dark moderno com:
- Gradientes purple/pink para elementos principais
- Cards com efeito glass e hover
- Bordas arredondadas
- Sombras suaves
- Transições animadas

## 📝 Estrutura de Dados

### Projeto (Card)
```javascript
{
  id: number,
  titulo: string,
  descricao: string,
  cliente: string,
  prazo: date,
  responsavel: string,
  prioridade: 'Alta' | 'Média' | 'Baixa',
  etiquetas: string[],
  valor: number,
  comentarios: number,
  anexos: number,
  ordem: number
}
```

### Cliente
```javascript
{
  id: number,
  nome: string,
  email: string,
  telefone: string,
  endereco: string,
  contato: string,
  observacoes: string,
  criadoEm: date
}
```

## 🎯 Como Usar

1. **Visualizar Kanban**: Acesse a aba "Kanban" para ver todos os projetos
2. **Adicionar Projeto**: Clique no botão "+" em qualquer coluna
3. **Editar Projeto**: Clique no ícone de lápis em um card
4. **Mover Projeto**: Arraste e solte entre as colunas
5. **Gerenciar Clientes**: Acesse a aba "Clientes"
6. **Ver Financeiro**: Acesse a aba "Financeiro" para visualizar projeções

## 📊 Dashboard Financeiro

O dashboard mostra:
- Receita total de todos os projetos
- Receita em andamento (projetos não concluídos)
- Receita concluída
- Distribuição por status
- Top 10 projetos mais valiosos

## 🔄 Atualizações

### Versão 2.0
- ✅ Design moderno dark theme
- ✅ Gerenciamento de clientes
- ✅ Valores financeiros nos projetos
- ✅ Dashboard de projeção financeira
- ✅ Edição de projetos com modal
- ✅ Melhorias visuais gerais
- ✅ Estatísticas em tempo real

## 📸 Screenshots

O sistema apresenta:
- Header com estatísticas em tempo real
- Três abas principais: Kanban, Clientes, Financeiro
- Interface moderna e profissional
- Cores vibrantes e contrastantes

## 🚧 Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Notificações em tempo real
- [ ] Exportação de relatórios (PDF/Excel)
- [ ] Gráficos interativos
- [ ] Histórico de alterações
- [ ] Comentários e anexos funcionais
- [ ] Integração com calendário
- [ ] App mobile

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido por

APsolutions - Gestão Inteligente de Projetos