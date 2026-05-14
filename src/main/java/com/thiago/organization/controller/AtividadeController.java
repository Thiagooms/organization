package com.thiago.organization.controller;

import com.thiago.organization.dto.atividade.AtividadeRequest;
import com.thiago.organization.dto.atividade.AtividadeResponse;
import com.thiago.organization.service.AtividadeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/aulas")
@RequiredArgsConstructor
public class AtividadeController {

    private final AtividadeService atividadeService;

    @GetMapping("/{aulaId}/atividades")
    public ResponseEntity<List<AtividadeResponse>> listarPorAula(@PathVariable Long aulaId) {
        return ResponseEntity.ok(atividadeService.listarPorAula(aulaId));
    }

    @PostMapping("/{aulaId}/atividades")
    public ResponseEntity<AtividadeResponse> criar(
            @PathVariable Long aulaId,
            @Valid @RequestBody AtividadeRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(atividadeService.criar(aulaId, request));
    }

    @GetMapping("/atividades/pendentes")
    public ResponseEntity<List<AtividadeResponse>> listarPendentes() {
        return ResponseEntity.ok(atividadeService.listarPendentes());
    }

    @PutMapping("/atividades/{id}")
    public ResponseEntity<AtividadeResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AtividadeRequest request) {
        return ResponseEntity.ok(atividadeService.atualizar(id, request));
    }

    @PatchMapping("/atividades/{id}/concluir")
    public ResponseEntity<AtividadeResponse> marcarConcluida(@PathVariable Long id) {
        return ResponseEntity.ok(atividadeService.marcarConcluida(id));
    }

    @DeleteMapping("/atividades/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        atividadeService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/atividades/{id}")
    public ResponseEntity<AtividadeResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(atividadeService.obterPorId(id));
    }
}
