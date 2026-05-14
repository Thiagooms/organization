package com.thiago.organization.repository;

import com.thiago.organization.entity.Aula;
import com.thiago.organization.entity.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AulaRepository extends JpaRepository<Aula, Long> {
    List<Aula> findByDisciplina(Disciplina disciplina);
    List<Aula> findByDisciplinaId(Long disciplinaId);
}
