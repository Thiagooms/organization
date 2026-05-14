package com.thiago.organization.repository;

import com.thiago.organization.entity.Disciplina;
import com.thiago.organization.entity.Periodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DisciplinaRepository extends JpaRepository<Disciplina, Long> {
    List<Disciplina> findByPeriodo(Periodo periodo);
    List<Disciplina> findByPeriodoId(Long periodoId);
}
