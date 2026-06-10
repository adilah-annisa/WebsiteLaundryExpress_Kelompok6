import kurirData from "../../data/kurirData.json";
import StatusBadge from "../../components/StatusBadge";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

export default function Antar() {
  const data = kurirData.tasks.filter((item) => item.jenis === "Pengantaran");
  const completedCount = data.filter((item) => item.status === "Diantar").length;

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
          <p className="text-xs text-blue-600 font-inter-semibold uppercase mb-1">Total Pengantaran</p>
          <p className="text-2xl font-inter-semibold text-blue-900">{data.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
          <p className="text-xs text-green-600 font-inter-semibold uppercase mb-1">Selesai</p>
          <p className="text-2xl font-inter-semibold text-green-900">{completedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-4 border border-yellow-200">
          <p className="text-xs text-yellow-600 font-inter-semibold uppercase mb-1">Sisa Tugas</p>
          <p className="text-2xl font-inter-semibold text-yellow-900">{data.length - completedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <h2 className="font-inter-semibold text-lg text-gray-800">
            Jadwal Pengantaran Hari Ini
          </h2>
          <p className="text-sm text-gray-500 mt-1">{data.length} pengantaran akan dilakukan</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Kode
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Nama Pelanggan
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Alamat
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Waktu
                </th>
                <th className="px-6 py-4 text-left text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-center text-xs font-inter-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data && data.length > 0 ? (
                data.map((task, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50/50 transition-colors group"
                  >
                    <td className="px-6 py-4 text-sm font-inter-semibold text-gray-800">
                      {task.kode}
                    </td>
                    <td className="px-6 py-4 text-sm font-inter-medium text-gray-700">
                      {task.nama}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins max-w-xs truncate">
                      {task.alamat}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-poppins font-inter-semibold">
                      {task.waktu}
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={task.status} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button className="inline-flex items-center justify-center px-3 py-2 rounded-lg text-sm font-inter-medium bg-blue-50 text-[#3b6fd8] hover:bg-blue-100 opacity-0 group-hover:opacity-100 transition-all">
                        Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <IoCheckmarkCircleOutline className="text-4xl text-green-500 mb-3" />
                      <p className="text-gray-500 font-poppins">
                        Semua pengantaran telah selesai!
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}