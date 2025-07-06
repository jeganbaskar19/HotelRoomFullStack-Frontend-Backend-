import React, { useEffect, useState } from 'react';
import './AdminProfile.css';
import { toast, ToastContainer } from 'react-toastify';

function AdminProfile() {
  const [admin, setAdmin] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    number: '',
    password: '',
    image: null,
  });

  const adminId = localStorage.getItem('adminId');

  useEffect(() => {
    fetch(`http://localhost:8081/admin/get/${adminId}`)
      .then((res) => res.json())
      .then((data) => {
        setAdmin(data);
        setFormData({
          name: data.name,
          email: data.email,
          number: data.number,
          password: data.password,
          image: null,
        });

        if (data.imageData && data.imageType) {
          setImagePreview(`data:${data.imageType};base64,${data.imageData}`);
        }
      })
      .catch(() => toast.error('Failed to load admin profile'));
  }, [adminId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });

      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result);
      reader.readAsDataURL(files[0]);
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
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
    } catch (err) {
      toast.error('Update failed');
    }
  };

  return (
    <div className="admin-profile-container">
      <h2>Admin Profile</h2>

      <form onSubmit={handleSubmit} className="admin-profile-form">
        {imagePreview && (
          <img src={imagePreview} alt="Profile" className="profile-preview" />
        )}
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleChange}
        />

        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="number"
          placeholder="Phone Number"
          value={formData.number}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Profile</button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default AdminProfile;
