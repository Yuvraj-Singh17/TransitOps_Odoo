import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import MaintenanceTable from "../components/maintenance/MaintenanceTable";
import MaintenanceForm from "../components/maintenance/MaintenanceForm";
import Loader from "../components/common/Loader";
import {
  getMaintenanceRecords,
  createMaintenanceRecord,
  closeMaintenanceRecord,
} from "../api/maintenanceApi";

function Maintenance() {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);

  const { data: records, isLoading } = useQuery({
    queryKey: ["maintenance"],
    queryFn: () => getMaintenanceRecords(),
  });

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["maintenance"] });
    queryClient.invalidateQueries({ queryKey: ["vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["available-vehicles"] });
    queryClient.invalidateQueries({ queryKey: ["vehicles-for-maintenance"] });
    queryClient.invalidateQueries({ queryKey: ["dashboard-kpis"] });
  };

  const createMutation = useMutation({
    mutationFn: createMaintenanceRecord,
    onSuccess: () => {
      invalidateAll();
      toast.success("Maintenance record created — vehicle marked In Shop");
      setModalOpen(false);
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to create record"),
  });

  const closeMutation = useMutation({
    mutationFn: (id) => closeMaintenanceRecord(id, { completedDate: new Date().toISOString() }),
    onSuccess: () => {
      invalidateAll();
      toast.success("Maintenance closed — vehicle marked Available");
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to close record"),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-text-primary">Maintenance</h2>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 px-4 py-2 rounded-lg text-sm hover:bg-[#00A8E0]"
        >
          <Plus size={16} />
          New Maintenance Record
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <MaintenanceTable
          records={records || []}
          onClose={(id) => closeMutation.mutate(id)}
        />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-bg-card rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-text-primary">New Maintenance Record</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-text-secondary">
                <X size={20} />
              </button>
            </div>
            <MaintenanceForm
              onSubmit={(data) => createMutation.mutate(data)}
              onCancel={() => setModalOpen(false)}
              loading={createMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Maintenance;