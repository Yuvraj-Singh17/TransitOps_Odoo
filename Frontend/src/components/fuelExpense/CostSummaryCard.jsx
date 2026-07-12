import { Fuel, Wrench, Receipt, TrendingUp } from "lucide-react";

// Usage: <CostSummaryCard summary={{ vehicleRegNumber, fuelCost, maintenanceCost, otherExpenses, totalCost }} />
function CostSummaryCard({ summary }) {
  if (!summary) return null;

  const { vehicleRegNumber, fuelCost = 0, maintenanceCost = 0, otherExpenses = 0 } = summary;
  const totalCost = fuelCost + maintenanceCost + otherExpenses;

  return (
    <div className="bg-[#121821] rounded-xl border shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-[#E5E7EB]">{vehicleRegNumber}</h4>
        <span className="flex items-center gap-1 text-xs text-gray-400">
          <TrendingUp size={14} /> Cost Breakdown
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-[#9CA3AF]">
            <Fuel size={15} className="text-blue-500" /> Fuel Cost
          </span>
          <span className="font-medium">₹{fuelCost.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-[#9CA3AF]">
            <Wrench size={15} className="text-orange-500" /> Maintenance Cost
          </span>
          <span className="font-medium">₹{maintenanceCost.toLocaleString()}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-[#9CA3AF]">
            <Receipt size={15} className="text-purple-500" /> Other Expenses
          </span>
          <span className="font-medium">₹{otherExpenses.toLocaleString()}</span>
        </div>

        <div className="border-t pt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-[#E5E7EB]">Total Operational Cost</span>
          <span className="text-lg font-bold text-blue-600">₹{totalCost.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export default CostSummaryCard;