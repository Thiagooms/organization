package com.thiago.organization.dto.aula;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AulaRequest {

    @NotNull(message = "Data é obrigatória")
    private LocalDate data;

    private String conteudo;

    @NotNull(message = "Satisfação é obrigatória")
    @Min(value = 1, message = "Satisfação deve ser entre 1 e 5")
    @Max(value = 5, message = "Satisfação deve ser entre 1 e 5")
    private Integer satisfacao;

    @NotNull(message = "Dificuldade é obrigatória")
    @Min(value = 1, message = "Dificuldade deve ser entre 1 e 5")
    @Max(value = 5, message = "Dificuldade deve ser entre 1 e 5")
    private Integer dificuldade;

    private String duvidas;

    private String observacoes;
}
