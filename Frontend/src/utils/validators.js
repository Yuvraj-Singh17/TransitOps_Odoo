import { z } from "zod";

// ---- Auth ----
export const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// ---- Vehicle ----
export const vehicleSchema = z.object({
  regNumber: z.string().min(3, "Registration number is required"),
  name: z.string().min(2, "Vehicle name/model is required"),
  type: z.string().min(1, "Select a vehicle type"),
  maxLoadCapacity: z.coerce.number().positive("Must be greater than 0"),
  odometer: z.coerce.number().min(0, "Cannot be negative"),
  acquisitionCost: z.coerce.number().positive("Must be greater than 0"),
  status: z.string().min(1, "Select a status"),
});

// ---- Driver ----
export const driverSchema = z.object({
  name: z.string().min(2, "Name is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseCategory: z.string().min(1, "Select a license category"),
  licenseExpiryDate: z.string().min(1, "Expiry date is required"),
  contactNumber: z
    .string()
    .min(10, "Enter a valid contact number")
    .max(15, "Enter a valid contact number"),
  safetyScore: z.coerce.number().min(0).max(100),
  status: z.string().min(1, "Select a status"),
});

// ---- Trip ----
export const tripSchema = z.object({
  source: z.string().min(2, "Source is required"),
  destination: z.string().min(2, "Destination is required"),
  vehicleId: z.string().min(1, "Select a vehicle"),
  driverId: z.string().min(1, "Select a driver"),
  cargoWeight: z.coerce.number().positive("Must be greater than 0"),
  plannedDistance: z.coerce.number().positive("Must be greater than 0"),
});

export const tripCompletionSchema = z.object({
  finalOdometer: z.coerce.number().positive("Required"),
  fuelConsumed: z.coerce.number().positive("Required"),
  revenue: z.coerce.number().min(0).optional(),
});

// ---- Maintenance ----
export const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  type: z.string().min(1, "Select maintenance type"),
  description: z.string().optional(),
  cost: z.coerce.number().min(0, "Cannot be negative"),
  scheduledDate: z.string().min(1, "Date is required"),
});

// ---- Fuel Log ----
export const fuelLogSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  liters: z.coerce.number().positive("Must be greater than 0"),
  cost: z.coerce.number().positive("Must be greater than 0"),
  date: z.string().min(1, "Date is required"),
});

// ---- Expense ----
export const expenseSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  type: z.string().min(1, "Select expense type"),
  amount: z.coerce.number().positive("Must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

// ---- Shared business-rule helper ----
// Cargo weight must not exceed vehicle's max load capacity (Mandatory Rule, spec section 4)
export function validateCargoWeight(cargoWeight, vehicle) {
  if (!vehicle) return { valid: true };
  if (Number(cargoWeight) > vehicle.maxLoadCapacity) {
    return {
      valid: false,
      message: `Cargo weight (${cargoWeight}kg) exceeds ${vehicle.name}'s max capacity of ${vehicle.maxLoadCapacity}kg`,
    };
  }
  return { valid: true };
}