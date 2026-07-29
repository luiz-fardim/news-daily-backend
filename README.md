# 📰 NewsClub API

<p align="center">

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Status](https://img.shields.io/badge/Status-Em%20Desenvolvimento-yellow?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

<p align="center">
  <strong>Plataforma de assinaturas que envia as principais notícias diretamente por e-mail</strong>, construída com Node.js, TypeScript, Prisma e PostgreSQL.
</p>

<p align="center">
  <i>🚧 Projeto em fase inicial de desenvolvimento — este README também serve como documentação viva do planejamento.</i>
</p>

---

## 💡 Sobre o projeto

Muita gente não tem tempo de acompanhar as notícias diariamente. O **NewsClub** resolve isso: o usuário assina um plano e passa a receber, por e-mail, um resumo das principais notícias reunidas de fontes confiáveis — sem precisar sair procurando.

O produto foi pensado para pessoas com rotina corrida que querem se manter informadas de forma automática. A ideia central: cada plano tem uma frequência diferente de envio (ex.: resumo semanal, três vezes por semana, ou diário), o que é o principal diferencial em relação a uma newsletter genérica.

**Status atual:** o projeto está no início. Até agora já foram feitos:
- ✅ Modelagem do banco de dados (`schema.prisma`)
- ✅ Conexão com o banco de dados
- ✅ Rota de registro de usuário (`POST /auth/register`)

Todo o restante (login, assinaturas, pagamento, envio de e-mail, filas, etc.) está planejado e detalhado no roadmap abaixo.

---

## 🚀 Tecnologias

### Já em uso
- 🟢 Node.js + TypeScript
- 🐘 PostgreSQL
- 🔗 Prisma ORM

### Planejadas
- 🔑 JWT + OAuth2 — autenticação
- 🔒 Argon2 — criptografia de senha
- 🐳 Docker
- 🧠 Redis (ou node-cache) — cache
- 📬 BullMQ — filas para envio assíncrono de e-mail
- 💳 Stripe — pagamentos e assinaturas
- 📊 Logs estruturados + observabilidade

---

## ✨ Funcionalidades

### ✅ Feito até agora
- Cadastro de usuário (`POST /auth/register`)

### 🔜 Planejado

**Usuário**
- [ ] Login (JWT)
- [ ] Escolher plano de assinatura
- [ ] Efetuar pagamento
- [ ] Visualizar assinatura
- [ ] Cancelar assinatura
- [ ] Solicitar reembolso (até 15 dias)

**Administrador**
- [ ] Criar, editar e desativar planos
- [ ] Visualizar assinantes ativos

**Sistema**
- [ ] Envio diário de newsletter aos assinantes ativos
- [ ] Idempotência no envio de e-mail
- [ ] Frequência de envio por plano (brief semanal, insider seg/qua/sex, elite diário)

---

## 📊 Regras de Negócio

- Um usuário só pode ter **uma assinatura ativa por vez**
- Pagamento em dia = recebe notícia
- Reembolso solicitado em até 15 dias **cancela a assinatura imediatamente**
- Plano nunca é excluído, apenas desativado (`is_active: false`)
- Envio de e-mail deve ser **idempotente** (evitar duplicidade)
- Cada plano tem uma frequência própria de envio

---

## 🗂️ Modelagem de Dados

### Entidades

| Entidade         | Principais campos                                                                 |
| ------------------ | ------------------------------------------------------------------------------------ |
| **User**          | `id`, `first_name`, `last_name`, `birth`, `email (unique)`, `password (argon2)`, `role`, `stripe_customer_id` |
| **Plan**          | `id`, `name (brief/insider/elite)`, `price`, `billing_interval`, `is_active`         |
| **Subscription**  | `id`, `user_id`, `plan_id`, `started_at`, `expires_at`, `price_at_signing`, `status`, `stripe_subscription_id`, `canceled_at` |
| **Payment**       | `id`, `user_id`, `plan_id`, `subscription_id`, `method`, `value`, `status`, `currency`, `stripe_payment_intent_id` |
| **EmailLog**      | `id`, `user_id`, `subscription_id`, `status`, `provider_message_id`, `sent_at`       |

### Relacionamentos

- `User` → `Subscription` — **1:N** (um usuário pode assinar planos diferentes ao longo do tempo)
- `Plan` → `Subscription` — **1:N** (resolve o N:N entre `User` e `Plan`)
- `User` → `Payment` — **1:N**
- `Subscription` → `Payment` — **1:N**
- `User` → `EmailLog` — **1:N**
- `Subscription` → `EmailLog` — **1:N**

---

## 📂 Estrutura do Projeto

```text
├── .agents
├── .claude
├── .windsurf
├── dist
├── node_modules
├── prisma
├── src
│   ├── config
│   ├── database
│   ├── generated
│   ├── modules
│   ├── utils
│   ├── app.module.ts
│   ├── main.ts
│   └── prisma.service.ts
├── test
├── .env
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── eslint.config.mjs
├── nest-cli.json
├── package.json
├── pnpm-lock.yaml
├── prisma.config.ts
├── README.md
├── skills-lock.json
├── tsconfig.build.json
└── tsconfig.json
```
---

## ⚙️ Como executar

### Pré-requisitos

- Node.js 18+
- PostgreSQL
- Docker (opcional, recomendado)

### Clone o projeto

```bash
git clone https://github.com/seu-usuario/newsclub-api.git
cd newsclub-api
```

### Instale as dependências

```bash
npm install
```

### Configure as variáveis de ambiente

Crie um arquivo `.env`:

```env
DATABASE_URL="postgresql://usuario:senha@localhost:5432/newsclub"
JWT_SECRET="sua_chave_secreta"
JWT_REFRESH_SECRET="sua_chave_secreta_de_refresh"
PORT=3000
```

### Rode as migrations e gere o cliente Prisma

```bash
npx prisma migrate dev
npx prisma generate
```

### Suba o servidor

```bash
npm run dev
```

---

## 📡 Endpoints planejados

> Legenda: ✅ implementado · 🔜 planejado

### Auth

| Status | Método | Rota             | Descrição                          |
| :----: | ------ | ----------------- | ------------------------------------- |
| ✅     | POST   | `/auth/register`  | Cadastro (nome, email, senha)         |
| 🔜     | POST   | `/auth/login`      | Login, retorna JWT                    |
| 🔜     | POST   | `/auth/refresh`    | Renova o access token                 |

### Users

| Status | Método | Rota          | Descrição                    | Auth               |
| :----: | ------ | -------------- | ------------------------------- | -------------------- |
| 🔜     | GET    | `/users/`      | Lista todos                     | JWT + Role (admin)  |
| 🔜     | GET    | `/users/:id`   | Busca um usuário                | JWT (dono ou admin) |
| 🔜     | PATCH  | `/users/:id`   | Atualiza usuário                | JWT (dono ou admin) |
| 🔜     | DELETE | `/users/:id`   | Remove usuário                  | JWT (dono ou admin) |

### Plans

| Status | Método | Rota          | Descrição                | Auth        |
| :----: | ------ | -------------- | --------------------------- | ------------- |
| 🔜     | GET    | `/plans`       | Lista planos disponíveis    | Público      |
| 🔜     | GET    | `/plans/:id`   | Detalhe de um plano         | Público      |
| 🔜     | POST   | `/plans`       | Cria plano                  | JWT + admin  |
| 🔜     | PATCH  | `/plans/:id`   | Edita plano                 | JWT + admin  |
| 🔜     | DELETE | `/plans/:id`   | Remove (desativa) plano     | JWT + admin  |

### Subscription

| Status | Método | Rota                | Descrição                    |
| :----: | ------ | --------------------- | -------------------------------- |
| 🔜     | POST   | `/subscription`       | Cria assinatura                  |
| 🔜     | GET    | `/subscription`       | Lista todas (admin)              |
| 🔜     | GET    | `/subscription/:id`   | Verifica status da assinatura    |
| 🔜     | PATCH  | `/subscription/:id`   | Muda de plano                    |
| 🔜     | DELETE | `/subscription/:id`   | Cancela assinatura               |

### Payment

| Status | Método | Rota                 | Descrição                                          |
| :----: | ------ | ---------------------- | ------------------------------------------------------ |
| 🔜     | POST   | `/payment`             | Simula pagamento (fake, fase inicial)                  |
| 🔜     | POST   | `/payment/checkout`    | Cria Stripe Checkout Session                            |
| 🔜     | POST   | `/payment/webhook`     | Recebe eventos do Stripe (auth via assinatura Stripe)   |
| 🔜     | GET    | `/payment/:id`         | Consulta status de um pagamento                         |
| 🔜     | GET    | `/payment`             | Lista pagamentos do usuário (ou todos, se admin)        |

### Admin

| Status | Método | Rota                  | Descrição                     |
| :----: | ------ | ----------------------- | --------------------------------- |
| 🔜     | GET    | `/admin/signatures`     | Lista assinantes ativos           |

---

## 🔮 Roadmap

### Etapa 1 — Modelagem
- [x] Relacionamentos e schema (`schema.prisma`)
- [x] Conexão com banco de dados
- [ ] Estados e transições da assinatura documentados

### Etapa 2 — API base (sem Stripe, sem e-mail, tudo fake)
- [x] Registro de usuário
- [ ] Login e refresh token
- [ ] CRUD de planos
- [ ] CRUD de assinaturas
- [ ] Pagamento fake

### Etapa 3 — Stripe
- [ ] Checkout Session
- [ ] Webhooks
- [ ] Assinaturas recorrentes

### Etapa 4 — Envio de e-mail
- [ ] Integração com provedor de e-mail (AWS)
- [ ] Templates HTML

### Etapa 5 — Redis
- [ ] Cache básico
- [ ] Pub/sub

### Etapa 6 — BullMQ
- [ ] Jobs e workers
- [ ] Retries e delayed jobs
- [ ] Controle de concorrência

### Etapa 7 — Observabilidade
- [ ] Logs estruturados
- [ ] Métricas
- [ ] Health checks

---

## 📝 Licença

Este projeto está sob a licença **MIT**.

---

## 👨‍💻 Autor

Desenvolvido por **Luiz**, como projeto de estudo avançado envolvendo modelagem de dados, pagamentos recorrentes, filas e observabilidade — um passo além dos projetos anteriores.

Sugestões, ideias ou vontade de contribuir? Fique à vontade para abrir uma **Issue** ou enviar um **Pull Request**. 🚀
