import React, { useEffect, useState } from 'react';
import './ManageUsers.css';
import { toast, ToastContainer } from 'react-toastify';

function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const initialForm = {
    id: '',
    name: '',
    email: '',
    number: '',
    password: '',
    role: 'user',
    image: null
  };

  const [formData, setFormData] = useState(initialForm);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch('http://localhost:8081/admin/users');
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const handleEdit = (user) => {
    setIsAdding(false);
    setEditingUser(user.id);
    setFormData({
      id: user.id,
      name: user.name,
      email: user.email,
      number: user.number,
      password: user.password,
      role: user.role,
      image: null
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`http://localhost:8081/admin/user/delete/${id}`, {
        method: 'DELETE'
      });
      const msg = await res.text();
      toast(msg);
      fetchUsers();
    } catch (error) {
      toast.error('Delete failed');
    }
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    for (const [key, value] of Object.entries(formData)) {
      if (value !== null) data.append(key, value);
    }

    const url = editingUser
      ? 'http://localhost:8081/admin/user/update'
      : 'http://localhost:8081/user/register';

    const method = editingUser ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        body: data
      });
      const msg = await res.text();
      toast(msg);
      setEditingUser(null);
      setIsAdding(false);
      setFormData(initialForm);
      fetchUsers();
    } catch (err) {
      toast.error('Operation failed');
    }
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>

      {/* ➕ Add New User Button */}
      {!isAdding && !editingUser && (
        <button
          style={{ marginBottom: '20px' }}
          onClick={() => {
            setFormData(initialForm);
            setIsAdding(true);
          }}
        >
          ➕ Add New User
        </button>
      )}

      {/* ➕ Add or ✏️ Edit Form */}
      {(isAdding || editingUser) && (
        <form onSubmit={handleSubmit} style={{ marginBottom: '30px' }}>
          <table>
            <tbody>
              <tr>
                <td>
                  <input type="file" name="image" onChange={handleChange} />
                </td>
                <td>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Name"
                    required
                  />
                </td>
                <td>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                  />
                </td>
                <td>
                  <input
                    type="text"
                    name="number"
                    value={formData.number}
                    onChange={handleChange}
                    placeholder="Phone"
                    required
                  />
                </td>
                <td>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>
                <td>
                  {!editingUser && (
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Password"
                      required
                    />
                  )}
                </td>
                <td>
                  <button type="submit">{editingUser ? 'Save' : 'Register'}</button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingUser(null);
                      setIsAdding(false);
                      setFormData(initialForm);
                    }}
                  >
                    Cancel
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      )}

      {/* 🔄 Users Table */}
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Name</th>
            <th>Email</th>
            <th>Number</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>
                {u.imageData ? (
                  <img
                    src={`data:${u.imageType};base64,${u.imageData}`}
                    alt="user"
                    className="user-avatar"
                  />
                ) : (
                  'N/A'
                )}
              </td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.number}</td>
              <td>{u.role}</td>
              <td>
                <button onClick={() => handleEdit(u)}>Edit</button>
                <button onClick={() => handleDelete(u.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default ManageUsers;
