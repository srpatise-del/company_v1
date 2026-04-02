import Card from "../components/ui/Card";
import DataTable from "../components/ui/DataTable";
import ProgressBar from "../components/ui/ProgressBar";
import EmptyState from "../components/ui/EmptyState";
import useAsync from "../hooks/useAsync";
import api from "../services/api";
import { formatDate } from "../utils/format";

export default function DashboardPage() {
  const { data, loading, error } = useAsync(async () => {
    const { data } = await api.get("/dashboard/summary");
    return data;
  }, []);

  if (loading) return <p className="text-sm text-slate-500">กำลังโหลดข้อมูลแดชบอร์ด...</p>;
  if (error) return <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>;

  const summaryCards = [
    { label: "ประกาศล่าสุด", value: data.summary.announcements, hint: "อัปเดตข่าวสารบริษัท" },
    { label: "เอกสารทั้งหมด", value: data.summary.documents, hint: "เอกสารภายในองค์กร" },
    { label: "โครงการที่กำลังดำเนินการ", value: data.summary.ongoingProjects, hint: "ติดตามสถานะงาน" },
    { label: "การแจ้งเตือนของฉัน", value: data.summary.unreadNotifications, hint: "รายการที่ยังไม่ได้อ่าน" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((item) => (
          <Card key={item.label}>
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-3 text-4xl font-bold text-slate-900">{item.value}</p>
            <p className="mt-2 text-sm text-brand-700">{item.hint}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card title="ประกาศปักหมุด" subtitle="ข่าวสารที่ควรติดตาม">
          {data.pinnedAnnouncements.length ? (
            <div className="space-y-4">
              {data.pinnedAnnouncements.map((item) => (
                <div key={item._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-semibold text-slate-900">{item.title}</h4>
                      <p className="mt-1 text-sm text-slate-500">{item.category}</p>
                    </div>
                    <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
                  </div>
                  <p className="mt-3 text-sm text-slate-600">{item.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="ยังไม่มีประกาศปักหมุด" description="เมื่อมีประกาศสำคัญจะปรากฏที่นี่" />
          )}
        </Card>

        <Card title="โครงการล่าสุด" subtitle="ติดตามความคืบหน้าในภาพรวม">
          <div className="space-y-4">
            {data.latestProjects.map((project) => (
              <div key={project._id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <div>
                    <h4 className="font-semibold text-slate-900">{project.name}</h4>
                    <p className="text-sm text-slate-500">{project.status === "ongoing" ? "กำลังดำเนินการ" : "เสร็จสิ้น"}</p>
                  </div>
                  <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">{project.assignedTo?.name || "ยังไม่ระบุ"}</span>
                </div>
                <ProgressBar value={project.progress} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="เอกสารล่าสุด" subtitle="เอกสารที่มีการอัปโหลดล่าสุด">
        <DataTable
          columns={[
            { key: "name", label: "ชื่อเอกสาร" },
            { key: "category", label: "หมวดหมู่" },
            { key: "uploadedBy", label: "ผู้อัปโหลด", render: (row) => row.uploadedBy?.name || "-" },
            { key: "createdAt", label: "วันที่", render: (row) => formatDate(row.createdAt) }
          ]}
          rows={data.latestDocuments}
          emptyMessage="ยังไม่มีเอกสารในระบบ"
        />
      </Card>
    </div>
  );
}
