import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Vehicle from './models/Vehicle.js';
import Driver from './models/Driver.js';
import Trip from './models/Trip.js';
import FuelLog from './models/FuelLog.js';
import Expense from './models/Expense.js';
import Maintenance from './models/Maintenance.js';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data (except users)
    await Vehicle.deleteMany({});
    await Driver.deleteMany({});
    await Trip.deleteMany({});
    await FuelLog.deleteMany({});
    await Expense.deleteMany({});
    await Maintenance.deleteMany({});
    console.log('Cleared existing dummy data');

    // Seed Vehicles
    const vehicles = await Vehicle.insertMany([
      { regNumber: 'MH-12-AB-1234', name: 'Tata Signa', type: 'Heavy Truck', maxLoadCapacity: 40000, odometer: 15000, acquisitionCost: 3500000, status: 'Available' },
      { regNumber: 'DL-01-CD-5678', name: 'Ashok Leyland Dost', type: 'Light Truck', maxLoadCapacity: 1500, odometer: 5000, acquisitionCost: 800000, status: 'On Trip' },
      { regNumber: 'GJ-05-EF-9012', name: 'Mahindra Bolero Pickup', type: 'Pickup', maxLoadCapacity: 1000, odometer: 12000, acquisitionCost: 900000, status: 'Available' },
      { regNumber: 'KA-03-GH-3456', name: 'Volvo FMX', type: 'Heavy Truck', maxLoadCapacity: 45000, odometer: 45000, acquisitionCost: 8500000, status: 'In Shop' },
      { regNumber: 'TN-09-IJ-7890', name: 'BharatBenz 2823C', type: 'Tipper', maxLoadCapacity: 28000, odometer: 32000, acquisitionCost: 4200000, status: 'Available' },
      { regNumber: 'UP-14-KL-1122', name: 'Eicher Pro 2049', type: 'Light Truck', maxLoadCapacity: 2000, odometer: 18000, acquisitionCost: 1100000, status: 'On Trip' }
    ]);
    console.log('Seeded vehicles');

    // Seed Drivers
    const drivers = await Driver.insertMany([
      { name: 'Raju Bhai', licenseNumber: 'DL-1990-1234567', licenseCategory: 'HMV', licenseExpiryDate: new Date('2028-05-10'), contactNumber: '9876543210', safetyScore: 95, status: 'Available' },
      { name: 'Singh Ji', licenseNumber: 'PB-1985-7654321', licenseCategory: 'HMV', licenseExpiryDate: new Date('2026-11-20'), contactNumber: '8765432109', safetyScore: 88, status: 'On Trip' },
      { name: 'Kishore', licenseNumber: 'MH-2005-9988776', licenseCategory: 'LMV', licenseExpiryDate: new Date('2030-01-15'), contactNumber: '7654321098', safetyScore: 75, status: 'Available' },
      { name: 'Arun Kumar', licenseNumber: 'TN-1995-1122334', licenseCategory: 'HMV', licenseExpiryDate: new Date('2027-08-22'), contactNumber: '9988776655', safetyScore: 92, status: 'On Trip' },
      { name: 'Vikram', licenseNumber: 'GJ-1992-4455667', licenseCategory: 'Transport', licenseExpiryDate: new Date('2029-03-14'), contactNumber: '9123456780', safetyScore: 60, status: 'Off Duty' }
    ]);
    console.log('Seeded drivers');

    // Seed Trips
    const trips = await Trip.insertMany([
      { source: 'Mumbai', destination: 'Delhi', vehicleId: vehicles[0]._id, driverId: drivers[0]._id, cargoWeight: 35000, plannedDistance: 1400, status: 'Draft', revenue: 150000 },
      { source: 'Ahmedabad', destination: 'Pune', vehicleId: vehicles[1]._id, driverId: drivers[1]._id, cargoWeight: 1200, plannedDistance: 650, status: 'Dispatched', startOdometer: 5000, revenue: 25000 },
      { source: 'Bangalore', destination: 'Chennai', vehicleId: vehicles[4]._id, driverId: drivers[3]._id, cargoWeight: 26000, plannedDistance: 350, status: 'Completed', startOdometer: 14000, finalOdometer: 14350, fuelConsumed: 120, revenue: 45000 },
      { source: 'Delhi', destination: 'Jaipur', vehicleId: vehicles[5]._id, driverId: drivers[1]._id, cargoWeight: 1800, plannedDistance: 280, status: 'Completed', startOdometer: 17720, finalOdometer: 18000, fuelConsumed: 45, revenue: 18000 },
      { source: 'Hyderabad', destination: 'Nagpur', vehicleId: vehicles[0]._id, driverId: drivers[2]._id, cargoWeight: 32000, plannedDistance: 500, status: 'Cancelled', revenue: 0 }
    ]);
    console.log('Seeded trips');

    // Seed FuelLogs
    await FuelLog.insertMany([
      { vehicleId: vehicles[0]._id, liters: 150, cost: 14000, date: new Date('2026-07-01') },
      { vehicleId: vehicles[1]._id, liters: 40, cost: 3800, date: new Date('2026-07-05') },
      { vehicleId: vehicles[0]._id, liters: 100, cost: 9300, date: new Date('2026-07-10') },
      { vehicleId: vehicles[4]._id, liters: 120, cost: 11500, date: new Date('2026-07-09') },
      { vehicleId: vehicles[5]._id, liters: 45, cost: 4200, date: new Date('2026-07-08') }
    ]);
    console.log('Seeded fuel logs');

    // Seed Expenses
    await Expense.insertMany([
      { vehicleId: vehicles[0]._id, type: 'Toll', amount: 1500, date: new Date('2026-07-02'), notes: 'Mumbai-Pune Expressway' },
      { vehicleId: vehicles[1]._id, type: 'Parking', amount: 300, date: new Date('2026-07-06') },
      { vehicleId: vehicles[3]._id, type: 'Other', amount: 5000, date: new Date('2026-07-08'), notes: 'Towing charges' },
      { vehicleId: vehicles[4]._id, type: 'Permit/Fine', amount: 1200, date: new Date('2026-07-10'), notes: 'State border tax' },
      { vehicleId: vehicles[5]._id, type: 'Insurance', amount: 15000, date: new Date('2026-07-01'), notes: 'Annual premium' }
    ]);
    console.log('Seeded expenses');

    // Seed Maintenance
    await Maintenance.insertMany([
      { vehicleId: vehicles[3]._id, type: 'Repair', description: 'Engine knocking issue', cost: 45000, scheduledDate: new Date('2026-07-11'), isActive: true },
      { vehicleId: vehicles[0]._id, type: 'Oil Change', description: 'Regular maintenance', cost: 12000, scheduledDate: new Date('2026-06-15'), completedDate: new Date('2026-06-16'), isActive: false },
      { vehicleId: vehicles[2]._id, type: 'Tyre Replacement', description: 'Replaced 2 rear tyres', cost: 18000, scheduledDate: new Date('2026-07-05'), completedDate: new Date('2026-07-06'), isActive: false }
    ]);
    console.log('Seeded maintenance');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
