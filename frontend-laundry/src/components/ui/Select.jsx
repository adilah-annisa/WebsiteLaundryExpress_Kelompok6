export default function Select({ label, error, options = [], className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
      <select
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm cursor-pointer transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Textarea({ label, error, className = "", ...props }) {
  return (
    <div className="space-y-1.5">
      {label && <label className="block text-sm font-semibold text-slate-700">{label}</label>}
      <textarea
        className={`w-full rounded-xl border bg-white px-4 py-3 text-sm resize-none transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 ${error ? "border-red-400" : "border-slate-200"} ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
