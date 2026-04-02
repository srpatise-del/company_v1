import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const DEMO_ADMIN = {
  email: "admin@1.com",
  password: "admin"
};

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/login", form);
      login(data);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAdmin = () => {
    setForm(DEMO_ADMIN);
    setError("");
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-[32px] border border-slate-700/60 bg-slate-950 p-6 text-white shadow-2xl shadow-slate-900/30 md:p-8">
        <div className="grid grid-cols-2 gap-3 rounded-[28px] border border-slate-700/70 bg-slate-900/60 p-3">
          <Link
            to="/login"
            className="rounded-2xl border border-slate-500/40 bg-slate-700/80 px-4 py-3 text-center text-sm font-semibold text-white"
          >
            เข้าสู่ระบบ
          </Link>
          <Link
            to="/register"
            className="rounded-2xl border border-slate-700 bg-slate-800/70 px-4 py-3 text-center text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:text-white"
          >
            สมัครสมาชิก
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">อีเมล</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-200">รหัสผ่าน</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="กรอกรหัสผ่าน"
              className="w-full rounded-2xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-orange-400 focus:ring-4 focus:ring-orange-400/10"
              required
            />
          </div>

          {error && <p className="rounded-2xl bg-red-500/10 px-4 py-3 text-sm text-red-300">{error}</p>}

          <button
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-rose-400 via-orange-400 to-orange-300 px-4 py-3 font-semibold text-slate-950 transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
          </button>
        </form>

        <div className="mt-6 rounded-[24px] border border-slate-700 bg-slate-900/70 p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-base font-semibold text-white">บัญชีสำหรับทดลอง</p>
              <p className="mt-1 text-sm text-slate-400">ใช้สำหรับเข้าสู่ระบบแอดมินอย่างรวดเร็ว</p>
            </div>
            <button
              type="button"
              onClick={fillDemoAdmin}
              className="rounded-xl border border-orange-400/40 bg-orange-400/10 px-3 py-2 text-xs font-semibold text-orange-200 transition hover:bg-orange-400/20"
            >
              ใส่ข้อมูลอัตโนมัติ
            </button>
          </div>

          <div className="mt-4 rounded-2xl bg-slate-800/80 p-4">
            <p className="text-lg font-bold text-amber-300">Admin</p>
            <p className="mt-2 text-sm text-slate-200">
              อีเมล: <span className="font-medium text-white">{DEMO_ADMIN.email}</span>
            </p>
            <p className="mt-1 text-sm text-slate-200">
              รหัสผ่าน: <span className="font-medium text-white">{DEMO_ADMIN.password}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
