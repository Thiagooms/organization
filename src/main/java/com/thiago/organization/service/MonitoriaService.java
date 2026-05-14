package com.thiago.organization.service;

import com.thiago.organization.dto.monitoria.MonitoriaRequest;
import com.thiago.organization.dto.monitoria.MonitoriaResponse;
import com.thiago.organization.entity.Monitoria;
import com.thiago.organization.entity.enums.StatusMonitoria;
import com.thiago.organization.exception.ResourceNotFoundException;
import com.thiago.organization.repository.MonitoriaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MonitoriaService {

    private final MonitoriaRepository monitoriaRepository;

    public MonitoriaResponse criar(MonitoriaRequest request) {
        Monitoria monitoria = Monitoria.builder()
                .disciplina(request.getDisciplina())
                .professor(request.getProfessor())
                .nomeMonitor(request.getNomeMonitor())
                .tipo(request.getTipo())
                .status(request.getStatus())
                .local(request.getLocal())
                .diasHorario(request.getDiasHorario())
                .dataProva(request.getDataProva())
                .dataInicio(request.getDataInicio())
                .observacoes(request.getObservacoes())
                .build();

        return toResponse(monitoriaRepository.save(monitoria));
    }

    public List<MonitoriaResponse> listar() {
        return monitoriaRepository.findAll()
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public MonitoriaResponse obterPorId(Long id) {
        return toResponse(buscarOuLancar(id));
    }

    public MonitoriaResponse atualizar(Long id, MonitoriaRequest request) {
        Monitoria monitoria = buscarOuLancar(id);

        monitoria.setDisciplina(request.getDisciplina());
        monitoria.setProfessor(request.getProfessor());
        monitoria.setNomeMonitor(request.getNomeMonitor());
        monitoria.setTipo(request.getTipo());
        monitoria.setStatus(request.getStatus());
        monitoria.setLocal(request.getLocal());
        monitoria.setDiasHorario(request.getDiasHorario());
        monitoria.setDataProva(request.getDataProva());
        monitoria.setDataInicio(request.getDataInicio());
        monitoria.setObservacoes(request.getObservacoes());

        return toResponse(monitoriaRepository.save(monitoria));
    }

    public MonitoriaResponse ativar(Long id) {
        Monitoria monitoria = buscarOuLancar(id);
        monitoria.setStatus(StatusMonitoria.ATIVO);
        return toResponse(monitoriaRepository.save(monitoria));
    }

    public void deletar(Long id) {
        monitoriaRepository.delete(buscarOuLancar(id));
    }

    private Monitoria buscarOuLancar(Long id) {
        return monitoriaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Monitoria não encontrada com ID: " + id));
    }

    private MonitoriaResponse toResponse(Monitoria m) {
        return MonitoriaResponse.builder()
                .id(m.getId())
                .disciplina(m.getDisciplina())
                .professor(m.getProfessor())
                .nomeMonitor(m.getNomeMonitor())
                .tipo(m.getTipo())
                .status(m.getStatus())
                .local(m.getLocal())
                .diasHorario(m.getDiasHorario())
                .dataProva(m.getDataProva())
                .dataInicio(m.getDataInicio())
                .observacoes(m.getObservacoes())
                .build();
    }
}
