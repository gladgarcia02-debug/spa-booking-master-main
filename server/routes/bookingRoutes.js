const express = require('express');
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');
const validateBooking = require('../middleware/validateBooking');
const requireAuth = require('../middleware/authMiddleware');

router.post('/', validateBooking, createBooking);          // public — customers create bookings
router.get('/', requireAuth, getAllBookings);               // admin only — full bookings list
router.get('/:id', getBookingById);                          // public — confirmation page needs this
router.patch('/:id/status', requireAuth, updateBookingStatus);            // used by both customer (cancel) and admin
router.delete('/:id', deleteBooking);                          // admin only in practice, not locked down yet

module.exports = router;