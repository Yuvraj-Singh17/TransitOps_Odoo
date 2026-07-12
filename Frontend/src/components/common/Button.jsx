import clsx from "clsx";

// Usage: <Button variant="primary" size="md" onClick={fn}>Save</Button>
function Button({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  loading = false,
  disabled = false,
  onClick,
  type = "button",
  className,
}) {
  const variants = {
    primary: "bg-[#00C2FF] text-black hover:shadow-cyan-500/50 hover:shadow-lg transition-all duration-300 hover:bg-[#00A8E0]",
    secondary: "border border-gray-300 text-text-primary hover:bg-bg-card",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outlineDanger: "border border-red-300 text-red-600 hover:bg-red-50",
    success: "bg-green-600 text-white hover:bg-green-700",
    ghost: "text-text-secondary hover:bg-gray-100",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-5 py-2.5 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={clsx(
        "flex items-center justify-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className
      )}
    >
      {Icon && !loading && <Icon size={size === "sm" ? 14 : 16} />}
      {loading ? "Loading..." : children}
    </button>
  );
}

export default Button;