import { useState } from 'react';
import PageHeader from '../../DashboardAdmin/components/PageHeader';
import StatusBadge from '../../DashboardAdmin/components/StatusBadge';

const initialTransactions = [
  { seri: '#00001', name: 'Budi', date: '24 April 2024', amount: 'Rp 120.000', status: 'Lunas' },
  { seri: '#00002', name: 'Susi', date: '24 April 2024', amount: 'Rp 85.000', status: 'Belum Lunas' },
  { seri: '#00003', name: 'Andi', date: '24 April 2024', amount: 'Rp 135.000', status: 'Lunas' },
  { seri: '#00004', name: 'Lina', date: '24 April 2024', amount: 'Rp 150.000', status: 'Belum Lunas' },
];

const statusOptions = ['Lunas', 'Belum Lunas'];
const initialForm = {
  seri: '',
  name: '',
  date: '',
  amount: '',
  status: 'Lunas',
};

export default function Keuangan() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');

  const filteredTransactions = transactions.filter((item) =>
    [item.seri, item.name].some((value) =>
      value.toLowerCase().includes(search.toLowerCase())
    )
  );

  const summaryCards = [
    { label: 'Total Pendapatan', value: `Rp ${transactions.reduce((acc, item) => acc + Number(item.amount.replace(/[^0-9]/g, '')), 0).toLocaleString('id-ID')}`, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Pesanan Selesai', value: transactions.filter((item) => item.status === 'Lunas').length, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Pesanan Pending', value: transactions.filter((item) => item.status === 'Belum Lunas').length, bg: 'bg-orange-50', text: 'text-orange-700' },
  ];

  const handleInputChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!form.seri || !form.name || !form.date || !form.amount) {
      setMessage('Lengkapi semua data transaksi.');
      return;
    }

    setTransactions((prev) => [form, ...prev]);
    setForm(initialForm);
    setShowForm(false);
    setMessage('Transaksi berhasil ditambahkan.');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Keuangan" showSearch={false} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-6 shadow-sm ${card.bg}`}>
            <p className="text-sm text-gray-500 font-poppins">{card.label}</p>
            <p className={`mt-3 text-3xl font-inter-semibold ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="w-full md:w-2/3">
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Cari Seri atau Nama</label>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Seri atau Nama"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter shadow-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowForm((prev) => !prev)}
              className="inline-flex items-center justify-center rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-inter-semibold text-white shadow-sm transition hover:bg-[#0f4d8a]"
            >
              {showForm ? 'Tutup Form' : '+ Tambah Transaksi'}
            </button>
          </div>
        </div>

        {message && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {message}
          </div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-inter-semibold text-gray-800 mb-5">Form Tambah Transaksi</h2>
            <div className="grid gap-4 md:grid-cols-2">
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
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Nama</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
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
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Jumlah</label>
                <input
                  type="text"
                  value={form.amount}
                  onChange={(e) => handleInputChange('amount', e.target.value)}
                  placeholder="Rp 0"
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 focus:border-blue-300 font-inter"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Status Bayar</label>
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
                Simpan Transaksi
              </button>
            </div>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-100">
            <h2 className="font-inter-semibold text-lg text-gray-800">Transaksi Terbaru</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full w-full text-left">
              <thead>
                <tr className="bg-gray-50/80">
                  {['Seri', 'Nama', 'Tanggal', 'Jumlah', 'Status Bayar'].map((label) => (
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
                {filteredTransactions.map((item) => (
                  <tr key={item.seri} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{item.seri}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.date}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.amount}</td>
                    <td className="px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
