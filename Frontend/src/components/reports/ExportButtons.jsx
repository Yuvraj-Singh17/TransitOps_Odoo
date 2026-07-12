import { Download } from "lucide-react";
import { exportToCSV } from "../../utils/csvExport";
import toast from "react-hot-toast";

// Usage: <ExportButtons data={reportData} filename="fuel-efficiency" />
function ExportButtons({ data, filename }) {
  const handleExport = () => {
    if (!data || data.length === 0) {
      toast.error("No data available to export");
      return;
    }
    exportToCSV(data, filename);
    toast.success("CSV exported successfully");
  };

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-2 border border-gray-300 text-gray-700 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50"
    >
      <Download size={15} />
      Export CSV
    </button>
  );
}

export default ExportButtons;