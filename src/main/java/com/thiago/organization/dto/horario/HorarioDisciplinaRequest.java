package com.thiago.organization.dto.horario;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioDisciplinaRequest {

    @NotNull(message = "ID da disciplina é obrigatório")
    private Long disciplinaId;

    @NotBlank(message = "Código é obrigatório")
    private String codigo;

    @NotBlank(message = "Horário de início é obrigatório")
    private String horarioInicio;

    @NotBlank(message = "Horário de fim é obrigatório")
    private String horarioFim;

    @NotNull(message = "Dia da semana é obrigatório")
    @Min(value = 0, message = "Dia deve ser entre 0 (segunda) e 6 (domingo)")
    @Max(value = 6, message = "Dia deve ser entre 0 (segunda) e 6 (domingo)")
    private Integer diaSemana;

    @NotBlank(message = "Sala é obrigatória")
    private String sala;

    @NotBlank(message = "Turno é obrigatório")
    private String turno;
}
