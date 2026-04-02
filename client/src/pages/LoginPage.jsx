import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/ui/FormInput";

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

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-soft lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden bg-brand-900 p-10 text-white lg:block">
          <p className="text-sm uppercase tracking-[0.4em] text-brand-100">Industrial Factory</p>
          <h1 className="mt-6 text-4xl font-bold leading-tight">ระบบ Intranet สำหรับการทำงานภายในองค์กร</h1>
          <p className="mt-4 text-white/75">รวมประกาศ เอกสาร แผนงาน การผลิต และการสื่อสารภายในบริษัทโรงงานอุตสาหกรรมไว้ในที่เดียว</p>
        </div>
        <div className="p-8 md:p-10">
          <h2 className="text-3xl font-bold text-slate-900">เข้าสู่ระบบ</h2>
          <p className="mt-2 text-sm text-slate-500">ใช้บัญชีพนักงานเพื่อเข้าถึงข้อมูลภายในบริษัท</p>
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <FormInput label="อีเมล" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <FormInput
              label="รหัสผ่าน"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
            {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
            <button disabled={loading} className="w-full rounded-2xl bg-brand-600 px-4 py-3 font-medium text-white disabled:opacity-70">
              {loading ? "กำลังเข้าสู่ระบบ..." : "เข้าสู่ระบบ"}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            ยังไม่มีบัญชี?{" "}
            <Link to="/register" className="font-medium text-brand-600">
              สมัครสมาชิก
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
