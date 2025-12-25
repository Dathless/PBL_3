package com.example.PBL3.dto;

import java.time.LocalDate;
import java.util.UUID;

public class PromotionDTO {
    private UUID id;
    private String name;
    private String description;
    private int discountPercent;
    private LocalDate startDate;
    private LocalDate endDate;
    private boolean active;

    public PromotionDTO() {
    }

    public PromotionDTO(UUID id, String name, String description, int discountPercent, LocalDate startDate,
            LocalDate endDate, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.discountPercent = discountPercent;
        this.startDate = startDate;
        this.endDate = endDate;
        this.active = active;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getDiscountPercent() {
        return discountPercent;
    }

    public void setDiscountPercent(int discountPercent) {
        this.discountPercent = discountPercent;
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
