package com.example.PBL3.dto.analytics;

public class SeriesPointDTO {
    private String label;
    private double value;

    public SeriesPointDTO() {
    }

    public SeriesPointDTO(String label, double value) {
        this.label = label;
        this.value = value;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }
}
