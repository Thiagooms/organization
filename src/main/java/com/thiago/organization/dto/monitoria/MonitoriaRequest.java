package com.thiago.organization.dto.monitoria;

import com.thiago.organization.entity.enums.StatusMonitoria;
import com.thiago.organization.entity.enums.TipoMonitoria;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonitoriaRequest {

    @NotBlank(message = "Disciplina é obrigatória")
    private String disciplina;

    private String professor;

    private String nomeMonitor;

    @NotNull(message = "Tipo é obrigatório")
    private TipoMonitoria tipo;

    @NotNull(message = "Status é obrigatório")
    private StatusMonitoria status;

    private String local;

    private String diasHorario;

    private LocalDate dataProva;

    private LocalDate dataInicio;

    private String observacoes;
}
