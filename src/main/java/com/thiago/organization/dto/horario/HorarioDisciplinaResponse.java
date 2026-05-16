package com.thiago.organization.dto.horario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioDisciplinaResponse {

    private Long id;
    private Long disciplinaId;
    private String disciplinaNome;
    private String professorNome;
    private String codigo;
    private String horarioInicio;
    private String horarioFim;
    private Integer diaSemana;
    private String sala;
    private String turno;
}
