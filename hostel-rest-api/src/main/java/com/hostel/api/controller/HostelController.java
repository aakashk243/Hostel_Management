package com.hostel.api.controller;

import com.hostel.api.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000"})
public class HostelController {

    @Autowired
    private HostelDataService dataService;

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "Hostel Management REST API");
        response.put("dataStore", "In-Memory");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/rooms/{roomNumber}")
    public ResponseEntity<?> searchRoom(@PathVariable String roomNumber) {
        try {
            RoomInfo room = dataService.searchRoom(roomNumber);
            return ResponseEntity.ok(room);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            error.put("roomNumber", roomNumber);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }
    }

    @PostMapping("/bookings")
    public ResponseEntity<?> bookRoom(@RequestBody BookingRequest request) {
        try {
            if (request.getStudentNames() == null || request.getStudentNames().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("error", "Student names are required");
                return ResponseEntity.badRequest().body(error);
            }

            BookingResponse response = dataService.bookRoom(request);
            
            if (response.isSuccess()) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/floors/{floorNumber}/rooms")
    public ResponseEntity<?> getAvailableRooms(@PathVariable int floorNumber) {
        try {
            List<String> rooms = dataService.getAvailableRooms(floorNumber);
            
            Map<String, Object> response = new HashMap<>();
            response.put("floor", floorNumber);
            response.put("availableRooms", rooms);
            response.put("count", rooms.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    @GetMapping("/floors/available")
    public ResponseEntity<?> getAvailableFloors() {
        try {
            List<Integer> floors = dataService.getAvailableFloors();
            
            Map<String, Object> response = new HashMap<>();
            response.put("availableFloors", floors);
            response.put("count", floors.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}