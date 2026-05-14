package com.thiago.organization.dto.disciplina;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DisciplinaRequest {

    @NotBlank(message = "Nome da disciplina é obrigatório")
    private String nome;

    @NotBlank(message = "Nome do professor é obrigatório")
    private String professor;

    @NotNull(message = "Carga horária é obrigatória")
    @Positive(message = "Carga horária deve ser positiva")
    private Integer cargaHoraria;
}
