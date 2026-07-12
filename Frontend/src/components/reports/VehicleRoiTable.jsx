// ROI = (Revenue - (Maintenance + Fuel)) / Acquisition Cost
// Usage: <VehicleRoiTable data={[{ vehicleRegNumber, revenue, fuelCost, maintenanceCost, acquisitionCost }]} />
function VehicleRoiTable({ data = [] }) {
  if (data.length === 0) {
    return <p className="text-center text-gray-400 text-sm py-10">No ROI data available.</p>;
  }

  const calculateRoi = (row) => {
    const { revenue = 0, fuelCost = 0, maintenanceCost = 0, acquisitionCost = 1 } = row;
    const roi = (revenue - (maintenanceCost + fuelCost)) / acquisitionCost;
    return (roi * 100).toFixed(2);
  };

  return (
    <div className="overflow-x-auto bg-bg-card rounded-xl border shadow-sm">
      <table className="min-w-full text-sm">
        <thead className="bg-bg-card border-b border-border-dark">
          <tr className="text-left text-text-secondary">
            <th className="px-4 py-3 font-medium">Vehicle</th>
            <th className="px-4 py-3 font-medium">Revenue</th>
            <th className="px-4 py-3 font-medium">Fuel Cost</th>
            <th className="px-4 py-3 font-medium">Maintenance Cost</th>
            <th className="px-4 py-3 font-medium">Acquisition Cost</th>
            <th className="px-4 py-3 font-medium">ROI %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => {
            const roi = calculateRoi(row);
            return (
              <tr key={idx} className="border-b border-border-dark last:border-0 hover:bg-bg-card">
                <td className="px-4 py-3 font-medium text-text-primary">{row.vehicleRegNumber}</td>
                <td className="px-4 py-3">₹{row.revenue?.toLocaleString() || 0}</td>
                <td className="px-4 py-3">₹{row.fuelCost?.toLocaleString() || 0}</td>
                <td className="px-4 py-3">₹{row.maintenanceCost?.toLocaleString() || 0}</td>
                <td className="px-4 py-3">₹{row.acquisitionCost?.toLocaleString() || 0}</td>
                <td className="px-4 py-3">
                  <span
                    className={`font-semibold ${
                      roi >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {roi}%
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default VehicleRoiTable;