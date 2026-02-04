# Aspect

Sistema de gerenciamento de agendamentos de exames hospitalares.

## Stack

- **Backend**: Node.js + Express.js + TypeScript
- **Frontend**: React + TypeScript + Axios
- **ORM**: Sequelize
- **Banco de Dados**: PostgreSQL
- **Containerização**: Docker + Docker Compose

## Requisitos

- Docker
- Docker Compose

## Instalação e Execução

1. Clone o repositório:
```bash
git clone https://github.com/yIranBR/Aspect.git
cd Aspect
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Inicie os containers:
```bash
docker compose up -d
```

4. A API estará disponível em: `http://localhost:9101`

## Frontend

O frontend está localizado na pasta `frontend/`.

Para executar em desenvolvimento:
```bash
cd frontend
npm install
npm start
```

O frontend estará disponível em: `http://localhost:3002`

## Autenticação

O sistema possui dois níveis de acesso:

### Administrador
- Pode visualizar todos os agendamentos (com informações dos pacientes)
- Pode editar e excluir qualquer agendamento
- **Usuário de teste**: admin@aspect.com / senha: 123456

### Paciente
- Pode criar seus próprios agendamentos
- Pode visualizar e excluir apenas seus próprios agendamentos
- Pode se registrar através da tela inicial
- **Usuário de teste**: paciente@aspect.com / senha: 123456

## Endpoints da API

### Autenticação
- `POST /api/auth/register` - Registra novo usuário
- `POST /api/auth/login` - Realiza login e retorna token JWT
- `GET /api/auth/profile` - Retorna dados do usuário autenticado (requer token)

### Exames
- `GET /api/exams` - Lista todos os exames disponíveis
- `GET /api/exams/:id` - Busca exame por ID

### Agendamentos
- `POST /api/appointments` - Cria novo agendamento (requer autenticação)
- `GET /api/appointments` - Lista agendamentos (paciente vê apenas os seus, admin vê todos)
- `PUT /api/appointments/:id` - Atualiza agendamento (apenas admin)
- `DELETE /api/appointments/:id` - Remove agendamento (paciente apenas os seus, admin todos)

### Health Check
- `GET /health` - Verifica status da API

## Funcionalidades

- **Autenticação JWT** com dois níveis de acesso (Admin e Paciente)
- **Controle de acesso baseado em roles**:
  - Pacientes podem criar e gerenciar apenas seus próprios agendamentos
  - Administradores têm acesso total a todos os agendamentos
- Visualização de exames disponíveis
- Criação de agendamentos com data/hora e observações
- Listagem de agendamentos com detalhes do exame e paciente (para admin)
- Exclusão e edição de agendamentos com controle de permissões
- Seed automático de exames na inicialização
- Interface responsiva com gradientes modernos

## Desenvolvimento

Para parar os containers:
```bash
docker compose down
```

Para visualizar logs:
```bash
docker compose logs -f api
```

Para reconstruir os containers:
```bash
docker compose up -d --build
```

