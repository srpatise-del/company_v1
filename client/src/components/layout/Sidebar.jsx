import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const navItems = [
  { to: "/dashboard", label: "แดชบอร์ด" },
  { to: "/announcements", label: "ประกาศบริษัท" },
  { to: "/documents", label: "เอกสาร" },
  { to: "/projects", label: "โครงการ" },
  { to: "/notifications", label: "การแจ้งเตือน" },
  { to: "/profile", label: "โปรไฟล์" }
];

export default function Sidebar() {
  const { user } = useAuth();

  return (
    <aside className="glass border-b border-white/60 px-5 py-6 lg:min-h-screen lg:border-b-0 lg:border-r">
      <div className="mb-8">
        <p className="text-sm font-medium uppercase tracking-[0.3em] text-brand-600">IFI</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">Intranet โรงงานอุตสาหกรรม</h1>
        <p className="mt-2 text-sm text-slate-500">ศูนย์กลางข้อมูลภายในสำหรับพนักงานฝ่ายผลิต คุณภาพ วิศวกรรม และสำนักงาน</p>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-brand-600 text-white shadow-soft" : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
        {user?.role === "admin" && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `block rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive ? "bg-accent text-white shadow-soft" : "text-slate-600 hover:bg-white hover:text-slate-900"
              }`
            }
          >
            แผงควบคุมผู้ดูแล
          </NavLink>
        )}
      </nav>
    </aside>
  );
}
