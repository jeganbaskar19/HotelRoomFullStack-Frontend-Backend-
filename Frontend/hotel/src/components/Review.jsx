import React, { useEffect, useState } from 'react';
import './Review.css';
import { toast, ToastContainer } from 'react-toastify';

function Review({ onClose }) {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviewsWithUsers = async () => {
      try {
        const res = await fetch('http://localhost:8081/review/all');
        const data = await res.json();

        const enriched = await Promise.all(
          data.map(async (r) => {
            try {
              const userRes = await fetch(`http://localhost:8081/user/get/${r.userid}`);
              const user = await userRes.json();
              return { ...r, user };
            } catch (err) {
              return { ...r, user: null };
            }
          })
        );

        setReviews(enriched);
      } catch (err) {
        toast.error('Failed to fetch reviews');
      }
    };

    fetchReviewsWithUsers();
  }, []);

  return (
    <div className="review-modal">
      <button className="close-btn" onClick={onClose}>✖</button>
      <h2>All Reviews</h2>
      {reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <div className="review-list">
          {reviews.map((r) => (
            <div key={r.id} className="review-card">
              {r.user?.imageData ? (
                <img
                  src={`data:${r.user.imageType};base64,${r.user.imageData}`}
                  alt="user"
                />
              ) : (
                <div className="review-placeholder-img" />
              )}
              <div>
                <p><strong>{r.user?.name || 'Anonymous'}</strong> ⭐ {r.rating}</p>
                <p>{r.review}</p>
                <small>{r.date}</small>
              </div>
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default Review;
