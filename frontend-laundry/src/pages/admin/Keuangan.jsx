import { useMemo, useState } from 'react';
import PageHeader from '../../DashboardAdmin/components/PageHeader';
import StatusBadge from '../../DashboardAdmin/components/StatusBadge';

const initialTransactions = [
  { seri: '#00001', name: 'Budi', date: '24 April 2024', amount: 'Rp 120.000', status: 'Lunas' },
  { seri: '#00002', name: 'Susi', date: '24 April 2024', amount: 'Rp 85.000', status: 'Belum Lunas' },
  { seri: '#00003', name: 'Andi', date: '24 April 2024', amount: 'Rp 135.000', status: 'Lunas' },
  { seri: '#00004', name: 'Lina', date: '24 April 2024', amount: 'Rp 150.000', status: 'Belum Lunas' },
];

const layananOptions = [
  { value: 'cuci-kering', label: 'Cuci Kering', price: 3000 },
  { value: 'cuci-setrika', label: 'Cuci Setrika', price: 7000 },
  { value: 'setrika-saja', label: 'Setrika Saja', price: 4000 },
  { value: 'dry-clean', label: 'Dry Clean', price: 15000 },
];

const statusOptions = ['Lunas', 'Belum Lunas'];
const initialForm = { seri: '', name: '', date: '', amount: '', status: 'Lunas' };

