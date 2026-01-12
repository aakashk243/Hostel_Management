package com.hostelassist.canteen.models;

import java.util.List;

public class Order {
    private long id;
    private String studentId;
    private List<OrderItem> items;
    private String status;
    private String timestamp;
    private double total;

    public Order() {
    }

    public Order(long id, String studentId, List<OrderItem> items, String status, String timestamp, double total) {
        this.id = id;
        this.studentId = studentId;
        this.items = items;
        this.status = status;
        this.timestamp = timestamp;
        this.total = total;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStudentId() {
        return studentId;
    }

    public void setStudentId(String studentId) {
        this.studentId = studentId;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", studentId='" + studentId + '\'' +
                ", items=" + items +
                ", status='" + status + '\'' +
                ", timestamp='" + timestamp + '\'' +
                ", total=" + total +
                '}';
    }
}