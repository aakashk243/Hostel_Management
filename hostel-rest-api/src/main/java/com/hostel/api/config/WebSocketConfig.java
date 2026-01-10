// File: src/main/java/com/hostel/api/config/WebSocketConfig.java
package com.hostel.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import com.hostel.api.websocket.ComplaintWebSocketHandler;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    
    private final ComplaintWebSocketHandler complaintWebSocketHandler;
    
    // Constructor injection
    public WebSocketConfig(ComplaintWebSocketHandler complaintWebSocketHandler) {
        this.complaintWebSocketHandler = complaintWebSocketHandler;
    }
    
    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(complaintWebSocketHandler, "/complaints-ws")
                .setAllowedOriginPatterns("*");
    }
}