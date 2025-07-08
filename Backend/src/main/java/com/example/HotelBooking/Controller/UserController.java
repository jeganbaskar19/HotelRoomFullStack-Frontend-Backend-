package com.example.HotelBooking.Controller;

import java.util.Optional;

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

import com.example.HotelBooking.Entity.User;
import com.example.HotelBooking.Services.UserService;

@RestController
@RequestMapping("/user")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;

    // ✅ Register User
    @PostMapping("/register")
    public ResponseEntity<String> registerUser(
        @RequestParam String name,
        @RequestParam String email,
        @RequestParam String number,
        @RequestParam String password,
        @RequestParam(required = false) MultipartFile image
    ) {
        User user = new User(name, email, number, password);
        user.setRole("user"); // Default role is always user
        String msg = userService.register(user, image);
        return ResponseEntity.ok(msg);
    }

    // ✅ Login User
    @PostMapping("/login")
    public ResponseEntity<User> login(
        @RequestParam String email,
        @RequestParam String password
    ) {
        User user = userService.authenticate(email, password);
        if (user != null) {
            return ResponseEntity.ok(user); // 👈 sends full user object as JSON
        }
        return ResponseEntity.status(401).build(); // Unauthorized
    }



    // ✅ Get User by ID
    @GetMapping("/get/{id}")
    public ResponseEntity<User> getUserById(@PathVariable int id) {
        User user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }

    // ✅ Get User by Email
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        Optional<User> user = userService.getUserByEmail(email);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // ✅ Update Profile
    @PutMapping("/update")
    public ResponseEntity<String> updateUser(
        @RequestParam int id,
        @RequestParam String name,
        @RequestParam String email,
        @RequestParam String number,
        @RequestParam String password,
        @RequestParam(required = false) MultipartFile image
    ) {
        User user = new User(name, email, number, password);
        user.setId(id);
        String msg = userService.updateUser(user, image);
        return ResponseEntity.ok(msg);
    }

    // ✅ Delete Account
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable int id) {
        String msg = userService.deleteUser(id);
        return ResponseEntity.ok(msg);
    }
}
