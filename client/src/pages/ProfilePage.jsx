import Card from "../components/ui/Card";
import { useAuth } from "../context/AuthContext";

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <Card title="โปรไฟล์ผู้ใช้งาน" subtitle="ข้อมูลส่วนตัวและสิทธิ์การใช้งาน">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">ชื่อ - นามสกุล</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.name}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">อีเมล</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.email}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">แผนก</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.department}</p>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-5">
          <p className="text-sm text-slate-500">บทบาท</p>
          <p className="mt-2 text-lg font-semibold text-slate-900">{user?.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน"}</p>
        </div>
      </div>
    </Card>
  );
}
