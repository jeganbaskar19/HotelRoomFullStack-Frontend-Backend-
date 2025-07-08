package com.example.HotelBooking.Controller;

import com.example.HotelBooking.Entity.Booking;
import com.example.HotelBooking.Services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/booking")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // ✅ Book a room (check-in/checkout auto-generated)
    @PostMapping("/book")
    public ResponseEntity<String> bookRoom(@RequestBody Booking booking) {
        String msg = bookingService.bookRoomWithGeneratedDates(booking.getUserid(), booking.getRoomid());
        return ResponseEntity.ok(msg);
    }

    // ✅ Cancel booking by ID
    @PutMapping("/cancel/{id}")
    public ResponseEntity<String> cancelBooking(@PathVariable int id) {
        String msg = bookingService.cancelBooking(id);
        return ResponseEntity.ok(msg);
    }

    // ✅ Get all bookings
    @GetMapping("/all")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    // ✅ Get all bookings by User ID
    @GetMapping("/user/{userid}")
    public ResponseEntity<List<Booking>> getBookingsByUser(@PathVariable int userid) {
        return ResponseEntity.ok(bookingService.getBookingsByUser(userid));
    }

    // ✅ Get a single booking by Booking ID
    @GetMapping("/{id}")
    public ResponseEntity<Booking> getBookingById(@PathVariable int id) {
        Booking booking = bookingService.getBookingById(id);
        return (booking != null) ? ResponseEntity.ok(booking) : ResponseEntity.notFound().build();
    }
}
																														