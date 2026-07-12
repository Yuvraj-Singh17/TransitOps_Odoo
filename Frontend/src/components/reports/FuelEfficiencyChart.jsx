import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Usage: <FuelEfficiencyChart data={[{ vehicleRegNumber, efficiency }]} />
function FuelEfficiencyChart({ data = [] }) {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-10">No fuel efficiency data available.</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="vehicleRegNumber" fontSize={12} />
        <YAxis fontSize={12} label={{ value: "km/L", angle: -90, position: "insideLeft" }} />
        <Tooltip formatter={(value) => [`${value} km/L`, "Fuel Efficiency"]} />
        <Legend />
        <Bar dataKey="efficiency" name="Fuel Efficiency (km/L)" fill="#3b82f6" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default FuelEfficiencyChart;