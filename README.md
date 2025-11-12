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

## Pré-requisitos

- Node.js >= 20  
- npm ou yarn  
- Docker e Docker Compose (opcional)  
- PostgreSQL (pode ser via Docker)  

---

## Instalação e execução

### 1️⃣ Configuração do `.env`

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="seu_secret_aqui"
PORT=3000


2️⃣ Executando em modo desenvolvimento (local)

# Instalar dependências

npm install

# Gerar cliente Prisma
npx prisma generate

# Criar/migrar banco de dados
npx prisma migrate dev

# Rodar aplicação em modo dev
npm run dev

A aplicação estará disponível em:

http://localhost:3000

E a documentação Swagger em:

http://localhost:3000/docs


3️⃣ Executando via Docker (produção ou testes)

# Subir containers
docker-compose up -d --build
docker-compose run --rm api npx prisma generate
docker-compose run --rm api npx prisma migrate dev --name init

# Verificar logs da API
docker-compose logs -f api

🔗 Link do projeto
https://github.com/FranciscoDiakomas-01/blog-api