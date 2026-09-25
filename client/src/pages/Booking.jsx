import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

const TIME_SLOTS = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
];

function Booking() {
  const { serviceId } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [loadingService, setLoadingService] = useState(true);
  const [serviceError, setServiceError] = useState(null);

  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    booking_date: "",
    booking_time: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState([]);

  // Load the selected service so we can show its name/price/duration
  useEffect(() => {
    api
      .get(`/services/${serviceId}`)
      .then((res) => {
        setService(res.data);
        setLoadingService(false);
      })
      .catch((err) => {
        console.error(err);
        setServiceError("Could not find this service.");
        setLoadingService(false);
      });
  }, [serviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setFieldErrors([]);
    setSubmitting(true);

    try {
      const res = await api.post("/bookings", {
        ...formData,
        service_id: Number(serviceId),
      });

      // Hand the confirmed booking off to the confirmation page (Step 9)
      navigate("/confirmation", { state: { booking: res.data, service } });
    } catch (err) {
      console.error(err);
      if (err.response?.data?.errors) {
        setFieldErrors(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setSubmitError(err.response.data.message);
      } else {
        setSubmitError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingService) return <p>Loading service details...</p>;
  if (serviceError) return <p className="error-text">{serviceError}</p>;

  // Minimum selectable date is today
  const today = new Date().toISOString().split("T")[0];

  // If the selected date is today, hide time slots that have already passed
  const availableTimeSlots = (() => {
    const todayStr = new Date().toISOString().split("T")[0];
    if (formData.booking_date !== todayStr) return TIME_SLOTS;

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    return TIME_SLOTS.filter((slot) => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > currentMinutes;
    });
  })();

  return (
    <div className="booking-page">
      <h1>Book: {service.name}</h1>
     <p className="service-meta">
        {service.duration} min — ₱{Number(service.price).toFixed(2)}
    </p>

      <form onSubmit={handleSubmit} className="booking-form">
        <label>
          Full Name
          <input
            type="text"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email
          <input
            type="email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Phone
          <input
            type="tel"
            name="customer_phone"
            value={formData.customer_phone}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Date
          <input
            type="date"
            name="booking_date"
            min={today}
            value={formData.booking_date}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Time
          <select
            name="booking_time"
            value={formData.booking_time}
            onChange={handleChange}
            required
          >
            <option value="">Select a time</option>
            {availableTimeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {availableTimeSlots.length === 0 && (
            <span className="error-text">
              No more time slots available today — please pick another date.
            </span>
          )}
        </label>

        {fieldErrors.length > 0 && (
          <ul className="error-text">
            {fieldErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        )}
        {submitError && <p className="error-text">{submitError}</p>}

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Booking..." : "Confirm Booking"}
        </button>
      </form>
    </div>
  );
}

export default Booking;
