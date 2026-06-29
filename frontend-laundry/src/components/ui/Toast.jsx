const types = {
  success: "bg-emerald-600 text-white border-emerald-700",
  error: "bg-red-600 text-white border-red-700",
  info: "bg-blue-600 text-white border-blue-700",
  warning: "bg-amber-500 text-white border-amber-600",
};

export default function Toast({ message, type = "success" }) {
  return (
    <div className={`pointer-events-auto px-4 py-3 rounded-xl text-sm font-semibold shadow-lg border animate-in slide-in-from-right ${types[type]}`}>
      {message}
    </div>
  );
}

export function Alert({ children, variant = "error", className = "" }) {
  const styles = {
    error: "bg-red-50 border-red-200 text-red-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
  };

  return (
    <div className={`rounded-xl border px-4 py-3 text-sm font-medium ${styles[variant]} ${className}`}>
      {children}
    </div>
  );
}
