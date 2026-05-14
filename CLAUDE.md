# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- Java 21
- Spring Boot 4.0.6 (Spring MVC, Spring Data JPA, Bean Validation)
- PostgreSQL
- Lombok
- Maven

## Comandos

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
