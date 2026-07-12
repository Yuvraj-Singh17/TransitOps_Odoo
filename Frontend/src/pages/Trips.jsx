import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import TripTable from "../components/trips/TripTable";
import TripForm from "../components/trips/TripForm";
import TripStatusStepper from "../components/trips/TripStatusStepper";
import Loader from "../components/common/Loader";
import {
  getTrips,
  createTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} from "../api/tripApi";

function Trips() {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [detailsTrip, setDetailsTrip] = useState(null);

  const { data: trips, isLoading } = useQuery({
    queryKey: ["trips"],
    queryFn: () => getTrips(),
  });

  // Invalidate trips + vehicles + drivers together since status changes cascade
  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["trips"] });
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["drivers"] });
    queryClient.invalidateQueries({ queryKey: ["available-vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["available-drivers"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
  };

  const createMutation = useMutation({
    mutationFn: createTrip,
    onSuccess: () => {
      invalidateAll();
      toast.success("Trip created as Draft");
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create trip"),
  });

  const dispatchMutation = useMutation({
    mutationFn: dispatchTrip,
    onSuccess: () => {
      invalidateAll();
      toast.success("Trip dispatched — vehicle & driver now On Trip");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to dispatch trip"),
  });

  const completeMutation = useMutation({
    mutationFn: ({ id, data }) => completeTrip(id, data),
    onSuccess: () => {
      invalidateAll();
      toast.success("Trip completed — vehicle & driver now Available");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to complete trip"),
  });

  const cancelMutation = useMutation({
    mutationFn: cancelTrip,
    onSuccess: () => {
      invalidateAll();
      toast.success("Trip cancelled");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to cancel trip"),
  });

  const isActionLoading =
    dispatchMutation.isPending || completeMutation.isPending || cancelMutation.isPending;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-[#E5E7EB]">Trip Management</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 px-4 py-2 rounded-lg text-sm hover:bg-[#00A8E0]"
        >
          <Plus size={16} />
          Create Trip
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <TripTable
          trips={trips || []}
          onDispatch={(id) => dispatchMutation.mutate(id)}
          onComplete={(id, data) => completeMutation.mutate({ id, data })}
          onCancel={(id) => cancelMutation.mutate(id)}
          onViewDetails={setDetailsTrip}
          actionLoading={isActionLoading}
        />
      )}

      {/* Create Trip Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121821] rounded-xl shadow-lg w-full max-w-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#E5E7EB]">Create Trip</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-[#9CA3AF]">
                <X size={20} />
              </button>
            </div>
            <TripForm
              onSubmit={(data) => createMutation.mutate(data)}
              onCancel={() => setModalOpen(false)}
              loading={createMutation.isPending}
            />
          </div>
        </div>
      )}

      {/* Trip Details Modal */}
      {detailsTrip && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-[#121821] rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-[#E5E7EB]">Trip Details</h3>
              <button onClick={() => setDetailsTrip(null)} className="text-gray-400 hover:text-[#9CA3AF]">
                <X size={20} />
              </button>
            </div>

            <div className="flex justify-center mb-6">
              <TripStatusStepper currentStatus={detailsTrip.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-gray-400 text-xs">Source</p>
                <p className="font-medium">{detailsTrip.source}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Destination</p>
                <p className="font-medium">{detailsTrip.destination}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Vehicle</p>
                <p className="font-medium">{detailsTrip.vehicleRegNumber || detailsTrip.vehicleId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Driver</p>
                <p className="font-medium">{detailsTrip.driverName || detailsTrip.driverId}</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Cargo Weight</p>
                <p className="font-medium">{detailsTrip.cargoWeight} kg</p>
              </div>
              <div>
                <p className="text-gray-400 text-xs">Planned Distance</p>
                <p className="font-medium">{detailsTrip.plannedDistance} km</p>
              </div>
              {detailsTrip.finalOdometer && (
                <div>
                  <p className="text-gray-400 text-xs">Final Odometer</p>
                  <p className="font-medium">{detailsTrip.finalOdometer} km</p>
                </div>
              )}
              {detailsTrip.fuelConsumed && (
                <div>
                  <p className="text-gray-400 text-xs">Fuel Consumed</p>
                  <p className="font-medium">{detailsTrip.fuelConsumed} L</p>
                </div>
              )}
              {detailsTrip.revenue > 0 && (
                <div>
                  <p className="text-gray-400 text-xs">Revenue</p>
                  <p className="font-medium">₹{detailsTrip.revenue}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Trips;