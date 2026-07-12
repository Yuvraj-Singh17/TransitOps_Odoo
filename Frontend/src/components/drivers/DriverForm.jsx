import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { DRIVER_STATUS } from "../../utils/constants";

const LICENSE_CATEGORIES = ["LMV", "HMV", "MCWG", "Transport"];

const driverSchema = z.object({
  name: z.string().min(2, "Name is required"),
  licenseNumber: z.string().min(3, "License number is required"),
  licenseCategory: z.string().min(1, "Select a license category"),
  licenseExpiryDate: z.string().min(1, "Expiry date is required"),
  contactNumber: z
    .string()
    .min(10, "Enter a valid contact number")
    .max(15, "Enter a valid contact number"),
  safetyScore: z.coerce.number().min(0).max(100),
  status: z.string().min(1, "Select a status"),
});

// Usage: <DriverForm defaultValues={editingDriver} onSubmit={handleSave} onCancel={closeModal} />
function DriverForm({ defaultValues, onSubmit, onCancel, loading }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(driverSchema),
    defaultValues: defaultValues || {
      name: "",
      licenseNumber: "",
      licenseCategory: "",
      licenseExpiryDate: "",
      contactNumber: "",
      safetyScore: 100,
      status: DRIVER_STATUS.AVAILABLE,
    },
  });

  useEffect(() => {
    if (defaultValues) reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">Full Name</label>
          <input
            {...register("name")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. Rahul Sharma"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            License Number
          </label>
          <input
            {...register("licenseNumber")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. DL-1420110012345"
          />
          {errors.licenseNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.licenseNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            License Category
          </label>
          <select
            {...register("licenseCategory")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          >
            <option className="bg-[#0B0F14] text-[#E5E7EB]"  value="">Select category</option>
            {LICENSE_CATEGORIES.map((c) => (
              <option className="bg-[#0B0F14] text-[#E5E7EB]"  key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {errors.licenseCategory && (
            <p className="text-red-500 text-xs mt-1">{errors.licenseCategory.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            License Expiry Date
          </label>
          <input
            type="date"
            {...register("licenseExpiryDate")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {errors.licenseExpiryDate && (
            <p className="text-red-500 text-xs mt-1">{errors.licenseExpiryDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            Contact Number
          </label>
          <input
            {...register("contactNumber")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
            placeholder="e.g. 9876543210"
          />
          {errors.contactNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.contactNumber.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">
            Safety Score (0-100)
          </label>
          <input
            type="number"
            {...register("safetyScore")}
            className="w-full border rounded-lg px-3 py-2 text-sm"
          />
          {errors.safetyScore && (
            <p className="text-red-500 text-xs mt-1">{errors.safetyScore.message}</p>
          )}
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-[#E5E7EB] mb-1">Status</label>
          <select {...register("status")} className="w-full border rounded-lg px-3 py-2 text-sm">
            {Object.values(DRIVER_STATUS).map((s) => (
              <option className="bg-[#0B0F14] text-[#E5E7EB]"  key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-sm rounded-lg border text-[#9CA3AF] hover:bg-[#0F172A]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm rounded-lg bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 hover:bg-[#00A8E0] disabled:opacity-50"
        >
          {loading ? "Saving..." : defaultValues ? "Update Driver" : "Add Driver"}
        </button>
      </div>
    </form>
  );
}

export default DriverForm;