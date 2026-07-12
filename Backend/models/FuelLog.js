import mongoose from 'mongoose';

const fuelLogSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  liters: {
    type: Number,
    required: true,
    min: 0.01,
  },
  cost: {
    type: Number,
    required: true,
    min: 0.01,
  },
  date: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

const FuelLog = mongoose.model('FuelLog', fuelLogSchema);
export default FuelLog;
