package com.thiago.organization.service;

import com.thiago.organization.dto.periodo.PeriodoRequest;
import com.thiago.organization.dto.periodo.PeriodoResponse;
import com.thiago.organization.entity.Periodo;
import com.thiago.organization.exception.ResourceNotFoundException;
import com.thiago.organization.repository.PeriodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PeriodoService {

    private final PeriodoRepository periodoRepository;

    public PeriodoResponse criar(PeriodoRequest request) {
        Periodo periodo = Periodo.builder()
                .nome(request.getNome())
                .dataInicio(request.getDataInicio())
                .dataFim(request.getDataFim())
                .ativo(false)
                .build();

        Periodo saved = periodoRepository.save(periodo);
        return toResponse(saved);
    }

    public List<PeriodoResponse> listar() {
        return periodoRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public PeriodoResponse obterPorId(Long id) {
        Periodo periodo = periodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + id));
        return toResponse(periodo);
    }

    public PeriodoResponse atualizar(Long id, PeriodoRequest request) {
        Periodo periodo = periodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + id));

        periodo.setNome(request.getNome());
        periodo.setDataInicio(request.getDataInicio());
        periodo.setDataFim(request.getDataFim());

        Periodo updated = periodoRepository.save(periodo);
        return toResponse(updated);
    }

    public void deletar(Long id) {
        Periodo periodo = periodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + id));
        periodoRepository.delete(periodo);
    }

    public PeriodoResponse ativar(Long id) {
        periodoRepository.findByAtivo(true).ifPresent(p -> {
            p.setAtivo(false);
            periodoRepository.save(p);
        });

        Periodo periodo = periodoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + id));

        periodo.setAtivo(true);
        Periodo updated = periodoRepository.save(periodo);
        return toResponse(updated);
    }

    public PeriodoResponse obterAtivo() {
        return periodoRepository.findByAtivo(true)
                .map(this::toResponse)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum período ativo no momento"));
    }

    private PeriodoResponse toResponse(Periodo periodo) {
        return PeriodoResponse.builder()
                .id(periodo.getId())
                .nome(periodo.getNome())
                .dataInicio(periodo.getDataInicio())
                .dataFim(periodo.getDataFim())
                .ativo(periodo.isAtivo())
                .build();
    }
}
