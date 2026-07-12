// Currency formatter (INR)
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return "₹0";
  return `₹${Number(amount).toLocaleString("en-IN")}`;
}

// Date formatter (DD MMM YYYY)
export function formatDate(dateString) {
  if (!dateString) return "—";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

// Percentage formatter
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined) return "0%";
  return `${Number(value).toFixed(decimals)}%`;
}

// Number with thousands separator
export function formatNumber(value) {
  if (value === null || value === undefined) return "0";
  return Number(value).toLocaleString("en-IN");
}

// Truncate long text (for table cells)
export function truncateText(text, maxLength = 30) {
  if (!text) return "";
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
}