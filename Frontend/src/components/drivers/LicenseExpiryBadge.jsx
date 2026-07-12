import { differenceInDays, parseISO } from "date-fns";

// Usage: <LicenseExpiryBadge expiryDate="2026-08-15" />
function LicenseExpiryBadge({ expiryDate }) {
  if (!expiryDate) return <span className="text-gray-400 text-xs">—</span>;

  const daysLeft = differenceInDays(parseISO(expiryDate), new Date());

  let colorClass = "text-green-600 bg-green-50";
  let label = expiryDate;

  if (daysLeft < 0) {
    colorClass = "text-red-600 bg-red-50 font-semibold";
    label = `Expired (${expiryDate})`;
  } else if (daysLeft <= 30) {
    colorClass = "text-orange-600 bg-orange-50 font-semibold";
    label = `${expiryDate} (${daysLeft}d left)`;
  }

  return (
    <span className={`inline-block px-2 py-1 rounded-md text-xs ${colorClass}`}>
      {label}
    </span>
  );
}

export default LicenseExpiryBadge;