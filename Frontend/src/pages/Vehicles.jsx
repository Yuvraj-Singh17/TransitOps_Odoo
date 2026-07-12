import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import VehicleTable from "../components/vehicles/VehicleTable";
import VehicleForm from "../components/vehicles/VehicleForm";
import Loader from "../components/common/Loader";
import {
  getVehicles,
  createVehicle,
  updateVehicle,
  deleteVehicle,
} from "../api/vehicleApi";

function Vehicles() {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ["vehicles"],
    queryFn: () => getVehicles(),
  });

  const createMutation = useMutation({
    mutationFn: createVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle added successfully");
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add vehicle"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateVehicle(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle updated successfully");
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update vehicle"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteVehicle,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vehicles"] });
      toast.success("Vehicle removed");
    },
    onError: () => toast.error("Failed to delete vehicle"),
  });

  const openAddModal = () => {
    setEditingVehicle(null);
    setModalOpen(true);
  };

  const openEditModal = (vehicle) => {
    setEditingVehicle(vehicle);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingVehicle(null);
  };

  const handleSubmit = (formData) => {
    if (editingVehicle) {
      updateMutation.mutate({ id: editingVehicle.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this vehicle?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Vehicle Registry</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Vehicle
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <VehicleTable vehicles={vehicles || []} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <VehicleForm
              defaultValues={editingVehicle}
              onSubmit={handleSubmit}
              onCancel={closeModal}
              loading={createMutation.isPending || updateMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Vehicles;