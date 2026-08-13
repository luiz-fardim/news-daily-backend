# news-daily API

<p align="center">

![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

Plataforma de assinaturas que envia as principais notícias por e-mail, construída com NestJS, TypeScript, Prisma e PostgreSQL.

## Objetivo

Muita gente não tem tempo de acompanhar notícias diariamente. O news-daily resolve isso: o usuário assina um plano e recebe por e-mail um resumo das principais notícias, sem precisar procurar.

Cada plano tem uma frequência de envio diferente (semanal, três vezes por semana ou diário), que é o principal diferencial em relação a uma newsletter genérica.

---

## Stack

NestJS, TypeScript, PostgreSQL, Prisma, JWT, Docker

---

## Como executar

### Pré-requisitos

- Node.js 18+
- pnpm
- Docker

### Clone o projeto

```bash
git clone https://github.com/seu-usuario/newsclub-api.git
cd newsclub-api
```

### Configure as variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/newsclub"
JWT_SECRET="sua_chave_secreta"
JWT_REFRESH_SECRET="sua_chave_secreta_de_refresh"
PORT=3000
POSTGRES_USER="seu_usuario"
POSTGRES_PASSWORD="sua_senha"
```

### Instale as dependências

```bash
pnpm install
```

### Suba os containers

```bash
docker compose up -d
```

### Rode as migrations e gere o cliente Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### Suba o servidor

```bash
pnpm run start:dev
```

## Autor

Desenvolvido por **Luiz**, como projeto de estudo avançado envolvendo modelagem de dados, pagamentos recorrentes, filas e observabilidade — um passo além dos projetos anteriores.

Sugestões, ideias ou vontade de contribuir? Fique à vontade para abrir uma **Issue** ou enviar um **Pull Request**. 🚀
