package com.example.HotelBooking.Controller;

import com.example.HotelBooking.Entity.Review;
import com.example.HotelBooking.Services.ReviewService;
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
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/review")
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // ➕ Post review
    @PostMapping("/add")
    public ResponseEntity<String> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.addReview(review));
    }

    // 🔁 Update review
    @PutMapping("/update")
    public ResponseEntity<String> updateReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.updateReview(review));
    }

    // ❌ Delete review
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteReview(@PathVariable int id) {
        return ResponseEntity.ok(reviewService.deleteReview(id));
    }

    // 📄 Get all reviews
    @GetMapping("/all")
    public ResponseEntity<List<Review>> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAllReviews());
    }

    // 📄 Get reviews by room ID
    @GetMapping("/room/{roomid}")
    public ResponseEntity<List<Review>> getByRoom(@PathVariable int roomid) {
        return ResponseEntity.ok(reviewService.getReviewsByRoom(roomid));
    }

    // 📄 Get reviews by user ID
    @GetMapping("/user/{userid}")
    public ResponseEntity<List<Review>> getByUser(@PathVariable int userid) {
        return ResponseEntity.ok(reviewService.getReviewsByUser(userid));
    }

    // 📄 Get single review by ID
    @GetMapping("/{id}")
    public ResponseEntity<Review> getById(@PathVariable int id) {
        Review review = reviewService.getReviewById(id);
        return review != null ? ResponseEntity.ok(review) : ResponseEntity.notFound().build();
    }
}
