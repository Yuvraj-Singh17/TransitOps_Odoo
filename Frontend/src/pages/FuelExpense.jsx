import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X, Fuel, Receipt } from "lucide-react";
import toast from "react-hot-toast";
import FuelLogForm from "../components/fuelExpense/FuelLogForm";
import ExpenseForm from "../components/fuelExpense/ExpenseForm";
import CostSummaryCard from "../components/fuelExpense/CostSummaryCard";
import Loader from "../components/common/Loader";
import {
  getFuelLogs,
  createFuelLog,
  getExpenses,
  createExpense,
  getCostSummary,
} from "../api/fuelExpenseApi";

function FuelExpense() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("fuel"); // fuel | expenses | summary
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: fuelLogs, isLoading: fuelLoading } = useQuery({
    queryKey: ["fuel-logs"],
    queryFn: () => getFuelLogs(),
    enabled: activeTab === "fuel",
  });

  const { data: expenses, isLoading: expensesLoading } = useQuery({
    queryKey: ["expenses"],
    queryFn: () => getExpenses(),
    enabled: activeTab === "expenses",
  });

  const { data: costSummary, isLoading: summaryLoading } = useQuery({
    queryKey: ["cost-summary"],
    queryFn: () => getCostSummary(),
    enabled: activeTab === "summary",
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["fuel-logs"] });
    queryClient.invalidateQueries({ queryKey: ["expenses"] });
    queryClient.invalidateQueries({ queryKey: ["cost-summary"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
  };

  const createFuelMutation = useMutation({
    mutationFn: createFuelLog,
    onSuccess: () => {
      invalidateAll();
      toast.success("Fuel log added");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to add fuel log"),
  });

  const createExpenseMutation = useMutation({
    mutationFn: createExpense,
    onSuccess: () => {
      invalidateAll();
      toast.success("Expense added");
      setModalOpen(false);
    },
    onError: () => toast.error("Failed to add expense"),
  });

  const tabs = [
    { id: "fuel", label: "Fuel Logs" },
    { id: "expenses", label: "Expenses" },
    { id: "summary", label: "Cost Summary" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Fuel & Expense Management</h2>
        {activeTab !== "summary" && (
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
          >
            <Plus size={16} />
            {activeTab === "fuel" ? "Add Fuel Log" : "Add Expense"}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Fuel Logs Tab */}
      {activeTab === "fuel" && (
        fuelLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Liters</th>
                  <th className="px-4 py-3 font-medium">Cost</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(fuelLogs || []).map((f) => (
                  <tr key={f.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{f.vehicleRegNumber || f.vehicleId}</td>
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <Fuel size={14} className="text-blue-500" /> {f.liters} L
                    </td>
                    <td className="px-4 py-3">₹{f.cost}</td>
                    <td className="px-4 py-3">{f.date}</td>
                  </tr>
                ))}
                {(fuelLogs || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No fuel logs yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        expensesLoading ? (
          <Loader />
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl border shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 border-b">
                <tr className="text-left text-gray-600">
                  <th className="px-4 py-3 font-medium">Vehicle</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Amount</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {(expenses || []).map((e) => (
                  <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{e.vehicleRegNumber || e.vehicleId}</td>
                    <td className="px-4 py-3 flex items-center gap-1.5">
                      <Receipt size={14} className="text-purple-500" /> {e.type}
                    </td>
                    <td className="px-4 py-3">₹{e.amount}</td>
                    <td className="px-4 py-3">{e.date}</td>
                  </tr>
                ))}
                {(expenses || []).length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      No expenses recorded yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )
      )}

      {/* Cost Summary Tab */}
      {activeTab === "summary" && (
        summaryLoading ? (
          <Loader />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(costSummary || []).map((s) => (
              <CostSummaryCard key={s.vehicleId} summary={s} />
            ))}
            {(costSummary || []).length === 0 && (
              <p className="text-gray-400 text-sm col-span-full text-center py-8">
                No cost data available yet.
              </p>
            )}
          </div>
        )
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {activeTab === "fuel" ? "Add Fuel Log" : "Add Expense"}
              </h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            {activeTab === "fuel" ? (
              <FuelLogForm
                onSubmit={(data) => createFuelMutation.mutate(data)}
                onCancel={() => setModalOpen(false)}
                loading={createFuelMutation.isPending}
              />
            ) : (
              <ExpenseForm
                onSubmit={(data) => createExpenseMutation.mutate(data)}
                onCancel={() => setModalOpen(false)}
                loading={createExpenseMutation.isPending}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default FuelExpense;