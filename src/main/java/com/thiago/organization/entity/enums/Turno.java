package com.thiago.organization.entity.enums;

public enum Turno {
    MANHA("Manhã"),
    NOITE("Noite");

    private final String label;

    Turno(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }
}
