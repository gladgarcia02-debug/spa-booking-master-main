const express = require('express');
const router = express.Router();
const {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} = require('../controllers/serviceController');
const requireAuth = require('../middleware/authMiddleware');

router.get('/', getAllServices);                    // public — customers browse services
router.get('/:id', getServiceById);                   // public — booking page needs this
router.post('/', requireAuth, createService);          // admin only
router.put('/:id', requireAuth, updateService);         // admin only
router.delete('/:id', requireAuth, deleteService);        // admin only

module.exports = router;