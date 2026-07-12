import { useQuery } from "@tanstack/react-query";
import { Truck, CheckCircle, Wrench, Route, Clock, Users, Gauge } from "lucide-react";
import KpiCard from "../components/dashboard/KpiCard";
import Loader from "../components/common/Loader";
import axiosInstance from "../api/axiosInstance";

// Fetches KPI data from backend: /dashboard/kpis
async function fetchDashboardKpis() {
  const res = await axiosInstance.get("/dashboard/kpis");
  return res.data;
}

function Dashboard() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-kpis"],
    queryFn: fetchDashboardKpis,
  });

  if (isLoading) return <Loader fullScreen />;

  if (isError) {
    return (
      <div className="text-center text-red-500 py-10">
        Failed to load dashboard data. Please check backend connection.
      </div>
    );
  }

  const kpis = data || {
    activeVehicles: 0,
    availableVehicles: 0,
    vehiclesInMaintenance: 0,
    activeTrips: 0,
    pendingTrips: 0,
    driversOnDuty: 0,
    fleetUtilization: 0,
  };

  return (
    <div>
      <h2 className="text-2xl font-bold text-text-primary mb-6">Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KpiCard
          title="Active Vehicles"
          value={kpis.activeVehicles}
          icon={Truck}
          color="blue"
        />
        <KpiCard
          title="Available Vehicles"
          value={kpis.availableVehicles}
          icon={CheckCircle}
          color="green"
        />
        <KpiCard
          title="Vehicles in Maintenance"
          value={kpis.vehiclesInMaintenance}
          icon={Wrench}
          color="orange"
        />
        <KpiCard
          title="Total Deliveries"
          value="1,480"
          icon={Route}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
        <KpiCard
          title="Vehicles in Maintenance"
          value={kpis.vehiclesInMaintenance}
          icon={Wrench}
          color="orange"
        />
        <KpiCard
          title="Active Trips"
          value={kpis.activeTrips}
          icon={Route}
          color="purple"
        />
        <KpiCard
          title="Pending Trips"
          value={kpis.pendingTrips}
          icon={Clock}
          color="orange"
        />
        <KpiCard
          title="Drivers On Duty"
          value={kpis.driversOnDuty}
          icon={Users}
          color="blue"
        />
        <KpiCard
          title="Fleet Utilization"
          value={`${kpis.fleetUtilization}%`}
          icon={Gauge}
          color="green"
        />
      </div>
    </div>
  );
}

export default Dashboard;