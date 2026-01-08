package com.p2p;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "*")
public class PeerNode {
    private static final int P2P_PORT = 8888; // Port for file transfer
    private static final int DISCOVERY_PORT = 8889; // UDP Port
    private static final String SHARED_DIR = "D:/P2P_Systems/backend/shared_files/";
    
    // In-memory data structures
    private static Set<String> activePeers = Collections.newSetFromMap(new ConcurrentHashMap<>());
    private static Map<String, List<String>> peerFiles = new ConcurrentHashMap<>();

    public static void main(String[] args) throws IOException {
        Files.createDirectories(Paths.get(SHARED_DIR));
        SpringApplication.run(PeerNode.class, args);
        
        // Start UDP Discovery Thread
        new Thread(PeerNode::listenForPeers).start();
        new Thread(PeerNode::broadcastPresence).start();
        // Start P2P File Server Thread
        new Thread(PeerNode::startFileServer).start();
    }

    // --- P2P Discovery (UDP) ---
    private static void broadcastPresence() {
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true);
            while (true) {
                String message = "ALIVE:" + InetAddress.getLocalHost().getHostAddress();
                DatagramPacket packet = new DatagramPacket(message.getBytes(), message.length(),
                        InetAddress.getByName("255.255.255.255"), DISCOVERY_PORT);
                socket.send(packet);
                Thread.sleep(5000);
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    private static void listenForPeers() {
        try (DatagramSocket socket = new DatagramSocket(DISCOVERY_PORT)) {
            byte[] buffer = new byte[1024];
            while (true) {
                DatagramPacket packet = new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);
                String msg = new String(packet.getData(), 0, packet.getLength());
                if (msg.startsWith("ALIVE:")) {
                    activePeers.add(msg.split(":")[1]);
                }
            }
        } catch (Exception e) { e.printStackTrace(); }
    }

    // --- REST API for Frontend ---
    @GetMapping("/peers")
    public Set<String> getPeers() { return activePeers; }

    @PostMapping("/upload")
    public String uploadFile(@RequestParam("file") MultipartFile file) throws IOException {
        file.transferTo(new File(SHARED_DIR + file.getOriginalFilename()));
        return "File uploaded locally!";
    }

    @GetMapping("/my-files")
    public String[] getLocalFiles() {
        return new File(SHARED_DIR).list();
    }

    // --- P2P File Server (Socket) ---
    private static void startFileServer() {
        try (ServerSocket serverSocket = new ServerSocket(P2P_PORT)) {
            while (true) {
                Socket client = serverSocket.accept();
                new Thread(() -> handleFileRequest(client)).start();
            }
        } catch (IOException e) { e.printStackTrace(); }
    }

    private static void handleFileRequest(Socket socket) {
        try (DataInputStream dis = new DataInputStream(socket.getInputStream());
             OutputStream os = socket.getOutputStream()) {
            String fileName = dis.readUTF();
            File file = new File(SHARED_DIR + fileName);
            if (file.exists()) {
                Files.copy(file.toPath(), os);
            }
        } catch (IOException e) { e.printStackTrace(); }
    }
}