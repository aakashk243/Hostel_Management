package com.hostel.api.laundry;

public class LaundryRequest {
    private int id;
    private String studentName;
    private int clothes;
    private String status;

    public LaundryRequest(int id, String studentName, int clothes) {
        this.id = id;
        this.studentName = studentName;
        this.clothes = clothes;
        this.status = "QUEUED";
    }

    public int getId() { return id; }
    public String getStudentName() { return studentName; }
    public int getClothes() { return clothes; }
    public String getStatus() { return status; }

    public void setStatus(String status) {
        this.status = status;
    }
}

