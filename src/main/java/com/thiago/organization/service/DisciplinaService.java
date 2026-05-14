package com.thiago.organization.service;

import com.thiago.organization.dto.disciplina.DisciplinaRequest;
import com.thiago.organization.dto.disciplina.DisciplinaResponse;
import com.thiago.organization.entity.Disciplina;
import com.thiago.organization.entity.Periodo;
import com.thiago.organization.exception.ResourceNotFoundException;
import com.thiago.organization.repository.DisciplinaRepository;
import com.thiago.organization.repository.PeriodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;
    private final PeriodoRepository periodoRepository;

    public DisciplinaResponse criar(Long periodoId, DisciplinaRequest request) {
        Periodo periodo = periodoRepository.findById(periodoId)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + periodoId));

        Disciplina disciplina = Disciplina.builder()
                .nome(request.getNome())
                .professor(request.getProfessor())
                .cargaHoraria(request.getCargaHoraria())
                .periodo(periodo)
                .build();

        Disciplina saved = disciplinaRepository.save(disciplina);
        return toResponse(saved);
    }

    public List<DisciplinaResponse> listarPorPeriodo(Long periodoId) {
        periodoRepository.findById(periodoId)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + periodoId));

        return disciplinaRepository.findByPeriodoId(periodoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public DisciplinaResponse obterPorId(Long id) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + id));
        return toResponse(disciplina);
    }

    public DisciplinaResponse atualizar(Long id, DisciplinaRequest request) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + id));

        disciplina.setNome(request.getNome());
        disciplina.setProfessor(request.getProfessor());
        disciplina.setCargaHoraria(request.getCargaHoraria());

        Disciplina updated = disciplinaRepository.save(disciplina);
        return toResponse(updated);
    }

    public void deletar(Long id) {
        Disciplina disciplina = disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + id));
        disciplinaRepository.delete(disciplina);
    }

    private DisciplinaResponse toResponse(Disciplina disciplina) {
        return DisciplinaResponse.builder()
                .id(disciplina.getId())
                .nome(disciplina.getNome())
                .professor(disciplina.getProfessor())
                .cargaHoraria(disciplina.getCargaHoraria())
                .periodoId(disciplina.getPeriodo().getId())
                .build();
    }
}
