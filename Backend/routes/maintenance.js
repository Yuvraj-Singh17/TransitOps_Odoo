import express from 'express';
import Maintenance from '../models/Maintenance.js';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to format maintenance response
const formatRecord = (record) => {
  const obj = record.toJSON ? record.toJSON() : record;
  obj.vehicleRegNumber = record.vehicleId ? record.vehicleId.regNumber : '';
  return obj;
};

// @desc    Get all maintenance records
// @route   GET /api/maintenance
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const records = await Maintenance.find()
      .populate('vehicleId')
      .sort({ createdAt: -1 });

    res.json(records.map(formatRecord));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a maintenance record
// @route   POST /api/maintenance
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { vehicleId, type, description, cost, scheduledDate } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // Creating active maintenance record automatically changes vehicle status to In Shop
    vehicle.status = 'In Shop';
    await vehicle.save();

    const record = await Maintenance.create({
      vehicleId,
      type,
      description: description || '',
      cost: cost || 0,
      scheduledDate,
      isActive: true,
    });

    const populatedRecord = await Maintenance.findById(record._id).populate('vehicleId');

    res.status(201).json(formatRecord(populatedRecord));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Close maintenance -> restores vehicle to Available (unless retired)
// @route   PATCH /api/maintenance/:id/close
// @access  Private
router.patch('/:id/close', protect, async (req, res) => {
  try {
    const { completedDate } = req.body;
    
    const record = await Maintenance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: 'Maintenance record not found' });
    }

    if (!record.isActive) {
      return res.status(400).json({ message: 'Maintenance record is already closed' });
    }

    const vehicle = await Vehicle.findById(record.vehicleId);

    // Close maintenance
    record.isActive = false;
    record.completedDate = completedDate || new Date();
    await record.save();

    // Restores vehicle status to Available (unless retired)
    if (vehicle) {
      if (vehicle.status !== 'Retired') {
        vehicle.status = 'Available';
        await vehicle.save();
      }
    }

    const populatedRecord = await Maintenance.findById(record._id).populate('vehicleId');

    res.json(formatRecord(populatedRecord));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
