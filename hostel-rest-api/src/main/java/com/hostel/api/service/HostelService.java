package com.hostel.api.service;

import java.rmi.Remote;
import java.rmi.RemoteException;
import java.util.List;

/**
 * Remote Interface for Hostel Room Management System
 * Defines methods accessible remotely via RMI
 */
public interface HostelService extends Remote {
    
    /**
     * Search for room details by room number
     * @param roomNumber The room number to search
     * @return RoomInfo object containing room details
     * @throws RemoteException if remote communication fails
     */
    RoomInfo searchRoom(String roomNumber) throws RemoteException;
    
    /**
     * Book a hostel room
     * @param booking BookingRequest containing booking details
     * @return BookingResponse with booking status and details
     * @throws RemoteException if remote communication fails
     */
    BookingResponse bookRoom(BookingRequest booking) throws RemoteException;
    
    /**
     * Get all available rooms on a specific floor
     * @param floor The floor number
     * @return List of available room numbers
     * @throws RemoteException if remote communication fails
     */
    List<String> getAvailableRooms(int floor) throws RemoteException;
    
    /**
     * Get all floors with available rooms
     * @return List of floor numbers
     * @throws RemoteException if remote communication fails
     */
    List<Integer> getAvailableFloors() throws RemoteException;
}