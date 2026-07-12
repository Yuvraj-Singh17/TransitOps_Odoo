import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery } from "@tanstack/react-query";
import { getVehiclesList } from "../../api/fuelExpenseApi";

const EXPENSE_TYPES = ["Toll", "Insurance", "Parking", "Permit/Fine", "Other"];

const expenseSchema = z.object({
  vehicleId: z.string().min(1, "Select a vehicle"),
  type: z.string().min(1, "Select expense type"),
  amount: z.coerce.number().positive("Must be greater than 0"),
  date: z.string().min(1, "Date is required"),
  notes: z.string().optional(),
});

// Usage: <ExpenseForm onSubmit={handleSave} onCancel={closeModal} />
function ExpenseForm({ onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(expenseSchema) });

  const { data: vehicles = [], isLoading: vehiclesLoading } = useQuery({
    queryKey: ["vehicles-list"],
    queryFn: getVehiclesList,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Vehicle {vehiclesLoading && "(loading...)"}
          </label>
          <select {...register("vehicleId")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select vehicle</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.regNumber} — {v.name}
              </option>
            ))}
          </select>
          {errors.vehicleId && (
            <p className="text-red-500 text-xs mt-1">{errors.vehicleId.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Expense Type</label>
          <select {...register("type")} className="w-full border rounded-lg px-3 py-2 text-sm">
            <option value="">Select type</option>
            {EXPENSE_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          {errors.type && <p className="text-red-500 text-xs mt-1">{errors.type.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
          <input
            type="number"
            {...register("amount")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="500"
          />
          {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
          <input
            type="date"
            {...register("date")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes (optional)
          </label>
          <textarea
            {...register("notes")}
            rows={2}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="Additional details..."
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border text-gray-600 hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

export default ExpenseForm;