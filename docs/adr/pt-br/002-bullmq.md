# ADR-001: Utilizar BullMQ para gerenciamento de filas

Data: 18/08/2026
Status: Aceito

## Contexto

O projeto precisa enviar e-mails de forma assíncrona (ex: confirmação de cadastro, 
envio de conteúdo por e-mail diário), sem bloquear a requisição principal do usuário
enquanto o e-mail é processado.

Para isso, é necessário um gerenciador de filas que suporte:
- Retry automático em caso de falha no envio
- Controle de concorrência (não estourar limite do provedor de e-mail)
- Persistência dos jobs (não perder e-mails se o processo cair)

## Decisão

Decidimos utilizar **BullMQ** como gerenciador de filas para o envio de e-mails.

## Alternativas consideradas

- **AWS SQS** — descartado por exigir gerenciamento de credenciais e infraestrutura AWS
  adicional, além de menos flexibilidade nativa para agendamento e priorização de jobs
  comparado ao BullMQ.
- **RabbitMQ** — descartado por trazer robustez e recursos (exchanges, routing avançado)
  que não são necessários para o volume atual do projeto, adicionando complexidade
  operacional desnecessária (novo serviço para subir, monitorar e manter).

## Justificativa

- Possui suporte nativo a retries configuráveis, rate limiting e agendamento de jobs,
  cobrindo os requisitos levantados no contexto sem código extra.
- Boa integração com TypeScript/NestJS e documentação madura.
- A equipe já tem familiaridade com Redis, o que reduz a curva de aprendizado e o
  risco de erros de configuração.

## Consequências

**Positivas**
- Boa experiência de desenvolvimento, com API simples e tipada.
- Suporte nativo a retries e rate limiting, reduzindo código customizado.

**Negativas**
- Precisa de configuração manual para Dead Letter Queue (DLQ), diferente de
  soluções como SQS, que já oferecem isso de forma gerenciada.
- Garantias de durabilidade dependem da configuração de persistência do Redis
  (AOF/RDB), que precisa ser configurada corretamente — não é automático como
  em um serviço gerenciado.