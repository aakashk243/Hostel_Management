package com.hostel.api.missing;

public class MissingItem {

    private int id;
    private String studentName;
    private String itemName;
    private String location;
    private String status;

    public MissingItem(int id, String studentName, String itemName, String location) {
        this.id = id;
        this.studentName = studentName;
        this.itemName = itemName;
        this.location = location;
        this.status = "OPEN";
    }

    public int getId() { return id; }
    public String getStudentName() { return studentName; }
    public String getItemName() { return itemName; }
    public String getLocation() { return location; }
    public String getStatus() { return status; }

    public void setStatus(String status) {
        this.status = status;
    }
}
