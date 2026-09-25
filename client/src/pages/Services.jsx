import { useEffect, useState } from 'react';
import api from '../services/api';
import ServiceList from '../components/ServiceList';

function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    api
      .get('/services')
      .then((res) => {
        const payload = Array.isArray(res.data) ? res.data : [];
        setServices(payload);
        if (!Array.isArray(res.data)) {
          setError('The services service responded with an unexpected format.');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError('Failed to load services. Please try again later.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p className="error-text">{error}</p>;

  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <ServiceList services={services} />
    </div>
  );
}

export default Services;