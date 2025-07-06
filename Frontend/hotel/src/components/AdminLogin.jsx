import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminLogin.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:8081/admin/login?email=${email}&password=${password}`, {
        method: 'POST',
      });

      if (response.ok) {
        const admin = await response.json();
        localStorage.setItem('adminId', admin.id);
        localStorage.setItem('adminEmail', admin.email);
        localStorage.setItem('role', 'admin');

        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      } else {
        const errorMsg = await response.text();
        toast.error(errorMsg || 'Invalid admin credentials');
      }

    } catch (err) {
      toast.error('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <form className="admin-login-form" onSubmit={handleLogin}>
        <h2>Admin Login</h2>
        <input
          type="email"
          placeholder="Admin Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Not a user? <a href="/login">Go to User Login</a>
        </p>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AdminLogin;
