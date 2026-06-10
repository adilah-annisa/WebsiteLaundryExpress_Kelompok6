export default function StatCard({ icon: Icon, label, value, color, bgIcon, subtitle }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-5 flex items-center gap-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-200">
      <div
        className={`w-12 h-12 rounded-xl ${bgIcon} flex items-center justify-center flex-shrink-0 ring-1 ring-white/10`}
      >
        <Icon className="text-2xl" style={{ color }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="font-inter-semibold text-2xl text-gray-800 truncate">{value}</p>
        <p className="text-sm text-gray-500 font-poppins mt-0.5 truncate">{label}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-1 truncate">{subtitle}</p>}
      </div>
    </div>
  );
}
