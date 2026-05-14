# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Monorepo Structure

```
organization/
├── backend/           (Spring Boot - Java)
│   ├── src/
│   ├── pom.xml
│   └── mvnw
├── frontend/          (React - JavaScript)
│   ├── src/
│   ├── package.json
│   └── vite.config.js
└── package.json       (Root - workspaces)
```

## Stack

- Java 21
- Spring Boot 4.0.6 (Spring MVC, Spring Data JPA, Bean Validation)
- PostgreSQL
- Lombok
- Maven

## Comandos

### Frontend (React)

```bash
# Instalar dependências
npm install

# Desenvolvimento (Vite dev server)
npm run dev

# Build para produção
npm run build

# Preview do build
npm run preview

# Lint
npm run lint
```

### Backend (Spring Boot)

```bash
# Build
./mvnw clean package

# Rodar a aplicação
./mvnw spring-boot:run

# Rodar todos os testes
./mvnw test

# Rodar um teste específico
./mvnw test -Dtest=NomeDaClasseTest

# Rodar um método de teste específico
./mvnw test -Dtest=NomeDaClasseTest#nomeDoMetodo
```

### Monorepo (Root)

```bash
# Instalar tudo
npm install

# Rodar frontend em desenvolvimento
npm run dev

# Build frontend
npm run build

# Build backend
npm run backend:build

# Rodar backend
npm run backend:run
```

## Frontend Stack

- **React 18** — UI framework
- **Vite** — Build tool e dev server
- **Tailwind CSS** — Utility-first CSS
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **Lucide Icons** — Icon library (minimalista)

Frontend comunica com backend via proxy em `http://localhost:8080/api`

## Backend Stack

- **Spring Boot 4.0.6** — Web framework
- **Spring Data JPA** — ORM
- **Spring Validation** — Bean validation
- **PostgreSQL** — Database
- **Lombok** — Boilerplate reduction

## Configuração

O banco de dados PostgreSQL precisa estar configurado em `src/main/resources/application.yaml`. As credenciais não estão no repositório — adicione localmente:

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/organization
    username: seu_usuario
    password: sua_senha
  jpa:
    hibernate:
      ddl-auto: update
```

## Arquitetura

Pacote raiz: `com.thiago.organization`

O projeto segue a estrutura padrão de camadas do Spring Boot:
- **Controller** — endpoints REST (`@RestController`)
- **Service** — lógica de negócio (`@Service`)
- **Repository** — acesso a dados via Spring Data JPA (`@Repository` / `JpaRepository`)
- **Entity** — entidades JPA mapeadas para tabelas do PostgreSQL
- **DTO** — objetos de transferência de dados para entrada/saída dos endpoints

Lombok é usado para reduzir boilerplate nas entidades e DTOs (`@Data`, `@Builder`, `@NoArgsConstructor`, etc.).

## Commits

Use **commits semânticos** em **linha única** e em **inglês**:

- `feat:` — nova funcionalidade
- `fix:` — correção de bug
- `refactor:` — refatoração sem alterar comportamento
- `docs:` — mudanças em documentação
- `style:` — formatação, sem alterar lógica
- `test:` — adição/alteração de testes
- `chore:` — tarefas de manutenção (deps, config)

**Exemplos:**
```
feat: add user authentication
fix: resolve null pointer in user service
refactor: simplify period controller logic
docs: update readme with setup instructions
```

Não coloque nome do autor no commit message — git já rastreia isso.
