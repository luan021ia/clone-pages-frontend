# Clone Pages - Backend

API NestJS para clonagem e edição de páginas web, com integração Kiwify para pagamentos.

## 🚀 Tecnologias

- **NestJS** com TypeScript
- **TypeORM** para ORM
- **SQLite** (dev) / **PostgreSQL** (prod)
- **JWT** para autenticação
- **Puppeteer** para web scraping
- **Jest** para testes

## 📦 Instalação

```bash
npm install
```

## 🛠 Desenvolvimento

```bash
npm run dev
```

A API estará disponível em `http://localhost:3333`

## 🔧 Configuração

Copie `.env.example` para `.env` e configure:

```bash
PORT=3333
JWT_SECRET=your-secret-key
SQLITE_DB=saas-dev.sqlite

# Kiwify Webhook
KIWIFY_TOKEN=seu-token
KIWIFY_PRODUCT_ID=seu-product-id
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor com hot reload |
| `npm run build` | Compila TypeScript |
| `npm run start` | Executa versão compilada |
| `npm run start:prod` | Executa em produção |
| `npm test` | Executa testes |
| `npm run test:watch` | Testes em modo watch |
| `npm run test:cov` | Relatório de cobertura |
| `npm run lint` | Verifica código |

## 🏗 Estrutura

```
backend/
├── src/
│   ├── modules/        # Módulos da aplicação
│   │   ├── users/      # Gerenciamento de usuários
│   │   ├── licenses/   # Sistema de licenças
│   │   ├── clone/      # Clonagem de páginas
│   │   └── webhooks/   # Webhooks (Kiwify)
│   ├── database/      # Entidades e seeds
│   └── common/         # Utilitários compartilhados
└── dist/               # Build compilado
```

## 🔗 Endpoints Principais

- `POST /users/login` - Autenticação
- `POST /users` - Registro
- `GET /users/me` - Usuário atual
- `POST /api/clone` - Clonar página
- `POST /webhooks/kiwify` - Webhook Kiwify

## 🚢 Deploy

1. Faça build: `npm run build`
2. Configure `.env` no servidor
3. Instale dependências: `npm install --production`
4. Execute: `npm run start:prod`

## 📞 Frontend

Este backend serve o frontend em: `https://clonepages.fabricadelowticket.com.br`

Configure CORS no `.env` para permitir requisições do frontend.
