import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import './AdminDashboard.css';
import { toast, ToastContainer } from 'react-toastify';

function AdminDashboard() {
  const [userCount, setUserCount] = useState(0);
  const [roomCount, setRoomCount] = useState(0);
  const [bookingCount, setBookingCount] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [admin, setAdmin] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const adminId = localStorage.getItem('adminId');
  const navigate = useNavigate();

  // ✅ Fetch counts on load
  useEffect(() => {
    fetch('http://localhost:8081/admin/users')
      .then(res => res.json())
      .then(data => setUserCount(data.length));

    fetch('http://localhost:8081/room/all')
      .then(res => res.json())
      .then(data => setRoomCount(data.length));

    fetch('http://localhost:8081/booking/all')
      .then(res => res.json())
      .then(data => setBookingCount(data.length));

    fetch('http://localhost:8081/review/all')
      .then(res => res.json())
      .then(data => setReviewCount(data.length));
  }, []);

  // ✅ Fetch admin profile
  useEffect(() => {
    fetch(`http://localhost:8081/admin/get/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data);
        setFormData(data);
      })
      .catch(() => toast.error('Failed to fetch admin details'));
  }, [adminId]);

  const handleEditChange = (e) => {
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
    data.append('id', adminId);
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('number', formData.number);
    data.append('password', formData.password);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      const res = await fetch('http://localhost:8081/admin/update', {
        method: 'PUT',
        body: data,
      });

      const msg = await res.text();
      toast.success(msg);
      setEditMode(false);

      // Refresh profile
      const updated = await fetch(`http://localhost:8081/admin/get/${adminId}`);
      const updatedData = await updated.json();
      setAdmin(updatedData);
      setFormData(updatedData);
    } catch {
      toast.error("Failed to update admin");
    }
  };

  return (
    <div>
      <AdminNavbar />
      <div className="admin-dashboard-container">
        <div className="admin-header">
          <div className="admin-profile">
            {admin.imageData ? (
              <img
                src={`data:${admin.imageType};base64,${admin.imageData}`}
                alt="Admin"
                className="admin-img"
              />
            ) : (
              <div className="admin-placeholder">No Image</div>
            )}
            <div className="admin-info">
              <h2>{admin.name}</h2>
              <p>{admin.email}</p>
              <p>{admin.number}</p>
              <button onClick={() => setEditMode(true)}>Edit Profile</button>
            </div>
          </div>
        </div>

        <h3 className="subtitle">📊 Admin Dashboard Overview</h3>

        <div className="dashboard-grid">
          <div className="dashboard-card users" onClick={() => navigate('/admin/users')}>
            <h3>👤 Users</h3>
            <p>{userCount}</p>
          </div>

          <div className="dashboard-card rooms" onClick={() => navigate('/admin/rooms')}>
            <h3>🏨 Rooms</h3>
            <p>{roomCount}</p>
          </div>

          <div className="dashboard-card bookings" onClick={() => navigate('/admin/bookings')}>
            <h3>📅 Bookings</h3>
            <p>{bookingCount}</p>
          </div>

          <div className="dashboard-card reviews" onClick={() => navigate('/admin/feedbacks')}>
            <h3>⭐ Reviews</h3>
            <p>{reviewCount}</p>
          </div>
        </div>

        {/* ✅ Edit Profile Modal */}
        {editMode && (
          <div className="admin-edit-modal">
            <form className="admin-edit-form" onSubmit={handleUpdate}>
              <h3>Edit Admin Profile</h3>
              <input
                name="name"
                value={formData.name || ''}
                onChange={handleEditChange}
                required
              />
              <input
                name="email"
                type="email"
                value={formData.email || ''}
                onChange={handleEditChange}
                required
              />
              <input
                name="number"
                value={formData.number || ''}
                onChange={handleEditChange}
                required
              />
              <input
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleEditChange}
                required
              />
              <input name="image" type="file" onChange={handleEditChange} />
              <div className="btn-group">
                <button type="submit">Update</button>
                <button type="button" onClick={() => setEditMode(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <ToastContainer />
      </div>
    </div>
  );
}

export default AdminDashboard;
