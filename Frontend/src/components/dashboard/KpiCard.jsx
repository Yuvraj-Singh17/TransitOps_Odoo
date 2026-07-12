// Usage: <KpiCard title="Active Vehicles" value={42} icon={Truck} trend="+5%" color="blue" />
function KpiCard({ title, value, icon: Icon, trend, color = "blue" }) {
  const colorMap = {
    blue: "bg-[#00C2FF]/10 text-[#00C2FF] shadow-[0_0_10px_rgba(0,194,255,0.2)]",
    green: "bg-[#22C55E]/10 text-[#22C55E] shadow-[0_0_10px_rgba(34,197,94,0.2)]",
    orange: "bg-[#F59E0B]/10 text-[#F59E0B] shadow-[0_0_10px_rgba(245,158,11,0.2)]",
    purple: "bg-[#7C3AED]/10 text-[#7C3AED] shadow-[0_0_10px_rgba(124,58,237,0.2)]",
    red: "bg-[#EF4444]/10 text-[#EF4444] shadow-[0_0_10px_rgba(239,68,68,0.2)]",
  };

  return (
    <div className="glass-card rounded-xl p-5 flex items-center justify-between group">
      <div>
        <p className="text-sm text-text-secondary group-hover:text-text-primary transition-colors">{title}</p>
        <h3 className="text-2xl font-bold text-text-primary mt-1">{value}</h3>
        {trend && (
          <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>
        )}
      </div>
      {Icon && (
        <div className={`p-3 rounded-lg ${colorMap[color]}`}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}

export default KpiCard;