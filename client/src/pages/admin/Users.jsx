import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import { Spinner } from '../../components/Loading';
import { Users as UsersIcon, ArrowLeft, Trash2, Shield, User, Store } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users');
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await api.put(`/users/${userId}/role`, { role: newRole });
      if (res.data.success) {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
      }
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user and all associated records?')) return;
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  if (loading) return <Spinner text="Loading users..." />;

  return (
    <div className="container" style={{ padding: '3rem 1.5rem 6rem' }}>
      
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/admin/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-muted)', marginBottom: '0.75rem', fontSize: '0.88rem' }}>
          <ArrowLeft size={16} /> Back to Admin Console
        </Link>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <UsersIcon size={28} color="#818cf8" /> User Governance ({users.length})
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage customer accounts, merchants, and staff roles.
        </p>
      </div>

      <div className="glass-panel" style={{ padding: '1rem', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Joined Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img
                      src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={u.name}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <span style={{ fontWeight: 700, color: '#fff' }}>{u.name}</span>
                  </div>
                </td>

                <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                <td style={{ color: 'var(--text-subtle)' }}>{u.phone || 'N/A'}</td>

                <td>
                  <select
                    value={u.role}
                    onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    className="form-select"
                    style={{ width: 'auto', padding: '0.3rem 0.65rem', fontSize: '0.85rem' }}
                  >
                    <option value="customer">Customer</option>
                    <option value="business">Business</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td style={{ color: 'var(--text-subtle)', fontSize: '0.85rem' }}>
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>

                <td>
                  <button
                    onClick={() => handleDeleteUser(u._id)}
                    className="btn btn-danger btn-sm"
                    style={{ padding: '0.35rem 0.6rem' }}
                    title="Delete User"
                  >
                    <Trash2 size={14} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AdminUsers;
