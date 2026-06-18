const statusStyles = {
  'Diproses': 'bg-yellow-100 text-yellow-600',
  'Diantar': 'bg-blue-100 text-blue-600',
  'Selesai': 'bg-green-100 text-green-600',
  'Dijemput': 'bg-blue-100 text-blue-600',
  'Cancel': 'bg-red-100 text-red-600',
  'Total': 'bg-red-100 text-red-600',
  'Lunas': 'bg-green-100 text-green-600',
  'Belum Lunas': 'bg-red-100 text-red-600',
  'Menunggu Penimbangan': 'bg-orange-100 text-orange-700',
};

export default function StatusBadge({ status, className = '' }) {
  const style = statusStyles[status] || 'bg-gray-100 text-gray-600';

  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-inter-semibold ${style} ${className}`}>
      {status}
    </span>
  );
}

