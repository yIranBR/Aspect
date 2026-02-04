Desafio Técnico: Aspect
Objetivo
Desenvolver uma aplicação web para gerenciamento de agendamentos de exames
hospitalares, permitindo que os usuários visualizem exames disponíveis, adicionem
agendamentos e excluam agendamentos existentes.
Requisitos Funcionais
1. Gerenciamento de Exames
○ Visualizar Exames Disponíveis:
■ Listar todos os tipos de exames disponíveis para agendamento.
■ Detalhes de cada exame:
■ NomedoExame
■ Especialidade médica
2. Agendamento de Exames
○ Adicionar Agendamento:
■ Permitir que usuários agendem um exame selecionando:
■ Tipodeexame
■ Dataehora disponíveis
■ Informações adicionais (observações)
○ Visualizar Agendamentos:
■ Listar todos os exames agendados.
■ Detalhes de cada agendamento:
■ Tipodeexame
■ Dataehora agendada
■ Informações adicionais
○ Excluir Agendamento:
■ Permitir que usuários removam um agendamento existente.
Tecnologias a Serem Utilizadas
● Frontend:
○ React.js com TypeScript
○ Gerenciamento de estado (Redux, Context API ou similar)
○ ConsumodeAPIs RESTful
● Backend:
○ Node.js com TypeScript
○ Frameworks sugeridos: Express.js
● BancodeDados:
○ SQL(PostgreSQL)
○ ORM/QueryBuilder sugerido:  Sequelize
Não é obrigatório, mas vamos curtir se você:
● Realizar commits específicos e detalhados;
● Acrescentar algum tipo de cache;
● Disponibilizar uma solução para deploy da aplicação (Helm chart, docker-compose
ou similar);
Entrega
● Compartilhe o link do repositório público (GitHub ou similar).
● Assegure-se de que o projeto possa ser executado localmente seguindo as
instruções do README.
● Opcionalmente, hospede a aplicação em um ambiente online (como Heroku, Vercel,
Netlify) e forneça o link de acesso