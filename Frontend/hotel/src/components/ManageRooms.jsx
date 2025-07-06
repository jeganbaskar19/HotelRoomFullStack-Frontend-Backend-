import React, { useEffect, useState } from 'react';
import './ManageRooms.css';
import { toast, ToastContainer } from 'react-toastify';

function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [newImage, setNewImage] = useState(null);

  const [formData, setFormData] = useState({
    roomid: '',
    roomNo: '',
    roomType: '',
    price: '',
    capacity: '',
    isAvailable: true
  });

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    const res = await fetch('http://localhost:8081/room/all');
    const data = await res.json();
    setRooms(data);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (name === 'image') {
      setNewImage(files[0]);
    } else {
      setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    }
  };

  const handleEdit = (room) => {
    setEditingRoomId(room.roomid);
    setFormData({
      roomid: room.roomid,
      roomNo: room.roomNo,
      roomType: room.roomType,
      price: room.price,
      capacity: room.capacity,
      isAvailable: room.isAvailable
    });
    setNewImage(null);
  };

  const handleUpdate = async () => {
    const form = new FormData();
    form.append('roomid', formData.roomid);
    form.append('roomNo', formData.roomNo);
    form.append('roomType', formData.roomType);
    form.append('price', formData.price);
    form.append('capacity', formData.capacity);
    form.append('isAvailable', formData.isAvailable);
    if (newImage) form.append('image', newImage);

    try {
      const res = await fetch('http://localhost:8081/room/update', {
        method: 'PUT',
        body: form,
      });

      const msg = await res.text();
      toast(msg);
      setEditingRoomId(null);
      fetchRooms();
    } catch (err) {
      toast.error('Update failed');
    }
  };

  const handleDelete = async (roomid) => {
    if (window.confirm('Are you sure to delete this room?')) {
      await fetch(`http://localhost:8081/room/delete/${roomid}`, { method: 'DELETE' });
      toast('Room deleted');
      fetchRooms();
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('roomNo', formData.roomNo);
    form.append('roomType', formData.roomType);
    form.append('price', formData.price);
    form.append('capacity', formData.capacity);
    form.append('isAvailable', formData.isAvailable);
    if (newImage) form.append('image', newImage);

    try {
      const res = await fetch('http://localhost:8081/room/add', {
        method: 'POST',
        body: form,
      });

      const msg = await res.text();
      toast(msg);
      setFormData({
        roomid: '',
        roomNo: '',
        roomType: '',
        price: '',
        capacity: '',
        isAvailable: true
      });
      setNewImage(null);
      fetchRooms();
    } catch (err) {
      toast.error('Creation failed');
    }
  };

  return (
    <div className="manage-rooms">
      <h2>Manage Rooms</h2>

      {/* 🔽 Add Room Section */}
      <form onSubmit={handleCreate} style={{ marginBottom: '30px' }}>
        <table>
          <thead>
            <tr>
              <th>Room No</th>
              <th>Type</th>
              <th>Price</th>
              <th>Capacity</th>
              <th>Available</th>
              <th>Image</th>
              <th>Add</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input name="roomNo" value={formData.roomNo} onChange={handleChange} required /></td>
              <td><input name="roomType" value={formData.roomType} onChange={handleChange} required /></td>
              <td><input name="price" type="number" value={formData.price} onChange={handleChange} required /></td>
              <td><input name="capacity" type="number" value={formData.capacity} onChange={handleChange} required /></td>
              <td><input name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleChange} /></td>
              <td><input name="image" type="file" accept="image/*" onChange={handleChange} /></td>
              <td><button type="submit">Add</button></td>
            </tr>
          </tbody>
        </table>
      </form>

      {/* 🔄 Room List with Edit/Delete */}
      <table>
        <thead>
          <tr>
            <th>Room No</th>
            <th>Type</th>
            <th>Price</th>
            <th>Capacity</th>
            <th>Available</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rooms.map((room) =>
            editingRoomId === room.roomid ? (
              <tr key={room.roomid}>
                <td><input name="roomNo" value={formData.roomNo} onChange={handleChange} /></td>
                <td><input name="roomType" value={formData.roomType} onChange={handleChange} /></td>
                <td><input name="price" type="number" value={formData.price} onChange={handleChange} /></td>
                <td><input name="capacity" type="number" value={formData.capacity} onChange={handleChange} /></td>
                <td><input name="isAvailable" type="checkbox" checked={formData.isAvailable} onChange={handleChange} /></td>
                <td>
                  <input type="file" accept="image/*" onChange={handleChange} name="image" />
                  <button onClick={handleUpdate}>Save</button>
                  <button className="btn-secondary" onClick={() => setEditingRoomId(null)}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={room.roomid}>
                <td>{room.roomNo}</td>
                <td>{room.roomType}</td>
                <td>₹{room.price}</td>
                <td>{room.capacity}</td>
                <td>{room.isAvailable ? 'Yes' : 'No'}</td>
                <td>
                  <button onClick={() => handleEdit(room)}>Edit</button>
                  <button className="btn-secondary" onClick={() => handleDelete(room.roomid)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>

      <ToastContainer />
    </div>
  );
}

export default ManageRooms;
