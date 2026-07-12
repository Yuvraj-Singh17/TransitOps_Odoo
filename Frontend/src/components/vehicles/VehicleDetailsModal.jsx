import { X } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import { formatCurrency, formatNumber } from "../../utils/formatters";

// Usage: <VehicleDetailsModal vehicle={selectedVehicle} onClose={fn} />
function VehicleDetailsModal({ vehicle, onClose }) {
  if (!vehicle) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-bg-card rounded-xl shadow-lg w-full max-w-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">{vehicle.name}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-text-secondary">
            <X size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-text-secondary">{vehicle.regNumber}</span>
          <StatusBadge status={vehicle.status} />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-400 text-xs">Type</p>
            <p className="font-medium">{vehicle.type}</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Max Load Capacity</p>
            <p className="font-medium">{formatNumber(vehicle.maxLoadCapacity)} kg</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Odometer</p>
            <p className="font-medium">{formatNumber(vehicle.odometer)} km</p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Acquisition Cost</p>
            <p className="font-medium">{formatCurrency(vehicle.acquisitionCost)}</p>
          </div>
          {vehicle.totalFuelCost !== undefined && (
            <div>
              <p className="text-gray-400 text-xs">Total Fuel Cost</p>
              <p className="font-medium">{formatCurrency(vehicle.totalFuelCost)}</p>
            </div>
          )}
          {vehicle.totalMaintenanceCost !== undefined && (
            <div>
              <p className="text-gray-400 text-xs">Total Maintenance Cost</p>
              <p className="font-medium">{formatCurrency(vehicle.totalMaintenanceCost)}</p>
            </div>
          )}
        </div>

        <div className="mt-5 pt-4 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg border text-text-secondary hover:bg-bg-card"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetailsModal;