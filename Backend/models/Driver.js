import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  licenseNumber: {
    type: String,
    required: true,
    trim: true,
  },
  licenseCategory: {
    type: String,
    required: true,
    enum: ['LMV', 'HMV', 'MCWG', 'Transport'],
  },
  licenseExpiryDate: {
    type: Date,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true,
  },
  safetyScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100,
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available',
  },
}, {
  timestamps: true,
});

const Driver = mongoose.model('Driver', driverSchema);
export default Driver;
