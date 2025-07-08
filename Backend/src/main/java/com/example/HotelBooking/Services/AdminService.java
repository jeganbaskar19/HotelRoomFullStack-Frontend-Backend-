package com.example.HotelBooking.Services;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.HotelBooking.Entity.Admin;
import com.example.HotelBooking.Entity.Booking;
import com.example.HotelBooking.Entity.Room;
import com.example.HotelBooking.Entity.User;
import com.example.HotelBooking.Repository.AdminRepository;
import com.example.HotelBooking.Repository.BookingRepository;
import com.example.HotelBooking.Repository.ReviewRepository;
import com.example.HotelBooking.Repository.RoomRepository;
import com.example.HotelBooking.Repository.UserRepository;
import com.example.HotelBooking.Entity.Review;


@Service
public class AdminService {

    @Autowired private AdminRepository adminRepo;
    @Autowired private UserRepository userRepo;
    @Autowired private RoomRepository roomRepo;
    @Autowired private BookingRepository bookingRepo;
    @Autowired private ReviewRepository reviewRepo;

    // ✅ Admin Login
    public Admin login(String email, String password) {
        Optional<Admin> adminOpt = adminRepo.findByEmail(email);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (admin.getPassword().equals(password)) {
                return admin;
            }
        }
        return null;
    }

    // ✅ Update Admin Profile
    public String updateAdmin(Admin updatedAdmin, MultipartFile image) {
        Optional<Admin> existing = adminRepo.findById(updatedAdmin.getId());
        if (existing.isEmpty()) {
            return "Admin not found!";
        }

        try {
            if (image != null && !image.isEmpty()) {
                updatedAdmin.setImageData(image.getBytes());
                updatedAdmin.setImageType(image.getContentType());
            } else {
                updatedAdmin.setImageData(existing.get().getImageData());
                updatedAdmin.setImageType(existing.get().getImageType());
            }
        } catch (IOException e) {
            return "Image update failed!";
        }

        adminRepo.save(updatedAdmin);
        return "Admin updated successfully.";
    }

    public Admin getAdminById(int id) {
        return adminRepo.findById(id).orElse(null);
    }

    public Admin getAdminByEmail(String email) {
        return adminRepo.findByEmail(email).orElse(null);
    }

    // ✅ USER MANAGEMENT
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    public String deleteUser(int id) {
        if (!userRepo.existsById(id)) {
            return "User not found.";
        }
        userRepo.deleteById(id);
        return "User deleted.";
    }

    public String updateUser(User updatedUser, MultipartFile image) {
        Optional<User> existing = userRepo.findById(updatedUser.getId());
        if (existing.isEmpty()) {
            return "User not found!";
        }

        try {
            if (image != null && !image.isEmpty()) {
                updatedUser.setImageData(image.getBytes());
                updatedUser.setImageType(image.getContentType());
            } else {
                updatedUser.setImageData(existing.get().getImageData());
                updatedUser.setImageType(existing.get().getImageType());
            }
        } catch (IOException e) {
            return "Image update failed!";
        }

        userRepo.save(updatedUser);
        return "User updated.";
    }

    // ✅ ROOM MANAGEMENT
    public List<Room> getAllRooms() {
        return roomRepo.findAll();
    }

    public String deleteRoom(int id) {
        if (!roomRepo.existsById(id)) {
            return "Room not found.";
        }
        roomRepo.deleteById(id);
        return "Room deleted.";
    }

    public String updateRoom(Room updatedRoom) {
        Optional<Room> existing = roomRepo.findById(updatedRoom.getRoomid());
        if (existing.isEmpty()) return "Room not found!";

        Room old = existing.get();
        updatedRoom.setImageData(old.getImageData());
        updatedRoom.setImageType(old.getImageType());

        if (updatedRoom.getIsAvailable() && !old.getIsAvailable()) {
            // Free the booking if marked available manually
            List<Booking> bookings = bookingRepo.findByRoomidAndStatus(updatedRoom.getRoomid(), "Booked");
            for (Booking b : bookings) {
                b.setStatus("Cancelled");
                bookingRepo.save(b);
            }
            updatedRoom.setBookedByUserid(0);
            updatedRoom.setCheckin(null);
            updatedRoom.setCheckout(null);
        }

        roomRepo.save(updatedRoom);
        return "Room updated.";
    }

    // ✅ BOOKING MANAGEMENT
    public List<Booking> getAllBookings() {
        return bookingRepo.findAll();
    }

    public String deleteBooking(int id) {
        if (!bookingRepo.existsById(id)) return "Booking not found.";
        bookingRepo.deleteById(id);
        return "Booking deleted.";
    }

    public String updateBooking(Booking booking) {
        bookingRepo.save(booking);
        return "Booking updated.";
    }

    // ✅ REVIEW MANAGEMENT
    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    public String deleteReview(int id) {
        if (!reviewRepo.existsById(id)) return "Review not found.";
        reviewRepo.deleteById(id);
        return "Review deleted.";
    }

    public String updateReview(Review review) {
        reviewRepo.save(review);
        return "Review updated.";
    }
}
