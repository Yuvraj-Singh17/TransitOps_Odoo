import clsx from "clsx";

// Usage: <Select label="Status" options={["Available","On Trip"]} {...register("status")} error={errors.status?.message} />
function Select({ label, options = [], error, placeholder = "Select...", className, ...props }) {
  return (
    <div>
      {label && (
        <label className="block text-sm font-medium text-text-primary mb-1">{label}</label>
      )}
      <select
        className={clsx(
          "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00C2FF] bg-bg-card text-text-primary",
          error ? "border-red-400" : "border-border-dark",
          className
        )}
        style={{ colorScheme: 'dark' }}
        {...props}
      >
        <option className="bg-bg-base text-text-primary"  value="">{placeholder}</option>
        {options.map((opt) => {
          const value = typeof opt === "object" ? opt.value : opt;
          const label = typeof opt === "object" ? opt.label : opt;
          return (
            <option className="bg-bg-base text-text-primary"  key={value} value={value}>
              {label}
            </option>
          );
        })}
      </select>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default Select;