# 1. Utilizar PostgreSQL para persistência de dados

Data: 29/07/2026
Status: Aceito

## Contexto

O projeto exigia um banco de dados para armazenar informações sobre usuários, planos, assinaturas, pagamentos, e-mails, etc.

## Decisão

Decidi utilizar o PostgreSQL como banco de dados.

## Alternativas consideradas

- **MongoDB** — descartado porque o domínio (usuários, planos, assinaturas,
  pagamentos) é fortemente relacional; o NoSQL adicionaria complexidade
  desnecessária ao modelar esses relacionamentos
- **SQLite** — bom para prototipagem rápida, mas inadequado para ambientes
  de produção com múltiplas conexões simultâneas

## Justificativa

- Os relacionamentos entre usuário, plano, assinatura e pagamento se beneficiam
  de chaves estrangeiras e restrições (evita estados inconsistentes)
- Transações ACID são importantes: a confirmação de pagamento e as atualizações
  de status da assinatura precisam ser atômicas
- Ecossistema maduro no ambiente Node/TS (Prisma, TypeORM, Drizzle)
- Fácil de conteinerizar com Docker; executa em qualquer ambiente

## Consequências

- Necessidade de gerenciar migrações à medida que o esquema evolui
- Necessidade de executar o Postgres localmente (Docker) ou utilizar um serviço
  gerenciado (ex.: Supabase, Neon, RDS) — decisão de hospedagem adiada para outro ADR
- Caso o projeto apresente alto volume de leitura, poderá ser necessário
  avaliar réplicas de leitura ou cache (Redis) futuramente