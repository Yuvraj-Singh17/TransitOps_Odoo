import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getAvailableVehicles, getAvailableDrivers } from "../../api/tripApi";
import { differenceInDays, parseISO } from "date-fns";
import { DRIVER_STATUS } from "../../utils/constants";

const tripSchema = z.object({
  source: z.string().min(2, "Source is required"),
  destination: z.string().min(2, "Destination is required"),
  vehicleId: z.string().min(1, "Select a vehicle"),
  driverId: z.string().min(1, "Select a driver"),
  cargoWeight: z.coerce.number().positive("Must be greater than 0"),
  plannedDistance: z.coerce.number().positive("Must be greater than 0"),
});

// Usage: <TripForm onSubmit={handleCreate} onCancel={closeModal} />
function TripForm({ onSubmit, onCancel, loading }) {
  const [capacityWarning, setCapacityWarning] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(tripSchema) });

  // Only fetch vehicles/drivers with status = Available
  // This enforces: "Retired/In Shop vehicles never appear in dispatch selection"
  // and "Drivers with expired license or Suspended cannot be assigned"
  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["available-vehicles"],
    queryFn: getAvailableVehicles,
  });

  const { data: drivers = [], isLoading: driversLoading } = useQuery({
    queryKey: ["available-drivers"],
    queryFn: getAvailableDrivers,
  });

  // Extra client-side safety net: filter out expired-license / suspended drivers
  // even if backend somehow returns them
  const eligibleDrivers = drivers.filter((d) => {
    if (d.status === DRIVER_STATUS.SUSPENDED) return false;
    if (d.licenseExpiryDate && differenceInDays(parseISO(d.licenseExpiryDate), new Date()) < 0) {
      return false;
    }
    return true;
  });

  const selectedVehicleId = watch("vehicleId");
  const cargoWeight = watch("cargoWeight");

  // Live cargo weight validation against selected vehicle's max capacity
  useEffect(() => {
    const vehicle = vehicles.find((v) => String(v.id) === String(selectedVehicleId));
    if (vehicle && cargoWeight) {
      if (Number(cargoWeight) > vehicle.maxLoadCapacity) {
        setCapacityWarning(
          `⚠️ Cargo (${cargoWeight}kg) exceeds ${vehicle.name}'s max capacity of ${vehicle.maxLoadCapacity}kg`
        );
      } else {
        setCapacityWarning("");
      }
    } else {
      setCapacityWarning("");
    }
  }, [selectedVehicleId, cargoWeight, vehicles]);

  const handleFormSubmit = (data) => {
    const vehicle = vehicles.find((v) => String(v.id) === String(data.vehicleId));

    // Hard block: cargo weight must not exceed vehicle max load capacity (Mandatory Rule)
    if (vehicle && Number(data.cargoWeight) > vehicle.maxLoadCapacity) {
      setCapacityWarning(
        `Cannot create trip: cargo weight exceeds ${vehicle.name}'s max capacity`
      );
      return;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">Source</label>
          <input
            {...register("source")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Delhi"
          />
          {errors.source && <p className="text-red-500 text-xs mt-1">{errors.source.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">Destination</label>
          <input
            {...register("destination")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Jaipur"
          />
          {errors.destination && (
            <p className="text-red-500 text-xs mt-1">{errors.destination.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            Vehicle {vehiclesLoading && "(loading...)"}
          </label>
          <select {...register("vehicleId")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option className="bg-[#0B0F14] text-[#E5E7EB]"  value="">Select available vehicle</option>
            {vehicles.map((v) => (
              <option className="bg-[#0B0F14] text-[#E5E7EB]"  key={v.id} value={v.id}>
                {v.regNumber} — {v.name} (max {v.maxLoadCapacity}kg)
              </option>
            ))}
          </select>
          {vehicles.length === 0 && !vehiclesLoading && (
            <p className="text-orange-500 text-xs mt-1">No available vehicles right now</p>
          )}
          {errors.vehicleId && (
            <p className="text-red-500 text-xs mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            Driver {driversLoading && "(loading...)"}
          </label>
          <select {...register("driverId")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option className="bg-[#0B0F14] text-[#E5E7EB]"  value="">Select available driver</option>
            {eligibleDrivers.map((d) => (
              <option className="bg-[#0B0F14] text-[#E5E7EB]"  key={d.id} value={d.id}>
                {d.name} — {d.licenseCategory}
              </option>
            ))}
          </select>
          {eligibleDrivers.length === 0 && !driversLoading && (
            <p className="text-orange-500 text-xs mt-1">
              No eligible drivers (available + valid license)
            </p>
          )}
          {errors.driverId && (
            <p className="text-red-500 text-xs mt-1">{errors.driverId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            Cargo Weight (kg)
          </label>
          <input
            type="number"
            {...register("cargoWeight")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="450"
          />
          {errors.cargoWeight && (
            <p className="text-red-500 text-xs mt-1">{errors.cargoWeight.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            Planned Distance (km)
          </label>
          <input
            type="number"
            {...register("plannedDistance")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="280"
          />
          {errors.plannedDistance && (
            <p className="text-red-500 text-xs mt-1">{errors.plannedDistance.message}</p>
          )}
        </div>
      </div>

      {capacityWarning && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-xs px-3 py-2 rounded-lg">
          {capacityWarning}
        </div>
      )}

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border text-[#9CA3AF] hover:bg-[#0F172A]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 hover:bg-[#00A8E0] disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Trip"}
        </button>
      </div>
    </form>
  );
}

export default TripForm;