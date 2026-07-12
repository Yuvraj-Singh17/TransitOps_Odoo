import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#22c55e", "#3b82f6", "#f97316", "#6b7280"];

// Usage: <UtilizationReport data={{ available, onTrip, inShop, retired }} />
function UtilizationReport({ data }) {
  if (!data) {
    return <p className="text-center text-gray-400 text-sm py-10">No utilization data available.</p>;
  }

  const chartData = [
    { name: "Available", value: data.available || 0 },
    { name: "On Trip", value: data.onTrip || 0 },
    { name: "In Shop", value: data.inShop || 0 },
    { name: "Retired", value: data.retired || 0 },
  ];

  const total = chartData.reduce((sum, d) => sum + d.value, 0);
  const utilizationPercent = total > 0 ? ((data.onTrip / total) * 100).toFixed(1) : 0;

  return (
    <div className="flex flex-col items-center">
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={90}
            label={(entry) => `${entry.name}: ${entry.value}`}
          >
            {chartData.map((_, idx) => (
              <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <p className="text-sm text-text-secondary mt-2">
        Fleet Utilization: <span className="font-bold text-blue-600">{utilizationPercent}%</span>
      </p>
    </div>
  );
}

export default UtilizationReport;