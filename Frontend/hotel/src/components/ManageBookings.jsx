import React, { useEffect, useState } from 'react';
import AdminNavbar from './AdminNavbar';
import './ManageBookings.css';

function ManageBookings() {
  const [bookings, setBookings] = useState([]);

  // Fetch all bookings on load
  useEffect(() => {
    fetch('http://localhost:8081/admin/bookings')
      .then((res) => res.json())
      .then((data) => setBookings(data))
      .catch((err) => console.error('Failed to fetch bookings:', err));
  }, []);

  // Delete booking
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to check out this booking?")) {
      fetch(`http://localhost:8081/admin/booking/delete/${id}`, {
        method: 'DELETE',
      })
        .then((res) => res.text())
        .then((msg) => {
          alert(msg);
          setBookings(bookings.filter((b) => b.id !== id));
        })
        .catch((err) => alert('Error deleting booking.'));
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="manage-bookings-container">
        <h2>📅 Manage Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="bookings-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User ID</th>
                <th>Room ID</th>
                <th>Check-in</th>
                <th>Check-out</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <tr key={booking.id}>
                  <td>{booking.id}</td>
                  <td>{booking.userid}</td>
                  <td>{booking.roomid}</td>
                  <td>{booking.checkin}</td>
                  <td>{booking.checkout}</td>
                  <td>{booking.status}</td>
                  <td>
                    {/* Optional Edit Button */}
                    {/* <button className="edit-btn">Edit</button> */}
                    <button className="delete-btn" onClick={() => handleDelete(booking.id)}>Check Out</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ManageBookings;
