import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSearch } from "../../context/SearchContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { keyword, setKeyword } = useSearch();
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const trimmedKeyword = keyword.trim();
    if (!trimmedKeyword) {
      navigate("/search");
      return;
    }
    navigate(`/search?q=${encodeURIComponent(trimmedKeyword)}`);
  };

  return (
    <header className="sticky top-0 z-10 border-b border-white/60 bg-white/75 px-4 py-4 backdrop-blur md:px-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">สวัสดี, {user?.name}</h2>
          <p className="text-sm text-slate-500">
            แผนก {user?.department || "-"} | สิทธิ์ {user?.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน"}
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              placeholder="ค้นหาประกาศ เอกสาร หรือโครงการ"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm outline-none ring-brand-100 transition focus:ring md:w-80"
            />
          </form>
          <button onClick={() => navigate("/notifications")} className="rounded-2xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white">
            การแจ้งเตือน
          </button>
          <button onClick={logout} className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700">
            ออกจากระบบ
          </button>
        </div>
      </div>
    </header>
  );
}
