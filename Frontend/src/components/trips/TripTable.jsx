import { Eye } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import TripLifecycleActions from "./TripLifecycleActions";

// Usage: <TripTable trips={data} onDispatch={fn} onComplete={fn} onCancel={fn} onViewDetails={fn} />
function TripTable({ trips = [], onDispatch, onComplete, onCancel, onViewDetails, actionLoading }) {
  if (trips.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No trips found. Create one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3 font-medium">Route</th>
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Driver</th>
            <th className="px-4 py-3 font-medium">Cargo</th>
            <th className="px-4 py-3 font-medium">Distance</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Actions</th>
            <th className="px-4 py-3 font-medium text-right">Details</th>
          </tr>
        </thead>
        <tbody>
          {trips.map((t) => (
            <tr key={t.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{t.source}</div>
                <div className="text-xs text-gray-400">→ {t.destination}</div>
              </td>
              <td className="px-4 py-3">{t.vehicleRegNumber || t.vehicleId}</td>
              <td className="px-4 py-3">{t.driverName || t.driverId}</td>
              <td className="px-4 py-3">{t.cargoWeight} kg</td>
              <td className="px-4 py-3">{t.plannedDistance} km</td>
              <td className="px-4 py-3">
                <StatusBadge status={t.status} />
              </td>
              <td className="px-4 py-3">
                <TripLifecycleActions
                  trip={t}
                  onDispatch={onDispatch}
                  onComplete={onComplete}
                  onCancel={onCancel}
                  loading={actionLoading}
                />
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onViewDetails(t)}
                  className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                >
                  <Eye size={16} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TripTable;