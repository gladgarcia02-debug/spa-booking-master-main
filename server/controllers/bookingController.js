const pool = require('../config/db');

// Helper: generate a booking reference like SPA-7F3K9
const generateBookingReference = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/I/1 to avoid confusion
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return `SPA-${code}`;
};

// POST /api/bookings
// NOTE: this is intentionally basic for now — full validation
// (email format, date/time sanity, duplicate slot check) lands in Step 6.
// POST /api/bookings
// Validation (required fields, email/date/time format, service existence,
// duplicate slot pre-check) already ran in middleware/validateBooking.js
const createBooking = async (req, res) => {
  const {
    customer_name,
    customer_email,
    customer_phone,
    service_id,
    booking_date,
    booking_time,
  } = req.body;

  try {
    const bookingReference = generateBookingReference();

    const result = await pool.query(
      `INSERT INTO bookings
        (booking_reference, customer_name, customer_email, customer_phone, service_id, booking_date, booking_time, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [bookingReference, customer_name, customer_email, customer_phone, service_id, booking_date, booking_time]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    // Still catch this as a backstop in case of a race condition
    // between the pre-check and the insert
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This time slot is already booked for this service' });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to create booking' });
  }
};

// GET /api/bookings
// Joins service info so the admin dashboard doesn't need a second request per row
const getAllBookings = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT b.*, s.name AS service_name, s.duration, s.price
      FROM bookings b
      JOIN services s ON b.service_id = s.id
      ORDER BY b.booking_date DESC, b.booking_time DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch bookings' });
  }
};

// GET /api/bookings/:id
const getBookingById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      `SELECT b.*, s.name AS service_name, s.duration, s.price
       FROM bookings b
       JOIN services s ON b.service_id = s.id
       WHERE b.id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch booking' });
  }
};

// PATCH /api/bookings/:id/status
const updateBookingStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ message: `status must be one of: ${validStatuses.join(', ')}` });
  }

  try {
    const result = await pool.query(
      'UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update booking status' });
  }
};

// DELETE /api/bookings/:id
const deleteBooking = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM bookings WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    res.json({ message: 'Booking deleted', booking: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete booking' });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
};