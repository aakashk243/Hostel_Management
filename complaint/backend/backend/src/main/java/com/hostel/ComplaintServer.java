package com.hostel;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.java_websocket.WebSocket;
import org.java_websocket.handshake.ClientHandshake;
import org.java_websocket.server.WebSocketServer;

import com.google.gson.Gson;
import com.google.gson.JsonObject;

public class ComplaintServer extends WebSocketServer {

    private static Set<WebSocket> clients = Collections.synchronizedSet(new HashSet<>());
    private static List<JsonObject> history = new ArrayList<>();
    private Gson gson = new Gson();
    private static final String FILE_PATH = "complaints.txt";

    public ComplaintServer(int port) {
        super(new InetSocketAddress(port));
        setReuseAddr(true);
        setConnectionLostTimeout(30);
    }

    @Override
    public void onStart() {
        System.out.println("Server started on port " + getPort());
        System.out.println("Waiting for WebSocket connections at: ws://localhost:" + getPort());
        loadHistory();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        clients.add(conn);
        System.out.println("✅ New WebSocket connection from: " + conn.getRemoteSocketAddress());
        
        // CRITICAL FIX: Send immediate response to complete handshake
        JsonObject welcome = new JsonObject();
        welcome.addProperty("type", "WELCOME");
        welcome.addProperty("message", "Connected to Complaint Server");
        welcome.addProperty("status", "ready");
        conn.send(gson.toJson(welcome));
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        clients.remove(conn);
        System.out.println("Connection closed: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        System.out.println("📨 Received: " + message);
        
        try {
            JsonObject json = gson.fromJson(message, JsonObject.class);
            String type = json.get("type").getAsString();

            if (type.equals("IDENTIFY") && json.get("role").getAsString().equals("WARDEN")) {
                System.out.println("Warden identified, sending " + history.size() + " complaints");
                for (JsonObject oldComplaint : history) {
                    conn.send(gson.toJson(oldComplaint));
                }
            } 
            else if (type.equals("SUBMIT_COMPLAINT")) {
                // Ensure ID exists
                if (!json.has("id")) {
                    json.addProperty("id", "COMP_" + System.currentTimeMillis());
                }
                json.addProperty("status", "Pending");
                
                history.add(json);
                rewriteFile();

                JsonObject ack = new JsonObject();
                ack.addProperty("type", "ACKNOWLEDGEMENT");
                ack.addProperty("status", "Received");
                ack.addProperty("msg", "Complaint registered!");
                ack.addProperty("id", json.get("id").getAsString());
                conn.send(gson.toJson(ack));

                broadcast(json);
            }
            else if (type.equals("RESOLVE_COMPLAINT")) {
                String targetId = json.get("id").getAsString();
                System.out.println("Attempting to resolve complaint: " + targetId);
                
                boolean found = false;
                for (JsonObject c : history) {
                    if (c.get("id").getAsString().equals(targetId)) {
                        c.addProperty("status", "Resolved");
                        broadcast(c);
                        found = true;
                        System.out.println("✅ Complaint resolved: " + targetId);
                        break;
                    }
                }
                
                if (found) {
                    rewriteFile();
                } else {
                    JsonObject error = new JsonObject();
                    error.addProperty("type", "ERROR");
                    error.addProperty("message", "Complaint not found: " + targetId);
                    conn.send(gson.toJson(error));
                }
            }
        } catch (Exception e) {
            System.err.println("Error processing message: " + e.getMessage());
            
            JsonObject error = new JsonObject();
            error.addProperty("type", "ERROR");
            error.addProperty("message", "Invalid message format");
            conn.send(gson.toJson(error));
        }
    }

    private void broadcast(JsonObject msg) {
        String message = gson.toJson(msg);
        int sentCount = 0;
        for (WebSocket client : clients) {
            if (client.isOpen()) {
                client.send(message);
                sentCount++;
            }
        }
        System.out.println("📤 Broadcasted to " + sentCount + " clients");
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

    @Override
    public void onError(WebSocket conn, Exception ex) { 
        if (conn != null) {
            System.err.println("Error for connection " + conn.getRemoteSocketAddress() + ": " + ex.getMessage());
        } else {
            System.err.println("Server error: " + ex.getMessage());
        }
    }

    public static void main(String[] args) {
        int port = 8080;
        ComplaintServer server = new ComplaintServer(port);
        
        // CRITICAL: Set connection timeout
        server.setConnectionLostTimeout(0);
        
        server.start();
        System.out.println("=======================================");
        System.out.println("Complaint Server is RUNNING");
        System.out.println("WebSocket URL: ws://localhost:" + port);
        System.out.println("=======================================");
        
        // Keep server alive
        try {
            Thread.sleep(Long.MAX_VALUE);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}