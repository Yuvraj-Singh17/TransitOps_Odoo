import { STATUS_COLOR_MAP } from "../../utils/constants";

// Usage: <StatusBadge status="Available" />
function StatusBadge({ status }) {
  const colorClass = STATUS_COLOR_MAP[status] || "bg-gray-400";

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-white ${colorClass}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-[#121821]/80" />
      {status}
    </span>
  );
}

export default StatusBadge;