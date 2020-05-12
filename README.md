## Recuperação de senha

**Requisitos funcionais**

- O usuário deve poder recuperar sua senha informando o seu e-mail;
- O usuário deve receber um e-mail com instruções de recuperação de senha;
- O usuário deve poder redefinir sua senha;

**Regras de negócio**

- O link enviado por e-mail para redefinir a senha, deve expirar em 2 horas;
- O usuário precisa confirmar a nova senha ao fazer a redefinição;

**Requisitos não funcionais**

- Utilizar Mailtrap para testar envios em ambient de desenvolvimento;
- Utilizar Amazon SES para envios em produção;
- O envio de e-mails deve acontecer em segundo plano (background job);

## Atualização do perfil

**Requisitos funcionais**

- O usuário dever poder atualizar seu nome, email e senha;

**Regras de negócio**

- O usuário não deve poder alterar seu e-mail para um e-mail já utilizado por outro usuário;
- Para atualizar sua senha, o usuário deve informar a senha antiga.
- Para atualizar sua senha, o usuário deve confirmar a nova senha.

## Agendamento de serviços

**Requisitos funcionais**

- O usuário deve poder listar todos os prestadores de serviço cadastrados;
- O usuário deve poder visualizar os dias de um mês com pelo menos um horário disponível de um prestador específico;
- O usuário deve poder listar os horários disponíveis em um dia específico de um determinado prestador.
- O usuário deve poder realizar um novo agendamente com um determinado prestador.

**Regras de negócio**

- Cada agendamento deve durar exatamente 1 hora;
- Os agendamentos devem estar disponíveis entre 8h até às 18h (Primeiro às 8h, último as 17h);
- O usuário não pode agendar em um horário já ocupado;
- O usuário não pode agendar em um horário passado;
- O usuário não pode agendar serviços consigo mesmo;

**Requisitos não funcionais**

- A listagem de prestadores deve ser armazenada em cache;

## Painel do prestador

**Requisitos funcionais**

- O usuário deve poder listar todos os seus agendamentos de um dia específico;
- O prestador deve receber uma notificação sempre que houver um novo agendamento;
- O prestador deve poder visualizar as notificações não lidas;

**Regras de negócio**

- A notificação deve ter um status de lida ou não lida para que o prestador possa controlar;

**Requisitos não funcionais**

- Os agendamentos do prestador no dia devem ser armazenados em cache;
- As notificações do prestador devem ser armazenadas no MongoDB;
- As notificações do prestador devem ser enviadas em tempo real utilizando Socket.io;
