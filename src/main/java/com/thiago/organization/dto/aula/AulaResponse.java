package com.thiago.organization.dto.aula;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AulaResponse {

    private Long id;
    private LocalDate data;
    private String conteudo;
    private Integer satisfacao;
    private Integer dificuldade;
    private String duvidas;
    private String observacoes;
    private Boolean presente;
    private Long disciplinaId;
}
