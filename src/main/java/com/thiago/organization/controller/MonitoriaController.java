package com.thiago.organization.controller;

import com.thiago.organization.dto.monitoria.MonitoriaRequest;
import com.thiago.organization.dto.monitoria.MonitoriaResponse;
import com.thiago.organization.service.MonitoriaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monitorias")
@RequiredArgsConstructor
public class MonitoriaController {

    private final MonitoriaService monitoriaService;

    @GetMapping
    public ResponseEntity<List<MonitoriaResponse>> listar() {
        return ResponseEntity.ok(monitoriaService.listar());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MonitoriaResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(monitoriaService.obterPorId(id));
    }

    @PostMapping
    public ResponseEntity<MonitoriaResponse> criar(@Valid @RequestBody MonitoriaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(monitoriaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MonitoriaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MonitoriaRequest request) {
        return ResponseEntity.ok(monitoriaService.atualizar(id, request));
    }

    @PatchMapping("/{id}/ativar")
    public ResponseEntity<MonitoriaResponse> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(monitoriaService.ativar(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        monitoriaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
