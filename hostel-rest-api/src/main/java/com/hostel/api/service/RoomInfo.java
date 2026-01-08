package com.hostel.api.service;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Serializable data object representing room information
 * Must implement Serializable for RMI transmission
 */
public class RoomInfo implements Serializable {
    private static final long serialVersionUID = 1L;
    
    private String roomNumber;
    private List<String> occupants;
    private String wardenName;
    private String wardenContact;
    private int floor;
    private int capacity;
    private boolean isAvailable;
    
    public RoomInfo() {
        this.occupants = new ArrayList<>();
    }
    
    public RoomInfo(String roomNumber, int floor, int capacity) {
        this.roomNumber = roomNumber;
        this.floor = floor;
        this.capacity = capacity;
        this.occupants = new ArrayList<>();
        this.isAvailable = true;
    }
    
    // Getters and Setters
    public String getRoomNumber() {
        return roomNumber;
    }
    
    public void setRoomNumber(String roomNumber) {
        this.roomNumber = roomNumber;
    }
    
    public List<String> getOccupants() {
        return occupants;
    }
    
    public void setOccupants(List<String> occupants) {
        this.occupants = occupants;
        this.isAvailable = (occupants.size() < capacity);
    }
    
    public void addOccupant(String name) {
        this.occupants.add(name);
        this.isAvailable = (occupants.size() < capacity);
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
    
    public int getFloor() {
        return floor;
    }
    
    public void setFloor(int floor) {
        this.floor = floor;
    }
    
    public int getCapacity() {
        return capacity;
    }
    
    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }
    
    public boolean isAvailable() {
        return isAvailable;
    }
    
    public void setAvailable(boolean available) {
        isAvailable = available;
    }
    
    public int getAvailableSpots() {
        return capacity - occupants.size();
    }
}