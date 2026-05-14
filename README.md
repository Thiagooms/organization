# Organization

A personal academic management platform built as a monorepo with a Spring Boot REST API and a React frontend. It allows students to track academic periods, subjects, classes, assignments, monitoring sessions, and organize priorities through a Kanban board.

---

## Table of Contents

- [Requirements](#requirements)
- [Stack](#stack)
- [Getting Started](#getting-started)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Available Scripts](#available-scripts)
- [Features](#features)

---

## Requirements

Before cloning and running this project, make sure you have the following installed:

- [Java 21](https://adoptium.net/)
- [Node.js 18+](https://nodejs.org/)
- [PostgreSQL 13+](https://www.postgresql.org/download/)
- Maven (included via `mvnw` wrapper, no separate install needed)

---

## Stack

**Backend**

- Java 21
- Spring Boot 4
- Spring Data JPA
- Spring Validation
- PostgreSQL
- Lombok

**Frontend**

- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Lucide React

---

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/organization.git
cd organization
```

### 2. Install frontend dependencies

From the root of the project:

```bash
npm install
```

---

## Database Setup

### Create the database

Connect to your PostgreSQL instance and run:

```sql
CREATE DATABASE organization;
```

### Configure credentials

Open `src/main/resources/application.yaml` and set your database credentials:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/organization
    username: your_username
    password: your_password
```

The schema is managed automatically by Hibernate with `ddl-auto: update`. Tables are created on the first run.

---

## Running the Application

You need two terminals running simultaneously.

**Terminal 1 — Backend**

```bash
npm run backend:run
```

The API will be available at `http://localhost:8080`.

**Terminal 2 — Frontend**

```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

The frontend proxies all `/api` requests to the backend automatically via Vite's dev server configuration.

---

## Project Structure

```
organization/
├── src/                                      # Spring Boot backend
│   └── main/
│       ├── java/com/thiago/organization/
│       │   ├── controller/                   # REST controllers
│       │   ├── service/                      # Business logic
│       │   ├── repository/                   # JPA repositories
│       │   ├── entity/                       # JPA entities
│       │   │   └── enums/                    # Enum types
│       │   ├── dto/                          # Request and response DTOs
│       │   ├── exception/                    # Exception handling
│       │   └── config/                       # CORS and app configuration
│       └── resources/
│           └── application.yaml
├── frontend/
│   └── src/
│       ├── pages/                            # Page-level components
│       ├── components/                       # Shared UI components
│       ├── services/                         # Axios API client
│       ├── App.jsx
│       └── main.jsx
├── pom.xml
├── package.json                              # Monorepo scripts
└── README.md
```

---

## API Reference

All endpoints are prefixed with `/api`.

**Periods**

```
GET     /periodos
POST    /periodos
GET     /periodos/{id}
PUT     /periodos/{id}
DELETE  /periodos/{id}
PATCH   /periodos/{id}/ativar
GET     /periodos/ativo/atual
```

**Subjects**

```
GET     /periodos/{periodoId}/disciplinas
POST    /periodos/{periodoId}/disciplinas
GET     /periodos/disciplinas/{id}
PUT     /periodos/disciplinas/{id}
DELETE  /periodos/disciplinas/{id}
```

**Classes**

```
GET     /disciplinas/{disciplinaId}/aulas
POST    /disciplinas/{disciplinaId}/aulas
GET     /disciplinas/aulas/{id}
PUT     /disciplinas/aulas/{id}
DELETE  /disciplinas/aulas/{id}
```

**Assignments**

```
GET     /aulas/{aulaId}/atividades
POST    /aulas/{aulaId}/atividades
GET     /aulas/atividades/{id}
PUT     /aulas/atividades/{id}
DELETE  /aulas/atividades/{id}
PATCH   /aulas/atividades/{id}/concluir
GET     /aulas/atividades/pendentes
```

**Monitoring Sessions**

```
GET     /monitorias
POST    /monitorias
GET     /monitorias/{id}
PUT     /monitorias/{id}
DELETE  /monitorias/{id}
PATCH   /monitorias/{id}/ativar
```

---

## Available Scripts

Run these from the project root:

| Command | Description |
|---|---|
| `npm install` | Install all frontend dependencies |
| `npm run dev` | Start the frontend dev server on port 3000 |
| `npm run build` | Build the frontend for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint on the frontend |
| `npm run backend:run` | Start the Spring Boot backend |
| `npm run backend:build` | Build the backend JAR |

---

## Features

**Periods**

Create and manage academic periods (e.g. 2026.1). Only one period can be active at a time. All subjects and classes are scoped to the active period.

**Subjects**

Register subjects linked to the active period with professor name and workload.

**Classes**

Log individual class sessions under a subject. Each class records the date, content, satisfaction level, difficulty level, and optional notes or doubts.

**Assignments**

Track assignments, exams, and projects linked to a class session. Each item has a deadline, type, optional grade, and completion status. Deadline urgency is displayed visually based on remaining days.

**Monitoring Sessions**

Track academic monitoring sessions, both as a participant and as a monitor. Supports statuses for sessions awaiting a qualifying exam, active sessions, and inactive ones. Fields adapt based on the selected status to avoid capturing irrelevant data.

**Priority Board**

A Kanban board displaying all pending assignments and monitoring sessions across four priority columns: Urgent, High, Medium, and Low. Items are auto-assigned to columns based on deadline proximity and can be freely dragged between columns and reordered within them. The board state persists in `localStorage`.

---

## License

MIT
