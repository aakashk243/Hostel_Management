package com.hostel.api.service;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Service
public class HostelDataService {
    
    private Map<String, RoomInfo> rooms;
    private Map<Integer, WardenInfo> wardens;
    
    @PostConstruct
    public void init() {
        rooms = new ConcurrentHashMap<>();
        wardens = new HashMap<>();
        initializeData();
        System.out.println("✓ Hostel data initialized with " + rooms.size() + " rooms");
    }
    
    private void initializeData() {
        // Initialize wardens
        wardens.put(1, new WardenInfo("Dr. Rajesh Kumar", "+91-98765-43210"));
        wardens.put(2, new WardenInfo("Prof. Anita Sharma", "+91-98765-43211"));
        wardens.put(3, new WardenInfo("Mr. Suresh Patel", "+91-98765-43212"));
        wardens.put(4, new WardenInfo("Ms. Priya Desai", "+91-98765-43213"));
        
        // Floor 1
        addRoom("101", 1, 2, Arrays.asList("Amit Singh", "Rahul Verma"));
        addRoom("102", 1, 2, new ArrayList<>());
        addRoom("103", 1, 3, Arrays.asList("Vikram Reddy"));
        addRoom("104", 1, 2, Arrays.asList("Arjun Mehta", "Karan Joshi"));
        addRoom("105", 1, 3, new ArrayList<>());
        
        // Floor 2
        addRoom("201", 2, 2, Arrays.asList("Sanjay Kumar"));
        addRoom("202", 2, 2, new ArrayList<>());
        addRoom("203", 2, 3, Arrays.asList("Ravi Sharma", "Deepak Gupta"));
        addRoom("204", 2, 2, new ArrayList<>());
        addRoom("205", 2, 3, Arrays.asList("Nikhil Agarwal", "Rohit Malhotra", "Varun Singh"));
        
        // Floor 3
        addRoom("301", 3, 2, new ArrayList<>());
        addRoom("302", 3, 2, Arrays.asList("Ajay Thakur"));
        addRoom("303", 3, 3, new ArrayList<>());
        addRoom("304", 3, 2, Arrays.asList("Manoj Yadav", "Sunil Reddy"));
        addRoom("305", 3, 3, Arrays.asList("Ankit Sharma"));
        
        // Floor 4
        addRoom("401", 4, 2, new ArrayList<>());
        addRoom("402", 4, 2, new ArrayList<>());
        addRoom("403", 4, 3, Arrays.asList("Pranav Jain"));
        addRoom("404", 4, 2, new ArrayList<>());
        addRoom("405", 4, 3, new ArrayList<>());
    }
    
    private void addRoom(String roomNum, int floor, int capacity, List<String> occupants) {
        RoomInfo room = new RoomInfo();
        room.setRoomNumber(roomNum);
        room.setFloor(floor);
        room.setCapacity(capacity);
        room.setOccupants(new ArrayList<>(occupants));
        
        WardenInfo warden = wardens.get(floor);
        room.setWardenName(warden.getName());
        room.setWardenContact(warden.getContact());
        
        rooms.put(roomNum, room);
    }
    
    public RoomInfo searchRoom(String roomNumber) throws Exception {
        if (roomNumber == null || roomNumber.trim().isEmpty()) {
            throw new Exception("Room number cannot be empty");
        }
        
        RoomInfo room = rooms.get(roomNumber.trim());
        if (room == null) {
            throw new Exception("Room not found: " + roomNumber);
        }
        
        return room;
    }
    
    public synchronized BookingResponse bookRoom(BookingRequest booking) throws Exception {
        BookingResponse response = new BookingResponse();
        
        if (booking.getStudentNames() == null || booking.getStudentNames().isEmpty()) {
            response.setSuccess(false);
            response.setMessage("Student names cannot be empty");
            return response;
        }
        
        int requiredSpots = booking.getNumberOfOccupants();
        
        // Try preferred room first
        if (booking.getPreferredRoomNumber() != null && 
            !booking.getPreferredRoomNumber().trim().isEmpty()) {
            
            String preferredRoom = booking.getPreferredRoomNumber().trim();
            RoomInfo room = rooms.get(preferredRoom);
            
            if (room != null && room.getAvailableSpots() >= requiredSpots) {
                return allocateRoom(room, booking.getStudentNames(), response);
            }
        }
        
        // Find room on preferred floor
        RoomInfo availableRoom = findAvailableRoom(booking.getPreferredFloor(), requiredSpots);
        
        if (availableRoom != null) {
            response.setMessage("Preferred room unavailable. Allocated alternative room on same floor.");
            return allocateRoom(availableRoom, booking.getStudentNames(), response);
        }
        
        // Find room on any floor
        availableRoom = findAvailableRoomAnyFloor(requiredSpots);
        
        if (availableRoom != null) {
            response.setMessage("Preferred floor full. Allocated room on floor " + availableRoom.getFloor());
            return allocateRoom(availableRoom, booking.getStudentNames(), response);
        }
        
        response.setSuccess(false);
        response.setMessage("No rooms available with " + requiredSpots + " spots. Please contact administration.");
        return response;
    }
    
    private BookingResponse allocateRoom(RoomInfo room, List<String> students, BookingResponse response) {
        for (String student : students) {
            room.addOccupant(student);
        }
        
        response.setSuccess(true);
        response.setAllocatedRoomNumber(room.getRoomNumber());
        response.setAllocatedFloor(room.getFloor());
        response.setWardenName(room.getWardenName());
        response.setWardenContact(room.getWardenContact());
        
        if (response.getMessage() == null) {
            response.setMessage("Room booked successfully!");
        }
        
        return response;
    }
    
    private RoomInfo findAvailableRoom(int floor, int requiredSpots) {
        return rooms.values().stream()
                .filter(r -> r.getFloor() == floor && r.getAvailableSpots() >= requiredSpots)
                .findFirst()
                .orElse(null);
    }
    
    private RoomInfo findAvailableRoomAnyFloor(int requiredSpots) {
        return rooms.values().stream()
                .filter(r -> r.getAvailableSpots() >= requiredSpots)
                .findFirst()
                .orElse(null);
    }
    
    public List<String> getAvailableRooms(int floor) {
        return rooms.values().stream()
                .filter(r -> r.getFloor() == floor && r.isAvailable())
                .map(r -> r.getRoomNumber() + " (" + r.getAvailableSpots() + " spots)")
                .collect(Collectors.toList());
    }
    
    public List<Integer> getAvailableFloors() {
        return rooms.values().stream()
                .filter(RoomInfo::isAvailable)
                .map(RoomInfo::getFloor)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    // Inner class for warden info
    private static class WardenInfo {
        private String name;
        private String contact;
        
        public WardenInfo(String name, String contact) {
            this.name = name;
            this.contact = contact;
        }
        
        public String getName() {
            return name;
        }
        
        public String getContact() {
            return contact;
        }
    }
}