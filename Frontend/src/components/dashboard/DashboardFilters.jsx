import { useState } from "react";
import { Filter, X } from "lucide-react";
import { VEHICLE_STATUS, VEHICLE_TYPES } from "../../utils/constants";

const REGIONS = ["North", "South", "East", "West", "Central"];

// Usage: <DashboardFilters onChange={(filters) => refetch(filters)} />
function DashboardFilters({ onChange }) {
  const [filters, setFilters] = useState({ type: "", status: "", region: "" });

  const handleChange = (key, value) => {
    const updated = { ...filters, [key]: value };
    setFilters(updated);
    onChange(updated);
  };

  const clearFilters = () => {
    const cleared = { type: "", status: "", region: "" };
    setFilters(cleared);
    onChange(cleared);
  };

  const hasActiveFilters = filters.type || filters.status || filters.region;

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6 bg-white border rounded-xl p-3">
      <div className="flex items-center gap-1.5 text-sm text-gray-500 font-medium">
        <Filter size={15} /> Filters:
      </div>

      <select
        value={filters.type}
        onChange={(e) => handleChange("type", e.target.value)}
        className="border rounded-lg px-3 py-1.5 text-sm text-gray-700"
      >
        <option value="">All Types</option>
        {VEHICLE_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        value={filters.status}
        onChange={(e) => handleChange("status", e.target.value)}
        className="border rounded-lg px-3 py-1.5 text-sm text-gray-700"
      >
        <option value="">All Statuses</option>
        {Object.values(VEHICLE_STATUS).map((s) => (
          <option key={s} value={s}>
            {s}
          </option>
        ))}
      </select>

      <select
        value={filters.region}
        onChange={(e) => handleChange("region", e.target.value)}
        className="border rounded-lg px-3 py-1.5 text-sm text-gray-700"
      >
        <option value="">All Regions</option>
        {REGIONS.map((r) => (
          <option key={r} value={r}>
            {r}
          </option>
        ))}
      </select>

      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 ml-auto"
        >
          <X size={14} /> Clear filters
        </button>
      )}
    </div>
  );
}

export default DashboardFilters;