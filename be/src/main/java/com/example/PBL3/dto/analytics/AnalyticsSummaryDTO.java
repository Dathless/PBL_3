package com.example.PBL3.dto.analytics;

public class AnalyticsSummaryDTO {
    private Stat revenue;
    private Stat orders;
    private Stat customers;
    private Stat conversion;

    public AnalyticsSummaryDTO() {
    }

    public AnalyticsSummaryDTO(Stat revenue, Stat orders, Stat customers, Stat conversion) {
        this.revenue = revenue;
        this.orders = orders;
        this.customers = customers;
        this.conversion = conversion;
    }

    public Stat getRevenue() {
        return revenue;
    }

    public void setRevenue(Stat revenue) {
        this.revenue = revenue;
    }

    public Stat getOrders() {
        return orders;
    }

    public void setOrders(Stat orders) {
        this.orders = orders;
    }

    public Stat getCustomers() {
        return customers;
    }

    public void setCustomers(Stat customers) {
        this.customers = customers;
    }

    public Stat getConversion() {
        return conversion;
    }

    public void setConversion(Stat conversion) {
        this.conversion = conversion;
    }

    public static class Stat {
        private double current;
        private double previous;
        private double change;

        public Stat() {
        }

        public Stat(double current, double previous) {
            this.current = current;
            this.previous = previous;
            this.change = previous == 0 ? (current == 0 ? 0 : 100) : ((current - previous) / previous) * 100;
        }

        // Add all args constructor including change if needed, but the logic above
        // calculates change
        // We can add a full constructor too
        public Stat(double current, double previous, double change) {
            this.current = current;
            this.previous = previous;
            this.change = change;
        }

        public double getCurrent() {
            return current;
        }

        public void setCurrent(double current) {
            this.current = current;
        }

        public double getPrevious() {
            return previous;
        }

        public void setPrevious(double previous) {
            this.previous = previous;
        }

        public double getChange() {
            return change;
        }

        public void setChange(double change) {
            this.change = change;
        }
    }
}
