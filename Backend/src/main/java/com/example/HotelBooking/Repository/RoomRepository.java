package com.example.HotelBooking.Repository;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.HotelBooking.Entity.Room;

public interface RoomRepository extends JpaRepository<Room, Integer> {

    // 🔍 Get all available or unavailable rooms
    List<Room> findByIsAvailable(Boolean isAvailable);

    // 🔍 Get rooms filtered by type (e.g., Deluxe, Suite)
    List<Room> findByRoomType(String roomType);
}
