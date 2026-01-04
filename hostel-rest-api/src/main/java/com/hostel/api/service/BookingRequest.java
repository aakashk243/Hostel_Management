package com.hostel.api.service;

import java.io.Serializable;
import java.util.List;

/**
 * Serializable data object for room booking requests
 */
public class BookingRequest implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private List<String> studentNames;
    private int preferredFloor;
    private String preferredRoomNumber;
    private int numberOfOccupants;
    
    public BookingRequest() {
    }
    
    public BookingRequest(List<String> studentNames, int preferredFloor, 
                         String preferredRoomNumber, int numberOfOccupants) {
        this.studentNames = studentNames;
        this.preferredFloor = preferredFloor;
        this.preferredRoomNumber = preferredRoomNumber;
        this.numberOfOccupants = numberOfOccupants;
    }
    
    // Getters and Setters
    public List<String> getStudentNames() {
        return studentNames;
    }
    
    public void setStudentNames(List<String> studentNames) {
        this.studentNames = studentNames;
    }
    
    public int getPreferredFloor() {
        return preferredFloor;
    }
    
    public void setPreferredFloor(int preferredFloor) {
        this.preferredFloor = preferredFloor;
    }
    
    public String getPreferredRoomNumber() {
        return preferredRoomNumber;
    }
    
    public void setPreferredRoomNumber(String preferredRoomNumber) {
        this.preferredRoomNumber = preferredRoomNumber;
    }
    
    public int getNumberOfOccupants() {
        return numberOfOccupants;
    }
    
    public void setNumberOfOccupants(int numberOfOccupants) {
        this.numberOfOccupants = numberOfOccupants;
    }
}