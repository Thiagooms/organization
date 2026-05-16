package com.thiago.organization.repository;

import com.thiago.organization.entity.HorarioDisciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HorarioDisciplinaRepository extends JpaRepository<HorarioDisciplina, Long> {
    List<HorarioDisciplina> findByPeriodoId(Long periodoId);
    List<HorarioDisciplina> findByDisciplinaId(Long disciplinaId);
}
