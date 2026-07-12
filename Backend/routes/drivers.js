import express from 'express';
import Driver from '../models/Driver.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all drivers (supports optional filters: status, licenseCategory)
// @route   GET /api/drivers
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.licenseCategory) {
      filters.licenseCategory = req.query.licenseCategory;
    }

    const drivers = await Driver.find(filters).sort({ createdAt: -1 });
    res.json(drivers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single driver by id
// @route   GET /api/drivers/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }
    res.json(driver);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a driver
// @route   POST /api/drivers
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

    const driver = await Driver.create({
      name,
      licenseNumber,
      licenseCategory,
      licenseExpiryDate,
      contactNumber,
      safetyScore: safetyScore ?? 100,
      status: status || 'Available',
    });

    res.status(201).json(driver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a driver
// @route   PUT /api/drivers/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, licenseNumber, licenseCategory, licenseExpiryDate, contactNumber, safetyScore, status } = req.body;

    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    driver.name = name ?? driver.name;
    driver.licenseNumber = licenseNumber ?? driver.licenseNumber;
    driver.licenseCategory = licenseCategory ?? driver.licenseCategory;
    driver.licenseExpiryDate = licenseExpiryDate ?? driver.licenseExpiryDate;
    driver.contactNumber = contactNumber ?? driver.contactNumber;
    driver.safetyScore = safetyScore ?? driver.safetyScore;
    driver.status = status ?? driver.status;

    const updatedDriver = await driver.save();
    res.json(updatedDriver);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a driver
// @route   DELETE /api/drivers/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    await Driver.deleteOne({ _id: req.params.id });
    res.json({ message: 'Driver removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
