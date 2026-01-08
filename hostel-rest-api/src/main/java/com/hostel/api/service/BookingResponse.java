package com.hostel.api.service;

import java.io.Serializable;

/**
 * Serializable response object for booking operations
 */
public class BookingResponse implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private boolean success;
    private String message;
    private String allocatedRoomNumber;
    private int allocatedFloor;
    private String wardenName;
    private String wardenContact;
    
    public BookingResponse() {
    }
    
    public BookingResponse(boolean success, String message) {
        this.success = success;
        this.message = message;
    }
    
    // Getters and Setters
    public boolean isSuccess() {
        return success;
    }
    
    public void setSuccess(boolean success) {
        this.success = success;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public String getAllocatedRoomNumber() {
        return allocatedRoomNumber;
    }
    
    public void setAllocatedRoomNumber(String allocatedRoomNumber) {
        this.allocatedRoomNumber = allocatedRoomNumber;
    }
    
    public int getAllocatedFloor() {
        return allocatedFloor;
    }
    
    public void setAllocatedFloor(int allocatedFloor) {
        this.allocatedFloor = allocatedFloor;
    }
    
    public String getWardenName() {
        return wardenName;
    }
    
    public void setWardenName(String wardenName) {
        this.wardenName = wardenName;
    }
    
    public String getWardenContact() {
        return wardenContact;
    }
    
    public void setWardenContact(String wardenContact) {
        this.wardenContact = wardenContact;
    }
}