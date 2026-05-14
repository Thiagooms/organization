package com.thiago.organization.dto.disciplina;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisciplinaResponse {

    private Long id;
    private String nome;
    private String professor;
    private Integer cargaHoraria;
    private Long periodoId;
}
