import ServiceCard from './ServiceCard';

function ServiceList({ services }) {
  if (!Array.isArray(services) || services.length === 0) {
    return <p>No services available right now.</p>;
  }

  return (
    <div className="service-list">
      {services.map((service) => (
        <ServiceCard key={service.id} service={service} />
      ))}
    </div>
  );
}

export default ServiceList;