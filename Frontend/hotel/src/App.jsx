import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Public Components
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/Adminlogin';

// User Components
import UserDashboard from './components/UserDashboard';
import UserProfile from './components/Userprofile';

// Admin Components
import AdminDashboard from './components/AdminDashboard';
import ManageUsers from './components/ManageUsers';
import ManageRooms from './components/ManageRooms';
import ManageBookings from './components/ManageBookings';
import ManageFeedbacks from './components/ManageFeedbacks';
import AdminProfile from './components/AdminProfile';

// Protected Route
import AdminProtectedRoute from './components/AdminProtectedRoute';

// (Optional) If needed, you can also add UserProtectedRoute

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/login" element={<AdminLogin />}/>

        {/* ✅ User Routes */}
        <Route path="/user/dashboard" element={<UserDashboard />} />
        <Route path="/user/profile" element={<UserProfile />} />

        {/* ✅ Admin Routes (Protected) */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <AdminProtectedRoute>
              <ManageUsers />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/rooms"
          element={
            <AdminProtectedRoute>
              <ManageRooms />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminProtectedRoute>
              <ManageBookings />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/feedbacks"
          element={
            <AdminProtectedRoute>
              <ManageFeedbacks />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/profile"
          element={
            <AdminProtectedRoute>
              <AdminProfile />
            </AdminProtectedRoute>
          }
        />

        {/* ❌ Catch-All (404) */}
        <Route path="*" element={<h2 style={{ textAlign: 'center', color: 'red' }}>404 - Page Not Found</h2>} />
      </Routes>
    </Router>
  );
}

export default App;
