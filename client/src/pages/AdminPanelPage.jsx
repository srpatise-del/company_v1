import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import useAsync from "../hooks/useAsync";
import api from "../services/api";

export default function AdminPanelPage() {
  const { data, loading, error } = useAsync(async () => {
    const [{ data: usersRes }, { data: dashboardRes }] = await Promise.all([api.get("/users"), api.get("/dashboard/summary")]);
    return { users: usersRes.users, summary: dashboardRes.summary };
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="จำนวนพนักงาน">{loading ? "..." : <p className="text-4xl font-bold">{data?.users?.length || 0}</p>}</Card>
        <Card title="ประกาศทั้งหมด">{loading ? "..." : <p className="text-4xl font-bold">{data?.summary?.announcements || 0}</p>}</Card>
        <Card title="โครงการทั้งหมด">{loading ? "..." : <p className="text-4xl font-bold">{data?.summary?.projects || 0}</p>}</Card>
      </div>
      <Card title="จัดการผู้ใช้งาน" subtitle="ภาพรวมพนักงานในระบบ">
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
        <DataTable
          columns={[
            { key: "name", label: "ชื่อ" },
            { key: "email", label: "อีเมล" },
            { key: "department", label: "แผนก" },
            { key: "role", label: "บทบาท", render: (row) => (row.role === "admin" ? "ผู้ดูแลระบบ" : "พนักงาน") }
          ]}
          rows={data?.users || []}
          emptyMessage="ยังไม่มีผู้ใช้งาน"
        />
      </Card>
    </div>
  );
}
