package com.thiago.organization.service;

import com.thiago.organization.dto.aula.AulaRequest;
import com.thiago.organization.dto.aula.AulaResponse;
import com.thiago.organization.entity.Aula;
import com.thiago.organization.entity.Disciplina;
import com.thiago.organization.exception.ResourceNotFoundException;
import com.thiago.organization.repository.AulaRepository;
import com.thiago.organization.repository.DisciplinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AulaService {

    private final AulaRepository aulaRepository;
    private final DisciplinaRepository disciplinaRepository;

    public AulaResponse criar(Long disciplinaId, AulaRequest request) {
        Disciplina disciplina = disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + disciplinaId));

        Aula aula = Aula.builder()
                .data(request.getData())
                .conteudo(request.getConteudo())
                .satisfacao(request.getSatisfacao())
                .dificuldade(request.getDificuldade())
                .duvidas(request.getDuvidas())
                .observacoes(request.getObservacoes())
                .presente(request.getPresente() != null ? request.getPresente() : true)
                .disciplina(disciplina)
                .build();

        Aula saved = aulaRepository.save(aula);
        return toResponse(saved);
    }

    public List<AulaResponse> listarPorDisciplina(Long disciplinaId) {
        disciplinaRepository.findById(disciplinaId)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + disciplinaId));

        return aulaRepository.findByDisciplinaId(disciplinaId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AulaResponse obterPorId(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada com ID: " + id));
        return toResponse(aula);
    }

    public AulaResponse atualizar(Long id, AulaRequest request) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada com ID: " + id));

        aula.setData(request.getData());
        aula.setConteudo(request.getConteudo());
        aula.setSatisfacao(request.getSatisfacao());
        aula.setDificuldade(request.getDificuldade());
        aula.setDuvidas(request.getDuvidas());
        aula.setObservacoes(request.getObservacoes());
        if (request.getPresente() != null) {
            aula.setPresente(request.getPresente());
        }

        Aula updated = aulaRepository.save(aula);
        return toResponse(updated);
    }

    public void deletar(Long id) {
        Aula aula = aulaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada com ID: " + id));
        aulaRepository.delete(aula);
    }

    private AulaResponse toResponse(Aula aula) {
        return AulaResponse.builder()
                .id(aula.getId())
                .data(aula.getData())
                .conteudo(aula.getConteudo())
                .satisfacao(aula.getSatisfacao())
                .dificuldade(aula.getDificuldade())
                .duvidas(aula.getDuvidas())
                .observacoes(aula.getObservacoes())
                .presente(aula.getPresente())
                .disciplinaId(aula.getDisciplina().getId())
                .build();
    }
}
