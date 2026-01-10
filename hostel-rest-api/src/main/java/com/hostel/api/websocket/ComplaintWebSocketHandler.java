// File: src/main/java/com/hostel/api/websocket/ComplaintWebSocketHandler.java
package com.hostel.api.websocket;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.*;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ComplaintWebSocketHandler extends TextWebSocketHandler {
    
    private static final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private static final List<JsonObject> history = new CopyOnWriteArrayList<>();
    private final Gson gson = new Gson();
    private static final String FILE_PATH = "complaints.txt";
    
    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        sessions.add(session);
        System.out.println("✅ New WebSocket connection: " + session.getId());
        
        // Load history from file
        loadHistory();
        
        // Send welcome message
        JsonObject welcome = new JsonObject();
        welcome.addProperty("type", "WELCOME");
        welcome.addProperty("message", "Connected to Complaint Server via Spring Boot");
        welcome.addProperty("status", "ready");
        session.sendMessage(new TextMessage(gson.toJson(welcome)));
    }
    
    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String payload = message.getPayload();
        System.out.println("📨 Received from " + session.getId() + ": " + payload);
        
        try {
            JsonObject json = gson.fromJson(payload, JsonObject.class);
            
            if (!json.has("type")) {
                sendError(session, "Missing 'type' field");
                return;
            }
            
            String type = json.get("type").getAsString();
            
            switch (type) {
                case "IDENTIFY":
                    handleIdentify(session, json);
                    break;
                case "SUBMIT_COMPLAINT":
                    handleSubmitComplaint(session, json);
                    break;
                case "RESOLVE_COMPLAINT":
                    handleResolveComplaint(session, json);
                    break;
                case "GET_COMPLAINTS":
                    sendAllComplaints(session);
                    break;
                default:
                    sendError(session, "Unknown message type: " + type);
            }
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            e.printStackTrace();
            sendError(session, "Invalid message format");
        }
    }
    
    private void handleIdentify(WebSocketSession session, JsonObject json) throws IOException {
        if (json.has("role") && json.get("role").getAsString().equals("WARDEN")) {
            System.out.println("Warden identified: " + session.getId());
            sendAllComplaints(session);
        } else {
            System.out.println("Student identified: " + session.getId());
            JsonObject ack = new JsonObject();
            ack.addProperty("type", "IDENTIFY_ACK");
            ack.addProperty("message", "Identified as " + json.get("role"));
            session.sendMessage(new TextMessage(gson.toJson(ack)));
        }
    }
    
    private void handleSubmitComplaint(WebSocketSession session, JsonObject complaint) throws IOException {
        // Ensure ID exists
        if (!complaint.has("id")) {
            complaint.addProperty("id", "COMP_" + System.currentTimeMillis() + "_" + session.getId());
        }
        
        // Add missing fields
        if (!complaint.has("status")) {
            complaint.addProperty("status", "Pending");
        }
        
        if (!complaint.has("timestamp")) {
            complaint.addProperty("timestamp", new Date().toString());
        }
        
        history.add(complaint);
        rewriteFile();
        
        // Send acknowledgement
        JsonObject ack = new JsonObject();
        ack.addProperty("type", "ACKNOWLEDGEMENT");
        ack.addProperty("status", "Received");
        ack.addProperty("msg", "Complaint registered!");
        ack.addProperty("id", complaint.get("id").getAsString());
        session.sendMessage(new TextMessage(gson.toJson(ack)));
        
        // Broadcast to all connected clients (including wardens)
        broadcast(complaint, "COMPLAINT_UPDATE");
    }
    
    private void handleResolveComplaint(WebSocketSession session, JsonObject json) throws IOException {
        if (!json.has("id")) {
            sendError(session, "Missing complaint ID");
            return;
        }
        
        String targetId = json.get("id").getAsString();
        System.out.println("Attempting to resolve complaint: " + targetId);
        
        boolean found = false;
        for (JsonObject complaint : history) {
            if (complaint.get("id").getAsString().equals(targetId)) {
                complaint.addProperty("status", "Resolved");
                complaint.addProperty("resolvedAt", new Date().toString());
                
                if (json.has("resolvedBy")) {
                    complaint.addProperty("resolvedBy", json.get("resolvedBy").getAsString());
                }
                
                broadcast(complaint, "COMPLAINT_RESOLVED");
                found = true;
                System.out.println("✅ Complaint resolved: " + targetId);
                break;
            }
        }
        
        if (found) {
            rewriteFile();
        } else {
            sendError(session, "Complaint not found: " + targetId);
        }
    }
    
    private void sendAllComplaints(WebSocketSession session) throws IOException {
        System.out.println("Sending " + history.size() + " complaints to " + session.getId());
        
        for (JsonObject complaint : history) {
            session.sendMessage(new TextMessage(gson.toJson(complaint)));
        }
        
        // Send completion message
        JsonObject complete = new JsonObject();
        complete.addProperty("type", "HISTORY_COMPLETE");
        complete.addProperty("count", history.size());
        session.sendMessage(new TextMessage(gson.toJson(complete)));
    }
    
    private void broadcast(JsonObject msg, String messageType) {
        msg.addProperty("broadcastType", messageType);
        String message = gson.toJson(msg);
        
        int sentCount = 0;
        for (WebSocketSession session : sessions) {
            if (session.isOpen()) {
                try {
                    session.sendMessage(new TextMessage(message));
                    sentCount++;
                } catch (IOException e) {
                    System.err.println("Error broadcasting to session " + session.getId() + ": " + e.getMessage());
                }
            }
        }
        System.out.println("📤 Broadcasted to " + sentCount + " clients");
    }
    
    private void sendError(WebSocketSession session, String errorMessage) throws IOException {
        JsonObject error = new JsonObject();
        error.addProperty("type", "ERROR");
        error.addProperty("message", errorMessage);
        session.sendMessage(new TextMessage(gson.toJson(error)));
    }
    
    private void rewriteFile() {
        try (FileWriter fw = new FileWriter(FILE_PATH, false)) {
            for (JsonObject c : history) {
                fw.write(gson.toJson(c) + "\n");
            }
            System.out.println("💾 Saved " + history.size() + " complaints to file");
        } catch (IOException e) {
            System.err.println("Error saving file: " + e.getMessage());
        }
    }
    
    private void loadHistory() {
        if (history.isEmpty()) { // Load only once
            File file = new File(FILE_PATH);
            if (file.exists()) {
                try {
                    List<String> lines = Files.readAllLines(Paths.get(FILE_PATH));
                    for (String line : lines) {
                        if (!line.trim().isEmpty()) {
                            history.add(gson.fromJson(line, JsonObject.class));
                        }
                    }
                    System.out.println("📂 Loaded " + history.size() + " complaints from file");
                } catch (IOException e) {
                    System.err.println("Error loading file: " + e.getMessage());
                }
            } else {
                System.out.println("No existing complaints file. Starting fresh.");
            }
        }
    }
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("Connection closed: " + session.getId() + " - " + status.getReason());
    }
    
    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.err.println("Transport error for session " + session.getId() + ": " + exception.getMessage());
    }
}