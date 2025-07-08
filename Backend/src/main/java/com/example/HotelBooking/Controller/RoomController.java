package com.example.HotelBooking.Controller;

import com.example.HotelBooking.Entity.Room;
import com.example.HotelBooking.Services.RoomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/room")
@CrossOrigin(origins = "http://localhost:5173")
public class RoomController {

    @Autowired
    private RoomService roomService;

    // ➕ Add new room
    @PostMapping("/add")
    public ResponseEntity<String> addRoom(
        @RequestParam String roomNo,
        @RequestParam String roomType,
        @RequestParam Double price,
        @RequestParam int capacity,
        @RequestParam(required = false) MultipartFile image
    ) {
        Room room = new Room();
        room.setRoomNo(roomNo);
        room.setRoomType(roomType);
        room.setPrice(price);
        room.setCapacity(capacity);
        room.setIsAvailable(true);
        room.setBookedByUserid(0);
        room.setCheckin(null);
        room.setCheckout(null);

        String msg = roomService.addRoom(room, image);
        return ResponseEntity.ok(msg);
    }

    // ✏️ Update existing room
    @PutMapping("/update")
    public ResponseEntity<String> updateRoom(
        @RequestParam int roomid,
        @RequestParam String roomNo,
        @RequestParam String roomType,
        @RequestParam Double price,
        @RequestParam int capacity,
        @RequestParam Boolean isAvailable,
        @RequestParam(required = false) MultipartFile image
    ) {
        Room room = new Room();
        room.setRoomid(roomid);
        room.setRoomNo(roomNo);
        room.setRoomType(roomType);
        room.setPrice(price);
        room.setCapacity(capacity);
        room.setIsAvailable(isAvailable);
        room.setBookedByUserid(0); // Preserved in service
        room.setCheckin(null);     // Preserved in service
        room.setCheckout(null);    // Preserved in service

        String msg = roomService.updateRoom(room, image);
        return ResponseEntity.ok(msg);
    }

    // ❌ Delete room by ID
    @DeleteMapping("/delete/{roomid}")
    public ResponseEntity<String> deleteRoom(@PathVariable int roomid) {
        String msg = roomService.deleteRoom(roomid);
        return ResponseEntity.ok(msg);
    }

    // 📋 Get all rooms
    @GetMapping("/all")
    public ResponseEntity<List<Room>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    // ✅ Get available rooms only
    @GetMapping("/available")
    public ResponseEntity<List<Room>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    // 🔍 Get room by ID
    @GetMapping("/get/{roomid}")
    public ResponseEntity<?> getRoom(@PathVariable int roomid) {
        Room room = roomService.getRoomById(roomid);
        if (room == null) {
            return ResponseEntity.status(404).body("Room not found.");
        }
        return ResponseEntity.ok(room);
    }
}
