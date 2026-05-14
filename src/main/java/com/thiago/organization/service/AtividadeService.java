package com.thiago.organization.service;

import com.thiago.organization.dto.atividade.AtividadeRequest;
import com.thiago.organization.dto.atividade.AtividadeResponse;
import com.thiago.organization.entity.Atividade;
import com.thiago.organization.entity.Aula;
import com.thiago.organization.exception.ResourceNotFoundException;
import com.thiago.organization.repository.AtividadeRepository;
import com.thiago.organization.repository.AulaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AtividadeService {

    private final AtividadeRepository atividadeRepository;
    private final AulaRepository aulaRepository;

    public AtividadeResponse criar(Long aulaId, AtividadeRequest request) {
        Aula aula = aulaRepository.findById(aulaId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada com ID: " + aulaId));

        Atividade atividade = Atividade.builder()
                .titulo(request.getTitulo())
                .descricao(request.getDescricao())
                .dataEntrega(request.getDataEntrega())
                .tipo(request.getTipo())
                .nota(request.getNota())
                .concluida(false)
                .aula(aula)
                .build();

        Atividade saved = atividadeRepository.save(atividade);
        return toResponse(saved);
    }

    public List<AtividadeResponse> listarPorAula(Long aulaId) {
        aulaRepository.findById(aulaId)
                .orElseThrow(() -> new ResourceNotFoundException("Aula não encontrada com ID: " + aulaId));

        return atividadeRepository.findByAulaId(aulaId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AtividadeResponse> listarPendentes() {
        return atividadeRepository.findByConcluida(false)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AtividadeResponse obterPorId(Long id) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada com ID: " + id));
        return toResponse(atividade);
    }

    public AtividadeResponse atualizar(Long id, AtividadeRequest request) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada com ID: " + id));

        atividade.setTitulo(request.getTitulo());
        atividade.setDescricao(request.getDescricao());
        atividade.setDataEntrega(request.getDataEntrega());
        atividade.setTipo(request.getTipo());
        atividade.setNota(request.getNota());

        Atividade updated = atividadeRepository.save(atividade);
        return toResponse(updated);
    }

    public AtividadeResponse marcarConcluida(Long id) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada com ID: " + id));

        atividade.setConcluida(true);
        Atividade updated = atividadeRepository.save(atividade);
        return toResponse(updated);
    }

    public void deletar(Long id) {
        Atividade atividade = atividadeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada com ID: " + id));
        atividadeRepository.delete(atividade);
    }

    private AtividadeResponse toResponse(Atividade atividade) {
        return AtividadeResponse.builder()
                .id(atividade.getId())
                .titulo(atividade.getTitulo())
                .descricao(atividade.getDescricao())
                .dataEntrega(atividade.getDataEntrega())
                .concluida(atividade.isConcluida())
                .tipo(atividade.getTipo())
                .nota(atividade.getNota())
                .aulaId(atividade.getAula().getId())
                .build();
    }
}
