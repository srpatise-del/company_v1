import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import FormInput from "../components/ui/FormInput";

const DEPARTMENTS = [
  "ฝ่ายบริหาร",
  "แผนกทรัพยากรบุคคล",
  "แผนกการเงินและบัญชี",
  "แผนกการตลาด",
  "แผนกฝ่ายขาย",
  "แผนกไอที",
  "แผนกฝ่ายปฏิบัติการ"
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    department: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");
      const { data } = await api.post("/auth/register", form);
      login(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-soft md:p-10">
        <h2 className="text-3xl font-bold text-slate-900">สมัครสมาชิกพนักงาน</h2>
        <p className="mt-2 text-sm text-slate-500">สร้างบัญชีเพื่อเริ่มใช้งานระบบภายในบริษัท</p>
        <form onSubmit={handleSubmit} className="mt-8 grid gap-4 md:grid-cols-2">
          <FormInput label="ชื่อ - นามสกุล" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">แผนก</span>
            <select
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
              required
            >
              <option value="">เลือกแผนก</option>
              {DEPARTMENTS.map((department) => (
                <option key={department} value={department}>
                  {department}
                </option>
              ))}
            </select>
          </label>
          <FormInput
            label="อีเมล"
            type="email"
            className="md:col-span-2"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <FormInput
            label="รหัสผ่าน"
            type="password"
            className="md:col-span-2"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-600 md:col-span-2">{error}</p>}
          <button disabled={loading} className="rounded-2xl bg-brand-600 px-4 py-3 font-medium text-white md:col-span-2">
            {loading ? "กำลังสร้างบัญชี..." : "สมัครสมาชิก"}
          </button>
        </form>
        <p className="mt-6 text-sm text-slate-500">
          มีบัญชีแล้ว?{" "}
          <Link to="/login" className="font-medium text-brand-600">
            กลับไปหน้าเข้าสู่ระบบ
          </Link>
        </p>
      </div>
    </div>
  );
}
