import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// Usage: <FleetUtilizationChart data={[{ date: "Mon", utilization: 72 }, ...]} />
function FleetUtilizationChart({ data = [] }) {
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-10">
        No utilization trend data available yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <defs>
          <linearGradient id="utilGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="date" fontSize={12} />
        <YAxis fontSize={12} unit="%" />
        <Tooltip formatter={(value) => [`${value}%`, "Fleet Utilization"]} />
        <Area
          type="monotone"
          dataKey="utilization"
          stroke="#3b82f6"
          fill="url(#utilGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export default FleetUtilizationChart;