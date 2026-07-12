import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { VEHICLE_STATUS, VEHICLE_TYPES } from "../../utils/constants";

const vehicleSchema = z.object({
  regNumber: z.string().min(3, "Registration number is required"),
  name: z.string().min(2, "Vehicle name/model is required"),
  type: z.string().min(1, "Select a vehicle type"),
  maxLoadCapacity: z.coerce.number().positive("Must be greater than 0"),
  odometer: z.coerce.number().min(0, "Cannot be negative"),
  acquisitionCost: z.coerce.number().positive("Must be greater than 0"),
  status: z.string().min(1, "Select a status"),
});

// Usage: <VehicleForm defaultValues={editingVehicle} onSubmit={handleSave} onCancel={closeModal} />
function VehicleForm({ defaultValues, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(vehicleSchema),
    defaultValues: defaultValues || {
      regNumber: "",
      name: "",
      type: "",
      maxLoadCapacity: "",
      odometer: 0,
      acquisitionCost: "",
      status: VEHICLE_STATUS.AVAILABLE,
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Registration Number
          </label>
          <input
            {...register("regNumber")}
            disabled={!!defaultValues} // uniqueness - lock on edit
            className="w-full border rounded-lg px-3 py-2 text-sm disabled:bg-gray-100"
            placeholder="e.g. DL-01-AB-1234"
          />
          {errors.regNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.regNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle Name / Model
          </label>
          <input
            {...register("name")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Tata Ace"
          />
          {errors.name && (
            <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
          <select {...register("type")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select type</option>
            {VEHICLE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select {...register("status")} className="w-full border rounded-lg px-3 py-2 text-sm">
            {Object.values(VEHICLE_STATUS).map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Load Capacity (kg)
          </label>
          <input
            type="number"
            {...register("maxLoadCapacity")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="500"
          />
          {errors.maxLoadCapacity && (
            <p className="text-red-500 text-xs mt-1">{errors.maxLoadCapacity.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Odometer (km)</label>
          <input
            type="number"
            {...register("odometer")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {errors.odometer && (
            <p className="text-red-500 text-xs mt-1">{errors.odometer.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Acquisition Cost (₹)
          </label>
          <input
            type="number"
            {...register("acquisitionCost")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="800000"
          />
          {errors.acquisitionCost && (
            <p className="text-red-500 text-xs mt-1">{errors.acquisitionCost.message}</p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : defaultValues ? "Update Vehicle" : "Add Vehicle"}
        </button>
      </div>
    </form>
  );
}

export default VehicleForm;