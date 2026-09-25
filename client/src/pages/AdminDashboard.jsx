import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import BookingCard from '../components/BookingCard';

function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const adminUser = JSON.parse(localStorage.getItem('spa_admin_user') || 'null');

  const loadBookings = () => {
    setLoading(true);
    api
      .get('/bookings')
      .then((res) => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to load bookings.');
        }
        setLoading(false);
      });
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleStatusChange = async (id, status) => {
    setUpdatingId(id);
    try {
      await api.patch(`/bookings/${id}/status`, { status });
      // Update just that one row locally instead of refetching everything
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status } : b))
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update booking status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('spa_admin_token');
    localStorage.removeItem('spa_admin_user');
    navigate('/login');
  };

  if (loading) return <p>Loading bookings...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div>
          {adminUser && <span className="admin-welcome">Hi, {adminUser.name}</span>}
          <button className="btn btn-secondary" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Service</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onStatusChange={handleStatusChange}
                updatingId={updatingId}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AdminDashboard;