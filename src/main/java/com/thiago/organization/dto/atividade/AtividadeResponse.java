package com.thiago.organization.dto.atividade;

import com.thiago.organization.entity.enums.TipoAtividade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AtividadeResponse {

    private Long id;
    private String titulo;
    private String descricao;
    private LocalDate dataEntrega;
    private boolean concluida;
    private TipoAtividade tipo;
    private Double nota;
    private Long aulaId;
}
