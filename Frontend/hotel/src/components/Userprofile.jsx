import React, { useEffect, useState } from 'react';
import './UserProfile.css';
import UserNavbar from './UserNavbar';
import { toast, ToastContainer } from 'react-toastify';

function UserProfile() {
  const [user, setUser] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [bookings, setBookings] = useState([]);
  const userId = localStorage.getItem('userId');

  const fetchUserDetails = () => {
    fetch(`http://localhost:8081/user/get/${userId}`)
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setFormData(data);
      })
      .catch(() => toast.error('Failed to fetch user details'));
  };

  useEffect(() => {
    fetchUserDetails();

    fetch(`http://localhost:8081/booking/user/${userId}`)
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch(() => toast.error('Failed to fetch bookings'));
  }, [userId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const data = new FormData();
    Object.entries(formData).forEach(([k, v]) => data.append(k, v));

    try {
      const res = await fetch('http://localhost:8081/user/update', {
        method: 'PUT',
        body: data,
      });

      if (res.ok) {
        toast.success('Profile updated successfully!');
        setEditMode(false);
        fetchUserDetails();
      } else {
        const msg = await res.text();
        toast.error(msg || 'Update failed!');
      }
    } catch (err) {
      toast.error('Something went wrong while updating!');
    }
  };

  const handleReview = async (booking) => {
    const review = prompt("Enter your review for Room #" + booking.roomid);
    const rating = prompt("Give a rating out of 5");
    if (!review || !rating) return;

    const body = {
      userid: parseInt(userId),
      roomid: booking.roomid,
      review,
      rating: parseInt(rating),
    };

    const res = await fetch(`http://localhost:8081/review/add`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const msg = await res.text();
    toast(msg);
  };

  return (
    <div>
      <UserNavbar />
      <div className="profile-container">
        <h2>User Profile</h2>

        {!editMode ? (
          <div className="profile-view">
            {user.imageData ? (
              <img
                src={`data:${user.imageType};base64,${user.imageData}`}
                alt="profile"
                style={{
                  width: '150px',
                  height: '150px',
                  objectFit: 'cover',
                  borderRadius: '50%',
                  marginBottom: '10px',
                }}
              />
            ) : (
              <div
                style={{
                  width: '150px',
                  height: '150px',
                  borderRadius: '50%',
                  backgroundColor: '#ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '10px',
                }}
              >
                No Image
              </div>
            )}
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.number}</p>
            <button onClick={() => setEditMode(true)}>Edit Profile</button>
          </div>
        ) : (
          <form className="profile-form" onSubmit={handleUpdate}>
            <input
              name="name"
              value={formData.name || ''}
              onChange={handleChange}
              required
            />
            <input
              name="email"
              value={formData.email || ''}
              onChange={handleChange}
              required
            />
            <input
              name="number"
              value={formData.number || ''}
              onChange={handleChange}
              required
            />
            <input
              name="password"
              value={formData.password || ''}
              onChange={handleChange}
              required
            />
            <input name="image" type="file" onChange={handleChange} />
            <button type="submit">Save Changes</button>
          </form>
        )}

        <h3>Your Bookings</h3>
        <div className="booking-list">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">
              <p>Room ID: {b.roomid}</p>
              <p>Status: {b.status}</p>
              <p>Check-in: {b.checkin}</p>
              <p>Check-out: {b.checkout}</p>
              <button onClick={() => handleReview(b)}>Post Review</button>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default UserProfile;
