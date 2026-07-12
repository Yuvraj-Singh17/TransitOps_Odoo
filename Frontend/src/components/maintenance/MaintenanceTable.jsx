import { CheckCircle } from "lucide-react";

// Usage: <MaintenanceTable records={data} onClose={fn} />
function MaintenanceTable({ records = [], onClose }) {
  if (records.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400 text-sm">
        No maintenance records found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50 border-b">
          <tr className="text-left text-gray-600">
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Type</th>
            <th className="px-4 py-3 font-medium">Scheduled Date</th>
            <th className="px-4 py-3 font-medium">Cost</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {records.map((r) => (
            <tr key={r.id} className="border-b last:border-0 hover:bg-gray-50">
              <td className="px-4 py-3 font-medium text-gray-800">
                {r.vehicleRegNumber || r.vehicleId}
              </td>
              <td className="px-4 py-3">{r.type}</td>
              <td className="px-4 py-3">{r.scheduledDate}</td>
              <td className="px-4 py-3">₹{r.cost}</td>
              <td className="px-4 py-3">
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                    r.isActive
                      ? "bg-orange-100 text-orange-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {r.isActive ? "In Progress" : "Closed"}
                </span>
              </td>
              <td className="px-4 py-3 text-right">
                {r.isActive && (
                  <button
                    onClick={() => onClose(r.id)}
                    className="flex items-center gap-1.5 ml-auto bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
                  >
                    <CheckCircle size={14} /> Close
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MaintenanceTable;