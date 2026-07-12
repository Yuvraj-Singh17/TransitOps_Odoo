import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";

// Usage: <VehicleTable vehicles={data} onEdit={fn} onDelete={fn} />
function VehicleTable({ vehicles = [], onEdit, onDelete }) {
  if (vehicles.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No vehicles found. Add one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3 font-medium">Reg. Number</th>
            <th className="px-4 py-3 font-medium">Name / Model</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Max Capacity</th>
            <th className="px-4 py-3 font-medium">Odometer</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v) => (
            <tr key={v.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">{v.regNumber}</td>
              <td className="px-4 py-3">{v.name}</td>
              <td className="px-4 py-3">{v.type}</td>
              <td className="px-4 py-3">{v.maxLoadCapacity} kg</td>
              <td className="px-4 py-3">{v.odometer} km</td>
              <td className="px-4 py-3">
                <StatusBadge status={v.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(v)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(v.id)}
                    className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleTable;