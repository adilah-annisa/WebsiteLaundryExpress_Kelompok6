import { useMemo, useState } from "react";
import {
  IoCubeOutline,
  IoShirtOutline,
  IoCheckmarkCircleOutline,
  IoTrendingUpOutline,
} from "react-icons/io5";

import StatCard from "../../components/StatCard";

const monthlyData = [
  { bulan: "Jan", nilai: 85 },
  { bulan: "Feb", nilai: 72 },
  { bulan: "Mar", nilai: 90 },
  { bulan: "Apr", nilai: 78 },
  { bulan: "Mei", nilai: 95 },
  { bulan: "Jun", nilai: 88 },
];

export default function Dashboard() {
  const [toast, setToast] = useState("");

  const maxNilai = Math.max(
    ...monthlyData.map((item) => item.nilai)
  );

  const summary = useMemo(() => {
    return [
      {
        label: "Total Pesanan",
        value: "1.180",
        color: "#2563eb",
        bgIcon: "bg-blue-50",
        icon: IoShirtOutline,
      },
      {
        label: "Pendapatan Bulan Ini",
        value: "Rp 1.248.000",
        color: "#10b981",
        bgIcon: "bg-green-50",
        icon: IoCubeOutline,
      },
      {
        label: "Laundry Selesai",
        value: "1.025",
        color: "#22c55e",
        bgIcon: "bg-emerald-50",
        icon: IoCheckmarkCircleOutline,
      },
      {
        label: "Pertumbuhan",
        value: "+12%",
        color: "#f59e0b",
        bgIcon: "bg-yellow-50",
        icon: IoTrendingUpOutline,
      },
    ];
  }, []);


  const handleUpdate = () => {
    setToast("Dashboard berhasil diperbarui");

    setTimeout(() => {
      setToast("");
    }, 3000);
  };


  return (
    <div className="space-y-8 max-w-screen-2xl mx-auto">

      {/* Toast */}
      {toast && (
        <div className="
          fixed top-5 right-5 z-50
          rounded-xl
          bg-slate-900
          text-white
          px-5 py-3
          text-sm
          font-semibold
          shadow-lg
        ">
          {toast}
        </div>
      )}


      {/* HEADER */}
      <div className="
        rounded-3xl
        bg-gradient-to-r
        from-[#1565C0]
        to-[#3b82f6]
        p-8
        text-white
        shadow-lg
      ">

        <div className="
          flex
          flex-col
          md:flex-row
          md:items-center
          md:justify-between
          gap-6
        ">

          <div>

            <p className="
              text-blue-100
              text-sm
              uppercase
              tracking-wider
            ">
              Laundry Express
            </p>


            <h1 className="
              text-3xl
              md:text-4xl
              font-bold
              mt-2
            ">
              Selamat Datang, Admin 👋
            </h1>


            <p className="
              text-blue-100
              mt-4
              max-w-xl
            ">
              Pantau Perkembangan Keuangan Anda
            </p>


          </div>


          <div className="
            bg-white/10
            rounded-2xl
            p-5
            backdrop-blur-sm
          ">
            <IoTrendingUpOutline
              className="text-6xl"
            />
          </div>


        </div>

      </div>



      {/* STAT CARD */}

      <div className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        {summary.map((item,index)=>(

          <StatCard

            key={index}

            icon={item.icon}

            label={item.label}

            value={item.value}

            color={item.color}

            bgIcon={item.bgIcon}

          />

        ))}

      </div>





      {/* GRAFIK */}

      <div className="
        rounded-3xl
        border
        border-slate-200
        bg-white
        shadow-sm
        p-6
      ">


        <div>

          <h2 className="
            text-2xl
            font-bold
            text-slate-900
          ">
            Ringkasan Dashboard
          </h2>


          <p className="
            mt-2
            text-sm
            text-slate-500
          ">
            Pantau perkembangan pendapatan Laundry Express selama enam bulan terakhir.
          </p>


        </div>




        <div className="
          mt-8
          rounded-3xl
          border
          border-slate-200
          bg-slate-50
          p-6
        ">


          <p className="
            text-sm
            uppercase
            tracking-[0.2em]
            text-slate-500
          ">
            Grafik Pendapatan (6 Bulan)
          </p>




          <div className="
            mt-8
            h-72
            flex
            items-end
            justify-between
            gap-5
            px-3
          ">


            {monthlyData.map((item)=>(

              <div
                key={item.bulan}
                className="
                  flex-1
                  flex
                  flex-col
                  items-center
                  gap-3
                  group
                "
              >


                <div className="
                  relative
                  w-full
                  flex
                  justify-center
                ">


                  <div

                    className="
                      w-full
                      max-w-14
                      rounded-t-xl
                      bg-gradient-to-t
                      from-[#1565C0]
                      to-[#3b82f6]
                      transition-all
                      duration-500
                      group-hover:scale-y-105
                      origin-bottom
                    "

                    style={{
                      height:`${
                        (item.nilai / maxNilai) * 220
                      }px`
                    }}

                  />


                </div>



                <span className="
                  text-xs
                  font-semibold
                  text-slate-600
                ">
                  {item.bulan}
                </span>


              </div>

            ))}


          </div>


        </div>


      </div>



    </div>
  );
}