export default function Keuangan() {
  const [transactions, setTransactions] = useState(initialTransactions);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');
  const [toast, setToast] = useState('');

  const [calcLayanan, setCalcLayanan] = useState('');
  const [calcBerat, setCalcBerat] = useState('');
  const [calcOngkir, setCalcOngkir] = useState('5000');

  const calcPrice = layananOptions.find((l) => l.value === calcLayanan)?.price || 0;
  const calcBeratNum = Number(calcBerat) || 0;
  const calcOngkirNum = Number(calcOngkir) || 0;
  const calcTotal = calcPrice * calcBeratNum + (calcBeratNum > 0 ? calcOngkirNum : 0);

  const filteredTransactions = useMemo(() => {
    const q = search.toLowerCase();
    return transactions.filter((item) => {
      const matchSearch = [item.seri, item.name].some((v) => v.toLowerCase().includes(q));
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transactions, search, statusFilter]);

  const summaryCards = [
    { label: 'Total Pendapatan', value: `Rp ${transactions.reduce((acc, item) => acc + Number(item.amount.replace(/[^0-9]/g, '')), 0).toLocaleString('id-ID')}`, bg: 'bg-green-50', text: 'text-green-700' },
    { label: 'Pesanan Lunas', value: transactions.filter((item) => item.status === 'Lunas').length, bg: 'bg-blue-50', text: 'text-blue-700' },
    { label: 'Pesanan Pending', value: transactions.filter((item) => item.status === 'Belum Lunas').length, bg: 'bg-orange-50', text: 'text-orange-700' },
  ];

  const showToast = (text) => {
    setToast(text);
    setTimeout(() => setToast(''), 3000);
  };

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
    setMessage('');
    showToast('Transaksi berhasil ditambahkan.');
  };

  const applyCalcToForm = () => {
    if (!calcLayanan || !calcBeratNum) return;
    setForm((prev) => ({
      ...prev,
      amount: `Rp ${calcTotal.toLocaleString('id-ID')}`,
    }));
    setShowForm(true);
    showToast('Total biaya diterapkan ke form transaksi.');
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-inter-semibold shadow-lg animate-in fade-in">
          {toast}
        </div>
      )}

      <PageHeader title="Keuangan" subtitle="Kelola transaksi dan hitung biaya laundry" showSearch={false} />

      <div className="rounded-2xl border border-blue-100 bg-linear-to-br from-blue-50 to-white p-6 shadow-sm">
        <h2 className="font-inter-semibold text-lg text-gray-800">Kalkulator Biaya Laundry</h2>
        <p className="text-sm text-gray-500 mt-1 font-poppins">Hitung biaya berdasarkan jenis layanan, berat, dan ongkir antar/jemput.</p>
        <div className="mt-5 grid gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Jenis Layanan</label>
            <select
              value={calcLayanan}
              onChange={(e) => setCalcLayanan(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter bg-white"
            >
              <option value="">Pilih layanan</option>
              {layananOptions.map((l) => (
                <option key={l.value} value={l.value}>{l.label} — Rp {l.price.toLocaleString('id-ID')}/Kg</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Berat (Kg)</label>
            <input
              type="number"
              min="0"
              step="0.1"
              value={calcBerat}
              onChange={(e) => setCalcBerat(e.target.value)}
              placeholder="Contoh: 3.5"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter"
            />
          </div>
          <div>
            <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Ongkir Antar/Jemput</label>
            <input
              type="number"
              min="0"
              value={calcOngkir}
              onChange={(e) => setCalcOngkir(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter"
            />
          </div>
          <div className="flex flex-col justify-end">
            <div className="rounded-xl bg-slate-800 p-4 text-white mb-3">
              <p className="text-xs text-slate-300">Total Estimasi</p>
              <p className="text-2xl font-inter-semibold mt-1">
                {calcTotal > 0 ? `Rp ${calcTotal.toLocaleString('id-ID')}` : '-'}
              </p>
            </div>
            <button
              type="button"
              onClick={applyCalcToForm}
              disabled={!calcLayanan || !calcBeratNum}
              className="rounded-xl bg-[#1565C0] px-4 py-2.5 text-sm font-inter-semibold text-white hover:bg-[#0f4d8a] transition disabled:opacity-50"
            >
              Terapkan ke Transaksi
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {summaryCards.map((card) => (
          <div key={card.label} className={`rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow ${card.bg}`}>
            <p className="text-sm text-gray-500 font-poppins">{card.label}</p>
            <p className={`mt-3 text-3xl font-inter-semibold ${card.text}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari seri atau nama..."
              className="w-full sm:w-64 px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter shadow-sm"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter bg-white shadow-sm"
            >
              <option value="all">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => setShowForm((prev) => !prev)}
            className="inline-flex items-center justify-center rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-inter-semibold text-white shadow-sm transition hover:bg-[#0f4d8a]"
          >
            {showForm ? 'Tutup Form' : '+ Tambah Transaksi'}
          </button>
        </div>

        {message && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">{message}</div>
        )}

        {showForm && (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <h2 className="text-lg font-inter-semibold text-gray-800 mb-5">Form Tambah Transaksi</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: 'Seri', field: 'seri', type: 'text' },
                { label: 'Nama', field: 'name', type: 'text' },
                { label: 'Tanggal', field: 'date', type: 'date' },
                { label: 'Jumlah', field: 'amount', type: 'text' },
              ].map((item) => (
                <div key={item.field}>
                  <label className="block text-sm font-inter-semibold text-gray-600 mb-2">{item.label}</label>
                  <input
                    type={item.type}
                    value={form[item.field]}
                    onChange={(e) => handleInputChange(item.field, e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter"
                  />
                </div>
              ))}
              <div className="md:col-span-2">
                <label className="block text-sm font-inter-semibold text-gray-600 mb-2">Status Bayar</label>
                <select
                  value={form.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-200 font-inter bg-white"
                >
                  {statusOptions.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-inter-semibold text-gray-700 hover:bg-gray-100">
                Batal
              </button>
              <button type="button" onClick={handleSave} className="rounded-xl bg-[#1565C0] px-5 py-3 text-sm font-inter-semibold text-white hover:bg-[#0f4d8a] transition">
                Simpan Transaksi
              </button>
            </div>
          </div>
        )}

        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="min-w-full w-full text-left">
            <thead>
              <tr className="bg-gray-50/80">
                {['Seri', 'Nama', 'Tanggal', 'Jumlah', 'Status Bayar'].map((label) => (
                  <th key={label} className="px-4 py-3 text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">{label}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTransactions.length > 0 ? (
                filteredTransactions.map((item) => (
                  <tr key={item.seri} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{item.seri}</td>
                    <td className="px-4 py-4 text-sm text-gray-700 font-inter-medium">{item.name}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.date}</td>
                    <td className="px-4 py-4 text-sm text-gray-600 font-poppins">{item.amount}</td>
                    <td className="px-4 py-4"><StatusBadge status={item.status} /></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-14 text-center text-gray-500 font-poppins">Tidak ada transaksi yang cocok.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
