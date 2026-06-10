import { IoCheckmarkCircleOutline, IoEllipseOutline, IoTimeOutline } from "react-icons/io5";

export default function StatusLaundry() {
  const steps = [
    { label: "Pesanan Dibuat", icon: IoCheckmarkCircleOutline, status: "completed" },
    { label: "Dijemput Kurir", icon: IoCheckmarkCircleOutline, status: "completed" },
    { label: "Sedang Dicuci", icon: IoCheckmarkCircleOutline, status: "completed" },
    { label: "Sedang Disetrika", icon: IoTimeOutline, status: "active" },
    { label: "Siap Diantar", icon: IoEllipseOutline, status: "pending" },
    { label: "Selesai", icon: IoEllipseOutline, status: "pending" },
  ];

  return (
    <div className="max-w-3xl">
      <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
        <div className="mb-8">
          <h2 className="font-inter-semibold text-2xl text-gray-800">
            Status Pesanan Laundry
          </h2>
          <p className="text-sm text-gray-500 mt-2">Pesanan #P001 - Status: Sedang Disetrika</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-[#3b6fd8] to-[#1565C0] rounded-full" style={{ width: "66%" }}></div>
          </div>
          <p className="text-xs text-gray-500 mt-2 text-right">4 dari 6 tahap selesai</p>
        </div>

        {/* Timeline Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isCompleted = step.status === "completed";
            const isActive = step.status === "active";
            const isPending = step.status === "pending";

            return (
              <div key={index} className="flex items-start gap-4">
                {/* Timeline Icon */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                      isCompleted
                        ? "bg-green-100 text-green-600"
                        : isActive
                        ? "bg-blue-100 text-blue-600 animate-pulse"
                        : "bg-gray-100 text-gray-400"
                    }`}
                  >
                    <Icon className="text-xl" />
                  </div>

                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div
                      className={`w-1 h-16 mt-2 transition-colors ${
                        isCompleted ? "bg-green-300" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>

                {/* Timeline Content */}
                <div className="flex-1 pt-2">
                  <div className="bg-gradient-to-r from-gray-50 to-white border border-gray-100 rounded-lg p-4 hover:border-gray-200 transition-all">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3
                          className={`font-inter-semibold text-lg ${
                            isCompleted ? "text-green-700" : isActive ? "text-blue-700" : "text-gray-600"
                          }`}
                        >
                          {step.label}
                        </h3>
                        <p
                          className={`text-sm mt-1 ${
                            isCompleted ? "text-green-600" : isActive ? "text-blue-600" : "text-gray-500"
                          }`}
                        >
                          {isCompleted && "✓ Selesai"}
                          {isActive && "⏳ Sedang berlangsung..."}
                          {isPending && "Menunggu"}
                        </p>
                      </div>

                      {isCompleted && (
                        <div className="text-xs bg-green-50 text-green-700 px-3 py-1 rounded-full font-inter-semibold">
                          Selesai
                        </div>
                      )}
                      {isActive && (
                        <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-inter-semibold animate-pulse">
                          Proses
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Info Box */}
        <div className="mt-12 p-4 bg-blue-50 border border-blue-100 rounded-lg">
          <p className="text-sm text-blue-700 font-inter-medium">
            💡 Pesanan Anda sedang dalam tahap pengsetrikaan. Estimasi selesai: Hari ini jam 17:00
          </p>
        </div>
      </div>
    </div>
  );
}