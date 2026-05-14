# Plano de Desenvolvimento — MVP Plataforma de Organização Acadêmica

**Objetivo:** Criar uma plataforma local para registrar e organizar seu dia a dia acadêmico (10 disciplinas, períodos semestrais, aulas, atividades, provas).

**Stack:** Spring Boot 4.0.6 + Java 21 + PostgreSQL + HTML/CSS/JS puro

**Status:** ✅ Planejamento concluído | 🔄 Desenvolvimento iniciando

---

## 📋 Modelo de Dados

```
Periodo (2026.1, 2026.2, ...)
├── id, nome, dataInicio, dataFim, ativo
│
└─→ Disciplina (Cálculo Numérico, etc)
    ├── id, nome, professor, cargaHoraria
    │
    └─→ Aula (registros de aula)
        ├── id, data, conteudo, satisfacao (1-5), dificuldade (1-5)
        ├── duvidas, observacoes
        │
        └─→ Atividade (tarefas, provas, trabalhos)
            └── id, titulo, descricao, dataEntrega, concluida, tipo, nota
```

---

## 🚀 Escopo MVP — 4 Fases

### Fase 1️⃣ — Backend: Entidades e Persistência
- [ ] Configurar `application.yaml` com PostgreSQL
- [ ] Criar 4 entidades JPA + enum TipoAtividade
- [ ] Criar 4 Repositories com métodos customizados

**Estimado:** 1-2 horas

### Fase 2️⃣ — Backend: API REST
- [ ] Service + Controller para Período (CRUD + ativar)
- [ ] Service + Controller para Disciplina (CRUD por período)
- [ ] Service + Controller para Aula (CRUD por disciplina)
- [ ] Service + Controller para Atividade (CRUD + marcar concluída)
- [ ] DTOs de request/response
- [ ] GlobalExceptionHandler

**Endpoints:**
```
Periodos:  GET/POST /api/periodos | PUT/DELETE /api/periodos/{id} | PATCH /api/periodos/{id}/ativar
Disciplinas: GET/POST /api/periodos/{id}/disciplinas | PUT/DELETE /api/disciplinas/{id}
Aulas:     GET/POST /api/disciplinas/{id}/aulas | PUT/DELETE /api/aulas/{id}
Atividades: GET/POST /api/aulas/{id}/atividades | PUT /api/atividades/{id} | PATCH /api/atividades/{id}/concluir | DELETE /api/atividades/{id}
```

**Estimado:** 3-4 horas

### Fase 3️⃣ — Frontend: HTML/CSS/JS
- [ ] Estrutura de arquivos (5 páginas + CSS + JS)
- [ ] Dashboard (período ativo, disciplinas, atividades pendentes)
- [ ] Periodos + Disciplinas
- [ ] Aulas + Atividades
- [ ] Menu de navegação + formulários

**Estimado:** 2-3 horas

### Fase 4️⃣ — Refinamentos
- [ ] Validações Bean Validation (@NotNull, @Min/@Max, etc)
- [ ] Dashboard com resumo (total aulas, pendências, média dificuldade)
- [ ] Testes completos

**Estimado:** 1-2 horas

**Total:** ~7-12 horas de desenvolvimento

---

## 📁 Estrutura de Arquivos (Java)

```
src/main/java/com/thiago/organization/
├── controller/
│   ├── PeriodoController.java
│   ├── DisciplinaController.java
│   ├── AulaController.java
│   └── AtividadeController.java
├── service/
│   ├── PeriodoService.java
│   ├── DisciplinaService.java
│   ├── AulaService.java
│   └── AtividadeService.java
├── repository/
│   ├── PeriodoRepository.java
│   ├── DisciplinaRepository.java
│   ├── AulaRepository.java
│   └── AtividadeRepository.java
├── entity/
│   ├── Periodo.java
│   ├── Disciplina.java
│   ├── Aula.java
│   ├── Atividade.java
│   └── enums/
│       └── TipoAtividade.java
├── dto/
│   ├── periodo/
│   │   ├── PeriodoRequest.java
│   │   └── PeriodoResponse.java
│   ├── disciplina/
│   ├── aula/
│   └── atividade/
├── exception/
│   ├── GlobalExceptionHandler.java
│   └── ResourceNotFoundException.java
└── OrganizationApplication.java
```

## 📁 Estrutura de Arquivos (Frontend)

```
src/main/resources/
├── application.yaml (+ datasource PostgreSQL)
└── static/
    ├── index.html (dashboard)
    ├── periodos.html
    ├── disciplinas.html
    ├── aulas.html
    ├── atividades.html
    ├── css/
    │   └── style.css
    └── js/
        ├── api.js (funções fetch)
        ├── periodos.js
        ├── disciplinas.js
        ├── aulas.js
        └── atividades.js
```

---

## ✅ Verificação Final

1. ✅ Configurar banco PostgreSQL local
2. ✅ `./mvnw clean package` compila sem erros
3. ✅ `./mvnw spring-boot:run` sobe a aplicação
4. ✅ `http://localhost:8080` carrega o dashboard
5. ✅ Fluxo completo: Período → Disciplina → Aula → Atividade
6. ✅ Dados persistem após reiniciar a app
7. ✅ `./mvnw test` passa

---

## 🎯 Próximos Passos

1. Começar pela **Fase 1** — entidades e persistência
2. Seguir para **Fase 2** — API REST completa
3. Depois **Fase 3** — frontend
4. Finalizar com **Fase 4** — refinamentos e testes

Cada fase deve ser concluída antes de passar à próxima.

---

## 📞 Documentação Relacionada

- Plano detalhado: `~/.claude/plans/misty-swimming-finch.md`
- Instruções Claude Code: `CLAUDE.md`
- Tarefas rastreadas via TaskList
