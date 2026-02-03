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

O frontend estará disponível em: `http://localhost:3000`

## Endpoints da API

### Exames
- `GET /api/exams` - Lista todos os exames disponíveis
- `GET /api/exams/:id` - Busca exame por ID

### Agendamentos
- `POST /api/appointments` - Cria novo agendamento
- `GET /api/appointments` - Lista todos os agendamentos
- `DELETE /api/appointments/:id` - Remove agendamento

### Health Check
- `GET /health` - Verifica status da API

## Funcionalidades

- Visualização de exames disponíveis
- Criação de agendamentos com data/hora e observações
- Listagem de agendamentos com detalhes do exame
- Exclusão de agendamentos
- Seed automático de exames na inicialização

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

