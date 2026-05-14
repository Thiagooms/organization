package com.thiago.organization.controller;

import com.thiago.organization.dto.periodo.PeriodoRequest;
import com.thiago.organization.dto.periodo.PeriodoResponse;
import com.thiago.organization.service.PeriodoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/periodos")
@RequiredArgsConstructor
public class PeriodoController {

    private final PeriodoService periodoService;

    @GetMapping
    public ResponseEntity<List<PeriodoResponse>> listar() {
        return ResponseEntity.ok(periodoService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<PeriodoResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(periodoService.obterPorId(id));
    }

    @GetMapping("/ativo/atual")
    public ResponseEntity<PeriodoResponse> obterAtivo() {
        return ResponseEntity.ok(periodoService.obterAtivo());
    }

    @PostMapping
    public ResponseEntity<PeriodoResponse> criar(@Valid @RequestBody PeriodoRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(periodoService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PeriodoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PeriodoRequest request) {
        return ResponseEntity.ok(periodoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        periodoService.deletar(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<PeriodoResponse> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(periodoService.ativar(id));
    }
}
