import express from 'express';
import Trip from '../models/Trip.js';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Helper to format trip responses
const formatTrip = (trip) => {
  const obj = trip.toJSON ? trip.toJSON() : trip;
  obj.vehicleRegNumber = trip.vehicleId ? trip.vehicleId.regNumber : '';
  obj.driverName = trip.driverId ? trip.driverId.name : '';
  return obj;
};

// @desc    Get all trips (supports optional filters)
// @route   GET /api/trips
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const filters = {};
    if (req.query.status) {
      filters.status = req.query.status;
    }

    const trips = await Trip.find(filters)
      .populate('vehicleId')
      .populate('driverId')
      .sort({ createdAt: -1 });

    res.json(trips.map(formatTrip));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single trip
// @route   GET /api/trips/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('vehicleId')
      .populate('driverId');

    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    res.json(formatTrip(trip));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a trip (Draft status by default)
// @route   POST /api/trips
// @access  Private
router.post('/', protect, async (req, res) => {
  try {
    const { source, destination, vehicleId, driverId, cargoWeight, plannedDistance } = req.body;

    const vehicle = await Vehicle.findById(vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver not found' });
    }

    // Business Rule: Cargo Weight must not exceed vehicle's maximum load capacity
    if (cargoWeight > vehicle.maxLoadCapacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargoWeight} kg) exceeds vehicle's maximum load capacity (${vehicle.maxLoadCapacity} kg)`
      });
    }

    const trip = await Trip.create({
      source,
      destination,
      vehicleId,
      driverId,
      cargoWeight,
      plannedDistance,
      status: 'Draft',
    });

    const populatedTrip = await Trip.findById(trip._id)
      .populate('vehicleId')
      .populate('driverId');

    res.status(201).json(formatTrip(populatedTrip));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Dispatch trip -> vehicle & driver status become "On Trip"
// @route   PATCH /api/trips/:id/dispatch
// @access  Private
router.patch('/:id/dispatch', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'Draft') {
      return res.status(400).json({ message: `Cannot dispatch trip in '${trip.status}' status` });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle associated with trip not found' });
    }

    const driver = await Driver.findById(trip.driverId);
    if (!driver) {
      return res.status(404).json({ message: 'Driver associated with trip not found' });
    }

    // Business Rule: Retired or In Shop vehicles must never be dispatched
    if (vehicle.status === 'Retired' || vehicle.status === 'In Shop') {
      return res.status(400).json({ message: `Vehicle is currently ${vehicle.status} and cannot be dispatched` });
    }

    // Business Rule: Vehicle already marked On Trip cannot be assigned
    if (vehicle.status === 'On Trip') {
      return res.status(400).json({ message: 'Vehicle is already on another active trip' });
    }

    // Business Rule: Driver already marked On Trip or Suspended/Off Duty cannot be assigned
    if (driver.status === 'Suspended') {
      return res.status(400).json({ message: 'Driver is Suspended and cannot be assigned' });
    }
    if (driver.status === 'Off Duty') {
      return res.status(400).json({ message: 'Driver is Off Duty and cannot be assigned' });
    }
    if (driver.status === 'On Trip') {
      return res.status(400).json({ message: 'Driver is already on another active trip' });
    }

    // Business Rule: Driver with expired license cannot be assigned
    if (driver.licenseExpiryDate) {
      const expiry = new Date(driver.licenseExpiryDate);
      const today = new Date();
      // Set hours to 0 to compare days
      expiry.setHours(0,0,0,0);
      today.setHours(0,0,0,0);
      if (expiry < today) {
        return res.status(400).json({ message: 'Driver license is expired' });
      }
    }

    // Update vehicle & driver status
    vehicle.status = 'On Trip';
    driver.status = 'On Trip';

    // Update trip details
    trip.status = 'Dispatched';
    trip.startOdometer = vehicle.odometer;

    await vehicle.save();
    await driver.save();
    await trip.save();

    const populatedTrip = await Trip.findById(trip._id)
      .populate('vehicleId')
      .populate('driverId');

    res.json(formatTrip(populatedTrip));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Complete trip -> requires final odometer + fuel consumed
// @route   PATCH /api/trips/:id/complete
// @access  Private
router.patch('/:id/complete', protect, async (req, res) => {
  try {
    const { finalOdometer, fuelConsumed, revenue } = req.body;
    
    if (finalOdometer === undefined || fuelConsumed === undefined) {
      return res.status(400).json({ message: 'Final odometer and fuel consumed are required' });
    }

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    if (trip.status !== 'Dispatched') {
      return res.status(400).json({ message: `Cannot complete trip in '${trip.status}' status` });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    // Business Rule Validation: Final odometer cannot be less than start odometer
    if (finalOdometer < trip.startOdometer) {
      return res.status(400).json({
        message: `Final odometer (${finalOdometer} km) cannot be less than start odometer (${trip.startOdometer} km)`
      });
    }

    // Update vehicle odometer and statuses
    if (vehicle) {
      vehicle.odometer = finalOdometer;
      vehicle.status = 'Available';
      await vehicle.save();
    }

    if (driver) {
      driver.status = 'Available';
      await driver.save();
    }

    trip.status = 'Completed';
    trip.finalOdometer = finalOdometer;
    trip.fuelConsumed = fuelConsumed;
    trip.revenue = revenue || 0;

    await trip.save();

    const populatedTrip = await Trip.findById(trip._id)
      .populate('vehicleId')
      .populate('driverId');

    res.json(formatTrip(populatedTrip));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Cancel trip -> restores vehicle & driver to Available
// @route   PATCH /api/trips/:id/cancel
// @access  Private
router.patch('/:id/cancel', protect, async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found' });
    }

    const vehicle = await Vehicle.findById(trip.vehicleId);
    const driver = await Driver.findById(trip.driverId);

    // Update statuses back to Available if they were dispatched
    if (trip.status === 'Dispatched') {
      if (vehicle) {
        vehicle.status = 'Available';
        await vehicle.save();
      }
      if (driver) {
        driver.status = 'Available';
        await driver.save();
      }
    }

    trip.status = 'Cancelled';
    await trip.save();

    const populatedTrip = await Trip.findById(trip._id)
      .populate('vehicleId')
      .populate('driverId');

    res.json(formatTrip(populatedTrip));
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
