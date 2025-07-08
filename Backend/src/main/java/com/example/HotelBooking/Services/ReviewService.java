package com.example.HotelBooking.Services;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.HotelBooking.Entity.Review;
import com.example.HotelBooking.Repository.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepo;

    // ➕ Post Review
    public String addReview(Review review) {
        review.setDate(LocalDate.now());
        reviewRepo.save(review);
        return "Review submitted successfully.";
    }

    // 🔁 Update Review
    public String updateReview(Review updatedReview) {
        Optional<Review> existing = reviewRepo.findById(updatedReview.getId());
        if (existing.isEmpty()) {
            return "Review not found!";
        }

        updatedReview.setDate(LocalDate.now()); // Update date on change
        reviewRepo.save(updatedReview);
        return "Review updated.";
    }

    // ❌ Delete Review
    public String deleteReview(int id) {
        if (!reviewRepo.existsById(id)) {
            return "Review not found.";
        }
        reviewRepo.deleteById(id);
        return "Review deleted.";
    }

    // 📄 Get All Reviews
    public List<Review> getAllReviews() {
        return reviewRepo.findAll();
    }

    // 📄 Get Reviews by Room ID
    public List<Review> getReviewsByRoom(int roomid) {
        return reviewRepo.findByRoomid(roomid);
    }

    // 📄 Get Reviews by User ID
    public List<Review> getReviewsByUser(int userid) {
        return reviewRepo.findByUserid(userid);
    }

    // 📄 Get Review by ID
    public Review getReviewById(int id) {
        return reviewRepo.findById(id).orElse(null);
    }
}
