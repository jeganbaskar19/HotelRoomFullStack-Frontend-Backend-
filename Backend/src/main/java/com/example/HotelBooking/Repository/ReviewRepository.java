package com.example.HotelBooking.Repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.HotelBooking.Entity.Review;

public interface ReviewRepository extends JpaRepository<Review, Integer> {
    List<Review> findByRoomid(int roomid);
    List<Review> findByUserid(int userid);
}

