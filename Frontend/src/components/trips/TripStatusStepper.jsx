import { Check } from "lucide-react";
import { TRIP_STATUS } from "../../utils/constants";

const STEPS = [TRIP_STATUS.DRAFT, TRIP_STATUS.DISPATCHED, TRIP_STATUS.COMPLETED];

// Usage: <TripStatusStepper currentStatus="Dispatched" />
function TripStatusStepper({ currentStatus }) {
  // Cancelled is a terminal state outside the normal flow - show distinctly
  if (currentStatus === TRIP_STATUS.CANCELLED) {
    return (
      <div className="flex items-center gap-2 text-red-600 text-sm font-medium">
        <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
        Cancelled
      </div>
    );
  }

  const currentIndex = STEPS.indexOf(currentStatus);

  return (
    <div className="flex items-center">
      {STEPS.map((step, idx) => {
        const isCompleted = idx < currentIndex;
        const isActive = idx === currentIndex;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold ${
                  isCompleted
                    ? "bg-green-500 text-white"
                    : isActive
                    ? "bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300"
                    : "bg-gray-200 text-text-secondary"
                }`}
              >
                {isCompleted ? <Check size={14} /> : idx + 1}
              </div>
              <span
                className={`text-xs mt-1 ${
                  isActive ? "text-blue-600 font-medium" : "text-gray-400"
                }`}
              >
                {step}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className={`w-12 h-0.5 mx-1 mb-4 ${
                  isCompleted ? "bg-green-500" : "bg-gray-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TripStatusStepper;