import express from 'express';
import FuelLog from '../models/FuelLog.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

const formatLog = (log) => {
  const obj = log.toJSON ? log.toJSON() : log;
  obj.vehicleRegNumber = log.vehicleId ? log.vehicleId.regNumber : '';
  return obj;
};

// @desc    Get all fuel logs
// @route   GET /api/fuel-logs
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const logs = await FuelLog.find()
      .populate('vehicleId')
      .sort({ date: -1, createdAt: -1 });

    res.json(logs.map(formatLog));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a fuel log
// @route   POST /api/fuel-logs
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, liters, cost, date } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const log = await FuelLog.create({
      vehicleId,
      liters,
      cost,
      date,
    });

    const populatedLog = await FuelLog.findById(log._id).populate('vehicleId');
    res.status(201).json(formatLog(populatedLog));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a fuel log
// @route   DELETE /api/fuel-logs/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const log = await FuelLog.findById(req.params.id);
    if (!log) {
      return res.status(404).json({ message: 'Fuel log not found' });
    }

    await FuelLog.deleteOne({ _id: req.params.id });
    res.json({ message: 'Fuel log removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
