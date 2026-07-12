import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, X } from "lucide-react";
import toast from "react-hot-toast";
import DriverTable from "../components/drivers/DriverTable";
import DriverForm from "../components/drivers/DriverForm";
import Loader from "../components/common/Loader";
import {
  getDrivers,
  createDriver,
  updateDriver,
  deleteDriver,
} from "../api/driverApi";

function Drivers() {
  const queryClient = useQueryClient();
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);

  const { data: drivers, isLoading } = useQuery({
    queryKey: ["drivers"],
    queryFn: () => getDrivers(),
  });

  const createMutation = useMutation({
    mutationFn: createDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver added successfully");
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to add driver"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateDriver(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver updated successfully");
      closeModal();
    },
    onError: (err) => toast.error(err.response?.data?.message || "Failed to update driver"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDriver,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      toast.success("Driver removed");
    },
    onError: () => toast.error("Failed to delete driver"),
  });

  const openAddModal = () => {
    setEditingDriver(null);
    setModalOpen(true);
  };

  const openEditModal = (driver) => {
    setEditingDriver(driver);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingDriver(null);
  };

  const handleSubmit = (formData) => {
    if (editingDriver) {
      updateMutation.mutate({ id: editingDriver.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to remove this driver?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Driver Management</h2>
        <button
          onClick={openAddModal}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
        >
          <Plus size={16} />
          Add Driver
        </button>
      </div>

      {isLoading ? (
        <Loader />
      ) : (
        <DriverTable drivers={drivers || []} onEdit={openEditModal} onDelete={handleDelete} />
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {editingDriver ? "Edit Driver" : "Add Driver"}
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>
            <DriverForm
              defaultValues={editingDriver}
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

export default Drivers;