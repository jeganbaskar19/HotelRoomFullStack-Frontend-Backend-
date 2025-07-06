import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import './ManageFeedbacks.css';
import { ToastContainer, toast } from 'react-toastify';

function ManageFeedbacks() {
  const [feedbacks, setFeedbacks] = useState([]);

  const fetchFeedbacks = async () => {
    try {
      const res = await fetch('http://localhost:8081/review/all');
      const rawFeedbacks = await res.json();

      // Manually enrich each feedback with user + room
      const enrichedFeedbacks = await Promise.all(
        rawFeedbacks.map(async (fb) => {
          const [userRes, roomRes] = await Promise.all([
            fetch(`http://localhost:8081/user/get/${fb.userid}`),
            fetch(`http://localhost:8081/room/get/${fb.roomid}`)
          ]);

          const user = userRes.ok ? await userRes.json() : null;
          const room = roomRes.ok ? await roomRes.json() : null;

          return { ...fb, user, room };
        })
      );

      setFeedbacks(enrichedFeedbacks);
    } catch (err) {
      toast.error('Failed to fetch feedbacks');
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:8081/review/delete/${id}`, {
        method: 'DELETE',
      });
      const msg = await res.text();
      toast(msg);
      fetchFeedbacks(); // Refresh after delete
    } catch (err) {
      toast.error('Error deleting feedback');
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="feedbacks-container">
        <h2>Manage Feedbacks</h2>
        <div className="feedback-grid">
          {feedbacks.map((fb) => (
            <div className="feedback-card" key={fb.id}>
              {/* 👤 User Info */}
              <div className="user-info">
                {fb.user?.imageData ? (
                  <img
                    src={`data:${fb.user.imageType};base64,${fb.user.imageData}`}
                    alt="user"
                  />
                ) : (
                  <div className="placeholder-avatar">👤</div>
                )}
                <div>
                  <p><strong>{fb.user?.name || 'Unknown User'}</strong></p>
                  <small>{fb.date}</small>
                </div>
              </div>

              {/* 🏨 Room Info */}
              <div className="room-info">
                {fb.room?.imageData ? (
                  <img
                    src={`data:${fb.room.imageType};base64,${fb.room.imageData}`}
                    alt="room"
                  />
                ) : (
                  <div className="placeholder-room">🏨</div>
                )}
                <p>{fb.room?.roomType || 'Unknown Room'}</p>
              </div>

              {/* 💬 Review Content */}
              <div className="review-text">
                <p>{fb.review}</p>
                <p>⭐ {fb.rating}</p>
              </div>

              <button onClick={() => handleDelete(fb.id)}>Delete</button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ManageFeedbacks;
