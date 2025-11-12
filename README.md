# Mini Blog API

Mini Blog é uma API RESTful desenvolvida em **NestJS**, utilizando **Prisma ORM** para persistência de dados e **Docker** para containerização. A aplicação permite gerenciar **usuários**, **posts** e **likes**, demonstrando boas práticas de arquitetura, autenticação JWT, relacionamentos entre entidades e validação de dados.

---

## Tecnologias

- **TypeScript**
- **NestJS** - Framework backend
- **Prisma** - ORM e modelagem do banco
- **PostgreSQL** - Banco de dados relacional
- **Docker & Docker Compose** - Containerização
- **Swagger + Scalar** - Documentação automática
- **class-validator / class-transformer** - Validação de dados

---

## Features

### Usuários
- Criar conta
- Atualizar perfil
- Deletar conta
- Login com JWT
- Refresh tokens
- Listagem com paginação
- Endpoints seguros usando `CurrentUser` decorator

### Posts
- Criar, atualizar e deletar posts
- Listar posts com paginação
- Visualizar detalhes do post com likes
- Dar like/unlike em posts (uma pessoa só pode dar like uma vez)
- Somente o dono do post pode atualizar ou deletar

### Likes
- Relacionamento entre usuários e posts
- Controle de unicidade de likes
- Verificação de dono do like para remoção

---

## Instalação e execução

### Pré-requisitos
- Node.js >= 20
- npm ou yarn
- Docker e Docker Compose (opcional para containerização)
- PostgreSQL (pode ser via Docker)

---

### Executando em modo desenvolvimento

1. Instalar dependências:
```bash
.ENV
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="seu_secret_aqui"
PORT=3000

SCRIPTS DE EXECUÇÂO EM DESENVOLVIMENTO

npx prisma migrate dev
npm run dev
npm ci

EM PRODUÇÃO
docker-compose up -d --build
docker-compose logs -f api


