import { useState } from "react";
import { Rocket, CheckCircle2, XCircle } from "lucide-react";
import { TRIP_STATUS } from "../../utils/constants";

// Usage: <TripLifecycleActions trip={trip} onDispatch={fn} onComplete={fn} onCancel={fn} />
function TripLifecycleActions({ trip, onDispatch, onComplete, onCancel, loading }) {
  const [showCompleteForm, setShowCompleteForm] = useState(false);
  const [finalOdometer, setFinalOdometer] = useState("");
  const [fuelConsumed, setFuelConsumed] = useState("");
  const [revenue, setRevenue] = useState("");

  const handleCompleteSubmit = (e) => {
    e.preventDefault();
    if (!finalOdometer || !fuelConsumed) return;
    onComplete(trip.id, {
      finalOdometer: Number(finalOdometer),
      fuelConsumed: Number(fuelConsumed),
      revenue: Number(revenue) || 0,
    });
    setShowCompleteForm(false);
  };

  // Draft -> can Dispatch or Cancel
  if (trip.status === TRIP_STATUS.DRAFT) {
    return (
      <div className="flex gap-2">
        <button
          onClick={() => onDispatch(trip.id)}
          disabled={loading}
          className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          <Rocket size={14} /> Dispatch
        </button>
        <button
          onClick={() => onCancel(trip.id)}
          disabled={loading}
          className="flex items-center gap-1.5 border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50"
        >
          <XCircle size={14} /> Cancel
        </button>
      </div>
    );
  }

  // Dispatched -> can Complete or Cancel
  if (trip.status === TRIP_STATUS.DISPATCHED) {
    return (
      <div>
        {!showCompleteForm ? (
          <div className="flex gap-2">
            <button
              onClick={() => setShowCompleteForm(true)}
              className="flex items-center gap-1.5 bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
            >
              <CheckCircle2 size={14} /> Complete
            </button>
            <button
              onClick={() => onCancel(trip.id)}
              disabled={loading}
              className="flex items-center gap-1.5 border border-red-300 text-red-600 px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 disabled:opacity-50"
            >
              <XCircle size={14} /> Cancel
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleCompleteSubmit}
            className="flex flex-wrap items-end gap-2 bg-gray-50 p-3 rounded-lg border"
          >
            <div>
              <label className="text-xs text-gray-500 block mb-1">Final Odometer</label>
              <input
                type="number"
                value={finalOdometer}
                onChange={(e) => setFinalOdometer(e.target.value)}
                required
                className="w-28 border rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Fuel Consumed (L)</label>
              <input
                type="number"
                value={fuelConsumed}
                onChange={(e) => setFuelConsumed(e.target.value)}
                required
                className="w-28 border rounded px-2 py-1 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 block mb-1">Revenue (₹)</label>
              <input
                type="number"
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-28 border rounded px-2 py-1 text-xs"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-green-700"
            >
              Confirm
            </button>
            <button
              type="button"
              onClick={() => setShowCompleteForm(false)}
              className="text-gray-500 text-xs px-2"
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    );
  }

  // Completed / Cancelled -> no actions, terminal state
  return <span className="text-xs text-gray-400">No actions available</span>;
}

export default TripLifecycleActions;