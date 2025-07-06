import React from 'react';
import { useNavigate } from 'react-router-dom';
import './UserNavbar.css';

function UserNavbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="user-navbar">
      <div className="logo" onClick={() => navigate('/user/dashboard')}>
        🏨 Hotel Comfort Stay
      </div>
      <ul>
        <li onClick={() => navigate('/user/dashboard')}>Rooms</li>
        <li onClick={() => navigate('/user/profile')}>Profile</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </nav>
  );
}

export default UserNavbar;
