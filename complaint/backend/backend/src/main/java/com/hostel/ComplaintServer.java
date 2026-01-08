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
    }

    @Override
    public void onStart() {
        System.out.println("Server started on port " + getPort());
        loadHistory();
    }

    @Override
    public void onOpen(WebSocket conn, ClientHandshake handshake) {
        clients.add(conn); // Track all connections
        System.out.println("New connection: " + conn.getRemoteSocketAddress());
    }

    @Override
    public void onClose(WebSocket conn, int code, String reason, boolean remote) {
        clients.remove(conn);
    }

    @Override
    public void onMessage(WebSocket conn, String message) {
        JsonObject json = gson.fromJson(message, JsonObject.class);
        String type = json.get("type").getAsString();

        // 1. WARDEN LOGIN
        if (type.equals("IDENTIFY") && json.get("role").getAsString().equals("WARDEN")) {
            // Send full history to new Warden
            for (JsonObject oldComplaint : history) {
                conn.send(gson.toJson(oldComplaint));
            }
        } 
        
        // 2. NEW COMPLAINT
        else if (type.equals("SUBMIT_COMPLAINT")) {
            // Add default status
            json.addProperty("status", "Pending");
            
            history.add(json);
            rewriteFile(); // Save to file

            // Send ACK to student
            JsonObject ack = new JsonObject();
            ack.addProperty("status", "Received");
            ack.addProperty("msg", "Complaint registered!");
            conn.send(gson.toJson(ack));

            // Broadcast to everyone (so Wardens see it immediately)
            broadcast(json);
        }

        // 3. RESOLVE COMPLAINT (NEW FEATURE)
        else if (type.equals("RESOLVE_COMPLAINT")) {
            String targetId = json.get("id").getAsString();
            
            // Find the complaint in memory and update it
            for (JsonObject c : history) {
                if (c.get("id").getAsString().equals(targetId)) {
                    c.addProperty("status", "Resolved");
                    
                    // Broadcast the update to everyone
                    broadcast(c);
                    break;
                }
            }
            rewriteFile(); // Update the file
        }
    }

    private void broadcast(JsonObject msg) {
        for (WebSocket client : clients) {
            if (client.isOpen()) {
                client.send(gson.toJson(msg));
            }
        }
    }

    // Rewrite the entire file (easiest way to handle updates)
    private void rewriteFile() {
        try (FileWriter fw = new FileWriter(FILE_PATH, false)) { // false = overwrite
            for (JsonObject c : history) {
                fw.write(gson.toJson(c) + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
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
                System.out.println("Loaded " + history.size() + " complaints.");
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    public void onError(WebSocket conn, Exception ex) { ex.printStackTrace(); }

    public static void main(String[] args) {
        new ComplaintServer(8080).start();
        System.out.println("Server listening on port 8080...");
    }
}