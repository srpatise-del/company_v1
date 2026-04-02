import { useMemo, useState } from "react";
import Card from "../components/ui/Card";
import Modal from "../components/ui/Modal";
import FormInput from "../components/ui/FormInput";
import EmptyState from "../components/ui/EmptyState";
import useAsync from "../hooks/useAsync";
import api from "../services/api";
import { useSearch } from "../context/SearchContext";
import { useAuth } from "../context/AuthContext";
import { formatDate } from "../utils/format";

const initialForm = { title: "", content: "", category: "", isPinned: false };

export default function AnnouncementsPage() {
  const { user } = useAuth();
  const { keyword } = useSearch();
  const { data, loading, error, setData } = useAsync(async () => {
    const { data } = await api.get("/announcements");
    return data.announcements;
  }, []);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState("");

  const filtered = useMemo(() => {
    if (!data) return [];
    const q = keyword.toLowerCase();
    return data.filter((item) => [item.title, item.content, item.category].some((value) => value?.toLowerCase().includes(q)));
  }, [data, keyword]);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      setSubmitError("");
      const { data: response } = await api.post("/announcements", form);
      setData([response.announcement, ...(data || [])]);
      setForm(initialForm);
      setOpen(false);
    } catch (err) {
      setSubmitError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <Card
        title="ประกาศบริษัท"
        subtitle="ติดตามข่าวสาร นโยบาย และอัปเดตภายในองค์กร"
        action={
          user?.role === "admin" && (
            <button onClick={() => setOpen(true)} className="rounded-2xl bg-brand-600 px-4 py-2 text-sm font-medium text-white">
              สร้างประกาศ
            </button>
          )
        }
      >
        {loading && <p className="text-sm text-slate-500">กำลังโหลดประกาศ...</p>}
        {error && <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-600">{error}</p>}
        {!loading && !error && !filtered.length && <EmptyState title="ไม่พบประกาศ" description="ลองเปลี่ยนคำค้นหาหรือเพิ่มประกาศใหม่" />}
        <div className="grid gap-4">
          {filtered.map((item) => (
            <article key={item._id} className="rounded-3xl border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">{item.category}</span>
                {item.isPinned && <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">ปักหมุด</span>}
                <span className="text-xs text-slate-400">{formatDate(item.createdAt)}</span>
              </div>
              <h3 className="mt-3 text-xl font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{item.content}</p>
              <p className="mt-4 text-xs text-slate-400">โดย {item.createdBy?.name || "ผู้ดูแลระบบ"}</p>
            </article>
          ))}
        </div>
      </Card>

      <Modal open={open} title="สร้างประกาศใหม่" onClose={() => setOpen(false)}>
        <form onSubmit={handleCreate} className="space-y-4">
          <FormInput label="หัวข้อประกาศ" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <FormInput label="หมวดหมู่" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">รายละเอียด</span>
            <textarea
              rows="5"
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-100"
            />
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.isPinned} onChange={(e) => setForm({ ...form, isPinned: e.target.checked })} />
            ปักหมุดประกาศนี้
          </label>
          {submitError && <p className="rounded-2xl bg-red-50 p-3 text-sm text-red-600">{submitError}</p>}
          <button className="rounded-2xl bg-brand-600 px-5 py-3 text-sm font-medium text-white">บันทึกประกาศ</button>
        </form>
      </Modal>
    </div>
  );
}
