import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Models
import User from './models/User.js';

// Routes
import authRoutes from './routes/auth.js';
import vehicleRoutes from './routes/vehicles.js';
import driverRoutes from './routes/drivers.js';
import tripRoutes from './routes/trips.js';
import maintenanceRoutes from './routes/maintenance.js';
import fuelLogRoutes from './routes/fuelLogs.js';
import expenseRoutes from './routes/expenses.js';
import reportsRoutes from './routes/reports.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Seeder Function
const seedUsers = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('🚀 Database is empty. Seeding initial users...');
      await User.create([
        {
          email: 'manager@transitops.com',
          password: 'manager123',
          role: 'Fleet Manager',
        },
        {
          email: 'safety@transitops.com',
          password: 'safety123',
          role: 'Safety Officer',
        },
        {
          email: 'finance@transitops.com',
          password: 'finance123',
          role: 'Financial Analyst',
        },
        {
          email: 'driver@transitops.com',
          password: 'driver123',
          role: 'Driver',
        },
      ]);
      console.log('✅ Initial users seeded successfully!');
    }
  } catch (error) {
    console.error('❌ Seeding users failed:', error.message);
  }
};

// Execute Seeder
seedUsers();

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/drivers', driverRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/fuel-logs', fuelLogRoutes);
app.use('/api/expenses', expenseRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('TransitOps API is running...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`📡 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

module.exports = app; // Or "export default app;" if you are using ES modules