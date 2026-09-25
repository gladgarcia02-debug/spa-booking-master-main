import { Link, useLocation } from 'react-router-dom';

function Confirmation() {
  const location = useLocation();
  const booking = location.state?.booking;
  const service = location.state?.service;

  if (!booking || !service) {
    return (
      <div className="confirmation-page">
        <h1>Booking not found</h1>
        <p>Your booking details could not be loaded.</p>
        <Link to="/services" className="btn btn-primary">
          Back to services
        </Link>
      </div>
    );
  }

  return (
    <div className="confirmation-page">
      <h1>Booking Confirmed</h1>
      <p>Thank you, {booking.customer_name}! Your appointment has been reserved.</p>

      <div className="confirmation-card">
        <p>
          <strong>Reference:</strong> {booking.booking_reference}
        </p>
        <p>
          <strong>Service:</strong> {service.name}
        </p>
        <p>
          <strong>Date:</strong> {booking.booking_date}
        </p>
        <p>
          <strong>Time:</strong> {booking.booking_time}
        </p>
        <p>
          <strong>Status:</strong> {booking.status}
        </p>
      </div>

      <Link to="/services" className="btn btn-primary">
        Book Another Service
      </Link>
    </div>
  );
}

export default Confirmation;
