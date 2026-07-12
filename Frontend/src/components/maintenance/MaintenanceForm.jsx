import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getVehiclesForMaintenance } from "../../api/maintenanceApi";
import { VEHICLE_STATUS } from "../../utils/constants";

const MAINTENANCE_TYPES = ["Oil Change", "Tyre Replacement", "Brake Service", "General Service", "Repair"];

const maintenanceSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  type: z.string().min(1, "Select maintenance type"),
  description: z.string().optional(),
  cost: z.coerce.number().min(0, "Cannot be negative"),
  scheduledDate: z.string().min(1, "Date is required"),
});

// Usage: <MaintenanceForm onSubmit={handleCreate} onCancel={closeModal} />
function MaintenanceForm({ onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(maintenanceSchema) });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles-for-maintenance"],
    queryFn: getVehiclesForMaintenance,
  });

  // Exclude vehicles already In Shop or Retired — can't open a 2nd active record,
  // and a retired vehicle shouldn't get maintenance
  const eligibleVehicles = vehicles.filter(
    (v) => v.status !== VEHICLE_STATUS.IN_SHOP && v.status !== VEHICLE_STATUS.RETIRED
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle {vehiclesLoading && "(loading...)"}
          </label>
          <select {...register("vehicleId")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select vehicle</option>
            {eligibleVehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.regNumber} — {v.name} ({v.status})
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-red-500 text-xs mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Maintenance Type
          </label>
          <select {...register("type")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select type</option>
            {MAINTENANCE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Scheduled Date
          </label>
          <input
            type="date"
            {...register("scheduledDate")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {errors.scheduledDate && (
            <p className="text-red-500 text-xs mt-1">{errors.scheduledDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Estimated Cost (₹)
          </label>
          <input
            type="number"
            {...register("cost")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="2500"
          />
          {errors.cost && <p className="text-red-500 text-xs mt-1">{errors.cost.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            {...register("description")}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Additional notes..."
          />
        </div>
      </div>

      <div className="bg-orange-50 border border-orange-200 text-orange-700 text-xs px-3 py-2 rounded-lg">
        ⚠️ Creating this record will automatically set the vehicle status to <b>In Shop</b> and
        remove it from trip dispatch selection.
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
          {loading ? "Creating..." : "Create Maintenance Record"}
        </button>
      </div>
    </form>
  );
}

export default MaintenanceForm;