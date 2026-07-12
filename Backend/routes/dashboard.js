import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Driver from '../models/Driver.js';
import Trip from '../models/Trip.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get dashboard KPIs
// @route   GET /api/dashboard/kpis
// @access  Private
router.get('/kpis', protect, async (req, res) => {
  try {
    const activeVehicles = await Vehicle.countDocuments({ status: 'On Trip' });
    const availableVehicles = await Vehicle.countDocuments({ status: 'Available' });
    const vehiclesInMaintenance = await Vehicle.countDocuments({ status: 'In Shop' });
    const totalVehicles = await Vehicle.countDocuments();

    const activeTrips = await Trip.countDocuments({ status: 'Dispatched' });
    const pendingTrips = await Trip.countDocuments({ status: 'Draft' });

    // Drivers on duty: status is Available or On Trip (i.e. not Off Duty or Suspended)
    const driversOnDuty = await Driver.countDocuments({
      status: { $in: ['Available', 'On Trip'] }
    });

    // Fleet utilization %
    let fleetUtilization = 0;
    if (totalVehicles > 0) {
      fleetUtilization = Math.round((activeVehicles / totalVehicles) * 100);
    }

    res.json({
      activeVehicles,
      availableVehicles,
      vehiclesInMaintenance,
      activeTrips,
      pendingTrips,
      driversOnDuty,
      fleetUtilization,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
