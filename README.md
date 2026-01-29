# Daily Pattern Frontend

Aplicação web desenvolvida em React com TypeScript para uma plataforma de aprendizado de Design Patterns através de desafios diários gerados por IA.

## Sobre o Projeto

Interface de usuário da plataforma Daily Pattern que oferece uma experiência gamificada com desafios diários, sistema de streak, estatísticas detalhadas e editor de código integrado para submissão de soluções.

### Funcionalidades Principais

- Autenticação e autorização com JWT
- Dashboard com estatísticas e gráficos de progresso
- Sistema de desafios diários personalizados
- Editor de código integrado com suporte a múltiplas linguagens
- Sistema de streak e gamificação
- Histórico de submissões

## Tecnologias Utilizadas

- **React 19.1.1** + **TypeScript 5.9.3**
- **Vite 7.1.7** (build tool)
- **React Router DOM 7.9.3**
- **Recharts 3.3.0** (gráficos)
- **CodeMirror** (editor de código com suporte a Python, JavaScript, Java, C++, Rust e PHP)

## Pré-requisitos

- **Node.js 18+**
- **Backend da aplicação** rodando (veja [daily-pattern-backend](../daily-pattern-backend))

## Configuração

### 1. Instalação

```bash
npm install
```

### 2. Variáveis de Ambiente

Crie um arquivo `.env.development`:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

## Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

Aplicação disponível em: http://localhost:5173

### Build para Produção

```bash
npm run build
npm run preview
```

### Executar em Produção

```bash
npm start
```

## Estrutura do Projeto

```
src/
├── components/              # Componentes reutilizáveis
│   ├── DashboardLayout.tsx
│   ├── ErrorBoundary.tsx
│   ├── ProtectedRoute.tsx
│   └── SubmissionModal.tsx
├── contexts/               # Gerenciamento de estado (Auth)
├── pages/                  # Páginas da aplicação
│   ├── Home.tsx           # Dashboard
│   ├── DailyChallenge.tsx
│   ├── Challenges.tsx
│   ├── Practice.tsx
│   ├── Login.tsx
│   └── SignUp.tsx
├── services/              # Integração com API
│   └── api.ts
└── App.tsx
```

## Rotas

### Públicas
- `/login` - Login
- `/signup` - Cadastro

### Protegidas
- `/` - Dashboard
- `/daily-challenge` - Desafio diário
- `/challenges` - Histórico de desafios
- `/practice` - Modo prática

## Scripts Disponíveis

```bash
npm run dev       # Desenvolvimento
npm run build     # Build de produção
npm run preview   # Preview da build
npm start         # Produção (Railway)
npm run lint      # ESLint
```

## Deploy (Railway)

Configuração em `vite.config.ts`:
- Porta: `process.env.PORT` ou 4173
- Host: `0.0.0.0`

### Variáveis de Ambiente
- `VITE_API_BASE_URL` - URL da API backend
- `PORT` - Porta do servidor (fornecida automaticamente)

## Desenvolvimento

### Padrões de Código
- Utilize TypeScript para novos componentes
- Siga as regras do ESLint
- Mantenha componentes pequenos e focados
- Utilize hooks customizados quando apropriado

### Adicionando Novas Páginas
1. Criar componente em `src/pages/`
2. Adicionar rota em `src/App.tsx`
3. Adicionar item na sidebar em `DashboardLayout.tsx`

## Segurança

- JWT Authentication (localStorage)
- Protected Routes
- React XSS Protection

---

Desenvolvido com React, TypeScript e Vite
