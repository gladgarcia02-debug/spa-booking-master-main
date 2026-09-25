const pool = require('../config/db');

// GET /api/services
const getAllServices = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM services ORDER BY id ASC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch services' });
  }
};

// GET /api/services/:id
const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM services WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch service' });
  }
};

// POST /api/services
const createService = async (req, res) => {
  const { name, description, duration, price } = req.body;

  if (!name || !duration || price === undefined) {
    return res.status(400).json({ message: 'name, duration, and price are required' });
  }
  if (isNaN(duration) || duration <= 0) {
    return res.status(400).json({ message: 'duration must be a positive number' });
  }
  if (isNaN(price) || price < 0) {
    return res.status(400).json({ message: 'price must be a non-negative number' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO services (name, description, duration, price)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [name, description || null, duration, price]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create service' });
  }
};

// PUT /api/services/:id
const updateService = async (req, res) => {
  const { id } = req.params;
  const { name, description, duration, price } = req.body;

  if (!name || !duration || price === undefined) {
    return res.status(400).json({ message: 'name, duration, and price are required' });
  }

  try {
    const result = await pool.query(
      `UPDATE services
       SET name = $1, description = $2, duration = $3, price = $4
       WHERE id = $5 RETURNING *`,
      [name, description || null, duration, price, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update service' });
  }
};

// DELETE /api/services/:id
const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'DELETE FROM services WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }
    res.json({ message: 'Service deleted', service: result.rows[0] });
  } catch (err) {
    // Foreign key violation — service still has bookings pointing to it
    if (err.code === '23503') {
      return res.status(409).json({
        message: 'Cannot delete: this service has existing bookings',
      });
    }
    console.error(err);
    res.status(500).json({ message: 'Failed to delete service' });
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
};