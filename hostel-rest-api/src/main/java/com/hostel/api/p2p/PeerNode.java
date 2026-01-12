package com.hostel.api.p2p;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.*;
import java.net.*;
import java.nio.file.*;
import java.util.*;
import java.util.concurrent.*;

@RestController
@CrossOrigin(origins = "*")
public class PeerNode {

    private static final int P2P_PORT = 8888;
    private static final int DISCOVERY_PORT = 41234;

    // Portable Downloads/P2P folder
    private static final String SHARED_DIR =
            System.getProperty("user.home") + "/Downloads/P2P/";

    private static final Set<String> activePeers =
            ConcurrentHashMap.newKeySet();

    // ---- INIT ----
    @PostConstruct
    public void init() throws IOException {
        Files.createDirectories(Paths.get(SHARED_DIR));

        new Thread(this::listenForPeers).start();
        new Thread(this::broadcastPresence).start();
        new Thread(this::startFileServer).start();
    }

    // ---- UDP DISCOVERY ----
    private void broadcastPresence() {
        try (DatagramSocket socket = new DatagramSocket()) {
            socket.setBroadcast(true);
            while (true) {
                String msg = "ALIVE:" +
                        InetAddress.getLocalHost().getHostAddress();
                DatagramPacket packet = new DatagramPacket(
                        msg.getBytes(),
                        msg.length(),
                        InetAddress.getByName("255.255.255.255"),
                        DISCOVERY_PORT
                );
                socket.send(packet);
                Thread.sleep(5000);
            }
        } catch (Exception ignored) {}
    }

    private void listenForPeers() {
        try (DatagramSocket socket = new DatagramSocket(DISCOVERY_PORT)) {
            byte[] buffer = new byte[1024];
            while (true) {
                DatagramPacket packet =
                        new DatagramPacket(buffer, buffer.length);
                socket.receive(packet);
                String msg = new String(
                        packet.getData(), 0, packet.getLength()
                );
                if (msg.startsWith("ALIVE:")) {
                    activePeers.add(msg.substring(6));
                }
            }
        } catch (Exception ignored) {}
    }

    // ---- REST API ----
    @GetMapping("/peers")
    public Set<String> getPeers() {
        return activePeers;
    }

    @PostMapping("/upload")
    public String upload(@RequestParam("file") MultipartFile file)
            throws IOException {
        file.transferTo(
                new File(SHARED_DIR + file.getOriginalFilename())
        );
        return "File uploaded";
    }

    @GetMapping("/my-files")
    public String[] myFiles() {
        return new File(SHARED_DIR).list();
    }

    // ---- TCP FILE SERVER ----
    private void startFileServer() {
        try (ServerSocket server = new ServerSocket(P2P_PORT)) {
            while (true) {
                Socket client = server.accept();
                new Thread(() -> sendFile(client)).start();
            }
        } catch (IOException ignored) {}
    }

    private void sendFile(Socket socket) {
        try (
                DataInputStream in =
                        new DataInputStream(socket.getInputStream());
                OutputStream out = socket.getOutputStream()
        ) {
            File file = new File(SHARED_DIR + in.readUTF());
            if (file.exists()) {
                Files.copy(file.toPath(), out);
            }
        } catch (IOException ignored) {}
    }
}
