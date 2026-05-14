package com.thiago.organization.repository;

import com.thiago.organization.entity.Periodo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PeriodoRepository extends JpaRepository<Periodo, Long> {
    Optional<Periodo> findByAtivo(boolean ativo);
    Optional<Periodo> findByNome(String nome);
}
