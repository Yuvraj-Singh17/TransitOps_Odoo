import { AlertTriangle } from "lucide-react";

// Usage: <ConfirmDialog isOpen={open} title="Delete Vehicle?" message="This cannot be undone." onConfirm={fn} onCancel={fn} />
function ConfirmDialog({
  isOpen,
  title = "Are you sure?",
  message,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-[60] p-4">
      <div className="bg-bg-card rounded-xl shadow-lg w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3">
          <AlertTriangle className="text-red-500" size={22} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
        {message && <p className="text-sm text-text-secondary mt-1">{message}</p>}

        <div className="flex justify-center gap-3 mt-5">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg border text-text-secondary hover:bg-bg-card"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
          >
            {loading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;