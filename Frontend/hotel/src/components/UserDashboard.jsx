import React, { useEffect, useState } from 'react';
import './UserDashboard.css';
import UserNavbar from './UserNavbar';
import { toast, ToastContainer } from 'react-toastify';

function UserDashboard() {
  const [rooms, setRooms] = useState([]);
  const [reviewsByRoom, setReviewsByRoom] = useState({});
  const [visibleReviews, setVisibleReviews] = useState({});
  const [search, setSearch] = useState('');

  const loadRoomsAndReviews = async () => {
    try {
      const res = await fetch('http://localhost:8081/room/all');
      const roomData = await res.json();
      setRooms(roomData);

      for (const room of roomData) {
        try {
          const reviewRes = await fetch(`http://localhost:8081/review/room/${room.roomid}`);
          const reviews = await reviewRes.json();

          const enrichedReviews = await Promise.all(
            reviews.map(async (r) => {
              try {
                const userRes = await fetch(`http://localhost:8081/user/get/${r.userid}`);
                if (!userRes.ok) throw new Error('User not found');
                const user = await userRes.json();
                return { ...r, user };
              } catch {
                return { ...r, user: { name: 'Deleted User', imageData: null, imageType: null } };
              }
            })
          );

          setReviewsByRoom((prev) => ({
            ...prev,
            [room.roomid]: enrichedReviews,
          }));
        } catch {
          toast.error('Failed to load reviews for room: ' + room.roomid);
        }
      }
    } catch {
      toast.error('Failed to load rooms');
    }
  };

  useEffect(() => {
    loadRoomsAndReviews();
  }, []);

  const handleBook = async (roomid) => {
    const userid = localStorage.getItem('userId');
    if (!userid) {
      toast.error('Please login first');
      return;
    }

    const booking = {
      userid: parseInt(userid),
      roomid,
      checkin: new Date().toISOString().slice(0, 10),
      checkout: new Date().toISOString().slice(0, 10),
      status: 'Booked',
    };

    try {
      const res = await fetch('http://localhost:8081/booking/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(booking),
      });

      const msg = await res.text();
      toast(msg);

      if (msg.toLowerCase().includes('booked')) {
        loadRoomsAndReviews();
      }
    } catch {
      toast.error('Booking failed');
    }
  };

  const toggleReviews = (roomid) => {
    setVisibleReviews((prev) => ({
      ...prev,
      [roomid]: !prev[roomid],
    }));
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.roomType.toLowerCase().includes(search.toLowerCase()) ||
      String(room.price).includes(search) ||
      String(room.capacity).includes(search)
  );

  return (
    <div>
      <UserNavbar />
      <div className="dashboard-container">
        <h2>Available Rooms</h2>
        <p style={{ fontWeight: 'bold', marginBottom: '10px', color: '#ccc' }}>
          ⏰ Check-in Time: 12:00 PM | Check-out Time: 11:00 AM
        </p>

        <input
          type="text"
          placeholder="Search by type, price, or capacity"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '60%',
            padding: '10px',
            marginBottom: '20px',
            borderRadius: '5px',
            border: '1px solid #444',
            backgroundColor: '#222',
            color: '#fff',
          }}
        />

        <div className="room-grid">
          {filteredRooms.map((room) => (
            <div className="room-card" key={room.roomid}>
              <img
                src={`data:${room.imageType};base64,${room.imageData}`}
                alt="room"
              />
              <h3>{room.roomType}</h3>
              <p>Capacity: {room.capacity} person(s)</p>
              <p>Price: ₹{room.price}</p>
              <button
                disabled={!room.isAvailable}
                onClick={() => handleBook(room.roomid)}
              >
                {room.isAvailable ? 'Book Room' : 'Not Available'}
              </button>

              <button className="review-toggle" onClick={() => toggleReviews(room.roomid)}>
                {visibleReviews[room.roomid] ? 'Hide Reviews' : 'Show Reviews'}
              </button>

              {visibleReviews[room.roomid] && reviewsByRoom[room.roomid] && (
                <div className="review-section">
                  <h4>Reviews</h4>
                  {reviewsByRoom[room.roomid].length === 0 ? (
                    <p>No reviews yet</p>
                  ) : (
                    reviewsByRoom[room.roomid].map((r) => (
                      <div key={r.id} className="review-card">
                        {r.user?.imageData ? (
                          <img
                            src={`data:${r.user.imageType};base64,${r.user.imageData}`}
                            alt="user"
                            className="review-user-img"
                          />
                        ) : (
                          <div className="review-placeholder-img" />
                        )}
                        <div>
                          <p><strong>{r.user?.name || 'User'}</strong> ⭐ {r.rating}</p>
                          <p>{r.review}</p>
                          <small>{r.date}</small>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserDashboard;
