package com.thiago.organization.controller;

import com.thiago.organization.dto.aula.AulaRequest;
import com.thiago.organization.dto.aula.AulaResponse;
import com.thiago.organization.service.AulaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/disciplinas")
@RequiredArgsConstructor
public class AulaController {

    private final AulaService aulaService;

    @GetMapping("/{disciplinaId}/aulas")
    public ResponseEntity<List<AulaResponse>> listarPorDisciplina(@PathVariable Long disciplinaId) {
        return ResponseEntity.ok(aulaService.listarPorDisciplina(disciplinaId));
    }

    @PostMapping("/{disciplinaId}/aulas")
    public ResponseEntity<AulaResponse> criar(
            @PathVariable Long disciplinaId,
            @Valid @RequestBody AulaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(aulaService.criar(disciplinaId, request));
    }

    @PutMapping("/aulas/{id}")
    public ResponseEntity<AulaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AulaRequest request) {
        return ResponseEntity.ok(aulaService.atualizar(id, request));
    }

    @DeleteMapping("/aulas/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        aulaService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/aulas/{id}")
    public ResponseEntity<AulaResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(aulaService.obterPorId(id));
    }
}
