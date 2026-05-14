package com.thiago.organization.repository;

import com.thiago.organization.entity.Monitoria;
import com.thiago.organization.entity.enums.TipoMonitoria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonitoriaRepository extends JpaRepository<Monitoria, Long> {
    List<Monitoria> findByTipo(TipoMonitoria tipo);
}
