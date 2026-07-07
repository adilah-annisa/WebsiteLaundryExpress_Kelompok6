import { Link } from "react-router-dom";
import { IoPeopleOutline, IoCarOutline, IoStorefrontOutline } from "react-icons/io5";
import { Card, CardBody } from "./ui/Card";

const PORTALS = {
  admin: [
    { to: "/pelanggan", label: "Portal Pelanggan", desc: "Demo dashboard pelanggan", icon: IoPeopleOutline, color: "from-violet-500 to-purple-600" },
    { to: "/kurir", label: "Portal Kurir", desc: "Demo dashboard kurir", icon: IoCarOutline, color: "from-amber-500 to-orange-600" },
  ],
  pelanggan: [
    { to: "/dashboard", label: "Portal Admin", desc: "Dashboard pemilik laundry", icon: IoStorefrontOutline, color: "from-blue-600 to-indigo-700" },
    { to: "/kurir", label: "Portal Kurir", desc: "Dashboard kurir", icon: IoCarOutline, color: "from-amber-500 to-orange-600" },
  ],
  kurir: [
    { to: "/dashboard", label: "Portal Admin", desc: "Dashboard pemilik laundry", icon: IoStorefrontOutline, color: "from-blue-600 to-indigo-700" },
    { to: "/pelanggan", label: "Portal Pelanggan", desc: "Dashboard pelanggan", icon: IoPeopleOutline, color: "from-violet-500 to-purple-600" },
  ],
};

export default function RoleShortcuts({ role }) {
  const items = PORTALS[role] || [];

  // Remove portal shortcuts for all roles per requirement
  if (role === "admin" || role === "pelanggan" || role === "kurir") return null;

  if (!items.length) return null;

  return (
    <div className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Shortcut Portal</h3>
        <p className="text-xs text-slate-500 mt-1">Navigasi cepat ke dashboard role lain (login dengan akun demo terkait).</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.to} to={item.to}>
              <Card hover className="h-full group">
                <CardBody className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform`}>
                    <Icon className="text-xl text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">{item.label}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                  </div>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
