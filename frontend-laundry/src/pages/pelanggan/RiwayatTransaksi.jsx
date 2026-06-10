import pelangganData from "../../data/pelangganData.json";
import StatusBadge from "../../components/StatusBadge";

export default function RiwayatTransaksi() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b">
        <h2 className="text-lg font-inter-semibold text-gray-800">
          Riwayat Transaksi
        </h2>
      </div>

      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-left">Kode</th>
            <th className="px-6 py-4 text-left">Layanan</th>
            <th className="px-6 py-4 text-left">Tanggal</th>
            <th className="px-6 py-4 text-left">Total</th>
            <th className="px-6 py-4 text-left">Status</th>
          </tr>
        </thead>

        <tbody>
          {pelangganData.orders.map((order, index) => (
            <tr key={index} className="border-t">
              <td className="px-6 py-4">{order.kode}</td>
              <td className="px-6 py-4">{order.layanan}</td>
              <td className="px-6 py-4">{order.tanggal}</td>
              <td className="px-6 py-4">{order.total}</td>
              <td className="px-6 py-4">
                <StatusBadge status={order.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}