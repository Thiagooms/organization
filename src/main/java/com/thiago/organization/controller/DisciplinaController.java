package com.thiago.organization.controller;

import com.thiago.organization.dto.disciplina.DisciplinaRequest;
import com.thiago.organization.dto.disciplina.DisciplinaResponse;
import com.thiago.organization.service.DisciplinaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/periodos")
@RequiredArgsConstructor
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    @GetMapping("/{periodoId}/disciplinas")
    public ResponseEntity<List<DisciplinaResponse>> listarPorPeriodo(@PathVariable Long periodoId) {
        return ResponseEntity.ok(disciplinaService.listarPorPeriodo(periodoId));
    }

    @PostMapping("/{periodoId}/disciplinas")
    public ResponseEntity<DisciplinaResponse> criar(
            @PathVariable Long periodoId,
            @Valid @RequestBody DisciplinaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(disciplinaService.criar(periodoId, request));
    }

    @PutMapping("/disciplinas/{id}")
    public ResponseEntity<DisciplinaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DisciplinaRequest request) {
        return ResponseEntity.ok(disciplinaService.atualizar(id, request));
    }

    @DeleteMapping("/disciplinas/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        disciplinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/disciplinas/{id}")
    public ResponseEntity<DisciplinaResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(disciplinaService.obterPorId(id));
    }
}
