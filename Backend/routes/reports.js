import express from 'express';
import Vehicle from '../models/Vehicle.js';
import Trip from '../models/Trip.js';
import Maintenance from '../models/Maintenance.js';
import FuelLog from '../models/FuelLog.js';
import Expense from '../models/Expense.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get cost summary per vehicle (Fuel + Maintenance + Expenses)
// @route   GET /api/reports/cost-summary
// @access  Private
router.get('/cost-summary', protect, async (req, res) => {
  try {
    const vehicleQuery = {};
    if (req.query.vehicleId) {
      vehicleQuery._id = req.query.vehicleId;
    }

    const vehicles = await Vehicle.find(vehicleQuery);
    const summaries = [];

    for (const vehicle of vehicles) {
      // 1. Sum fuel logs cost
      const fuelLogs = await FuelLog.find({ vehicleId: vehicle._id });
      const fuelCost = fuelLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      // 2. Sum maintenance cost (both active and completed)
      const maintenanceLogs = await Maintenance.find({ vehicleId: vehicle._id });
      const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      // 3. Sum other expenses
      const expenses = await Expense.find({ vehicleId: vehicle._id });
      const otherExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

      summaries.push({
        vehicleId: vehicle.id,
        vehicleRegNumber: vehicle.regNumber,
        fuelCost,
        maintenanceCost,
        otherExpenses,
        totalCost: fuelCost + maintenanceCost + otherExpenses,
      });
    }

    // If query was for a single vehicle, return the object directly or in array
    // The frontend hooks call getCostSummary(vehicleId?) -> if it returns an array,
    // FuelExpense.jsx does (costSummary || []).map(...)
    // So we should always return an array.
    res.json(summaries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get fuel efficiency report (Distance / Fuel Consumed)
// @route   GET /api/reports/fuel-efficiency
// @access  Private
router.get('/fuel-efficiency', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const report = [];

    for (const vehicle of vehicles) {
      const completedTrips = await Trip.find({
        vehicleId: vehicle._id,
        status: 'Completed',
        fuelConsumed: { $gt: 0 },
      });

      if (completedTrips.length === 0) {
        continue; // Only show vehicles with completed trip data
      }

      let totalDistance = 0;
      let totalFuel = 0;

      for (const trip of completedTrips) {
        // Actual distance from odometer difference, or fall back to plannedDistance
        const tripDistance = (trip.finalOdometer && trip.startOdometer)
          ? (trip.finalOdometer - trip.startOdometer)
          : trip.plannedDistance;
        
        totalDistance += tripDistance || 0;
        totalFuel += trip.fuelConsumed || 0;
      }

      const efficiency = totalFuel > 0 ? Number((totalDistance / totalFuel).toFixed(2)) : 0;

      report.push({
        vehicleRegNumber: vehicle.regNumber,
        efficiency,
      });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get utilization report (Counts of vehicles in each status)
// @route   GET /api/reports/utilization
// @access  Private
router.get('/utilization', protect, async (req, res) => {
  try {
    const available = await Vehicle.countDocuments({ status: 'Available' });
    const onTrip = await Vehicle.countDocuments({ status: 'On Trip' });
    const inShop = await Vehicle.countDocuments({ status: 'In Shop' });
    const retired = await Vehicle.countDocuments({ status: 'Retired' });

    res.json({
      available,
      onTrip,
      inShop,
      retired,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get vehicle ROI report
// @route   GET /api/reports/vehicle-roi
// @access  Private
router.get('/vehicle-roi', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const report = [];

    for (const vehicle of vehicles) {
      // 1. Sum of revenue from completed trips
      const completedTrips = await Trip.find({
        vehicleId: vehicle._id,
        status: 'Completed',
      });
      const revenue = completedTrips.reduce((sum, trip) => sum + (trip.revenue || 0), 0);

      // 2. Sum of fuel cost
      const fuelLogs = await FuelLog.find({ vehicleId: vehicle._id });
      const fuelCost = fuelLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      // 3. Sum of maintenance cost
      const maintenanceLogs = await Maintenance.find({ vehicleId: vehicle._id });
      const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      report.push({
        vehicleRegNumber: vehicle.regNumber,
        revenue,
        fuelCost,
        maintenanceCost,
        acquisitionCost: vehicle.acquisitionCost || 1, // Avoid division by zero
      });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get operational cost (same as cost summary but styled as reports endpoint)
// @route   GET /api/reports/operational-cost
// @access  Private
router.get('/operational-cost', protect, async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const report = [];

    for (const vehicle of vehicles) {
      const fuelLogs = await FuelLog.find({ vehicleId: vehicle._id });
      const fuelCost = fuelLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      const maintenanceLogs = await Maintenance.find({ vehicleId: vehicle._id });
      const maintenanceCost = maintenanceLogs.reduce((sum, log) => sum + (log.cost || 0), 0);

      const expenses = await Expense.find({ vehicleId: vehicle._id });
      const otherExpenses = expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0);

      report.push({
        vehicleRegNumber: vehicle.regNumber,
        fuelCost,
        maintenanceCost,
        otherExpenses,
        totalCost: fuelCost + maintenanceCost + otherExpenses,
      });
    }

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
