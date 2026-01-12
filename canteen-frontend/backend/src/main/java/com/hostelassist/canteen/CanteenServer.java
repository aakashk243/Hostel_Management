package com.hostelassist.canteen;

import com.hostelassist.canteen.models.*;
import com.hostelassist.canteen.storage.InMemoryStorage;
import com.google.gson.Gson;
import com.sun.net.httpserver.*;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Canteen Service Backend Server
 * This is a RESTful API server using Java's built-in HTTP server
 * Demonstrates distributed systems concepts with client-server architecture
 */
public class CanteenServer {
    private static final int PORT = 8080;
    private static final Gson gson = new Gson();
    private static final InMemoryStorage storage = new InMemoryStorage();

    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        
        // CORS handler for all routes
        server.createContext("/", new CORSHandler());
        
        // Menu endpoints
        server.createContext("/api/menu", new MenuHandler());
        server.createContext("/api/menu/add", new AddMenuItemHandler());
        server.createContext("/api/menu/remove", new RemoveMenuItemHandler());
        server.createContext("/api/menu/update", new UpdateMenuItemHandler());
        
        // Order endpoints
        server.createContext("/api/orders", new OrdersHandler());
        server.createContext("/api/orders/place", new PlaceOrderHandler());
        server.createContext("/api/orders/update", new UpdateOrderHandler());
        server.createContext("/api/orders/student", new StudentOrdersHandler());
        
        server.setExecutor(null);
        server.start();
        
        System.out.println("====================================");
        System.out.println("Canteen Service Server Started");
        System.out.println("Port: " + PORT);
        System.out.println("API Base URL: http://localhost:" + PORT);
        System.out.println("====================================");
        System.out.println("\nIn-Memory Storage Justification:");
        System.out.println("- Lab environment focused on distributed communication");
        System.out.println("- Data is transient (session-based canteen orders)");
        System.out.println("- Simplifies client-server architecture demonstration");
        System.out.println("- Fast read/write operations for real-time order updates");
        System.out.println("====================================\n");
    }

    // CORS Handler for Cross-Origin Requests
    static class CORSHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            Headers headers = exchange.getResponseHeaders();
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
            }
        }
    }

    // Get Menu Items
    static class MenuHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                List<MenuItem> menu = storage.getAllMenuItems();
                sendJsonResponse(exchange, 200, menu);
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Add Menu Item (Admin)
    static class AddMenuItemHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                MenuItem newItem = gson.fromJson(body, MenuItem.class);
                
                if (newItem.getName() == null || newItem.getName().isEmpty()) {
                    sendJsonResponse(exchange, 400, Map.of("error", "Item name is required"));
                    return;
                }
                
                newItem.setId(System.currentTimeMillis());
                storage.addMenuItem(newItem);
                sendJsonResponse(exchange, 201, newItem);
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Remove Menu Item (Admin)
    static class RemoveMenuItemHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("DELETE".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                if (query == null || !query.startsWith("id=")) {
                    sendJsonResponse(exchange, 400, Map.of("error", "Item ID is required"));
                    return;
                }
                
                long id = Long.parseLong(query.substring(3));
                boolean removed = storage.removeMenuItem(id);
                
                if (removed) {
                    sendJsonResponse(exchange, 200, Map.of("message", "Item removed successfully"));
                } else {
                    sendJsonResponse(exchange, 404, Map.of("error", "Item not found"));
                }
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Update Menu Item Price (Admin)
    static class UpdateMenuItemHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("PUT".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                MenuItem updatedItem = gson.fromJson(body, MenuItem.class);
                
                boolean updated = storage.updateMenuItem(updatedItem.getId(), updatedItem.getPrice());
                
                if (updated) {
                    sendJsonResponse(exchange, 200, Map.of("message", "Item updated successfully"));
                } else {
                    sendJsonResponse(exchange, 404, Map.of("error", "Item not found"));
                }
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Get All Orders (Admin)
    static class OrdersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                List<Order> orders = storage.getAllOrders();
                sendJsonResponse(exchange, 200, orders);
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Place Order (Student)
    static class PlaceOrderHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("POST".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Order newOrder = gson.fromJson(body, Order.class);
                
                if (newOrder.getItems() == null || newOrder.getItems().isEmpty()) {
                    sendJsonResponse(exchange, 400, Map.of("error", "Order must contain items"));
                    return;
                }
                
                newOrder.setId(System.currentTimeMillis());
                newOrder.setStatus("Preparing");
                newOrder.setTimestamp(new Date().toString());
                
                storage.addOrder(newOrder);
                sendJsonResponse(exchange, 201, newOrder);
                
                // Simulate order preparation (5 seconds) then mark as ready
                new Thread(() -> {
                    try {
                        Thread.sleep(5000);
                        storage.updateOrderStatus(newOrder.getId(), "Collect Now");
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }).start();
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Update Order Status (Admin)
    static class UpdateOrderHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("PUT".equals(exchange.getRequestMethod())) {
                String body = new String(exchange.getRequestBody().readAllBytes(), StandardCharsets.UTF_8);
                Map<String, Object> data = gson.fromJson(body, Map.class);
                
                long orderId = ((Double) data.get("id")).longValue();
                String status = (String) data.get("status");
                
                boolean updated = storage.updateOrderStatus(orderId, status);
                
                if (updated) {
                    sendJsonResponse(exchange, 200, Map.of("message", "Order status updated"));
                } else {
                    sendJsonResponse(exchange, 404, Map.of("error", "Order not found"));
                }
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Get Student Orders
    static class StudentOrdersHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            setCORSHeaders(exchange);
            
            if ("OPTIONS".equals(exchange.getRequestMethod())) {
                exchange.sendResponseHeaders(204, -1);
                return;
            }
            
            if ("GET".equals(exchange.getRequestMethod())) {
                String query = exchange.getRequestURI().getQuery();
                if (query == null || !query.startsWith("studentId=")) {
                    sendJsonResponse(exchange, 400, Map.of("error", "Student ID is required"));
                    return;
                }
                
                String studentId = query.substring(10);
                List<Order> orders = storage.getOrdersByStudent(studentId);
                sendJsonResponse(exchange, 200, orders);
            } else {
                sendJsonResponse(exchange, 405, Map.of("error", "Method not allowed"));
            }
        }
    }

    // Helper Methods
    private static void setCORSHeaders(HttpExchange exchange) {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendJsonResponse(HttpExchange exchange, int statusCode, Object data) throws IOException {
        String jsonResponse = gson.toJson(data);
        byte[] responseBytes = jsonResponse.getBytes(StandardCharsets.UTF_8);
        
        exchange.getResponseHeaders().add("Content-Type", "application/json");
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        
        OutputStream os = exchange.getResponseBody();
        os.write(responseBytes);
        os.close();
    }
}