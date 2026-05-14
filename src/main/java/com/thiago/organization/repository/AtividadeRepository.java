package com.thiago.organization.repository;

import com.thiago.organization.entity.Atividade;
import com.thiago.organization.entity.Aula;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AtividadeRepository extends JpaRepository<Atividade, Long> {
    List<Atividade> findByAula(Aula aula);
    List<Atividade> findByAulaId(Long aulaId);
    List<Atividade> findByConcluida(boolean concluida);
}
