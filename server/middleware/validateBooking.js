const pool = require('../config/db');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM, 24-hour

const validateBooking = async (req, res, next) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    service_id,
    booking_date,
    booking_time,
  } = req.body;

  const errors = [];

  // Required fields
  if (!customer_name || !customer_name.trim()) errors.push('customer_name is required');
  if (!customer_email || !customer_email.trim()) errors.push('customer_email is required');
  if (!customer_phone || !customer_phone.trim()) errors.push('customer_phone is required');
  if (!service_id) errors.push('service_id is required');
  if (!booking_date) errors.push('booking_date is required');
  if (!booking_time) errors.push('booking_time is required');

  // Stop early if basics are missing — no point checking format on empty values
  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  // Email format
  if (!EMAIL_REGEX.test(customer_email)) {
    errors.push('customer_email is not a valid email address');
  }

  // Time format (expects "HH:MM")
  if (!TIME_REGEX.test(booking_time)) {
    errors.push('booking_time must be in HH:MM 24-hour format');
  }

  // Date validity + not in the past
  const parsedDate = new Date(booking_date);
  if (isNaN(parsedDate.getTime())) {
    errors.push('booking_date is not a valid date');
  } else {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (parsedDate < today) {
      errors.push('booking_date cannot be in the past');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ message: 'Validation failed', errors });
  }

  try {
    // Service must exist
    const serviceCheck = await pool.query('SELECT id FROM services WHERE id = $1', [service_id]);
    if (serviceCheck.rows.length === 0) {
      return res.status(400).json({ message: 'Validation failed', errors: ['Selected service does not exist'] });
    }

    // Pre-check for duplicate slot (friendlier than waiting for the DB error)
    const slotCheck = await pool.query(
      `SELECT id FROM bookings
       WHERE service_id = $1 AND booking_date = $2 AND booking_time = $3
       AND status != 'cancelled'`,
      [service_id, booking_date, booking_time]
    );
    if (slotCheck.rows.length > 0) {
      return res.status(409).json({ message: 'This time slot is already booked for this service' });
    }

    next(); // all good — hand off to the controller
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Validation error' });
  }
};

module.exports = validateBooking;