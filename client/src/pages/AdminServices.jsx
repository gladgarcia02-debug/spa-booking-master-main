import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ServiceForm from '../components/ServiceForm';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [actionError, setActionError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadServices = async () => {
      setLoading(true);

      try {
        const res = await api.get('/services');
        if (isMounted) {
          setServices(res.data);
        }
      } catch (err) {
        console.error(err);
        if (isMounted) {
          setError('Failed to load services.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadServices();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSubmit = async (formData) => {
    setSubmitting(true);
    setActionError(null);
    try {
      if (editingService) {
        const res = await api.put(`/services/${editingService.id}`, formData);
        setServices((prev) => prev.map((s) => (s.id === editingService.id ? res.data : s)));
        setEditingService(null);
      } else {
        const res = await api.post('/services', formData);
        setServices((prev) => [...prev, res.data]);
      }
    } catch (err) {
      console.error(err);
      setActionError(err.response?.data?.message || 'Failed to save service.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return;
    try {
      await api.delete(`/services/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      console.error(err);
      // 409 = service has existing bookings, from Step 4's foreign key handling
      alert(err.response?.data?.message || 'Failed to delete service.');
    }
  };

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="admin-services">
      <div className="admin-header">
        <h1>Manage Services</h1>
        <Link to="/admin" className="btn btn-secondary">Back to Bookings</Link>
      </div>

      {actionError && <p className="error-text">{actionError}</p>}

      <ServiceForm
        key={editingService ? editingService.id : 'new-service'}
        editingService={editingService}
        onSubmit={handleSubmit}
        onCancel={() => setEditingService(null)}
        submitting={submitting}
      />

      <table className="bookings-table services-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.id}>
              <td>{service.name}</td>
              <td>{service.duration} min</td>
              <td>₱{Number(service.price).toFixed(2)}</td>
              <td className="actions-cell">
                <button className="btn btn-small btn-confirm" onClick={() => setEditingService(service)}>
                  Edit
                </button>
                <button className="btn btn-small btn-danger" onClick={() => handleDelete(service.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminServices;