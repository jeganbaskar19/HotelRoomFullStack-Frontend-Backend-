package com.example.HotelBooking.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.HotelBooking.Entity.Booking;

public interface BookingRepository extends JpaRepository<Booking, Integer> {

    // Get all bookings for a specific user
    List<Booking> findByUserid(int userid);

    // Get bookings by room ID and status (e.g., "Booked")
    List<Booking> findByRoomidAndStatus(int roomid, String status);

    // Check if a specific user already booked a specific room
    List<Booking> findByUseridAndRoomid(int userid, int roomid);
}
