import { Pencil, Trash2 } from "lucide-react";
import StatusBadge from "../common/StatusBadge";
import LicenseExpiryBadge from "./LicenseExpiryBadge";

// Usage: <DriverTable drivers={data} onEdit={fn} onDelete={fn} />
function DriverTable({ drivers = [], onEdit, onDelete }) {
  if (drivers.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No drivers found. Add one to get started.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-[#121821] rounded-xl border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-[#0F172A] border-b border-[#1F2937]">
          <tr className="text-left text-[#9CA3AF]">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">License No.</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">License Expiry</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Safety Score</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers.map((d) => (
            <tr key={d.id} className="border-b border-[#1F2937] last:border-0 hover:bg-[#0F172A]">
              <td className="px-4 py-3 font-medium text-[#E5E7EB]">{d.name}</td>
              <td className="px-4 py-3">{d.licenseNumber}</td>
              <td className="px-4 py-3">{d.licenseCategory}</td>
              <td className="px-4 py-3">
                <LicenseExpiryBadge expiryDate={d.licenseExpiryDate} />
              </td>
              <td className="px-4 py-3">{d.contactNumber}</td>
              <td className="px-4 py-3">
                <span
                  className={`font-medium ${
                    d.safetyScore >= 80
                      ? "text-green-600"
                      : d.safetyScore >= 50
                      ? "text-orange-600"
                      : "text-red-600"
                  }`}
                >
                  {d.safetyScore}
                </span>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={d.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(d)}
                    className="p-1.5 rounded-lg hover:bg-blue-50 text-blue-600"
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => onDelete(d.id)}
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

export default DriverTable;