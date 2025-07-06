import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminNavbar.css';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="admin-navbar">
      <div className="admin-logo" onClick={() => navigate('/admin/dashboard')}>
        🛎️ Admin Panel
      </div>
      <ul className="admin-nav-links">
        <li onClick={() => navigate('/admin/users')}>👤 Users</li>
        <li onClick={() => navigate('/admin/rooms')}>🏨 Rooms</li>
        <li onClick={() => navigate('/admin/bookings')}>📅 Bookings</li>
        <li onClick={() => navigate('/admin/feedbacks')}>⭐ Feedbacks</li>
        <li onClick={() => navigate('/admin/profile')}>🖊️ Edit Profile</li>
        <li onClick={handleLogout}>🚪 Logout</li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;
