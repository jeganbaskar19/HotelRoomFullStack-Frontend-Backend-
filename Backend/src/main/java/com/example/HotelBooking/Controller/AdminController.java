package com.example.HotelBooking.Controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.HotelBooking.Entity.Admin;
import com.example.HotelBooking.Entity.Booking;
import com.example.HotelBooking.Entity.Review;
import com.example.HotelBooking.Entity.Room;
import com.example.HotelBooking.Entity.User;
import com.example.HotelBooking.Services.AdminService;

@RestController
@RequestMapping("/admin")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminController {

    @Autowired private AdminService adminService;

    // ✅ Admin Login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        Admin admin = adminService.login(email, password);
        if (admin != null) {
            return ResponseEntity.ok(admin); // ✅ Returns JSON
        } else {
            return ResponseEntity.status(401).body("Invalid email or password");
        }
    }


    // ✅ Admin Profile Update
    @PutMapping("/update")
    public ResponseEntity<String> updateAdmin(
        @RequestParam int id,
        @RequestParam String name,
        @RequestParam String email,
        @RequestParam String number,
        @RequestParam String password,
        @RequestParam(required = false) MultipartFile image
    ) {
        Admin admin = new Admin();
        admin.setId(id);
        admin.setName(name);
        admin.setEmail(email);
        admin.setNumber(number);
        admin.setPassword(password);
        return ResponseEntity.ok(adminService.updateAdmin(admin, image));
    }

    @GetMapping("/get/{id}")
    public ResponseEntity<Admin> getAdmin(@PathVariable int id) {
        return ResponseEntity.ok(adminService.getAdminById(id));
    }

    // ✅ USER API
    @GetMapping("/users")
    public ResponseEntity<List<User>> getUsers() {
        return ResponseEntity.ok(adminService.getAllUsers());
    }

    @DeleteMapping("/user/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        return ResponseEntity.ok(adminService.deleteUser(id));
    }

    @PutMapping("/user/update")
    public ResponseEntity<String> updateUser(
        @RequestParam int id,
        @RequestParam String name,
        @RequestParam String email,
        @RequestParam String number,
        @RequestParam String password,
        @RequestParam String role,
        @RequestParam(required = false) MultipartFile image
    ) {
        User user = new User();
        user.setId(id);
        user.setName(name);
        user.setEmail(email);
        user.setNumber(number);
        user.setPassword(password);
        user.setRole(role);
        return ResponseEntity.ok(adminService.updateUser(user, image));
    }

    // ✅ ROOM API
    @GetMapping("/rooms")
    public ResponseEntity<List<Room>> getRooms() {
        return ResponseEntity.ok(adminService.getAllRooms());
    }

    @DeleteMapping("/room/delete/{id}")
    public ResponseEntity<String> deleteRoom(@PathVariable int id) {
        return ResponseEntity.ok(adminService.deleteRoom(id));
    }

    @PutMapping("/room/update")
    public ResponseEntity<String> updateRoom(@RequestBody Room room) {
        return ResponseEntity.ok(adminService.updateRoom(room));
    }

    // ✅ BOOKING API
    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getBookings() {
        return ResponseEntity.ok(adminService.getAllBookings());
    }

    @DeleteMapping("/booking/delete/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable int id) {
        return ResponseEntity.ok(adminService.deleteBooking(id));
    }

    @PutMapping("/booking/update")
    public ResponseEntity<String> updateBooking(@RequestBody Booking booking) {
        return ResponseEntity.ok(adminService.updateBooking(booking));
    }

    // ✅ REVIEW API
    @GetMapping("/reviews")
    public ResponseEntity<List<Review>> getReviews() {
        return ResponseEntity.ok(adminService.getAllReviews());
    }

    @DeleteMapping("/review/delete/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable int id) {
        return ResponseEntity.ok(adminService.deleteReview(id));
    }

    @PutMapping("/review/update")
    public ResponseEntity<String> updateReview(@RequestBody Review review) {
        return ResponseEntity.ok(adminService.updateReview(review));
    }
    @GetMapping("/email/{email}")
    public ResponseEntity<Admin> getAdminByEmail(@PathVariable String email) {
        return ResponseEntity.ok(adminService.getAdminByEmail(email));
    }

}
