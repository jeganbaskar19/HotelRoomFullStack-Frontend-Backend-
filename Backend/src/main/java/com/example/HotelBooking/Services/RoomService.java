package com.example.HotelBooking.Services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.HotelBooking.Entity.Room;
import com.example.HotelBooking.Repository.RoomRepository;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepo;

    // ✅ Add New Room
    public String addRoom(Room room, MultipartFile image) {
        room.setIsAvailable(true); // default to available

        try {
            if (image != null && !image.isEmpty()) {
                room.setImageData(image.getBytes());
                room.setImageType(image.getContentType());
            }
        } catch (IOException e) {
            return "Failed to process room image!";
        }

        roomRepo.save(room);
        return "Room added successfully.";
    }

    // ✅ Update Room
    public String updateRoom(Room updatedRoom, MultipartFile image) {
        Optional<Room> optional = roomRepo.findById(updatedRoom.getRoomid());
        if (optional.isEmpty()) {
            return "Room not found!";
        }

        Room existingRoom = optional.get();

        try {
            if (image != null && !image.isEmpty()) {
                updatedRoom.setImageData(image.getBytes());
                updatedRoom.setImageType(image.getContentType());
            } else {
                // Preserve previous image
                updatedRoom.setImageData(existingRoom.getImageData());
                updatedRoom.setImageType(existingRoom.getImageType());
            }

            // Preserve checkin/checkout & user if room is already booked
            updatedRoom.setCheckin(existingRoom.getCheckin());
            updatedRoom.setCheckout(existingRoom.getCheckout());
            updatedRoom.setBookedByUserid(existingRoom.getBookedByUserid());

        } catch (IOException e) {
            return "Failed to update room image!";
        }

        roomRepo.save(updatedRoom);
        return "Room updated successfully.";
    }

    // ✅ Delete Room
    public String deleteRoom(int roomid) {
        if (!roomRepo.existsById(roomid)) {
            return "Room ID not found.";
        }
        roomRepo.deleteById(roomid);
        return "Room deleted.";
    }

    // ✅ Get Room By ID
    public Room getRoomById(int roomid) {
        return roomRepo.findById(roomid).orElse(null);
    }

    // ✅ Get All Rooms
    public List<Room> getAllRooms() {
        return roomRepo.findAll();
    }

    // ✅ Get Only Available Rooms
    public List<Room> getAvailableRooms() {
        return roomRepo.findByIsAvailable(true);
    }

    // ✅ Filter Rooms By Type
    public List<Room> getRoomsByType(String type) {
        return roomRepo.findByRoomType(type);
    }
}
