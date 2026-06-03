import { useState } from 'react';
import PageHeader from '../../DashboardAdmin/components/PageHeader';
import StatusBadge from '../../DashboardAdmin/components/StatusBadge';

const initialOrders = [
  {
    seri: '#00001',
    name: 'Budi',
    address: 'Jl. Melati No. 23',
    date: '24 April 2024',
    time: '09:00',
    status: 'Diproses',
  },
  {
    seri: '#00002',
    name: 'Susi',
    address: 'Jl. Melati No. 23',
    date: '24 April 2024',
    time: '10:30',
    status: 'Diantar',
  },
  {
    seri: '#00003',
    name: 'Andi',
    address: 'Jl. Melati No. 23',
    date: '24 April 2024',
    time: '11:15',
    status: 'Selesai',
  },
  {
    seri: '#00004',
    name: 'Lina',
    address: 'Jl. Melati No. 23',
    date: '24 April 2024',
    time: '12:45',
    status: 'Total',
  },
];

const statusOptions = ['Diproses', 'Diantar', 'Selesai', 'Total'];

const initialForm = {
  seri: '',
  name: '',
  address: '',
  date: '',
  time: '',
  status: 'Diproses',
};

export default function Pesanan() {
  const [search, setSearch] = useState('');
  const [orders, setOrders] = useState(initialOrders);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState('');

  const filteredOrders = orders.filter((order) =>
    [order.name, order.seri].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.seri || !form.name || !form.address || !form.date || !form.time) {
      setMessage('Harap lengkapi semua data pesanan.');
      return;
    }

    setOrders((prev) => [form, ...prev]);
    setForm(initialForm);
    setShowForm(false);
    setMessage('Pesanan berhasil ditambahkan.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader 
        title="Kelola Pesanan" 
        subtitle="Kelola pesanan laundry dengan mudah dan efisien"
        showSearch={false} />

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="w-full sm:w-2/3">
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Cari Nama atau Seri</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nama atau Seri"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter shadow-sm"
            />
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <div className="flex items-center justify-between gap-4 mb-5">
              <h2 className="text-lg font-inter-semibold text-gray-800">Form Tambah Pesanan</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Tutup
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Seri</label>
                <input
                  type="text"
                  value={form.seri}
                  onChange={(e) => handleInputChange('seri', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Nama Pelanggan</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Alamat</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Tanggal</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Waktu Jemput</label>
                <input
                  type="time"
                  value={form.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div>
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-inter-semibold text-gray-700 hover:bg-gray-100"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-inter-semibold text-white hover:bg-[#0f4d8a] transition"
              >
                Simpan Pesanan
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="min-w-full w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                {['No', 'Seri', 'Nama Pelanggan', 'Alamat', 'Tanggal', 'Waktu Jemput', 'Status'].map((label) => (
                  <th
                    key={label}
                    className="px-4 py-3 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider"
                  >
                    {label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.map((order, index) => (
                <tr key={order.seri} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{index + 1}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{order.seri}</td>
                  <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{order.name}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{order.address}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{order.date}</td>
                  <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{order.time}</td>
                  <td className="px-4 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
