package com.thiago.organization.entity;

import com.thiago.organization.entity.enums.Turno;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.persistence.*;

@Entity
@Table(name = "horarios_disciplinas")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class HorarioDisciplina {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id", nullable = false)
    private Disciplina disciplina;

    @Column(nullable = false)
    private String codigo;

    @Column(nullable = false)
    private String horarioInicio;

    @Column(nullable = false)
    private String horarioFim;

    @Column(nullable = false)
    private Integer diaSemana;

    @Column(nullable = false)
    private String sala;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Turno turno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "periodo_id", nullable = false)
    private Periodo periodo;
}
