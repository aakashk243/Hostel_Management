package com.hostel.api.service;

import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

@Service
public class RmiClientService {

    private HostelService hostelService;
    private static final String RMI_HOST = "localhost";
    private static final int RMI_PORT = 1099;
    private static final String SERVICE_NAME = "HostelService";

    @PostConstruct
    public void init() {
        // Don't fail startup if RMI connection fails
        try {
            connectToRmiServer();
        } catch (Exception e) {
            System.err.println("⚠ RMI connection failed at startup - will retry on first request");
        }
    }

    private void connectToRmiServer() {
        try {
            System.setProperty("java.rmi.server.useCodebaseOnly", "false");
            
            Registry registry = LocateRegistry.getRegistry(RMI_HOST, RMI_PORT);
            hostelService = (HostelService) registry.lookup(SERVICE_NAME);
            
            System.out.println("✓ Successfully connected to RMI Server at " + RMI_HOST + ":" + RMI_PORT);
        } catch (Exception e) {
            System.err.println("✗ Failed to connect to RMI Server: " + e.getMessage());
            // Don't throw - allow Spring Boot to start
        }
    }

    public HostelService getHostelService() throws Exception {
        if (hostelService == null) {
            connectToRmiServer();
            if (hostelService == null) {
                throw new Exception("RMI Server is not available. Please ensure the server is running.");
            }
        }
        return hostelService;
    }

    public boolean isConnected() {
        return hostelService != null;
    }

    public void reconnect() {
        connectToRmiServer();
    }
}