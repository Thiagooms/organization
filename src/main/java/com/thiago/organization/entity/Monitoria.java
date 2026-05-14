package com.thiago.organization.entity;

import com.thiago.organization.entity.enums.StatusMonitoria;
import com.thiago.organization.entity.enums.TipoMonitoria;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "monitorias")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Monitoria {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String disciplina;

    private String professor;

    private String nomeMonitor;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoMonitoria tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private StatusMonitoria status = StatusMonitoria.AGUARDANDO_PROVA;

    private String local;

    private String diasHorario;

    private LocalDate dataProva;

    private LocalDate dataInicio;

    @Column(columnDefinition = "TEXT")
    private String observacoes;
}
