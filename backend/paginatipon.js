const express = require('express');
const router = express.Router();
const Item = require('../models/Item');

// GET /api/items - Get all items with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  try {
    const items = await Item.find().skip(skip).limit(limit);
    const totalItems = await Item.countDocuments();
    res.json({
      items,
      totalItems,
      totalPages: Math.ceil(totalItems / limit),
      currentPage: page,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
