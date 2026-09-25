import { Link } from 'react-router-dom';

function ServiceCard({ service }) {
  return (
    <div className="service-card">
      <h3>{service.name}</h3>
      <p className="service-description">{service.description}</p>
      <div className="service-meta">
        <span>{service.duration} min</span>
        <span>₱{Number(service.price).toFixed(2)}</span>
      </div>
      <Link to={`/booking/${service.id}`} className="btn btn-primary">
        Book This Service
      </Link>
    </div>
  );
}

export default ServiceCard;