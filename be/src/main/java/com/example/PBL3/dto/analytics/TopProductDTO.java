package com.example.PBL3.dto.analytics;

import java.math.BigDecimal;

public class TopProductDTO {
    private String name;
    private Long sales;
    private BigDecimal revenue;
    private String imageUrl;

    public TopProductDTO() {
    }

    // Constructor with 3 parameters (without imageUrl)
    public TopProductDTO(String name, Long sales, BigDecimal revenue) {
        this.name = name;
        this.sales = sales;
        this.revenue = revenue;
    }

    // Constructor with 4 parameters (including imageUrl) - needed by JPA query
    public TopProductDTO(String name, Long sales, BigDecimal revenue, String imageUrl) {
        this.name = name;
        this.sales = sales;
        this.revenue = revenue;
        this.imageUrl = imageUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getSales() {
        return sales;
    }

    public void setSales(Long sales) {
        this.sales = sales;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
