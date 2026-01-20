# Clone Pages - Frontend

Aplicação React + Vite para clonagem e edição visual de páginas web.

## 🚀 Tecnologias

- **React 19** com TypeScript
- **Vite** para build rápido
- **React Router v7** para navegação
- **Axios** para chamadas HTTP
- **Context API** para estado global
- **Jest + Testing Library** para testes

## 📦 Instalação

```bash
npm install
```

## 🛠 Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 🔧 Configuração

Copie `.env.example` para `.env` e configure:

```bash
VITE_API_BASE_URL=https://bclone.fabricadelowticket.com.br
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor de desenvolvimento |
| `npm run build` | Build para produção |
| `npm run preview` | Preview do build |
| `npm test` | Executa testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:coverage` | Relatório de cobertura |
| `npm run lint` | Verifica código |
| `npm run lint:fix` | Corrige problemas |

## 🏗 Estrutura

```
frontend/
├── src/
│   ├── components/     # Componentes React
│   ├── pages/          # Páginas da aplicação
│   ├── services/       # Chamadas à API
│   ├── hooks/          # Custom Hooks
│   ├── contexts/       # Context API
│   ├── utils/          # Funções utilitárias
│   └── types/          # Tipos TypeScript
├── public/             # Arquivos estáticos
└── dist/               # Build de produção
```

## 🚢 Deploy

O build de produção gera os arquivos na pasta `dist/`. Faça upload dessa pasta para seu servidor web.

## 📞 Backend

Este frontend se conecta ao backend em: `https://bclone.fabricadelowticket.com.br`

Para desenvolvimento local, configure `VITE_API_BASE_URL=http://localhost:3333`
