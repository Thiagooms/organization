package com.thiago.organization.controller;

import com.thiago.organization.dto.horario.HorarioDisciplinaRequest;
import com.thiago.organization.dto.horario.HorarioDisciplinaResponse;
import com.thiago.organization.service.HorarioDisciplinaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/horarios")
@RequiredArgsConstructor
public class HorarioDisciplinaController {

    private final HorarioDisciplinaService horarioDisciplinaService;

    @GetMapping
    public ResponseEntity<List<HorarioDisciplinaResponse>> listarAtivos() {
        return ResponseEntity.ok(horarioDisciplinaService.listarAtivos());
    }

    @GetMapping("/periodo/{periodoId}")
    public ResponseEntity<List<HorarioDisciplinaResponse>> listarPorPeriodo(@PathVariable Long periodoId) {
        return ResponseEntity.ok(horarioDisciplinaService.listarPorPeriodo(periodoId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<HorarioDisciplinaResponse> obterPorId(@PathVariable Long id) {
        return ResponseEntity.ok(horarioDisciplinaService.obterPorId(id));
    }

    @PostMapping
    public ResponseEntity<HorarioDisciplinaResponse> criar(@Valid @RequestBody HorarioDisciplinaRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(horarioDisciplinaService.criar(request));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HorarioDisciplinaResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody HorarioDisciplinaRequest request) {
        return ResponseEntity.ok(horarioDisciplinaService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        horarioDisciplinaService.deletar(id);
        return ResponseEntity.noContent().build();
    }
}
