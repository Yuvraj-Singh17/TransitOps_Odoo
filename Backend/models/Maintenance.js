import mongoose from 'mongoose';

const maintenanceSchema = new mongoose.Schema({
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Vehicle',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['Oil Change', 'Tyre Replacement', 'Brake Service', 'General Service', 'Repair'],
  },
  description: {
    type: String,
    trim: true,
    default: '',
  },
  cost: {
    type: Number,
    required: true,
    min: 0,
    default: 0,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  completedDate: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true,
  },
}, {
  timestamps: true,
});

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);
export default Maintenance;
