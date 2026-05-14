package com.thiago.organization.dto.monitoria;

import com.thiago.organization.entity.enums.StatusMonitoria;
import com.thiago.organization.entity.enums.TipoMonitoria;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitoriaResponse {

    private Long id;
    private String disciplina;
    private String professor;
    private String nomeMonitor;
    private TipoMonitoria tipo;
    private StatusMonitoria status;
    private String local;
    private String diasHorario;
    private LocalDate dataProva;
    private LocalDate dataInicio;
    private String observacoes;
}
