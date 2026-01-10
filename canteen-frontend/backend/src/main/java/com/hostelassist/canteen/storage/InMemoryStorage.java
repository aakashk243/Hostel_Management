package com.hostelassist.canteen.storage;

import com.hostelassist.canteen.models.*;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

public class InMemoryStorage {
    
    private final Map<Long, MenuItem> menuItems = new ConcurrentHashMap<>();
    private final Map<Long, Order> orders = new ConcurrentHashMap<>();
    
    public InMemoryStorage() {
        initializeDefaultMenu();
    }
    
    private void initializeDefaultMenu() {
        addMenuItem(new MenuItem(1, "Veg Biryani", 80));
        addMenuItem(new MenuItem(2, "Paneer Butter Masala", 120));
        addMenuItem(new MenuItem(3, "Masala Dosa", 60));
        addMenuItem(new MenuItem(4, "Chole Bhature", 70));
        addMenuItem(new MenuItem(5, "Dal Makhani", 90));
    }
    
    public List<MenuItem> getAllMenuItems() {
        return new ArrayList<>(menuItems.values());
    }
    
    public void addMenuItem(MenuItem item) {
        menuItems.put(item.getId(), item);
        System.out.println("Added menu item: " + item);
    }
    
    public boolean removeMenuItem(long id) {
        MenuItem removed = menuItems.remove(id);
        if (removed != null) {
            System.out.println("Removed menu item: " + removed);
            return true;
        }
        return false;
    }
    
    public boolean updateMenuItem(long id, double newPrice) {
        MenuItem item = menuItems.get(id);
        if (item != null) {
            item.setPrice(newPrice);
            System.out.println("Updated menu item price: " + item);
            return true;
        }
        return false;
    }
    
    public MenuItem getMenuItem(long id) {
        return menuItems.get(id);
    }
    
    public List<Order> getAllOrders() {
        return new ArrayList<>(orders.values());
    }
    
    public void addOrder(Order order) {
        orders.put(order.getId(), order);
        System.out.println("New order placed: " + order);
    }
    
    public Order getOrder(long id) {
        return orders.get(id);
    }
    
    public List<Order> getOrdersByStudent(String studentId) {
        return orders.values().stream()
                .filter(order -> studentId.equals(order.getStudentId()))
                .collect(Collectors.toList());
    }
    
    public boolean updateOrderStatus(long id, String newStatus) {
        Order order = orders.get(id);
        if (order != null) {
            order.setStatus(newStatus);
            System.out.println("Order status updated: ID=" + id + ", Status=" + newStatus);
            return true;
        }
        return false;
    }
    
    public boolean deleteOrder(long id) {
        Order removed = orders.remove(id);
        if (removed != null) {
            System.out.println("Deleted order: " + removed);
            return true;
        }
        return false;
    }
}