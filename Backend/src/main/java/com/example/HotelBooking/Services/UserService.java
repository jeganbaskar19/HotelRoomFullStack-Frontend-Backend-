package com.example.HotelBooking.Services;

import java.io.IOException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.HotelBooking.Entity.User;
import com.example.HotelBooking.Repository.UserRepository;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    // ✅ Register User
    public String register(User user, MultipartFile image) {
        if (userRepo.findByEmail(user.getEmail()).isPresent()) {
            return "Email already registered!";
        }

        try {
            if (image != null && !image.isEmpty()) {
                user.setImageData(image.getBytes());
                user.setImageType(image.getContentType());
            }
        } catch (IOException e) {
            return "Failed to process image!";
        }

        userRepo.save(user);
        return "User registered successfully.";
    }

    // ✅ Login
    public User authenticate(String email, String password) {
        Optional<User> userOpt = userRepo.findByEmail(email);
        if (userOpt.isEmpty()) {
            return null;
        }

        User user = userOpt.get();
        if (user.getPassword().equals(password)) {
            return user;
        }
        return null;
    }


    // ✅ Get User by ID
    public User getUserById(int id) {
        return userRepo.findById(id).orElse(null);
    }

    // ✅ Get User by Email
    public Optional<User> getUserByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    // ✅ Update User
    public String updateUser(User updatedUser, MultipartFile image) {
        Optional<User> existingOpt = userRepo.findById(updatedUser.getId());
        if (existingOpt.isEmpty()) {
            return "User not found!";
        }

        User existing = existingOpt.get();

        try {
            if (image != null && !image.isEmpty()) {
                updatedUser.setImageData(image.getBytes());
                updatedUser.setImageType(image.getContentType());
            } else {
                updatedUser.setImageData(existing.getImageData());
                updatedUser.setImageType(existing.getImageType());
            }
        } catch (IOException e) {
            return "Image update failed!";
        }

        userRepo.save(updatedUser);
        return "User updated successfully.";
    }

    // ✅ Delete User
    public String deleteUser(int id) {
        if (!userRepo.existsById(id)) {
            return "User ID not found.";
        }
        userRepo.deleteById(id);
        return "User deleted.";
    }
}
