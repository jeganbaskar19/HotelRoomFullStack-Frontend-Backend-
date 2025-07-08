package com.example.HotelBooking.Services;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HotelBooking.Entity.Booking;
import com.example.HotelBooking.Entity.Room;
import com.example.HotelBooking.Repository.BookingRepository;
import com.example.HotelBooking.Repository.RoomRepository;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepo;

    @Autowired
    private RoomRepository roomRepo;

    // ✅ Book Room
    public String bookRoomWithGeneratedDates(int userid, int roomid) {
        Room room = roomRepo.findById(roomid).orElse(null);
        if(userid<0) return "Login to Book Room";
        if (room == null) return "Room not found!";
        if (!room.getIsAvailable()) return "Room is already booked!";

        LocalDate checkin = LocalDate.now();
        LocalDate checkout = checkin.plusDays(1);

        Booking booking = new Booking();
        booking.setUserid(userid);
        booking.setRoomid(roomid);
        booking.setCheckin(checkin);
        booking.setCheckout(checkout);
        booking.setStatus("Booked");

        bookingRepo.save(booking);

        room.setIsAvailable(false);
        room.setCheckin(checkin);
        room.setCheckout(checkout);
        room.setBookedByUserid(userid);
        roomRepo.save(room);

        return "✅ Room booked successfully.";
    }

    // ✅ Cancel Booking
    public String cancelBooking(int bookingId) {
        Booking booking = bookingRepo.findById(bookingId).orElse(null);
        if (booking == null) return "Booking not found.";

        Room room = roomRepo.findById(booking.getRoomid()).orElse(null);
        if (room != null) {
            room.setIsAvailable(true);
            room.setCheckin(null);
            room.setCheckout(null);
            room.setBookedByUserid(0);
            roomRepo.save(room);
        }

        booking.setStatus("Cancelled");
        bookingRepo.save(booking);

        return "Booking cancelled.";
    }

    // ✅ Get Bookings by User
    public List<Booking> getBookingsByUser(int userid) {
        return bookingRepo.findByUserid(userid);
    }

    // ✅ Get Booking by ID
    public Booking getBookingById(int id) {
        return bookingRepo.findById(id).orElse(null);
    }

    // ✅ Get All Bookings
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }
}
