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

### Deploy Automático (Dokploy)

O projeto está configurado para deploy automático via Docker:

1. **Build de produção:**
```bash
npm run build
```

2. **Commit e push (aciona deploy automático):**
```bash
git add .
git commit -m "Deploy: atualização"
git push origin main
```

O Dokploy detecta o `Dockerfile` e faz o build automaticamente usando Nginx para servir os arquivos estáticos.

### Configuração no Dokploy

**Build Type:** Dockerfile

**Campos de configuração:**
- **Docker File:** `Dockerfile`
- **Docker Context Path:** `.`
- **Docker Build Stage:** (deixar vazio)

**Importante:** O Build Type deve ser **"Dockerfile"** (não "Static") para garantir que os MIME types sejam servidos corretamente.

### Arquivos de Deploy

- `Dockerfile` - Container Nginx Alpine
- `nginx.conf` - Configuração do servidor web com MIME types corretos
- `dist/` - Arquivos buildados (incluídos no repositório)

### URL de Produção

- **Frontend**: https://clonepages.fabricadelowticket.com.br

### ⚠️ Importante: Rate Limiting no Deploy

**Problema conhecido:** O Dokploy pode ignorar deploys quando há múltiplos pushes muito próximos (em poucos minutos).

**Solução:**
- Aguardar **2-3 minutos entre pushes** quando houver múltiplos commits
- Agrupar mudanças relacionadas em um único commit quando possível
- Se o deploy não for acionado, aguardar alguns minutos e fazer um novo push de teste

**Sintomas:**
- ✅ Push realizado com sucesso
- ✅ Commit aparece no GitHub
- ❌ Mas o deploy não é acionado no Dokploy

Se isso acontecer, aguarde alguns minutos e faça um novo push.

### ✅ Problema de MIME Type Resolvido

**Problema anterior:** Arquivos JavaScript sendo servidos com MIME type `application/octet-stream` causando erro:
```
Failed to load module script: Expected a JavaScript-or-Wasm module script but the server responded with a MIME type of "application/octet-stream"
```

**Solução implementada:**
- Build Type configurado como **"Dockerfile"** no Dokploy
- `Dockerfile` usa Nginx Alpine com `nginx.conf` customizado
- `nginx.conf` configura MIME types corretos: `application/javascript; charset=utf-8` para arquivos `.js` e `.mjs`
- **Status:** ✅ Resolvido e funcionando

**Nota:** Não usar Build Type "Static" pois não permite configuração de MIME types no servidor interno.

## 📞 Backend

Este frontend se conecta ao backend em: `https://bclone.fabricadelowticket.com.br`

Para desenvolvimento local, configure `VITE_API_BASE_URL=http://localhost:3333`
