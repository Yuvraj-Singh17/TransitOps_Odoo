import express from 'express';
import Vehicle from '../models/Vehicle.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all vehicles (supports optional filters: status, type)
// @route   GET /api/vehicles
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }
    if (req.query.type) {
      filters.type = req.query.type;
    }

    const vehicles = await Vehicle.find(filters).sort({ createdAt: -1 });
    res.json(vehicles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single vehicle by id
// @route   GET /api/vehicles/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a vehicle
// @route   POST /api/vehicles
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { regNumber, name, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

    const vehicleExists = await Vehicle.findOne({ regNumber: regNumber.trim() });
    if (vehicleExists) {
      return res.status(400).json({ message: `Vehicle with registration number ${regNumber} already exists` });
    }

    const vehicle = await Vehicle.create({
      regNumber: regNumber.trim(),
      name,
      type,
      maxLoadCapacity,
      odometer: odometer || 0,
      acquisitionCost,
      status: status || 'Available',
    });

    res.status(201).json(vehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Update a vehicle
// @route   PUT /api/vehicles/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  try {
    const { name, type, maxLoadCapacity, odometer, acquisitionCost, status } = req.body;

    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    // regNumber is locked in frontend on edit, so we update other fields
    vehicle.name = name ?? vehicle.name;
    vehicle.type = type ?? vehicle.type;
    vehicle.maxLoadCapacity = maxLoadCapacity ?? vehicle.maxLoadCapacity;
    vehicle.odometer = odometer ?? vehicle.odometer;
    vehicle.acquisitionCost = acquisitionCost ?? vehicle.acquisitionCost;
    vehicle.status = status ?? vehicle.status;

    const updatedVehicle = await vehicle.save();
    res.json(updatedVehicle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a vehicle
// @route   DELETE /api/vehicles/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    await Vehicle.deleteOne({ _id: req.params.id });
    res.json({ message: 'Vehicle removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
