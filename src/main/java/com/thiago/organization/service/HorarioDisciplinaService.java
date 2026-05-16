package com.thiago.organization.service;

import com.thiago.organization.dto.horario.HorarioDisciplinaRequest;
import com.thiago.organization.dto.horario.HorarioDisciplinaResponse;
import com.thiago.organization.entity.Disciplina;
import com.thiago.organization.entity.HorarioDisciplina;
import com.thiago.organization.entity.Periodo;
import com.thiago.organization.entity.enums.Turno;
import com.thiago.organization.exception.ResourceNotFoundException;
import com.thiago.organization.repository.DisciplinaRepository;
import com.thiago.organization.repository.HorarioDisciplinaRepository;
import com.thiago.organization.repository.PeriodoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HorarioDisciplinaService {

    private final HorarioDisciplinaRepository horarioRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final PeriodoRepository periodoRepository;

    public HorarioDisciplinaResponse criar(HorarioDisciplinaRequest request) {
        Disciplina disciplina = disciplinaRepository.findById(request.getDisciplinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + request.getDisciplinaId()));

        Periodo periodo = periodoRepository.findByAtivo(true)
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum período ativo no momento"));

        HorarioDisciplina horario = HorarioDisciplina.builder()
                .disciplina(disciplina)
                .codigo(request.getCodigo())
                .horarioInicio(request.getHorarioInicio())
                .horarioFim(request.getHorarioFim())
                .diaSemana(request.getDiaSemana())
                .sala(request.getSala())
                .turno(Turno.valueOf(request.getTurno()))
                .periodo(periodo)
                .build();

        HorarioDisciplina saved = horarioRepository.save(horario);
        return toResponse(saved);
    }

    public List<HorarioDisciplinaResponse> listarPorPeriodo(Long periodoId) {
        periodoRepository.findById(periodoId)
                .orElseThrow(() -> new ResourceNotFoundException("Período não encontrado com ID: " + periodoId));

        return horarioRepository.findByPeriodoId(periodoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<HorarioDisciplinaResponse> listarAtivos() {
        return periodoRepository.findByAtivo(true)
                .map(periodo -> horarioRepository.findByPeriodoId(periodo.getId())
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList()))
                .orElseThrow(() -> new ResourceNotFoundException("Nenhum período ativo no momento"));
    }

    public HorarioDisciplinaResponse obterPorId(Long id) {
        HorarioDisciplina horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horário não encontrado com ID: " + id));
        return toResponse(horario);
    }

    public HorarioDisciplinaResponse atualizar(Long id, HorarioDisciplinaRequest request) {
        HorarioDisciplina horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horário não encontrado com ID: " + id));

        Disciplina disciplina = disciplinaRepository.findById(request.getDisciplinaId())
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina não encontrada com ID: " + request.getDisciplinaId()));

        horario.setDisciplina(disciplina);
        horario.setCodigo(request.getCodigo());
        horario.setHorarioInicio(request.getHorarioInicio());
        horario.setHorarioFim(request.getHorarioFim());
        horario.setDiaSemana(request.getDiaSemana());
        horario.setSala(request.getSala());
        horario.setTurno(Turno.valueOf(request.getTurno()));

        HorarioDisciplina updated = horarioRepository.save(horario);
        return toResponse(updated);
    }

    public void deletar(Long id) {
        HorarioDisciplina horario = horarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Horário não encontrado com ID: " + id));
        horarioRepository.delete(horario);
    }

    private HorarioDisciplinaResponse toResponse(HorarioDisciplina horario) {
        return HorarioDisciplinaResponse.builder()
                .id(horario.getId())
                .disciplinaId(horario.getDisciplina().getId())
                .disciplinaNome(horario.getDisciplina().getNome())
                .professorNome(horario.getDisciplina().getProfessor())
                .codigo(horario.getCodigo())
                .horarioInicio(horario.getHorarioInicio())
                .horarioFim(horario.getHorarioFim())
                .diaSemana(horario.getDiaSemana())
                .sala(horario.getDisciplina().getSala())
                .turno(horario.getTurno().name())
                .build();
    }
}
