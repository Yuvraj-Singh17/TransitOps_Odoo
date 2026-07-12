import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Usage: <OperationalCostReport data={[{ vehicleRegNumber, fuelCost, maintenanceCost }]} />
function OperationalCostReport({ data = [] }) {
  if (data.length === 0) {
    return (
      <p className="text-center text-gray-400 text-sm py-10">
        No operational cost data available.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={320}>
      <BarChart data={data} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
        <XAxis dataKey="vehicleRegNumber" fontSize={12} />
        <YAxis fontSize={12} />
        <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
        <Legend />
        <Bar dataKey="fuelCost" name="Fuel Cost" stackId="cost" fill="#3b82f6" radius={[0, 0, 0, 0]} />
        <Bar
          dataKey="maintenanceCost"
          name="Maintenance Cost"
          stackId="cost"
          fill="#f97316"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default OperationalCostReport;