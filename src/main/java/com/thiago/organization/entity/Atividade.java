package com.thiago.organization.entity;

import com.thiago.organization.entity.enums.TipoAtividade;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "atividades")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Atividade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descricao;

    @Column(nullable = false)
    private LocalDate dataEntrega;

    @Column(nullable = false)
    @Builder.Default
    private boolean concluida = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAtividade tipo;

    private Double nota;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aula_id", nullable = false)
    private Aula aula;
}
