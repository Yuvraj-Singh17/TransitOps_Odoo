import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import FuelEfficiencyChart from "../components/reports/FuelEfficiencyChart";
import UtilizationReport from "../components/reports/UtilizationReport";
import VehicleRoiTable from "../components/reports/VehicleRoiTable";
import ExportButtons from "../components/reports/ExportButtons";
import Loader from "../components/common/Loader";
import {
  getFuelEfficiencyReport,
  getUtilizationReport,
  getVehicleRoiReport,
} from "../api/reportsApi";

function Reports() {
  const [activeTab, setActiveTab] = useState("efficiency"); // efficiency | utilization | roi

  const { data: efficiencyData, isLoading: effLoading } = useQuery({
    queryKey: ["report-fuel-efficiency"],
    queryFn: getFuelEfficiencyReport,
    enabled: activeTab === "efficiency",
  });

  const { data: utilizationData, isLoading: utilLoading } = useQuery({
    queryKey: ["report-utilization"],
    queryFn: getUtilizationReport,
    enabled: activeTab === "utilization",
  });

  const { data: roiData, isLoading: roiLoading } = useQuery({
    queryKey: ["report-vehicle-roi"],
    queryFn: getVehicleRoiReport,
    enabled: activeTab === "roi",
  });

  const tabs = [
    { id: "efficiency", label: "Fuel Efficiency" },
    { id: "utilization", label: "Fleet Utilization" },
    { id: "roi", label: "Vehicle ROI" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports & Analytics</h2>
        {activeTab === "efficiency" && (
          <ExportButtons data={efficiencyData} filename="fuel-efficiency-report" />
        )}
        {activeTab === "roi" && <ExportButtons data={roiData} filename="vehicle-roi-report" />}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 p-1 rounded-lg w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-white text-blue-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border shadow-sm p-5">
        {activeTab === "efficiency" &&
          (effLoading ? <Loader /> : <FuelEfficiencyChart data={efficiencyData || []} />)}

        {activeTab === "utilization" &&
          (utilLoading ? <Loader /> : <UtilizationReport data={utilizationData} />)}

        {activeTab === "roi" &&
          (roiLoading ? <Loader /> : <VehicleRoiTable data={roiData || []} />)}
      </div>
    </div>
  );
}

export default Reports;